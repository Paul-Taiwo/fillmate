import { UserProfile } from "../../../types";
import { handleLeverFileUploads } from "./file-uploads";
import { handleLeverFormFields } from "./form-fields";

/**
 * Find and fill Lever.co specific form fields
 * This is the main entry point for Lever.co form handling
 */
export const handleLeverCustomFields = async (profile: UserProfile): Promise<number> => {
  let fieldsHandled = 0;

  try {
    // Handle special form fields first (like location)
    const formFieldsHandled = await handleLeverFormFields(profile);
    fieldsHandled += formFieldsHandled;

    // Handle file uploads
    const fileFieldsHandled = await handleLeverFileUploads(profile);
    fieldsHandled += fileFieldsHandled;
  } catch (error) {
    // Silent error handling
  }

  return fieldsHandled;
};
