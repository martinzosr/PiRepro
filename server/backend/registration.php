<?php
include("backdoor.php");

ini_set('display_errors', 'on');
$db = new Backdoor;
$db->startConnection();

$post = file_get_contents('php://input');
$post = json_decode($post, true);

if(array_key_exists('username', $post) && array_key_exists('password', $post)){
	$res = $db->registration($post['username'], $post['password']);
	if(!$res){
		http_response_code(500);
	} 
}

$db->stopConnection();
?>
