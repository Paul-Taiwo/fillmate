import { UserProfile } from "../../../types";
import { dataUrlToFile } from "../../utils/file-handlers";

/**
 * Handles file uploads for Lever.co
 */
export const handleLeverFileUploads = async (profile: UserProfile): Promise<number> => {
  let filesHandled = 0;

  try {
    // Handle resume upload
    if (profile.resumeFile) {
      const resumeHandled = await handleResumeUpload(profile);
      filesHandled += resumeHandled;
    }

    // Handle cover letter upload
    if (profile.coverLetterFile) {
      const coverLetterHandled = await handleCoverLetterUpload(profile);
      filesHandled += coverLetterHandled;
    }
  } catch (error) {
    // Silent error handling
  }

  return filesHandled;
};

/**
 * Handles resume file upload specifically
 */
const handleResumeUpload = async (profile: UserProfile): Promise<number> => {
  try {
    // Convert dataUrl to File
    const resumeFile = await dataUrlToFile(
      profile.resumeFile!.dataUrl,
      profile.resumeFile!.name
    );

    if (!resumeFile) {
      return 0;
    }

    // Try different strategies in sequence until one works
    const strategies = [
      findResumeInputInContainer,
      findResumeInputById,
      findResumeInputByAttributes,
    ];

    for (const strategy of strategies) {
      const result = await strategy(resumeFile);
      if (result) {
        return 1;
      }
    }

    return 0;
  } catch (error) {
    // Silent error handling
    return 0;
  }
};

/**
 * Strategy 1: Find resume input within resume container
 */
const findResumeInputInContainer = async (file: File): Promise<boolean> => {
  try {
    // Look for the resume container in the form
    const resumeContainer = document.querySelector("li.application-question.resume");
    if (!resumeContainer) {
      return false;
    }

    // Find the file input within the container
    const fileInput = resumeContainer.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    if (fileInput && fileInput instanceof HTMLInputElement) {
      // Assign file to input
      assignFile(fileInput, file);

      // Check if there's also an upload button that needs to be clicked
      const uploadButton = resumeContainer.querySelector("button");
      if (uploadButton) {
        uploadButton.click();
      }

      return true;
    }

    return false;
  } catch (error) {
    // Silent error handling
    return false;
  }
};

/**
 * Strategy 2: Find resume input by standard ID
 */
const findResumeInputById = async (file: File): Promise<boolean> => {
  try {
    // Look for resume input by common IDs
    const resumeInput = document.getElementById(
      "resume-upload-input"
    ) as HTMLInputElement;

    if (resumeInput && resumeInput instanceof HTMLInputElement) {
      // Assign file to input
      assignFile(resumeInput, file);
      return true;
    }

    return false;
  } catch (error) {
    // Silent error handling
    return false;
  }
};

/**
 * Strategy 3: Find resume input by attributes
 */
const findResumeInputByAttributes = async (file: File): Promise<boolean> => {
  try {
    // Look for all file inputs on the page
    const inputs = document.querySelectorAll('input[type="file"]');

    for (const input of inputs) {
      const inputEl = input as HTMLInputElement;
      const inputId = inputEl.id?.toLowerCase() || "";
      const inputName = inputEl.name?.toLowerCase() || "";
      const inputClasses = inputEl.className?.toLowerCase() || "";

      // Check for resume-related attributes
      if (
        inputId.includes("resume") ||
        inputName.includes("resume") ||
        inputClasses.includes("resume") ||
        inputEl.closest("li.resume") ||
        inputEl.closest('[class*="resume" i]')
      ) {
        // Found resume input
        assignFile(inputEl, file);
        return true;
      }
    }

    return false;
  } catch (error) {
    // Silent error handling
    return false;
  }
};

/**
 * Handles cover letter file upload specifically
 */
const handleCoverLetterUpload = async (profile: UserProfile): Promise<number> => {
  try {
    // Convert dataUrl to File
    const coverLetterFile = await dataUrlToFile(
      profile.coverLetterFile!.dataUrl,
      profile.coverLetterFile!.name
    );

    if (!coverLetterFile) {
      return 0;
    }

    // Look for cover letter container
    const coverLetterContainer = document.querySelector(
      "li.application-question.cover-letter"
    );
    if (coverLetterContainer) {
      const fileInput = coverLetterContainer.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;

      if (fileInput && fileInput instanceof HTMLInputElement) {
        // Assign file to input
        assignFile(fileInput, coverLetterFile);
        return 1;
      }
    }

    // Try generic selectors
    const inputs = document.querySelectorAll('input[type="file"]');
    for (const input of inputs) {
      const inputEl = input as HTMLInputElement;
      const inputId = inputEl.id?.toLowerCase() || "";
      const inputName = inputEl.name?.toLowerCase() || "";
      const inputClasses = inputEl.className?.toLowerCase() || "";

      // Check for cover letter attributes
      if (
        inputId.includes("cover") ||
        inputName.includes("cover") ||
        inputClasses.includes("cover") ||
        inputEl.closest("li.cover-letter") ||
        inputEl.closest('[class*="cover" i]')
      ) {
        // Found cover letter input
        assignFile(inputEl, coverLetterFile);
        return 1;
      }
    }

    return 0;
  } catch (error) {
    // Silent error handling
    return 0;
  }
};

/**
 * Helper function to assign a file to an input element and dispatch events
 */
const assignFile = (fileInput: HTMLInputElement, file: File): void => {
  try {
    // Create a DataTransfer to programmatically set files
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;

    // Dispatch events to ensure the form recognizes the file being set
    const events = ["change", "input"];
    for (const eventType of events) {
      const event = new Event(eventType, { bubbles: true });
      fileInput.dispatchEvent(event);
    }
  } catch (error) {
    // Silent error handling
  }
};
