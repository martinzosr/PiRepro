<?php
include("backdoor.php");

ini_set('display_errors', 'on');
$db = new Backdoor;
$db->startConnection();

if (isset($_GET['songId'])){
	$tokken = getTokkenFromHeader(apache_request_headers());
	if ($db->songUp($tokken, $_GET['songId'])) {
		http_response_code1(200);
	} else {
	    http_response_code1(500);
	}
}
$db->stopConnection();
?>
