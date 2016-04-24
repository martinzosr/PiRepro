<?php
include("backdoor.php");

ini_set('display_errors', 'on');
$db = new Backdoor;
$db->startConnection();

$column = "";
if(isset($_GET['column'])){
	$column = $_GET['column'];
}
$order = "";
if(isset($_GET['order'])){
	$order = $_GET['order'];
}
$res = $db->getSongs($column, $order);
echo json_encode($res);

$db->stopConnection();
?>
