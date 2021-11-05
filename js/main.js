const filenameInput = document.getElementById('filename');
const uploadBtn = document.getElementById('upload');
const downloadEv3Btn = document.getElementById('downloadEv3');
const downloadSpikeBtn = document.getElementById('downloadSpike');
const clearBtn = document.getElementById('clear');
const clearBrowserBtn = document.getElementById('clearBrowser');
const copyToBrowserBtn = document.getElementById('copyToBrowser');
const allToBrowserBtn = document.getElementById('allToBrowser');
const copyToFileBtn = document.getElementById('copyToFile');
const allToFileBtn = document.getElementById('allToFile');
const deleteSelectedBtn = document.getElementById('deleteSelected');

const fileBlocksDiv = document.getElementById('fileBlocks');
const browserBlocksDiv = document.getElementById('browserBlocks');

var manifest = '';
var icon = defaults.icon.slice();
var sb3svg = defaults.sb3svg.slice();
var sb3svgFilename = defaults.sb3svgFilename;

var fileProject = JSON.parse(JSON.stringify(defaults.project));
var browserProject = JSON.parse(JSON.stringify(defaults.project));

function selectBlock(e) {
    for (let block of document.getElementsByClassName('block')) {
        block.classList.remove('selected');
    }
    e.target.classList.add('selected');
}

function listBlocks(parentDiv, ids, blocks) {
    for (let id of ids) {
        let div = document.createElement('div');

        let block = getDescription(blocks, id);
        div.blockID = block.id;
        div.innerText = block.description;
        div.classList.add(block.cssClass);
        div.classList.add('block');
        div.addEventListener('click', selectBlock);

        parentDiv.append(div);
    }
}

function clearBlocks(div) {
    div.innerHTML = '';
}

function getDescription(blocks, id) {
    let description = blocks[id].opcode;
    let cssClass = 'none';

    if (description == 'procedures_definition') {
        let definitionID = blocks[id].inputs.custom_block[1];
        description = 'define ' + blocks[definitionID].mutation.proccode;
        cssClass = 'myblock';
    } else if (description in BLOCK_DESCRIPTIONS) {
        description = BLOCK_DESCRIPTIONS[description];
        cssClass = 'event';
    }

    return {
        id: id,
        description: description,
        cssClass: cssClass
    };
}

function getParentBlockIDs(blocks) {
    let parentBlocks = []

    for (let key in blocks) {
        if (blocks[key].parent === null) {
            parentBlocks.push(key);
        }
    }

    return parentBlocks;
}

function getTarget(project) {
    return project.targets.find(e => e.isStage == false);
}

function loadFile(content) {
    fileProject = JSON.parse(content);
    displayProject(fileBlocksDiv, fileProject);
}

function displayProject(div, project) {
    let target = getTarget(project);

    let blocks = target.blocks;
    let parentBlockIDs = getParentBlockIDs(blocks);

    clearBlocks(div);
    listBlocks(div, parentBlockIDs, blocks);
}

function processSb3(zip) {
    let projectFile = zip.file('project.json');
    if (projectFile) {
        projectFile.async('string')
            .then(function(content) {
                loadFile(content);
                sb3svgFilename = fileProject.targets[0].costumes[0].md5ext;
                let sb3svgFile = zip.file(sb3svgFilename);
                if (sb3svgFile) {
                    sb3svgFile.async('string')
                        .then(function(content){
                            sb3svg = content;
                        })
                }            
            });
    }
}

function processLmsp(zip) {
    let manifestFile = zip.file('manifest.json');
    if (manifestFile) {
        manifestFile.async('string')
            .then(function(content){
                manifest = content;
            });
    }

    let iconFile = zip.file('icon.svg');
    if (iconFile) {
        iconFile.async('string')
            .then(function(content){
                icon = content;
            });
    }

    let sb3File = zip.file('scratch.sb3');
    if (sb3File) {
        sb3File.async('blob')
            .then(function(blob){
                JSZip.loadAsync(blob).then(processSb3);
            });
    }
}

function getProjectJson(project) {
    return JSON.stringify(project);
}

function uploadFile(e) {
    let file = e.target.files[0];
    filenameInput.value = file.name;
    JSZip.loadAsync(file).then(processLmsp);
    e.target.value = null;
};

