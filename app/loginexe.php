<?php

	session_start();
	extract( $_POST );
	require_once( "./db.php" );

	$userName = $_POST[ "login" ];
	$userPassword = $_POST[ "password" ];
	$q = "SELECT * FROM users WHERE user_name = '". $userName ."' AND user_password = '". hash( "sha256", $userPassword ) ."'";
	$db = get_db();
	//$db->set_charset('utf-8');
	$arr = '';
	
	$stmt = $db->prepare( $q );
	$stmt->execute();
	if ($res = $stmt->get_result()) {
		if( $res->num_rows > 0 ) $_SESSION["user_logged"] = TRUE;
		else $_SESSION["user_logged"] = FALSE;
	}
	$stmt->close();
	$db->close();

	header("Location: ./index.php");
	exit;

?>