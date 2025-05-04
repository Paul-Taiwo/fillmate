import { UserProfile } from "../../../types";
import { dataUrlToFile } from "../../utils/file-handlers";

/**
 * Handles file uploads for AshbyHQ
 */
export const handleAshbyHQFileUploads = async (profile: UserProfile): Promise<number> => {
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
 * Handles resume file upload for AshbyHQ
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

    // Look for resume upload field
    const resumeField = findResumeField();
    if (!resumeField) {
      return 0;
    }

    // Upload the file
    await uploadFile(resumeField, resumeFile);
    return 1;
  } catch (error) {
    // Silent error handling
    return 0;
  }
};

/**
 * Find the resume upload field on AshbyHQ
 */
const findResumeField = (): HTMLElement | null => {
  try {
    // Method 1: Look for resume field using data attributes
    const resumeField = document.querySelector('[data-field-type="resume"]');
    if (resumeField) {
      return resumeField as HTMLElement;
    }

    // Method 2: Look for resume field using common class names
    const resumeFieldByClass = document.querySelector(".resume-field, .resume-upload");
    if (resumeFieldByClass) {
      return resumeFieldByClass as HTMLElement;
    }

    // Method 3: Look for fields with "resume" or "cv" in the label
    const fieldLabels = document.querySelectorAll(".field-label, label");
    for (const label of fieldLabels) {
      const labelText = label.textContent?.toLowerCase() || "";
      if (labelText.includes("resume") || labelText.includes("cv")) {
        // Find the closest field container
        const container = label.closest(".field-container, .upload-field");
        if (container) {
          return container as HTMLElement;
        }
      }
    }

    // Method 4: If there's only one upload field, use that
    const uploadFields = document.querySelectorAll(
      '.upload-field, [data-field-type="file"]'
    );
    if (uploadFields.length === 1) {
      return uploadFields[0] as HTMLElement;
    }

    return null;
  } catch (error) {
    // Silent error handling
    return null;
  }
};

/**
 * Handles cover letter file upload for AshbyHQ
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

    // Look for cover letter upload field
    const coverLetterField = findCoverLetterField();
    if (!coverLetterField) {
      return 0;
    }

    // Upload the file
    await uploadFile(coverLetterField, coverLetterFile);
    return 1;
  } catch (error) {
    // Silent error handling
    return 0;
  }
};

/**
 * Find the cover letter upload field on AshbyHQ
 */
const findCoverLetterField = (): HTMLElement | null => {
  try {
    // Method 1: Look for cover letter field using data attributes
    const coverLetterField = document.querySelector('[data-field-type="cover_letter"]');
    if (coverLetterField) {
      return coverLetterField as HTMLElement;
    }

    // Method 2: Look for cover letter field using common class names
    const coverLetterFieldByClass = document.querySelector(
      ".cover-letter-field, .cover-letter-upload"
    );
    if (coverLetterFieldByClass) {
      return coverLetterFieldByClass as HTMLElement;
    }

    // Method 3: Look for fields with "cover letter" in the label
    const fieldLabels = document.querySelectorAll(".field-label, label");
    for (const label of fieldLabels) {
      const labelText = label.textContent?.toLowerCase() || "";
      if (labelText.includes("cover letter")) {
        // Find the closest field container
        const container = label.closest(".field-container, .upload-field");
        if (container) {
          return container as HTMLElement;
        }
      }
    }

    return null;
  } catch (error) {
    // Silent error handling
    return null;
  }
};

/**
 * Helper function to upload a file to a field
 */
const uploadFile = async (fieldContainer: HTMLElement, file: File): Promise<void> => {
  try {
    // Find file input within container
    const fileInput = fieldContainer.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (!fileInput) {
      return;
    }

    // Create DataTransfer and assign file
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;

    // Dispatch events
    const events = ["change", "input"];
    for (const eventType of events) {
      const event = new Event(eventType, { bubbles: true });
      fileInput.dispatchEvent(event);
    }

    // Check if there's an upload button to click
    const uploadButton = fieldContainer.querySelector("button");
    if (uploadButton) {
      uploadButton.click();
    }
  } catch (error) {
    // Silent error handling
  }
};
