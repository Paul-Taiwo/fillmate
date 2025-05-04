import { mapProfileToFields } from "../utils/fieldMapper";
import { fillFormField } from "../utils/field-fillers";
import { handleStandardFileUploads } from "./handlers/file-upload-handler";
import { findSiteHandler } from "./site-handlers";

/**
 * Main autofill logic - fills in form fields based on profile data
 * Returns a success/failure message
 */
export const executeAutofill = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  // Get the user profile from storage
  const profile = await import("../storage/userProfile")
    .then((m) => m.getUserProfile())
    .catch(() => null);

  if (!profile) {
    return { success: false, message: "Profile not found" };
  }

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
        fieldsNotFound++;
      }
    }
  }

  // Find and execute site-specific handler based on hostname
  let siteSpecificFieldsHandled = 0;
  const matchedSite = findSiteHandler(hostname);

  if (matchedSite) {
    siteSpecificFieldsHandled = await matchedSite.handler(profile);
    fieldsFilled += siteSpecificFieldsHandled;
  } else {
    // Default handler for sites without specific implementations
    const standardFieldsHandled = await handleStandardFileUploads(profile);
    fieldsFilled += standardFieldsHandled;
  }

  const message = `Autofill complete. Fields filled: ${fieldsFilled}. Fields not found: ${fieldsNotFound}.`;

  return { success: true, message };
};
