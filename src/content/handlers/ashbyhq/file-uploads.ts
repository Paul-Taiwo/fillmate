import { UserProfile } from "../../../types";
import { dataUrlToFile, assignFileToInput } from "../../utils/file-handlers";

/**
 * Special handling for AshbyHQ file uploads
 * AshbyHQ uses a custom file upload component that requires special handling
 */
export const handleAshbyHqFileUploads = async (profile: UserProfile): Promise<number> => {
  let fieldsHandled = 0;

  if (profile.resumeFile?.dataUrl) {
    try {
      // Find AshbyHQ's specific hidden file input (based on their HTML structure)
      const fileInput = document.getElementById(
        "_systemfield_resume"
      ) as HTMLInputElement;

      if (!fileInput) {
        console.log(
          "Could not find file input with ID '_systemfield_resume', trying alternative approaches"
        );

        // Try to find resume sections by scanning for labels/text containing CV/Resume
        const resumeLabels = Array.from(document.querySelectorAll("label")).filter(
          (label) => {
            const text = label.textContent?.toLowerCase() || "";
            return (
              text.includes("resume") ||
              text.includes("cv") ||
              text.includes("curriculum vitae")
            );
          }
        );

        console.log(`Found ${resumeLabels.length} resume/CV related labels`);

        // Try each label to find file input
        for (const label of resumeLabels) {
          if (label.htmlFor) {
            const associatedElement = document.getElementById(label.htmlFor);

            // Sometimes the for attribute points to a container, not the input itself
            if (associatedElement) {
              const fileInputNearLabel =
                associatedElement.querySelector('input[type="file"]') ||
                (associatedElement instanceof HTMLInputElement &&
                associatedElement.type === "file"
                  ? associatedElement
                  : null);

              if (fileInputNearLabel instanceof HTMLInputElement) {
                console.log(
                  "Found file input through label association:",
                  fileInputNearLabel
                );

                // Convert dataUrl to File
                const resumeFile = await dataUrlToFile(
                  profile.resumeFile.dataUrl,
                  profile.resumeFile.name
                );

                if (resumeFile) {
                  assignFileToInput(fileInputNearLabel, resumeFile);
                  fieldsHandled++;

                  // Look for upload button nearby
                  const parentContainer =
                    fileInputNearLabel.closest("div._fieldEntry_hkyf8_29") ||
                    fileInputNearLabel.parentElement?.parentElement;

                  if (parentContainer) {
                    const nearbyButton = parentContainer.querySelector("button");
                    if (nearbyButton) {
                      setTimeout(() => {
                        nearbyButton.click();
                      }, 500);
                    }
                  }

                  return fieldsHandled;
                }
              }
            }
          }

          // If htmlFor didn't work, try looking at nearby elements
          const container = label.nextElementSibling || label.parentElement;
          if (container) {
            const fileInputNearLabel = container.querySelector('input[type="file"]');

            if (fileInputNearLabel instanceof HTMLInputElement) {
              console.log("Found file input near label:", fileInputNearLabel);

              // Convert dataUrl to File
              const resumeFile = await dataUrlToFile(
                profile.resumeFile.dataUrl,
                profile.resumeFile.name
              );

              if (resumeFile) {
                assignFileToInput(fileInputNearLabel, resumeFile);
                fieldsHandled++;

                // Look for upload button nearby
                const nearbyButton = container.querySelector("button");
                if (nearbyButton) {
                  setTimeout(() => {
                    nearbyButton.click();
                  }, 500);
                }

                return fieldsHandled;
              }
            }
          }
        }

        // Final approach: look for buttons with text "Upload File" or "Upload Resume"
        // and check if there's a hidden file input nearby
        const uploadButtons = Array.from(document.querySelectorAll("button")).filter(
          (button) => {
            const text = button.textContent?.toLowerCase() || "";
            return (
              text.includes("upload file") ||
              text.includes("upload resume") ||
              text.includes("upload cv")
            );
          }
        );

        console.log(`Found ${uploadButtons.length} upload buttons`);

        for (const button of uploadButtons) {
          // Check surrounding container for file input
          const container =
            button.closest("div._fieldEntry_hkyf8_29") ||
            button.closest("div._container_6k3nb_71") ||
            button.parentElement?.parentElement;

          if (container) {
            const hiddenFileInput = container.querySelector('input[type="file"]');

            if (hiddenFileInput instanceof HTMLInputElement) {
              console.log("Found hidden file input near upload button:", hiddenFileInput);

              // Convert dataUrl to File
              const resumeFile = await dataUrlToFile(
                profile.resumeFile.dataUrl,
                profile.resumeFile.name
              );

              if (resumeFile) {
                assignFileToInput(hiddenFileInput, resumeFile);
                fieldsHandled++;

                // Click the button to trigger any UI updates
                setTimeout(() => {
                  button.click();
                }, 500);

                return fieldsHandled;
              }
            }
          }
        }

        // Last resort: try any file input
        const fallbackInput =
          document.querySelector('input[type="file"][accept*=".pdf"]') ||
          document.querySelector('input[type="file"][id*="resume" i]') ||
          document.querySelector('input[type="file"]');

        if (fallbackInput instanceof HTMLInputElement) {
          console.log("Found fallback file input:", fallbackInput);

          // Convert dataUrl to File
          const resumeFile = await dataUrlToFile(
            profile.resumeFile.dataUrl,
            profile.resumeFile.name
          );

          if (resumeFile) {
            assignFileToInput(fallbackInput, resumeFile);
            fieldsHandled++;
          }
        } else {
          console.warn("No suitable file input found for resume upload");
        }

        return fieldsHandled;
      }

      console.log("Found AshbyHQ file input:", fileInput);

      // Convert dataUrl to File
      const resumeFile = await dataUrlToFile(
        profile.resumeFile.dataUrl,
        profile.resumeFile.name
      );

      if (!resumeFile) {
        console.error("Failed to convert resume dataUrl to File");
        return fieldsHandled;
      }

      // Assign file to the input
      assignFileToInput(fileInput, resumeFile);
      fieldsHandled++;

      // Find and click the upload button to ensure the UI updates
      // Look for the button near the file input that contains "Upload File" text
      const uploadButton = Array.from(document.querySelectorAll("button")).find(
        (btn) =>
          btn.textContent?.includes("Upload File") &&
          btn.closest("div")?.contains(fileInput)
      );

      if (uploadButton) {
        console.log("Found upload button, clicking to ensure UI updates");
        setTimeout(() => {
          uploadButton.click();
        }, 500);
      } else {
        // Fallback approach - find any element that might be the upload button in the vicinity
        const fallbackButtons = document.querySelectorAll(
          '._button_6k3nb_107, button:contains("Upload")'
        );

        if (fallbackButtons.length > 0) {
          console.log("Using fallback button");
          setTimeout(() => {
            (fallbackButtons[0] as HTMLElement).click();
          }, 500);
        }
      }

      // Create and dispatch a change event on the file input to ensure it registers
      const changeEvent = new Event("change", { bubbles: true });
      fileInput.dispatchEvent(changeEvent);
    } catch (error) {
      console.error("Error handling AshbyHQ resume upload:", error);
    }
  }

  return fieldsHandled;
};
