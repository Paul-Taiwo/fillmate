console.log(
  "***** Autofill Content Script Injected and Running on:",
  window.location.href,
  "*****"
);

import { getUserProfile } from "../storage/userProfile";
import { UserProfile } from "../types";
import { mapProfileToFields } from "../utils/fieldMapper";
import { fillFormField } from "../utils/field-fillers";
import { findFieldByLabel } from "../utils/field-finders";

console.log("Autofill content script loaded (post-imports).");

// --- Helper Functions ---

/**
 * Converts a data URL string back into a File object.
 */
async function dataUrlToFile(dataUrl: string, filename: string): Promise<File | null> {
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  } catch (error) {
    console.error("Error converting data URL to file:", error);
    return null;
  }
}

/**
 * Programmatically assigns a File object to a file input element.
 */
const assignFileToInput = (fileInput: HTMLInputElement, file: File) => {
  try {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;

    // Dispatch events to mimic user interaction
    const changeEvent = new Event("change", { bubbles: true });
    fileInput.dispatchEvent(changeEvent);
    const inputEvent = new Event("input", { bubbles: true }); // Some frameworks might need this
    fileInput.dispatchEvent(inputEvent);

    console.log(`Assigned file ${file.name} to input`, fileInput);
  } catch (error) {
    console.error(`Error assigning file ${file.name} to input:`, error);
  }
};

// --- Main Autofill Logic ---

const executeAutofill = async () => {
  console.log("Autofill action triggered");
  const profile = await getUserProfile();

  if (!profile) {
    console.warn("No user profile found. Cannot autofill.");
    return { success: false, message: "Profile not found" };
  }

  console.log("Using profile:", profile);
  const fieldMappings = mapProfileToFields(profile, window.location.hostname);
  let fieldsFilled = 0;
  let fieldsNotFound = 0;
  const processedProfileKeys = new Set<string>();

  // Fill standard fields based on mappings
  for (const [fieldName, fieldDetail] of Object.entries(fieldMappings)) {
    processedProfileKeys.add(fieldName);
    if (fieldDetail?.selectors && fieldDetail.value) {
      const filled = fillFormField(fieldDetail.selectors, fieldDetail.value);
      if (filled) {
        fieldsFilled++;
      } else {
        console.warn(`Could not find or fill field mapped to profile key: ${fieldName}`);
        fieldsNotFound++;
      }
    } else {
      // This case means a mapping exists but has no value or selectors
      // It might happen if the profile value for this key is empty
      // console.log(`Mapping exists for ${fieldName}, but value is empty or selectors missing.`);
    }
  }

  // Log profile fields that *exist* but had *no mapping* defined for them
  for (const key in profile) {
    if (
      Object.prototype.hasOwnProperty.call(profile, key) &&
      !processedProfileKeys.has(key)
    ) {
      if (key !== "resumeFile" && key !== "coverLetterFile" && key !== "customQA") {
        const profileKey = key as keyof UserProfile;
        if (profile[profileKey]) {
          console.warn(
            `Profile has data for key "${key}", but no mapping was defined in fieldMapper.ts`
          );
        }
      }
    }
  }

  // Handle File Uploads
  if (profile.resumeFile?.dataUrl) {
    const resumeFile = await dataUrlToFile(
      profile.resumeFile.dataUrl,
      profile.resumeFile.name
    );
    const resumeInput = findFieldByLabel([
      "resume",
      "cv",
      "curriculum vitae",
      "upload resume",
    ]);
    if (
      resumeFile &&
      resumeInput instanceof HTMLInputElement &&
      resumeInput.type === "file"
    ) {
      assignFileToInput(resumeInput, resumeFile);
      fieldsFilled++;
    } else {
      console.warn("Could not find resume input or convert file.");
      if (profile.resumeFile) fieldsNotFound++;
    }
  }

  if (profile.coverLetterFile?.dataUrl) {
    const coverLetterFile = await dataUrlToFile(
      profile.coverLetterFile.dataUrl,
      profile.coverLetterFile.name
    );
    const coverLetterInput = findFieldByLabel([
      "cover letter",
      "cover_letter",
      "upload cover letter",
    ]);
    if (
      coverLetterFile &&
      coverLetterInput instanceof HTMLInputElement &&
      coverLetterInput.type === "file"
    ) {
      assignFileToInput(coverLetterInput, coverLetterFile);
      fieldsFilled++;
    } else {
      console.warn("Could not find cover letter input or convert file.");
      if (profile.coverLetterFile) fieldsNotFound++;
    }
  }

  // TODO: Handle Custom Q&A (requires more complex logic to find matching question fields)

  const message = `Autofill complete. Fields filled: ${fieldsFilled}. Fields not found: ${fieldsNotFound}.`;
  console.log(message);
  // Optionally send completion message back to sidebar/popup
  return { success: true, message };
};

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
