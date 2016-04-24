<?php
include("backdoor.php");

ini_set('display_errors', 'on');
$db = new Backdoor;
$db->startConnection();

if (isset($_GET['name'])){
	$tokken = getTokkenFromHeader(apache_request_headers());
	$res = $db->addPlaylist($tokken, $_GET['name']);
	if ($res) {
		$res = $db->getPlaylists($tokken);
		echo json_encode($res);
	} else {
	    http_response_code1(500);
	}
}
$db->stopConnection();
?>
