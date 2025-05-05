import React, { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import { getUserProfile } from "../storage/userProfile";
import { UserProfile } from "../types";
import "./Sidebar.css";

interface SidebarProps {
  onAutofill: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAutofill }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const nodeRef = useRef(null);

  useEffect(() => {
    getUserProfile()
      .then((loadedProfile) => {
        setProfile(loadedProfile);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const handleButtonClick = () => {
    if (profile) {
      onAutofill();
    } else {
      // Send message to background script to open options page
      chrome.runtime.sendMessage({ action: "openOptions" });
    }
  };

  return (
    <Draggable handle='.drag-handle' nodeRef={nodeRef}>
      <div
        ref={nodeRef}
        className={`autofill-button-floating ${isLoading ? "loading" : ""} ${
          !profile ? "no-profile" : ""
        }`}
        title={profile ? "Click to autofill" : "Set up your profile"}>
        <div className='button-content' onClick={handleButtonClick}>
          {isLoading ? (
            <div className='button-spinner'></div>
          ) : profile ? (
            <span className='material-icons'>auto_fix_high</span>
          ) : (
            <span className='material-icons'>settings</span>
          )}
        </div>
        <div className='drag-handle' title='Hold to drag'>
          <span className='material-icons'>drag_indicator</span>
        </div>
      </div>
    </Draggable>
  );
};

export default Sidebar;
