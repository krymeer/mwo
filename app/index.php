<?php
	error_reporting(0);
	session_start();
	extract( $_GET );

	$page = $_GET["page"];
    if( !$page || $page == "" ) $page = 0;
?>
<!DOCTYPE html>
<html lang="pl">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="css/styles.css">
        <link rel="stylesheet" type="text/css" href="css/index.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <script src="js/vue.min.js"></script>
    <script src="js/vue-resource-1.3.4.js"></script>
    <script src="js/main.js"></script>
    <title>ToDoApp</title>
  </head>
  <body>

    <?php

      if( !$_SESSION["user_logged"] ) {

      	if( $page == 1 ) {
      		include( "./registered.php" );
      	} else {
      		echo "<link rel=\"stylesheet\" type=\"text/css\" href=\"css/login.css\">";
			include( "./login.php" );
      	}
        echo "</body></html>";
        return;
      }

      if( $page == 0 ) include( "./desktop.php" );

    ?>
  </body>
</html>