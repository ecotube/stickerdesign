<?php

    require_once __DIR__ . '/upload.php';


    if ($_FILES["file"]["error"] > 0)
    {
        header("HTTP/1.1 503 Service Unavailable");
    }
    else
    {
        $uploader = new QiniuUploader();
        $result = $uploader->upload($_FILES["media"]["tmp_name"], strval(time())."_".$_FILES["media"]["name"]);
        header("HTTP/1.1 200 OK");
        echo json_encode(Array("file"=>$result));
    }


?>