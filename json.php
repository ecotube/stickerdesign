<?php
/**
 * Created by PhpStorm.
 * User: pilotpete
 * Date: 2016/12/6
 * Time: 下午4:42
 */

    $data = @json_decode(@file_get_contents("php://input"), true);
    foreach($data as $key=>$value){
        $data[$key]["type"] = 1;
        $data[$key]["scaleHeigthtOffset"] = 0;
        $data[$key]["alignPos"] = 0;
        $data[$key]["alignX"] = 0;
        $data[$key]["alignY"] = 0;
        $data[$key]["frameDuration"] = 100;
        $data[$key]["triggerType"] = 0;
    }
    $jsonArr = Array("itemList" => $data);
    $fh = fopen("./configure.json", "w");
    fwrite($fh, json_encode($jsonArr));
    fclose($fh);
    header("HTTP/1.1 200 OK");
    echo json_encode(Array("result"=>"ok"));



?>