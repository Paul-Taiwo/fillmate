import { UserProfile } from "../../../types";
import { dataUrlToFile } from "../../utils/file-handlers";

/**
 * Handles file uploads for Greenhouse
 */
export const handleGreenhouseFileUploads = async (
  profile: UserProfile
): Promise<number> => {
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

    // Find resume file input
    const resumeInput = findResumeInput();
    if (!resumeInput) {
      return 0;
    }

    // Assign file to input
    await assignFile(resumeInput, resumeFile);
    return 1;
  } catch (error) {
    // Silent error handling
    return 0;
  }
};

/**
 * Finds the resume input field on the page
 */
const findResumeInput = (): HTMLInputElement | null => {
  try {
    // Approach 1: Check for resume section with a file input
    const resumeSections = document.querySelectorAll(
      '.resume, [data-field-type="resume"]'
    );
    for (const section of resumeSections) {
      const fileInput = section.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        return fileInput;
      }
    }

    // Approach 2: Check for resume-related attribute in input
    const fileInputs = document.querySelectorAll('input[type="file"]');
    for (const input of fileInputs) {
      const inputEl = input as HTMLInputElement;
      const dataType = inputEl.getAttribute("data-input-type") || "";
      const fieldName = inputEl.getAttribute("name") || "";
      const fieldId = inputEl.getAttribute("id") || "";

      if (
        dataType.toLowerCase().includes("resume") ||
        fieldName.toLowerCase().includes("resume") ||
        fieldId.toLowerCase().includes("resume")
      ) {
        return inputEl;
      }

      // Check parent elements for resume indicator
      let parent = inputEl.parentElement;
      for (let i = 0; i < 5 && parent; i++) {
        if (
          parent.textContent?.toLowerCase().includes("resume") ||
          parent.className.toLowerCase().includes("resume")
        ) {
          return inputEl;
        }
        parent = parent.parentElement;
      }
    }

    // Approach 3: If there's only one file input, assume it's for resume
    if (fileInputs.length === 1) {
      return fileInputs[0] as HTMLInputElement;
    }

    return null;
  } catch (error) {
    // Silent error handling
    return null;
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

    // Find cover letter file input
    const coverLetterInput = findCoverLetterInput();
    if (!coverLetterInput) {
      return 0;
    }

    // Assign file to input
    await assignFile(coverLetterInput, coverLetterFile);
    return 1;
  } catch (error) {
    // Silent error handling
    return 0;
  }
};

/**
 * Finds the cover letter input field on the page
 */
const findCoverLetterInput = (): HTMLInputElement | null => {
  try {
    // Approach 1: Check for cover letter section with a file input
    const coverLetterSections = document.querySelectorAll(
      '.cover_letter, [data-field-type="cover_letter"]'
    );
    for (const section of coverLetterSections) {
      const fileInput = section.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        return fileInput;
      }
    }

    // Approach 2: Check for cover letter-related attribute in input
    const fileInputs = document.querySelectorAll('input[type="file"]');
    for (const input of fileInputs) {
      const inputEl = input as HTMLInputElement;
      const dataType = inputEl.getAttribute("data-input-type") || "";
      const fieldName = inputEl.getAttribute("name") || "";
      const fieldId = inputEl.getAttribute("id") || "";

      if (
        dataType.toLowerCase().includes("cover") ||
        fieldName.toLowerCase().includes("cover") ||
        fieldId.toLowerCase().includes("cover")
      ) {
        return inputEl;
      }

      // Check parent elements for cover letter indicator
      let parent = inputEl.parentElement;
      for (let i = 0; i < 5 && parent; i++) {
        if (
          parent.textContent?.toLowerCase().includes("cover letter") ||
          parent.className.toLowerCase().includes("cover")
        ) {
          return inputEl;
        }
        parent = parent.parentElement;
      }
    }

    return null;
  } catch (error) {
    // Silent error handling
    return null;
  }
};

/**
 * Helper function to assign a file to an input element
 */
const assignFile = async (fileInput: HTMLInputElement, file: File): Promise<void> => {
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

    // Greenhouse sometimes requires a click on the "Upload" button
    const uploadBtn = findUploadButton(fileInput);
    if (uploadBtn) {
      uploadBtn.click();
    }
  } catch (error) {
    // Silent error handling
  }
};

/**
 * Finds the upload button associated with a file input
 */
const findUploadButton = (fileInput: HTMLInputElement): HTMLElement | null => {
  try {
    // Check for button in parent container
    let parent = fileInput.parentElement;
    for (let i = 0; i < 5 && parent; i++) {
      const button = parent.querySelector(
        'button, .button, .btn, [type="submit"], .upload-button'
      );
      if (
        button &&
        (button.textContent?.toLowerCase().includes("upload") ||
          button.className.includes("upload"))
      ) {
        return button as HTMLElement;
      }
      parent = parent.parentElement;
    }
    return null;
  } catch (error) {
    // Silent error handling
    return null;
  }
};
