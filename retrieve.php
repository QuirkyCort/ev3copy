<?php
    $json = file_get_contents('php://input');
    $db = new PDO('sqlite:'.__DIR__.'/../protected/db.sq3');
    
    if ($json === false) {
        exit();
    }

    $data = json_decode($json, true);

    $sql = '
        SELECT json
        FROM projects
        WHERE groupID = ?
    ';
    $st = $db->prepare($sql);
    $st->execute([$data['groupID']]);
    $result = $st->fetch(PDO::FETCH_ASSOC);

    if ($result === false) {
        echo 'INVALID';
        exit();
    }
    echo $result['json'];
