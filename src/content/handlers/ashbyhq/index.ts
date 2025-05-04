import { UserProfile } from "../../../types";
import { handleAshbyHQFileUploads } from "./file-uploads";
import { handleAshbyHqBasicFields } from "./form-fields";
import { handleAshbyHqRadioFields } from "./radio-fields";
import { handleAshbyHqCheckboxFields } from "./checkbox-fields";

/**
 * Find and fill AshbyHQ specific form fields that might not be standard inputs
 * This is the main entry point for AshbyHQ form handling
 */
export const handleAshbyHqCustomFields = async (
  profile: UserProfile
): Promise<number> => {
  let fieldsHandled = 0;

  try {
    // Handle basic form fields (name, email, phone, location, etc.)
    const basicFieldsHandled = await handleAshbyHqBasicFields(profile);
    fieldsHandled += basicFieldsHandled;

    // Handle radio button fields (notice period)
    const radioFieldsHandled = await handleAshbyHqRadioFields(profile);
    fieldsHandled += radioFieldsHandled;

    // Handle checkbox fields (how did you hear about us)
    const checkboxFieldsHandled = await handleAshbyHqCheckboxFields(profile);
    fieldsHandled += checkboxFieldsHandled;
  } catch (error) {
    // Silent error handling
  }

  return fieldsHandled;
};

// Export individual handlers for direct access if needed
export {
  handleAshbyHQFileUploads,
  handleAshbyHqBasicFields,
  handleAshbyHqRadioFields,
  handleAshbyHqCheckboxFields,
};
