<?php
include("backdoor.php");

ini_set('display_errors', 'on');
$db = new Backdoor;
$db->startConnection();

if (isset($_GET['id'])){
	$tokken = getTokkenFromHeader(apache_request_headers());
	$res = $db->getPlaylists($tokken, $_GET['id']);
	echo json_encode($res);
}

$db->stopConnection();
?>
