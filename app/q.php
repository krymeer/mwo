<?php
  
  extract( $_POST );

  require_once('db.php');

  function is_natural($id) {
    return (is_int($id) && $id >= 0);
  }

  function get_notes($id) {
    $q = 'SELECT msg_id, msg_val FROM notes WHERE user_id = ?';
    $db = get_db();
    //$db->set_charset('utf-8');
    $arr = '';
    
    $stmt = $db->prepare($q);
    $stmt->bind_param('s', $id);
    $stmt->execute();
    if ($res = $stmt->get_result()) {
      while ($res->num_rows > 0 && $row = $res->fetch_assoc()) {
        $arr[] = array('id' => $row['msg_id'], 'msg' => $row['msg_val']);
      }
    }
    $stmt->close();
    $db->close();
    return json_encode($arr);
  }

  function add_note($user, $id, $date) {
    $q = 'INSERT INTO notes VALUES (?, ?, "", ?)';
    $db = get_db();
    //$db->set_charset('utf-8');
    $stmt = $db->prepare($q);
    $stmt->bind_param('iis', $user, $id, $date);
    $stmt->execute();
    $stmt->close();
    $db->close();
  }

  function save_note($user, $id, $contents) {
    $q = 'UPDATE notes SET msg_val = ? WHERE user_id = ? AND msg_id = ?';
    $db = get_db();
    //$db->set_charset('utf-8');
    //echo $db->character_set_name();
    $stmt = $db->prepare($q);
    $stmt->bind_param('sii', $contents, $user, $id);
    $stmt->execute();
    $stmt->close();
    $db->close();
  }

  save_note(0, 6662, 'ddasad');

  function delete_note($user, $id) {
    echo $user.'<br>'.$id;
    $q = 'DELETE FROM notes WHERE user_id = ? AND msg_id = ?';
    $db = get_db();
    //$db->set_charset('utf-8');
    $stmt = $db->prepare($q);
    $stmt->bind_param('ii', $user, $id);
    $stmt->execute();
    $stmt->close();
    $db->close();
  }

  if (sizeof($_POST) == 0) {
    $json = file_get_contents("php://input");
    $_POST = json_decode($json, true);
  }

  if (isset($_POST['action']) && !empty($_POST['action'])) {
    switch($_POST['action']) {
      case 'get_notes':
        if (isset($_POST['user_id'])) {
          echo get_notes($_POST['user_id']);
        }
        break;
      case 'add_note':
        if (isset($_POST['user_id']) && isset($_POST['note_id']) && isset($_POST['date'])) {
          add_note($_POST['user_id'], $_POST['note_id'], $_POST['date']);
        }
        break;
      case 'save_note':
        if (isset($_POST['user_id']) && isset($_POST['note_id']) && isset($_POST['contents'])) {
          save_note($_POST['user_id'], $_POST['note_id'], $_POST['contents']);
        }
        break;
      case 'delete_note':
        if (isset($_POST['user_id']) && isset($_POST['note_id'])) {
          delete_note($_POST['user_id'], $_POST['note_id']);
        }
        break;
      default:
        break;
    }
  }

?>