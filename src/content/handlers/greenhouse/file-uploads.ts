import { UserProfile } from "../../../types";
import { dataUrlToFile, assignFileToInput } from "../../utils/file-handlers";

/**
 * Special handling for Greenhouse file uploads
 * Greenhouse uses a specific file upload structure with hidden inputs and multiple buttons
 */
export const handleGreenhouseFileUploads = async (
  profile: UserProfile
): Promise<number> => {
  let fieldsHandled = 0;

  try {
    // Handle Resume/CV upload
    if (profile.resumeFile?.dataUrl) {
      const resumeFile = await dataUrlToFile(
        profile.resumeFile.dataUrl,
        profile.resumeFile.name
      );

      if (!resumeFile) {
        console.warn("Could not convert resume data URL to File object");
        return fieldsHandled;
      }

      // Find resume upload input - Greenhouse typically uses id="resume"
      const resumeInput = document.getElementById("resume") as HTMLInputElement;

      if (
        resumeInput &&
        resumeInput instanceof HTMLInputElement &&
        resumeInput.type === "file"
      ) {
        console.log("Found resume input field");
        assignFileToInput(resumeInput, resumeFile);
        fieldsHandled++;

        // Trigger change event to update UI (some Greenhouse forms use JavaScript to show the file name)
        resumeInput.dispatchEvent(new Event("change", { bubbles: true }));
      } else {
        console.log("Could not find standard resume input field, searching by labels");

        // Try finding by label/upload section
        const resumeLabels = Array.from(
          document.querySelectorAll("div[id^='upload-label-']")
        ).filter((label) => {
          const text = label.textContent?.toLowerCase() || "";
          return text.includes("resume") || text.includes("cv");
        });

        if (resumeLabels.length > 0) {
          const resumeLabel = resumeLabels[0];
          const uploadSection = resumeLabel.closest("div[role='group']");

          if (uploadSection) {
            const fileInput = uploadSection.querySelector("input[type='file']");

            if (fileInput instanceof HTMLInputElement) {
              console.log("Found resume input via label");
              assignFileToInput(fileInput, resumeFile);
              fieldsHandled++;

              // Trigger change event
              fileInput.dispatchEvent(new Event("change", { bubbles: true }));
            }
          }
        }
      }
    }

    // Handle Cover Letter upload
    if (profile.coverLetterFile?.dataUrl) {
      const coverLetterFile = await dataUrlToFile(
        profile.coverLetterFile.dataUrl,
        profile.coverLetterFile.name
      );

      if (!coverLetterFile) {
        console.warn("Could not convert cover letter data URL to File object");
        return fieldsHandled;
      }

      // Find cover letter upload input - Greenhouse typically uses id="cover_letter"
      const coverLetterInput = document.getElementById(
        "cover_letter"
      ) as HTMLInputElement;

      if (
        coverLetterInput &&
        coverLetterInput instanceof HTMLInputElement &&
        coverLetterInput.type === "file"
      ) {
        console.log("Found cover letter input field");
        assignFileToInput(coverLetterInput, coverLetterFile);
        fieldsHandled++;

        // Trigger change event
        coverLetterInput.dispatchEvent(new Event("change", { bubbles: true }));
      } else {
        console.log(
          "Could not find standard cover letter input field, searching by labels"
        );

        // Try finding by label/upload section
        const coverLetterLabels = Array.from(
          document.querySelectorAll("div[id^='upload-label-']")
        ).filter((label) => {
          const text = label.textContent?.toLowerCase() || "";
          return text.includes("cover letter");
        });

        if (coverLetterLabels.length > 0) {
          const coverLetterLabel = coverLetterLabels[0];
          const uploadSection = coverLetterLabel.closest("div[role='group']");

          if (uploadSection) {
            const fileInput = uploadSection.querySelector("input[type='file']");

            if (fileInput instanceof HTMLInputElement) {
              console.log("Found cover letter input via label");
              assignFileToInput(fileInput, coverLetterFile);
              fieldsHandled++;

              // Trigger change event
              fileInput.dispatchEvent(new Event("change", { bubbles: true }));
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error handling Greenhouse file uploads:", error);
  }

  return fieldsHandled;
};
