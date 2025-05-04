import { UserProfile } from "../../types";
import { dataUrlToFile, assignFileToInput } from "../utils/file-handlers";
import { findFieldByLabel } from "../../utils/field-finders";

/**
 * Handle file uploads for standard (non-AshbyHQ) sites
 * Finds file input fields and assigns the appropriate files to them
 */
export const handleStandardFileUploads = async (
  profile: UserProfile
): Promise<number> => {
  let fieldsHandled = 0;

  if (profile.resumeFile?.dataUrl) {
    try {
      const resumeFile = await dataUrlToFile(
        profile.resumeFile.dataUrl,
        profile.resumeFile.name
      );

      // Look for resume/CV file inputs
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
        fieldsHandled++;
        console.log("Resume uploaded successfully");
      } else {
        console.warn("Could not find resume input or convert file.");
      }
    } catch (error) {
      console.error("Error handling resume upload:", error);
    }
  }

  if (profile.coverLetterFile?.dataUrl) {
    try {
      const coverLetterFile = await dataUrlToFile(
        profile.coverLetterFile.dataUrl,
        profile.coverLetterFile.name
      );

      // Look for cover letter file inputs
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
        fieldsHandled++;
        console.log("Cover letter uploaded successfully");
      } else {
        console.warn("Could not find cover letter input or convert file.");
      }
    } catch (error) {
      console.error("Error handling cover letter upload:", error);
    }
  }

  return fieldsHandled;
};
