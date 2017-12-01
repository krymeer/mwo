window.addEventListener('message', function(event) {
  if (event.source != window) {
    return;
  }

  if (event.data.page && (event.data.page == 'ToDoApp')) {
    chrome.runtime.sendMessage({ token: event.data.token });
  }
}, false);