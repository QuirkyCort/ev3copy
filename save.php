<?php
    $json = file_get_contents('php://input');
    $db = new PDO('sqlite:'.__DIR__.'/../protected/db.sq3');

    if ($json === false) {
        exit();
    }

    $data = json_decode($json, true);

    $sql = '
        UPDATE projects
        SET json = ?
        WHERE groupID = ?
    ';
    $st = $db->prepare($sql);
    $result = $st->execute([
        $data['project'],
        $data['groupID']
    ]);
    
    if ($result) {
        echo $st->rowCount();
    } else {
        echo 'execute failed';
    }
