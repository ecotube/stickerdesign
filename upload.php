<?php
require_once __DIR__ . '/qiniu/autoload.php';

// 引入鉴权类
use Qiniu\Auth;

// 引入上传类
use Qiniu\Storage\UploadManager;

// 需要填写你的 Access Key 和 Secret Key

class QiniuUploader{

    private static $accessKey = 'kqOw7G_w4cf5-X-_9lA_8zK7KVs7WUXrsVA7H5wM';
    private static $secretKey = 'n-eRUN6_dRGUBvL_-DQmLPG6viKy17L6flhO3m65';
    protected $domain = "http://ofso95tts.bkt.clouddn.com/";
    protected $bucket = 'camo';
    private $token;

    function __construct($bucket = "", $domain = ""){
        $auth = new Auth(self::$accessKey, self::$secretKey);
        $this->domain = $domain ? $domain : $this->domain;
        $this->bucket = $bucket ? $bucket : $this->bucket;
        $this->token = $auth->uploadToken($this->bucket);
    }

    public function upload($localFile, $qiniuFile){
        // 初始化 UploadManager 对象并进行文件的上传。
        $uploadMgr = new UploadManager();

        // 调用 UploadManager 的 putFile 方法进行文件的上传。
        list($ret, $err) = $uploadMgr->putFile($this->token, $qiniuFile, $localFile);
        if($err){return false;}
        else{
            return $this->domain . $qiniuFile;
        }
    }

}




