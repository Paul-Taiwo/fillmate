import { UserProfile } from "../../types";
import { dataUrlToFile } from "../utils/file-handlers";

/**
 * Handle file uploads for standard (non-AshbyHQ) sites
 * Finds file input fields and assigns the appropriate files to them
 */
export const handleStandardFileUploads = async (
  profile: UserProfile
): Promise<number> => {
  let filesHandled = 0;

  // Handle resume upload if profile has a resume file
  if (profile.resumeFile) {
    try {
      // Convert dataUrl to File
      const resumeFile = await dataUrlToFile(
        profile.resumeFile.dataUrl,
        profile.resumeFile.name
      );

      if (resumeFile) {
        // Look for common resume upload inputs
        const resumeInput = findFileInput(["resume", "cv"]);
        if (resumeInput) {
          // Assign file to input
          assignFile(resumeInput, resumeFile);
          filesHandled++;
        }
      }
    } catch (error) {
      // Silent error handling
    }
  }

  // Handle cover letter upload if profile has a cover letter file
  if (profile.coverLetterFile) {
    try {
      // Convert dataUrl to File
      const coverLetterFile = await dataUrlToFile(
        profile.coverLetterFile.dataUrl,
        profile.coverLetterFile.name
      );

      if (coverLetterFile) {
        // Look for common cover letter upload inputs
        const coverLetterInput = findFileInput(["cover", "letter", "motivation"]);
        if (coverLetterInput) {
          // Assign file to input
          assignFile(coverLetterInput, coverLetterFile);
          filesHandled++;
        }
      }
    } catch (error) {
      // Silent error handling
    }
  }

  return filesHandled;
};

/**
 * Finds a file input element that matches the given keywords
 */
const findFileInput = (keywords: string[]): HTMLInputElement | null => {
  // Look for file inputs that match any of the provided keywords
  const inputs = document.querySelectorAll('input[type="file"]');
  for (const input of inputs) {
    const inputEl = input as HTMLInputElement;
    const id = inputEl.id?.toLowerCase() || "";
    const name = inputEl.name?.toLowerCase() || "";
    const classes = inputEl.className?.toLowerCase() || "";
    const ariaLabel = inputEl.getAttribute("aria-label")?.toLowerCase() || "";

    if (
      keywords.some(
        (keyword) =>
          id.includes(keyword) ||
          name.includes(keyword) ||
          classes.includes(keyword) ||
          ariaLabel.includes(keyword)
      )
    ) {
      return inputEl;
    }
  }
  return null;
};

/**
 * Assigns a file to an input element and dispatches necessary events
 */
const assignFile = (fileInput: HTMLInputElement, file: File): void => {
  try {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;

    // Dispatch necessary events
    const events = ["change", "input"];
    events.forEach((eventType) => {
      const event = new Event(eventType, { bubbles: true });
      fileInput.dispatchEvent(event);
    });
  } catch (error) {
    // Silent error handling
  }
};
