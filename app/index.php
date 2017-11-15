<?php
	error_reporting(0);
	session_start();
	extract( $_GET );

	$page = $_GET["page"];
    if( !$page || $page == "" ) $page = 0;

    if( $_SESSION["user_logged"] ) echo "<script type='text/javascript'>var session_user_id = ". $_SESSION["user_id"] .";</script>";
?>
<!DOCTYPE html>
<html lang="pl">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="css/styles.css">
        <link rel="stylesheet" type="text/css" href="css/index.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <script src="./js/vue.min.js"></script>
    <script src="./js/vue-resource-1.3.4.js"></script>
    <script src="./js/main.js"></script>
    <title>ToDoApp</title>
  </head>
  <body>

    <?php

      if( !$_SESSION["user_logged"] ) {

      	if( $page == 1 ) {
      		include( "./registered.php" );
      	} else {
      		echo "<link rel=\"stylesheet\" type=\"text/css\" href=\"css/login.css\">";

          if( $_COOKIE["invalid_login_data"] ) {
            echo "<script type='text/javascript'>var invalid_login_data = true;</script>";
            setcookie("invalid_login_data", "", time()-3600);
          } else if( $_COOKIE["user_logged_out"] ) {
            echo "<script type='text/javascript'>var user_logged_out = true;</script>";
            setcookie("user_logged_out", "", time()-3600);
          }

          include( "./login.php" );
      	}
        echo "</body></html>";
        return;
      }

      if( $page == 0 ) include( "./desktop.php" );

    ?>
  </body>
</html>