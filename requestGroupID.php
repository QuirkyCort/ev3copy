<?php
    $json = file_get_contents('php://input');
    $db = new PDO('sqlite:'.__DIR__.'/../protected/db.sq3');

    if ($json === false) {
        exit();
    }

    $data = json_decode($json, true);

    if ($data['request'] != 'GroupID') {
        exit();
    }

    $unambiguous = 'ABCDEFGHJKLMNPRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

    do {
        $groupID = '';
        for ($i=0; $i<6; $i++) {
            $groupID .= $unambiguous[rand(0, strlen($unambiguous) - 1)];
        }
        
        $sql = '
            SELECT groupID
            FROM projects 
            WHERE groupID = ?
        ';
        $st = $db->prepare($sql);
        $st->execute([
            $groupID
        ]);
        $result = $st->fetch();
    } while ($result != false);

    $sql = '
        INSERT INTO projects (groupID, json)
        VALUES (?, "")
    ';
    $st = $db->prepare($sql);
    $result = $st->execute([
        $groupID
    ]);
    
    if ($result) {
        echo $groupID;
    }
