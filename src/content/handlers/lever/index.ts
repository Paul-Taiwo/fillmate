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
    console.log("Starting Lever.co-specific field handling");

    // Handle special form fields first (like location)
    const formFieldsHandled = await handleLeverFormFields(profile);
    fieldsHandled += formFieldsHandled;
    console.log(`Handled ${formFieldsHandled} special form fields`);

    // Handle file uploads
    const fileFieldsHandled = await handleLeverFileUploads(profile);
    fieldsHandled += fileFieldsHandled;
    console.log(`Handled ${fileFieldsHandled} file uploads`);
  } catch (error) {
    console.error("Error handling Lever.co custom fields:", error);
  }

  console.log(`Lever.co fields handler completed: ${fieldsHandled} fields filled`);
  return fieldsHandled;
};
