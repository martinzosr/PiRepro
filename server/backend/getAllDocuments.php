<?php
include("backdoor.php");

ini_set('display_errors', 'on');
$db = new Backdoor;
$db->startConnection();

$tokken = getTokkenFromHeader(apache_request_headers());
$res = $db->getAllDocuments($tokken);
echo json_encode($res);

$db->stopConnection();
?>
