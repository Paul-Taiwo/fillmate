import { UserProfile } from "../types";
import { mapProfileToFields } from "../utils/fieldMapper";
import { fillFormField } from "../utils/field-fillers";
import { handleAshbyHqFileUploads, handleAshbyHqCustomFields } from "./handlers/ashbyhq";
import { handleStandardFileUploads } from "./handlers/file-upload-handler";

/**
 * Main autofill logic - fills in form fields based on profile data
 * Returns a success/failure message
 */
export const executeAutofill = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  console.log("Autofill action triggered");

  // Get the user profile from storage
  const profile = await import("../storage/userProfile")
    .then((m) => m.getUserProfile())
    .catch((err) => {
      console.error("Error loading profile module:", err);
      return null;
    });

  if (!profile) {
    console.warn("No user profile found. Cannot autofill.");
    return { success: false, message: "Profile not found" };
  }

  console.log("Using profile:", profile);
  const hostname = window.location.hostname;
  const fieldMappings = mapProfileToFields(profile, hostname);
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
    }
  }

  // Log profile fields that *exist* but had *no mapping* defined for them
  for (const key in profile) {
    if (
      Object.prototype.hasOwnProperty.call(profile, key) &&
      !processedProfileKeys.has(key) &&
      key !== "resumeFile" &&
      key !== "coverLetterFile" &&
      key !== "customQA"
    ) {
      const profileKey = key as keyof UserProfile;
      if (profile[profileKey]) {
        console.warn(
          `Profile has data for key "${key}", but no mapping was defined in fieldMapper.ts`
        );
      }
    }
  }

  // Handle site-specific processing based on hostname
  if (hostname.includes("ashbyhq.com")) {
    console.log("AshbyHQ detected - using special handlers");

    // Handle custom field filling first
    const ashbyCustomFieldsHandled = await handleAshbyHqCustomFields(profile);
    fieldsFilled += ashbyCustomFieldsHandled;

    // Then handle file uploads
    const ashbyFileFieldsHandled = await handleAshbyHqFileUploads(profile);
    fieldsFilled += ashbyFileFieldsHandled;
  } else {
    // Handle File Uploads for non-AshbyHQ sites using standard approach
    const standardFileFieldsHandled = await handleStandardFileUploads(profile);
    fieldsFilled += standardFileFieldsHandled;
  }

  // TODO: Handle Custom Q&A (requires more complex logic to find matching question fields)

  const message = `Autofill complete. Fields filled: ${fieldsFilled}. Fields not found: ${fieldsNotFound}.`;
  console.log(message);

  return { success: true, message };
};
