console.log("Background service worker started.");

chrome.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed:", details.reason);
  // Optionally open a welcome/setup page
  // if (details.reason === 'install') {
  //   chrome.tabs.create({ url: 'welcome.html' });
  // }
});

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL("src/popup/index.html"), // Try without the "src/" prefix
  });
});

// Listen for messages from content scripts (like the sidebar)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background received message:", message, "from sender:", sender);

  if (message.action === "autofill") {
    // Get the current active tab where the sidebar likely is
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].id) {
        const targetTabId = tabs[0].id;
        console.log(`Background relaying autofill command to tab: ${targetTabId}`);
        // Send a new message specifically to the content script (autofill.ts) in that tab
        chrome.tabs.sendMessage(
          targetTabId,
          { action: "executeAutofill" },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error(
                "Background: Error sending executeAutofill to tab:",
                chrome.runtime.lastError.message || chrome.runtime.lastError
              );
              // Send error back to the original sender (sidebar)
              sendResponse({
                success: false,
                message: `Failed to connect to autofill script: ${chrome.runtime.lastError.message}`,
              });
            } else {
              console.log(
                "Background: Received response from autofill script:",
                response
              );
              // Relay response back to the original sender (sidebar)
              sendResponse(response);
            }
          }
        );
      } else {
        console.error("Background: Could not find active tab to send message to.");
        sendResponse({ success: false, message: "Could not find active tab." });
      }
    });
    return true; // Indicates we will send a response asynchronously
  }

  // Handle other potential background messages here
  console.warn("Background received unhandled message action:", message.action);
  // return false; // Optional: indicate no async response for unhandled actions
});

// Add other listeners or logic here if needed in the future
// For example, listening for messages from content scripts or popups:
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   console.log('Background received message:', message);
//   // Process message...
//   sendResponse({ status: 'received' });
//   return true; // if sending async response
// });
