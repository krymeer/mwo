  // Check if the token is already in the extension's storage
  chrome.storage.sync.get(['todoToken'], function(item) { 
    token = item.todoToken;

    // If token was found, hide one of the HTML elements
    if (token) {
      var style = document.createElement('style');
      style.innerHTML = '#tokenNotSent { display: none; }';
      document.getElementsByTagName('head')[0].appendChild(style);
    }
  });

window.addEventListener('message', function(event) {
  if (event.source != window) {
    return;
  }

  if (event.data.page && (event.data.page == 'ToDoApp')) {
    chrome.runtime.sendMessage({ token: event.data.token });
  }
}, false);