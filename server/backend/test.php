<?php
include("backdoor.php");

ini_set('display_errors', 'on');
$db = new Backdoor;
$db->startConnection();
$db->test();

$db->stopConnection();
phpinfo();
?>
