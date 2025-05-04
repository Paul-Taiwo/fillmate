import { UserProfile } from "../../../types";
import { handleGreenhouseFileUploads } from "./file-uploads";

/**
 * Find and fill Greenhouse specific form fields
 * This is the main entry point for Greenhouse form handling
 */
export const handleGreenhouseCustomFields = async (
  profile: UserProfile
): Promise<number> => {
  let fieldsHandled = 0;

  try {
    // Handle basic fields first (firstname, lastname, email, etc.)
    const basicFieldsHandled = await handleGreenhouseBasicFields(profile);
    fieldsHandled += basicFieldsHandled;

    // Handle React Select dropdowns (gender, location, etc.)
    const reactSelectsHandled = await handleGreenhouseReactSelects(profile);
    fieldsHandled += reactSelectsHandled;

    // Handle other dynamic form fields (linkedin, github, portfolio, etc.)
    const dynamicFieldsHandled = await handleGreenhouseDynamicFields(profile);
    fieldsHandled += dynamicFieldsHandled;

    // Handle file uploads
    const fileFieldsHandled = await handleGreenhouseFileUploads(profile);
    fieldsHandled += fileFieldsHandled;
  } catch (error) {
    // Silent error handling
  }

  return fieldsHandled;
};

/**
 * Handle basic form fields specific to Greenhouse
 */
const handleGreenhouseBasicFields = async (profile: UserProfile): Promise<number> => {
  let fieldsHandled = 0;

  try {
    // Handle first name field
    const firstNameInput = document.getElementById("first_name");
    if (firstNameInput instanceof HTMLInputElement && profile.name) {
      const nameParts = profile.name.split(" ");
      const firstName = nameParts[0];

      firstNameInput.value = firstName;
      firstNameInput.dispatchEvent(new Event("input", { bubbles: true }));
      firstNameInput.dispatchEvent(new Event("change", { bubbles: true }));
      fieldsHandled++;
    }

    // Handle last name field
    const lastNameInput = document.getElementById("last_name");
    if (lastNameInput instanceof HTMLInputElement && profile.name) {
      const nameParts = profile.name.split(" ");
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

      lastNameInput.value = lastName;
      lastNameInput.dispatchEvent(new Event("input", { bubbles: true }));
      lastNameInput.dispatchEvent(new Event("change", { bubbles: true }));
      fieldsHandled++;
    }

    // Handle other basic fields (email, phone, etc.)
    const fieldMappings: { [key: string]: keyof UserProfile } = {
      email: "email",
      phone: "phone",
      phone_number: "phone",
    };

    for (const [fieldId, profileKey] of Object.entries(fieldMappings)) {
      const field = document.getElementById(fieldId);
      if (field instanceof HTMLInputElement && profile[profileKey]) {
        field.value = profile[profileKey] as string;
        field.dispatchEvent(new Event("input", { bubbles: true }));
        field.dispatchEvent(new Event("change", { bubbles: true }));
        fieldsHandled++;
      }
    }
  } catch (error) {
    // Silent error handling
  }

  return fieldsHandled;
};

/**
 * Handles React Select dropdowns in Greenhouse forms
 * These are more complex than standard inputs and require special handling
 */
