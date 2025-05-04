import { UserProfile } from "../types";

const USER_PROFILE_KEY = "userProfile";

// Function to get normalized notice period value without modifying the original
const getNormalizedNoticePeriod = (noticePeriod: string): string => {
  const trimmed = noticePeriod.trim();
  const lowerCase = trimmed.toLowerCase();

  const immediate =
    lowerCase.includes("immediate") ||
    lowerCase.includes("available") ||
    lowerCase === "0" ||
    lowerCase === "asap";

  const oneMonth =
    lowerCase === "1 month" ||
    lowerCase.includes("one month") ||
    lowerCase === "1" ||
    lowerCase === "one" ||
    lowerCase.includes("2-4 week") ||
    lowerCase.includes("2 - 4 week") ||
    lowerCase.includes("2 to 4 week");

  const twoMonths =
    lowerCase === "2 months" ||
    lowerCase.includes("two month") ||
    lowerCase === "2" ||
    lowerCase === "two" ||
    lowerCase.includes("4-8 week") ||
    lowerCase.includes("4 - 8 week") ||
    lowerCase.includes("4 to 8 week");

  const threeMonthsOrMore =
    lowerCase === "3 months or more" ||
    lowerCase.includes("three month") ||
    lowerCase.includes("more") ||
    lowerCase === "3" ||
    lowerCase === "three" ||
    lowerCase.includes("8 week") ||
    lowerCase.includes("8+") ||
    lowerCase.includes("8 +");

  // Convert to AshbyHQ standard format while preserving original value
  if (immediate) {
    return "Immediately available";
  } else if (oneMonth) {
    return "1 month";
  } else if (twoMonths) {
    return "2 months";
  } else if (threeMonthsOrMore) {
    return "3 months or more";
  }

  // Return original if no match found
  return trimmed;
};

// Saves the user profile data to chrome.storage.local
export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [USER_PROFILE_KEY]: profile }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
};

// Helper function to get notice period in AshbyHQ format
export const getAshbyHqNoticePeriod = (noticePeriod: string): string => {
  return getNormalizedNoticePeriod(noticePeriod);
};

// Retrieves the user profile data from chrome.storage.local
export const getUserProfile = async (): Promise<UserProfile | null> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(USER_PROFILE_KEY, (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        const profile = result[USER_PROFILE_KEY] as UserProfile;
        resolve(profile || null);
      }
    });
  });
};

// Clears the user profile data from chrome.storage.local
export const clearUserProfile = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove(USER_PROFILE_KEY, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
};
