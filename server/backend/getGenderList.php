<?php
include("backdoor.php");

ini_set('display_errors', 'on');
$db = new Backdoor;
$db->startConnection();

$res = $db->getGenderList();
echo json_encode($res);

$db->stopConnection();
?>
