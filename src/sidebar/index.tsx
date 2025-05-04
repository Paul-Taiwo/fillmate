import React from "react";
import ReactDOM from "react-dom/client";
import Sidebar from "./Sidebar";

console.log("Sidebar content script injected.");

// Load Material Icons
const addMaterialIcons = () => {
  const link = document.createElement("link");
  link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
  link.rel = "stylesheet";
  document.head.appendChild(link);
};

// Create a div to mount the Sidebar component
const sidebarRootId = "job-autofill-sidebar-root";
let sidebarRoot = document.getElementById(sidebarRootId);

if (!sidebarRoot) {
  // Add Material Icons if not already loaded
  addMaterialIcons();

  sidebarRoot = document.createElement("div");
  sidebarRoot.id = sidebarRootId;
  // Basic styling to ensure it's on top and positioned
  sidebarRoot.style.position = "fixed";
  sidebarRoot.style.top = "20px";
  sidebarRoot.style.right = "20px";
  sidebarRoot.style.zIndex = "9999"; // High z-index to be on top
  document.body.appendChild(sidebarRoot);
  console.log("Sidebar root element created and appended to body.");
} else {
  console.log("Sidebar root element already exists.");
}

// Function to be passed to the Sidebar component to trigger autofill
const triggerAutofill = () => {
  console.log("Sidebar index.tsx: Sending autofill message");
  // Send a message to the autofill.ts content script
  chrome.runtime.sendMessage({ action: "autofill" }, (response) => {
    if (chrome.runtime.lastError) {
      // Log the specific error message if available
      console.error(
        "Error sending autofill message:",
        chrome.runtime.lastError.message || chrome.runtime.lastError
      );
    } else {
      console.log("Autofill message sent, response:", response);
      // Handle response (e.g., show notification based on response.success)
      // if (response?.success) {
      //   alert("Autofill successful! " + (response.message || "")); // Simple alert for now
      // } else {
      //   alert("Autofill failed. " + (response?.message || "Check console for details."));
      // }
    }
  });
};

// Render the Sidebar component into the root element
const root = ReactDOM.createRoot(sidebarRoot);
root.render(
  <React.StrictMode>
    <Sidebar onAutofill={triggerAutofill} />
  </React.StrictMode>
);
