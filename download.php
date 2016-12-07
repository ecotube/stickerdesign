<?php

function downfile()
{
    $filename=realpath("configure.json"); //文件名
    Header( "Content-type:  application/octet-stream ");
    Header( "Accept-Ranges:  bytes ");
    Header( "Accept-Length: " .filesize($filename));
    header( "Content-Disposition:  attachment;  filename=configure.json");
    echo file_get_contents($filename);
}

downfile();



?>