const handleGreenhouseReactSelects = async (profile: UserProfile): Promise<number> => {
  let fieldsHandled = 0;

  try {
    // Find all select containers
    const selectContainers = document.querySelectorAll('[class*="select"]');

    if (!selectContainers || selectContainers.length === 0) {
      return 0;
    }

    // Process each select container to identify the field and fill it
    for (const container of selectContainers) {
      // Find the label to identify the field
      const label = container.querySelector("label");
      if (!label) continue;

      const labelText = label.textContent?.trim().toLowerCase() || "";
      const labelFor = label.getAttribute("for") || "";

      // Skip if we can't identify the field
      if (!labelText) continue;

      // Map label text to profile fields
      let valueToSelect = "";

      // Handle gender field
      if (labelText.includes("gender")) {
        const inputElement = document.getElementById(labelFor);
        if (inputElement) {
          valueToSelect = profile.gender || "";
          fieldsHandled += await handleReactSelect(
            inputElement,
            labelText,
            valueToSelect
          );
        }
      }

      // Handle location field
      else if (labelText.includes("location") || labelText.includes("where")) {
        const inputElement = document.getElementById(labelFor);
        if (inputElement) {
          valueToSelect = profile.location || "";
          fieldsHandled += await handleReactSelect(
            inputElement,
            labelText,
            valueToSelect
          );
        }
      }

      // Handle visa sponsorship field
      else if (
        labelText.includes("visa") ||
        labelText.includes("sponsor") ||
        labelText.includes("work authorization") ||
        labelText.includes("authorized")
      ) {
        const inputElement = document.getElementById(labelFor);
        if (inputElement) {
          // Convert visa status to a yes/no value
          const requiresSponsorship = profile.visaStatus === "requires_sponsorship";
          valueToSelect = requiresSponsorship ? "Yes" : "No";
          fieldsHandled += await handleReactSelect(
            inputElement,
            labelText,
            valueToSelect
          );
        }
      }

      // Handle notice period field
      else if (labelText.includes("notice") || labelText.includes("start")) {
        const inputElement = document.getElementById(labelFor);
        if (inputElement) {
          valueToSelect = profile.noticePeriod || "";
          fieldsHandled += await handleReactSelect(
            inputElement,
            labelText,
            valueToSelect
          );
        }
      }

      // For GDPR/privacy related selects (often required), just select the first option
      else if (
        labelText.includes("gdpr") ||
        labelText.includes("privacy") ||
        labelText.includes("consent") ||
        labelText.includes("terms")
      ) {
        const inputElement = document.getElementById(labelFor);
        if (inputElement) {
          fieldsHandled += await handleReactSelect(inputElement, labelText, "Yes");
        }
      }
    }
  } catch (error) {
    // Silent error handling
  }

  return fieldsHandled;
};

/**
 * Helper function to handle a single React Select dropdown
 */
