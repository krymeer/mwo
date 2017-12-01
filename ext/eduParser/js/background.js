function clearStorage() {
  chrome.storage.sync.clear(function() {
    console.log('All the items from storage removed')
  });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.token) {
      chrome.storage.sync.set({ 'todoToken': request.token }, function() {
        console.log('todoToken saved')
      });
    }
  }
);