function downloadFile(filename) {
    var sb3Zip = new JSZip();
    sb3Zip.file(sb3svgFilename, sb3svg);
    var projectJson = getProjectJson(fileProject);
    sb3Zip.file('project.json', projectJson);

    sb3Zip.generateAsync({type: 'blob'})
        .then(function(content){
            var lmspZip = new JSZip();
            lmspZip.file('icon.svg', icon);
            lmspZip.file('manifest.json', manifest);
            lmspZip.file('scratch.sb3', content);
            lmspZip.generateAsync({type: 'base64'})
                .then(function(content) {
                    if (filenameInput.value.trim() != '') {
                        filename = filenameInput.value.trim();
                    }

                    var hiddenElement = document.createElement('a');
                    hiddenElement.href = 'data:application/xml;base64,' + content;
                    hiddenElement.target = '_blank';
                    hiddenElement.download = filename;
                    hiddenElement.dispatchEvent(new MouseEvent('click'));
                });
        });
}

function downloadFileEv3(e) {
    if (! manifest) {
        manifest = defaults.manifestEv3.slice();
    }

    downloadFile('ev3copy.lmsp');
}

function downloadFileSpike(e) {
    if (! manifest) {
        manifest = defaults.manifestSpike.slice();
    }
    downloadFile('ev3copy.llsp');
}

function clearFile() {
    clearBlocks(fileBlocksDiv);
    filenameInput.value = '';

    manifest = '';
    icon = defaults.icon.slice();
    sb3svg = defaults.sb3svg.slice();

    fileProject = JSON.parse(JSON.stringify(defaults.project));
}

function clearBrowser() {
    browserProject = JSON.parse(JSON.stringify(defaults.project));
    localStorage.removeItem('ev3copy_browserProject');
    clearBlocks(browserBlocksDiv);
    displayProject(browserBlocksDiv, browserProject);
}

function copyAny(copyIDs, from, to) {
    for (let id of copyIDs) {
        if (! (id in to)) {
            console.log('  Copy: ' + id);
            to[id] = JSON.parse(JSON.stringify(from[id]));
        } else {
            console.log('  Duplicate (not copying): ' + id);
        }
    }
}

function copyBlocks(copyIDs, from, to) {
    let fromObj = getTarget(from).blocks;
    let toObj = getTarget(to).blocks;
    copyAny(copyIDs, fromObj, toObj);
}

function copyVariables(copyIDs, from, to) {
    let fromObj = getTarget(from).variables;
    let toObj = getTarget(to).variables;
    copyAny(copyIDs, fromObj, toObj);
}

function copyLists(copyIDs, from, to) {
    let fromObj = getTarget(from).lists;
    let toObj = getTarget(to).lists;
    copyAny(copyIDs, fromObj, toObj);
}

function copyBroadcasts(copyIDs, from, to) {
    let fromObj = getTarget(from).broadcasts;
    let toObj = getTarget(to).broadcasts;
    copyAny(copyIDs, fromObj, toObj);
}

function idFromProccode(proccode, blocks) {
    for (let id in blocks) {
        if (blocks[id].mutation && blocks[id].mutation.proccode == proccode) {
            return id;
        }
    }
}

function idFromBroadcastMsg(broadcastMsg, blocks) {
    for (let id in blocks) {
        if (blocks[id].opcode == 'event_whenbroadcastreceived' && blocks[id].fields.BROADCAST_OPTION[0] == broadcastMsg) {
            return id;
        }
    }
}

function copyBlockWithDependents(copyID, from, to) {
    let blockIDs = [];
    let variableIDs = [];
    let listIDs = [];
    let broadcastIDs = [];
    blockIDs.push(copyID);

    let target = getTarget(from);
    let fromBlocks = target.blocks;
    let fromVariables = target.variables;
    let fromLists = target.lists;
    let fromBroadcasts = target.broadcasts;

    while (true) {
        let changed = false;

        let blocks = {};
        for (let id of blockIDs) {
            blocks[id] = fromBlocks[id];
        }

        // Pull in dependent procedures
        for (let id in blocks) {
            if (blocks[id].opcode == 'procedures_call') {
                let proccode = blocks[id].mutation.proccode;
                let procPrototypeID = idFromProccode(proccode, fromBlocks);
                if (blockIDs.indexOf(procPrototypeID) == -1) {
                    blockIDs.push(procPrototypeID);
                    changed = true;
                }
            }
        }

        // Pull in dependent broadcasts
        for (let id in blocks) {
            if (blocks[id].opcode == 'event_broadcast' || blocks[id].opcode == 'event_broadcastandwait') {
                let broadcastMsg = blocks[id].inputs.BROADCAST_INPUT[1][1];
                let broadcastID = idFromBroadcastMsg(broadcastMsg, fromBlocks);
                if (blockIDs.indexOf(broadcastID) == -1) {
                    blockIDs.push(broadcastID);
                    changed = true;
                }
            }
        }

        // Search for dependencies by string
        let json = JSON.stringify(blocks);

        // Blocks dependencies
        for (let id in fromBlocks) {
            if (blockIDs.indexOf(id) != -1) {
                continue;
            }
            if (json.indexOf(id) != -1) {
                blockIDs.push(id);
                changed = true;
            }
        }

        // Variables dependencies
        for (let id in fromVariables) {
            if (variableIDs.indexOf(id) != -1) {
                continue;
            }
            if (json.indexOf(id) != -1) {
                variableIDs.push(id);
                changed = true;
            }
        }

        // List dependencies
        for (let id in fromLists) {
            if (listIDs.indexOf(id) != -1) {
                continue;
            }
            if (json.indexOf(id) != -1) {
                listIDs.push(id);
                changed = true;
            }
        }

        // Broadcast dependencies
        for (let id in fromBroadcasts) {
            if (broadcastIDs.indexOf(id) != -1) {
                continue;
            }
            if (json.indexOf(id) != -1) {
                broadcastIDs.push(id);
                changed = true;
            }
        }

        if (changed == false) {
            break;
        }
    }
    
    console.log('Blocks');
    copyBlocks(blockIDs, from, to);
    console.log('Variables');
    copyVariables(variableIDs, from, to);
    console.log('Lists');
    copyLists(listIDs, from, to);
    console.log('Broadcasts');
    copyBroadcasts(broadcastIDs, from, to);
}

