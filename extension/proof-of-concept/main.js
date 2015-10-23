// document.body.style.background = 'yellow';
console.log('main');

// Receive update from background process
chrome.runtime.onMessage.addListener(function(message) {
  if (message.event === "receivedNewMessage") {
    console.log('received new message event trigger');
    window.postMessage({ type: 'receivedNewMessage', text: message.data}, "*");
  }
  // Received facebook friends list
  if (message.event === "facebookFriendsList") {
    // Emit the facebook friends list to the extension
    window.postMessage({ type: 'facebookFriendsList', text: message.data}, "*");
  }
});

// Register the tabid with the background process
chrome.runtime.sendMessage({
  event: 'registerTabId',
  data: 'webapp'
});

// Listen to requests from web app
window.addEventListener('message', function(event) {
  if (event.source != window)
    return;
  // App requesting facebook friends
  if (event.data.type && (event.data.type === 'getFacebookFriends')) {
    chrome.runtime.sendMessage({
      event: 'getFacebookFriends',
      data: ''
    });
  }
  // App sending facebook message
  if (event.data.type && (event.data.type === 'sendFacebookMessage')) {
    chrome.runtime.sendMessage({
      event: 'sendFacebookMessage',
      data: {
        to: event.data.to,
        text: event.data.text
      }
    });
  }
});

// PROOF OF CONCEPT MESSAGE SENDING & RECEIPT
// window.addEventListener("message", function(event) {
//   // We only accept messages from ourselves
//   if (event.source != window)
//     return;
// 
//   if (event.data.type && (event.data.type == "FROM_PAGE")) {
//     console.log("Content script received (main_js): " + event.data.text);
//     window.postMessage({ type: "FROM_EXT", text: "Hello from the ext!" }, "*");
//   }
// }, false);
