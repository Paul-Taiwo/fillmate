import { UserProfile } from "../types";

const USER_PROFILE_KEY = "userProfile";

// Saves the user profile data to chrome.storage.local
export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [USER_PROFILE_KEY]: profile }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error saving user profile:", chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      } else {
        console.log("User profile saved successfully.");
        resolve();
      }
    });
  });
};

// Retrieves the user profile data from chrome.storage.local
export const getUserProfile = async (): Promise<UserProfile | null> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(USER_PROFILE_KEY, (result) => {
      if (chrome.runtime.lastError) {
        console.error("Error retrieving user profile:", chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      } else {
        resolve((result[USER_PROFILE_KEY] as UserProfile) || null);
      }
    });
  });
};

// Clears the user profile data from chrome.storage.local
export const clearUserProfile = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove(USER_PROFILE_KEY, () => {
      if (chrome.runtime.lastError) {
        console.error("Error clearing user profile:", chrome.runtime.lastError);
        reject(chrome.runtime.lastError);
      } else {
        console.log("User profile cleared successfully.");
        resolve();
      }
    });
  });
};
