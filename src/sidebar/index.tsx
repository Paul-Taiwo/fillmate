import React from "react";
import ReactDOM from "react-dom/client";
import Sidebar from "./Sidebar";

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
  sidebarRoot.style.zIndex = "9999";
  document.body.appendChild(sidebarRoot);
}

// Function to be passed to the Sidebar component to trigger autofill
const triggerAutofill = () => {
  // Send a message to the autofill.ts content script
  chrome.runtime.sendMessage({ action: "autofill" });
};

// Render the Sidebar component into the root element
try {
  if (sidebarRoot) {
    const root = ReactDOM.createRoot(sidebarRoot);
    root.render(
      <React.StrictMode>
        <Sidebar onAutofill={triggerAutofill} />
      </React.StrictMode>
    );
  }
} catch {
  // Silently catch error
}
