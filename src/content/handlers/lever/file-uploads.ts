import { UserProfile } from "../../../types";
import { dataUrlToFile, assignFileToInput } from "../../utils/file-handlers";

/**
 * Special handling for Lever.co file uploads
 * Lever.co uses a specific HTML structure for file uploads
 */
export const handleLeverFileUploads = async (profile: UserProfile): Promise<number> => {
  let fieldsHandled = 0;

  // Handle resume upload
  if (profile.resumeFile?.dataUrl) {
    const resumeHandled = await handleResumeUpload(profile);
    fieldsHandled += resumeHandled;
  }

  // Handle cover letter upload (if needed)
  if (profile.coverLetterFile?.dataUrl) {
    const coverLetterHandled = await handleCoverLetterUpload(profile);
    fieldsHandled += coverLetterHandled;
  }

  return fieldsHandled;
};

/**
 * Handles resume file upload specifically
 */
const handleResumeUpload = async (profile: UserProfile): Promise<number> => {
  try {
    console.log("Attempting to upload resume on Lever.co");

    // Convert dataUrl to File
    const resumeFile = await dataUrlToFile(
      profile.resumeFile!.dataUrl,
      profile.resumeFile!.name
    );

    if (!resumeFile) {
      console.warn("Could not convert resume data URL to File object");
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

    console.warn("All resume upload strategies failed");
    return 0;
  } catch (error) {
    console.error("Error handling Lever.co resume upload:", error);
    return 0;
  }
};

/**
 * Strategy 1: Find resume input inside container
 */
const findResumeInputInContainer = async (resumeFile: File): Promise<boolean> => {
  const resumeContainer = document.querySelector("li.application-question.resume");
  if (!resumeContainer) {
    console.log("Strategy 1: Resume container not found");
    return false;
  }

  console.log("Strategy 1: Found resume container on Lever.co form");

  // Find the file input within the container
  const fileInput = resumeContainer.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement;

  if (!fileInput || !(fileInput instanceof HTMLInputElement)) {
    console.log("Strategy 1: No file input found in container");
    return false;
  }

  console.log("Strategy 1: Found resume file input:", fileInput);

  // Assign file to input
  assignFileToInput(fileInput, resumeFile);

  // Lever.co has a hidden input that requires clicking the visible button
  const uploadButton = resumeContainer.querySelector(
    "a.postings-btn.template-btn-utility.visible-resume-upload"
  );

  if (uploadButton) {
    console.log("Strategy 1: Clicking on upload button to trigger file dialog");
    // Sometimes we need to directly focus and click
    (uploadButton as HTMLElement).focus();
    (uploadButton as HTMLElement).click();
  }

  return true;
};

/**
 * Strategy 2: Find resume input by ID
 */
const findResumeInputById = async (resumeFile: File): Promise<boolean> => {
  const idFileInput = document.getElementById("resume-upload-input") as HTMLInputElement;

  if (!idFileInput || !(idFileInput instanceof HTMLInputElement)) {
    console.log("Strategy 2: Resume input with ID 'resume-upload-input' not found");
    return false;
  }

  console.log("Strategy 2: Found resume file input by ID");
  assignFileToInput(idFileInput, resumeFile);

  // Manually trigger change event to ensure Lever.co UI updates
  const changeEvent = new Event("change", { bubbles: true });
  idFileInput.dispatchEvent(changeEvent);

  return true;
};

/**
 * Strategy 3: Find resume input by attributes
 */
const findResumeInputByAttributes = async (resumeFile: File): Promise<boolean> => {
  // Try generic selectors
  const inputs = document.querySelectorAll('input[type="file"]');
  console.log(`Strategy 3: Found ${inputs.length} file inputs on the page`);

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
      console.log("Strategy 3: Found resume input through attributes:", inputEl);
      assignFileToInput(inputEl, resumeFile);
      return true;
    }
  }

  console.log("Strategy 3: No resume input found by attributes");
  return false;
};

/**
 * Handles cover letter file upload specifically
 */
const handleCoverLetterUpload = async (profile: UserProfile): Promise<number> => {
  try {
    console.log("Attempting to upload cover letter on Lever.co");

    // Convert dataUrl to File
    const coverLetterFile = await dataUrlToFile(
      profile.coverLetterFile!.dataUrl,
      profile.coverLetterFile!.name
    );

    if (!coverLetterFile) {
      console.warn("Could not convert cover letter data URL to File object");
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
        console.log("Found cover letter file input");
        assignFileToInput(fileInput, coverLetterFile);
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
        console.log("Found cover letter input through attributes:", inputEl);
        assignFileToInput(inputEl, coverLetterFile);
        return 1;
      }
    }

    console.warn("Could not find cover letter input");
    return 0;
  } catch (error) {
    console.error("Error handling Lever.co cover letter upload:", error);
    return 0;
  }
};