function copyToBrowser() {
    let selected = fileBlocksDiv.getElementsByClassName('selected')[0];

    if (selected) {
        copyBlockWithDependents(selected.blockID, fileProject, browserProject);
        clearBlocks(browserBlocksDiv);
        displayProject(browserBlocksDiv, browserProject);
        saveToLocalStorage();
    }
}

function copyToFile() {
    let selected = browserBlocksDiv.getElementsByClassName('selected')[0];

    if (selected) {
        copyBlockWithDependents(selected.blockID, browserProject, fileProject);
        clearBlocks(fileBlocksDiv);
        displayProject(fileBlocksDiv, fileProject);
    }
}

function allToBrowser() {
    for (let selected of fileBlocksDiv.children) {
        copyBlockWithDependents(selected.blockID, fileProject, browserProject);
        clearBlocks(browserBlocksDiv);
        displayProject(browserBlocksDiv, browserProject);
        saveToLocalStorage();
    }
}

function allToFile() {
    for (let selected of browserBlocksDiv.children) {
        copyBlockWithDependents(selected.blockID, browserProject, fileProject);
        clearBlocks(fileBlocksDiv);
        displayProject(fileBlocksDiv, fileProject);
    }
}

function deleteBlocksWithChildren(deleteID, from) {
    let blockIDs = [];
    blockIDs.push(deleteID);

    let target = getTarget(from);
    let fromBlocks = target.blocks;

    function addChild(id) {
        if (fromBlocks[id].next != null) {
            blockIDs.push(fromBlocks[id].next);
            addChild(fromBlocks[id].next);
        }
        if (fromBlocks[id].opcode == 'procedures_definition') {
            blockIDs.push(fromBlocks[id].inputs.custom_block[1]);
        }
    }

    addChild(deleteID);

    console.log('Blocks')
    for (let id of blockIDs) {
        console.log('  Delete:' + id);
        delete fromBlocks[id];
    }
}

function deleteBlock() {
    let selected = fileBlocksDiv.getElementsByClassName('selected')[0];
    if (selected) {
        deleteBlocksWithChildren(selected.blockID, fileProject);
        clearBlocks(fileBlocksDiv);
        displayProject(fileBlocksDiv, fileProject);
    }

    selected = browserBlocksDiv.getElementsByClassName('selected')[0];
    if (selected) {
        deleteBlocksWithChildren(selected.blockID, browserProject);
        clearBlocks(browserBlocksDiv);
        displayProject(browserBlocksDiv, browserProject);
        saveToLocalStorage();
    }
}

function saveToLocalStorage() {
    localStorage.setItem('ev3copy_browserProject', JSON.stringify(browserProject));
}

function loadFromLocalStorage() {
    let json = localStorage.getItem('ev3copy_browserProject');
    if (json) {
        browserProject = JSON.parse(json);
    }
}

uploadBtn.addEventListener('change', uploadFile);
downloadEv3Btn.addEventListener('click', downloadFileEv3);
downloadSpikeBtn.addEventListener('click', downloadFileSpike);
clearBtn.addEventListener('click', clearFile);
clearBrowserBtn.addEventListener('click', clearBrowser);
copyToBrowserBtn.addEventListener('click', copyToBrowser);
copyToFileBtn.addEventListener('click', copyToFile);
allToBrowserBtn.addEventListener('click', allToBrowser);
allToFileBtn.addEventListener('click', allToFile);
deleteSelectedBtn.addEventListener('click', deleteBlock);

loadFromLocalStorage();
displayProject(browserBlocksDiv, browserProject);