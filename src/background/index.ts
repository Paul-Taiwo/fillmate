// Listen for messages from content scripts (like the sidebar)
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === "autofill") {
    // Get the current active tab where the sidebar likely is
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].id) {
        const targetTabId = tabs[0].id;
        // Send a new message specifically to the content script (autofill.ts) in that tab
        chrome.tabs.sendMessage(
          targetTabId,
          { action: "executeAutofill" },
          (response) => {
            if (chrome.runtime.lastError) {
              // Send error back to the original sender (sidebar)
              sendResponse({
                success: false,
                message: `Failed to connect to autofill script: ${chrome.runtime.lastError.message}`,
              });
            } else {
              // Relay response back to the original sender (sidebar)
              sendResponse(response);
            }
          }
        );
      } else {
        sendResponse({ success: false, message: "Could not find active tab." });
      }
    });
    return true; // Indicates we will send a response asynchronously
  }

  // Handle opening options page
  if (message.action === "openOptions") {
    chrome.runtime
      .openOptionsPage()
      .then(() => {
        sendResponse({ success: true });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });
    return true; // Indicates we will send a response asynchronously
  }

  // Default response for unhandled message actions
  sendResponse({ success: false, message: "Unhandled message action." });
  return true;
});

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    // Open options page on first install
    chrome.runtime.openOptionsPage();
  }
});
