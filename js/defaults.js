const defaults = {
    manifestEv3: '{"type":"word-blocks","autoDelete":false,"created":"2021-11-03T16:38:52.280Z","id":"sa7njKncfoZi","lastsaved":"2021-11-03T16:40:51.731Z","size":8122,"name":"ev3 classroom","slotIndex":0,"workspaceX":164.00000000000028,"workspaceY":153.99999999999977,"zoomLevel":0.675,"showAllBlocks":false,"version":8,"hardware":{"NVxM#.;GQvP]c)AgGMMS":{"type":"flipper"}},"extensions":["ev3events","ev3motor","ev3display"],"state":{"playMode":"download","canvasDrawerTab":"monitorTab"}}',
    manifestSpike: '{"type":"word-blocks","autoDelete":false,"created":"2021-04-12T03:03:27.172Z","id":"tcMUF8MX_OGm","lastsaved":"2021-11-05T07:47:40.871Z","size":0,"name":"spike","slotIndex":0,"workspaceX":239.00000000000023,"workspaceY":-1.1368683772161603e-13,"zoomLevel":0.675,"showAllBlocks":false,"version":8,"hardware":{"Fm|1#oj6@qB5H?(OBeB=":{"type":"flipper"}},"extensions":["flipperevents","flipperdisplay","flippersound"],"state":{"playMode":"download","canvasDrawerTab":"monitorTab"},"extraFiles":[]}',
    icon: '<svg    xmlns="http://www.w3.org/2000/svg"    xmlns:xlink="http://www.w3.org/1999/xlink"    version="1.1"     preserveAspectRatio="xMidYMid meet"    viewBox="0 0 803 270"><style>* {  -webkit-font-smoothing: antialiased;  text-rendering: optimizeLegibility;  word-wrap: break-word;}.blocklyPath {  stroke-width: 1px;}.blocklyText {  fill: rgb(255, 255, 255);  font-family: "Chalet", "Arial", sans-serif;  font-size: 12pt;  font-weight: 700;}.blocklyDropdownText {  fill: rgb(255, 255, 255) !important;}.blocklyNonEditableText > text, .blocklyEditableText > text {  fill: rgb(87, 94, 117);}.scratchCommentForeignObject {  background-color: #fff9d9;}.scratchCommentTextarea {  color: #a9983e;  background-color: #fff9d9;   width: 100%;  height: 100%;  padding: 12px;  box-sizing: border-box;}.scratchCommentText {  font-size: 12pt;  fill: #fff9d9;  font-family: "Chalet", "Arial", sans-serif; }.scratchCommentBody {  background-color: #fff9d9; }.scratchCommentTopBar {  fill: #fff2ae;  fill-opacity: 0.1}.scratchCommentRect {  fill: #fff2ae; }.scratchWorkspaceCommentBorder {  stroke: #fff2ae; }.scratchCommentTopBar ~ use, .scratchCommentTopBar ~ image {  opacity: 0.4; }.scratchCommentTarget {  display: none;}.scratchCommentResizeSE, .scratchCommentResizeSW {  fill: transparent;}.blocklyResizeLine {  stroke: #888;  stroke-width: 1;}</style></svg>',
    sb3svg: '',
    sb3svgFilename: 'deadc057000000000000000000000000',
    project: {
        "targets": [
          {
            "isStage": true,
            "name": "Stage",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {},
            "comments": {},
            "currentCostume": 0,
            "costumes": [
              {
                "assetId": "deadc057000000000000000000000000",
                "name": "backdrop1",
                "bitmapResolution": 1,
                "md5ext": "deadc057000000000000000000000000.svg",
                "dataFormat": "svg",
                "rotationCenterX": 47,
                "rotationCenterY": 55
              }
            ],
            "sounds": [],
            "volume": 0,
            "tempo": 60,
            "videoTransparency": 50,
            "videoState": "on",
            "textToSpeechLanguage": null
          },
          {
            "isStage": false,
            "name": "_Odk1oUULCyv0YyJnDKK",
            "variables": {},
            "lists": {},
            "broadcasts": {},
            "blocks": {},
            "comments": {},
            "currentCostume": 0,
            "costumes": [
              {
                "assetId": "deadc057000000000000000000000000",
                "name": "N6jlWUU3nfxowNT3olIq",
                "bitmapResolution": 1,
                "md5ext": "deadc057000000000000000000000000.svg",
                "dataFormat": "svg",
                "rotationCenterX": 240,
                "rotationCenterY": 180
              }
            ],
            "sounds": [],
            "volume": 100,
            "visible": true,
            "x": 0,
            "y": 0,
            "size": 100,
            "direction": 90,
            "draggable": false,
            "rotationStyle": "all around"
          }
        ],
        "monitors": [],
        "extensions": [
          "ev3events",
          "ev3motor",
          "ev3display"
        ],
        "meta": {
          "semver": "3.0.0",
          "vm": "0.2.0-prerelease.20200512204241",
          "agent": "Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36"
        }
    }
}

const BLOCK_DESCRIPTIONS = {
  'event_whenbroadcastreceived': 'Broadcast: when I receive',
  'ev3events_whenProgramStarts': 'EV3: when program starts',
  'ev3events_whenEV3ColorSensorColor': 'EV3: when color is',
  'ev3events_whenEV3TouchSensorPressed': 'EV3: when touch sensor',
  'ev3events_whenEV3UltrasonicSensorDistance': 'EV3: when distance is',
  'ev3events_whenEV3GyroSensorAngle': 'EV3: when angle is',
  'ev3events_whenEV3BrickButtonPressed': 'EV3: when brick button',
  'ev3events_whenCondition': 'EV3: when condition',
  'ev3events_whenTimer': 'EV3: when timer >',
  'flipperevents_whenProgramStarts': 'SPIKE: when program starts',
  'flipperevents_whenColor': 'SPIKE: when color is',
  'flipperevents_whenPressed': 'SPIKE: when touch sensor',
  'flipperevents_whenDistance': 'SPIKE: when distance',
  'flipperevents_whenOrientation': 'SPIKE: when side is up',
  'flipperevents_whenGesture': 'SPIKE: when gesture',
  'flipperevents_whenButton': 'SPIKE: when button',
  'flipperevents_whenTimer': 'SPIKE: when timer',
  'flipperevents_whenCondition': 'SPIKE: when condition',
}