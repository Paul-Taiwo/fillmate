import React from "react";
import "./App.css";

const App: React.FC = () => {
  const openSettings = () => {
    chrome.runtime.openOptionsPage();
    window.close(); // Close the popup
  };

  return (
    <div className='app-container'>
      <h1>Job Application Autofill</h1>
      <p>
        Use this extension to automatically fill out job applications with your profile
        information.
      </p>

      <button onClick={openSettings} className='settings-button'>
        Open Profile Settings
      </button>
    </div>
  );
};

export default App;
