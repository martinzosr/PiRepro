<?php
include("backdoor.php");

ini_set('display_errors', 'on');
$db = new Backdoor;
$db->startConnection();

$post = file_get_contents('php://input');
$post = json_decode($post, true);

if(array_key_exists('data', $post)){
	$tokken = getTokkenFromHeader(apache_request_headers());
	$res = $db->addUserPreferences($tokken, $post['data']);
	if(!$res){
		http_response_code(500);
	} 
}

$db->stopConnection();
?>
