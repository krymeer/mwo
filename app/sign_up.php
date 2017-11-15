<?php

	require_once( "./db.php" );
	extract( $_POST );

	$userName = $_POST[ "login" ];
	$userPassword = $_POST[ "password" ];
	$userEmail = $_POST[ "e-mail" ];

	$password = hash( "sha256", $userPassword );

	$query = "INSERT INTO users VALUES (NULL, ?, ?, ?)";
	$db = get_db();
	$stmt = $db->prepare( $query );
	$stmt->bind_param( "sss", $userName, $password, $userEmail );
	$stmt->execute();
	$stmt->close();
	$db->close();

	header( "Location: ./index.php?page=1" );
	exit;

?>