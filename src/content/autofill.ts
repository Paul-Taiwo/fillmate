console.log(
  "***** Autofill Content Script Injected and Running on:",
  window.location.href,
  "*****"
);

import { executeAutofill } from "./autofill-engine";

console.log("Autofill content script loaded (post-imports).");

// --- Event Listener ---

console.log("***** Setting up message listener in autofill.ts *****");

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log("Autofill script received message:", message, "from sender:", _sender);

  // Check if the action is the one relayed from the background script
  if (message.action === "executeAutofill") {
    console.log("ExecuteAutofill action recognized. Executing...");
    executeAutofill()
      .then((response) => {
        console.log(
          "Autofill execution finished. Sending response back to background:",
          response
        );
        sendResponse(response);
      })
      .catch((error) => {
        console.error("Autofill execution failed:", error);
        sendResponse({
          success: false,
          message: "Autofill failed",
          error: error instanceof Error ? error.message : String(error),
        });
      });
    return true; // Indicates that the response is sent asynchronously
  } else {
    console.warn("Received unknown message action:", message.action);
  }
});
console.log("***** Autofill content script finished executing. *****");
