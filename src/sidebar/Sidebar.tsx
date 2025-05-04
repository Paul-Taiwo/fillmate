import React, { useState, useEffect } from "react";
import Draggable from "react-draggable"; // Using react-draggable for easy drag functionality
import { getUserProfile } from "../storage/userProfile";
import { UserProfile } from "../types";
import "./Sidebar.css"; // We'll add styles later

interface SidebarProps {
  onAutofill: () => void; // Callback to trigger autofill in content script
}

const Sidebar: React.FC<SidebarProps> = ({ onAutofill }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getUserProfile()
      .then((loadedProfile) => {
        setProfile(loadedProfile);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Sidebar: Error loading profile:", err);
        setIsLoading(false);
      });
  }, []);

  const handleAutofillClick = () => {
    if (profile) {
      console.log("Sidebar: Autofill initiated with profile:", profile);
      onAutofill(); // Trigger the autofill action passed from the content script
    } else {
      console.warn("Sidebar: No profile loaded to autofill.");
      // Optionally show a message to the user to set up their profile first
    }
  };

  if (!isVisible) {
    return null; // Can add a small button to re-open later if needed
  }

  return (
    <Draggable handle='.sidebar-handle'>
      <div className='job-autofill-sidebar'>
        <div className='sidebar-handle'>Drag Me</div>
        <button onClick={() => setIsVisible(false)} className='close-button'>
          X
        </button>
        <h3>Autofill Controls</h3>
        {isLoading ? (
          <p>Loading profile...</p>
        ) : profile ? (
          <button onClick={handleAutofillClick} className='autofill-button'>
            Autofill All
          </button>
        ) : (
          <p>Please set up your profile in the extension popup.</p>
        )}
        {/* Optional: Add profile preview here */}
      </div>
    </Draggable>
  );
};

export default Sidebar;
