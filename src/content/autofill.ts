import { executeAutofill } from "./autofill-engine";

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  // Check if the action is the one relayed from the background script
  if (message.action === "executeAutofill") {
    executeAutofill()
      .then((response) => {
        sendResponse(response);
      })
      .catch((error) => {
        sendResponse({
          success: false,
          message: "Autofill failed",
          error: error instanceof Error ? error.message : String(error),
        });
      });
    return true; // Indicates that the response is sent asynchronously
  }
});
