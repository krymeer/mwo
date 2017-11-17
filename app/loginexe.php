<?php

	session_start();
	extract( $_POST );
	require_once( "./db.php" );

	$userName = $_POST[ "login" ];
	$userPassword = $_POST[ "password" ];
	$q = "SELECT * FROM users WHERE user_name = ? AND user_password = ?";
	$db = get_db();
	$arr = '';
	
	$stmt = $db->prepare( $q );
  $stmt->bind_param('ss', $userName, hash( "sha256", $userPassword ));
	$stmt->execute();
	if ($res = $stmt->get_result()) {
		if( $res->num_rows > 0 ) {
			$row = $res->fetch_assoc();
			$_SESSION["user_logged"] = TRUE;
			$_SESSION["user_id"] = $row[ "user_id" ];
		} else {
			$_SESSION["user_logged"] = FALSE;
		 	setcookie("invalid_login_data", "1");
		}
	}
	$stmt->close();
	$db->close();

	header("Location: ./index.php");
	exit;

?>