const handleReactSelect = async (
  inputElement: HTMLElement,
  labelText: string,
  valueToSelect: string
): Promise<number> => {
  if (!inputElement || !valueToSelect) return 0;

  try {
    // 1. Focus and click on the input to open the dropdown
    inputElement.focus();
    inputElement.click();

    // 2. Wait for the dropdown to appear
    await new Promise((resolve) => setTimeout(resolve, 300));

    // 3. Find all dropdown options
    const optionsContainer = document.querySelector('[class*="menu"]');
    if (!optionsContainer) return 0;

    const options = optionsContainer.querySelectorAll('[id*="option"]');
    if (!options || options.length === 0) {
      // If no options found, try inputting the text directly
      if (inputElement instanceof HTMLInputElement) {
        inputElement.value = valueToSelect;
        inputElement.dispatchEvent(new Event("input", { bubbles: true }));
        inputElement.dispatchEvent(new Event("change", { bubbles: true }));

        // Press Enter to confirm selection
        const enterEvent = new KeyboardEvent("keydown", {
          key: "Enter",
          code: "Enter",
          keyCode: 13,
          bubbles: true,
        });
        inputElement.dispatchEvent(enterEvent);
        return 1;
      }
      return 0;
    }

    // 4. Find and click the matching option
    let foundMatch = false;

    // Special handling for location field - more fuzzy matching
    if (labelText.includes("location")) {
      for (const option of options) {
        if (option instanceof HTMLElement) {
          const optionText = option.textContent?.trim().toLowerCase() || "";
          const valueToSelectLower = valueToSelect.toLowerCase();

          // For location, we do more fuzzy matching
          if (
            optionText.includes(valueToSelectLower) ||
            valueToSelectLower.includes(optionText) ||
            // Match country/city part
            valueToSelectLower
              .split(",")
              .some((part) => optionText.includes(part.trim())) ||
            optionText.split(",").some((part) => valueToSelectLower.includes(part.trim()))
          ) {
            option.click();
            foundMatch = true;
            break;
          }
        }
      }
    }
    // Standard matching for other fields
    else {
      for (const option of options) {
        if (option instanceof HTMLElement) {
          const optionText = option.textContent?.trim().toLowerCase() || "";

          if (
            optionText.includes(valueToSelect.toLowerCase()) ||
            valueToSelect.toLowerCase().includes(optionText)
          ) {
            option.click();
            foundMatch = true;
            break;
          }
        }
      }
    }

    // 5. If no match found, just close the dropdown by clicking elsewhere
    if (!foundMatch) {
      // For location field, we might need to take a different approach
      if (labelText.includes("location") && inputElement instanceof HTMLInputElement) {
        // Enter the value directly and press Enter
        inputElement.value = valueToSelect;
        inputElement.dispatchEvent(new Event("input", { bubbles: true }));
        inputElement.dispatchEvent(new Event("change", { bubbles: true }));

        // Press Enter to confirm selection
        const enterEvent = new KeyboardEvent("keydown", {
          key: "Enter",
          code: "Enter",
          keyCode: 13,
          bubbles: true,
        });
        inputElement.dispatchEvent(enterEvent);
      } else {
        // Just click elsewhere to close the dropdown
        document.body.click();
      }
    }

    // Direct ID-based approach for location field
    if (labelText.includes("location") && !foundMatch) {
      const locationField = document.getElementById("job_application_location");
      if (locationField instanceof HTMLInputElement) {
        locationField.value = valueToSelect;
        locationField.dispatchEvent(new Event("input", { bubbles: true }));
        locationField.dispatchEvent(new Event("change", { bubbles: true }));

        // Dispatch blur event to trigger validation
        locationField.dispatchEvent(new Event("blur", { bubbles: true }));
        return 1;
      }
    }

    return foundMatch ? 1 : 0;
  } catch (error) {
    // Silent error handling
    return 0;
  }
};

/**
 * Handles dynamic form fields in Greenhouse
 * These are often custom questions added by the company
 */
const handleGreenhouseDynamicFields = async (profile: UserProfile): Promise<number> => {
  let fieldsHandled = 0;

  try {
    // Find all labels that might be for dynamic fields
    const labels = document.querySelectorAll("label");

    for (const label of labels) {
      const labelText = label.textContent?.trim().toLowerCase() || "";
      const forAttribute = label.getAttribute("for");

      if (!forAttribute) continue;

      const input = document.getElementById(forAttribute);
      if (
        !input ||
        !(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement)
      ) {
        continue;
      }

      // Match label text to profile fields

      // LinkedIn field
      if (labelText.includes("linkedin") || labelText.includes("linked in")) {
        input.value = profile.linkedin || "";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
        fieldsHandled++;
      }

      // GitHub field
      else if (labelText.includes("github") || labelText.includes("git hub")) {
        input.value = profile.github || "";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
        fieldsHandled++;
      }

      // Portfolio/website field
      else if (
        labelText.includes("portfolio") ||
        labelText.includes("website") ||
        labelText.includes("personal site")
      ) {
        input.value = profile.portfolio || "";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
        fieldsHandled++;
      }

      // How did you hear about us field
      else if (
        labelText.includes("how did you hear") ||
        labelText.includes("how you found")
      ) {
        input.value = profile.howDidYouHear || "";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
        fieldsHandled++;
      }

      // Notice period field
      else if (
        labelText.includes("notice period") ||
        labelText.includes("when can you start")
      ) {
        input.value = profile.noticePeriod || "";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
        fieldsHandled++;
      }
    }
  } catch (error) {
    // Silent error handling
  }

  return fieldsHandled;
};
