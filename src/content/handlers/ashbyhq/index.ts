import { UserProfile } from "../../../types";
import { handleAshbyHqFileUploads } from "./file-uploads";
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
    console.log("Starting AshbyHQ-specific field handling");

    // Handle basic form fields (name, email, phone, location, etc.)
    const basicFieldsHandled = await handleAshbyHqBasicFields(profile);
    fieldsHandled += basicFieldsHandled;
    console.log(`Handled ${basicFieldsHandled} basic AshbyHQ fields`);

    // Handle radio button fields (notice period)
    const radioFieldsHandled = await handleAshbyHqRadioFields(profile);
    fieldsHandled += radioFieldsHandled;
    console.log(`Handled ${radioFieldsHandled} radio button AshbyHQ fields`);

    // Handle checkbox fields (how did you hear about us)
    const checkboxFieldsHandled = await handleAshbyHqCheckboxFields(profile);
    fieldsHandled += checkboxFieldsHandled;
    console.log(`Handled ${checkboxFieldsHandled} checkbox AshbyHQ fields`);
  } catch (error) {
    console.error("Error in AshbyHQ custom fields handler:", error);
  }

  console.log(`AshbyHQ fields handler completed: ${fieldsHandled} fields filled`);
  return fieldsHandled;
};

// Export individual handlers for direct access if needed
export {
  handleAshbyHqFileUploads,
  handleAshbyHqBasicFields,
  handleAshbyHqRadioFields,
  handleAshbyHqCheckboxFields,
};
