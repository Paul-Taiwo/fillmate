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
    console.log("Starting Greenhouse-specific field handling");

    // Handle first name and last name separately (Greenhouse usually has separate fields)
    if (profile.name) {
      const nameParts = profile.name.trim().split(/\s+/);
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ");

      // Handle First Name
      const firstNameField = document.getElementById("first_name") as HTMLInputElement;
      if (firstNameField && firstNameField instanceof HTMLInputElement) {
        console.log("Found first name field by ID");
        firstNameField.value = firstName;
        firstNameField.dispatchEvent(new Event("input", { bubbles: true }));
        firstNameField.dispatchEvent(new Event("change", { bubbles: true }));
        fieldsHandled++;
      }

      // Handle Last Name
      const lastNameField = document.getElementById("last_name") as HTMLInputElement;
      if (lastNameField && lastNameField instanceof HTMLInputElement) {
        console.log("Found last name field by ID");
        lastNameField.value = lastName;
        lastNameField.dispatchEvent(new Event("input", { bubbles: true }));
        lastNameField.dispatchEvent(new Event("change", { bubbles: true }));
        fieldsHandled++;
      }
    }

    // Handle standard fields by ID
    const standardFields = [
      { id: "email", value: profile.email },
      { id: "phone", value: profile.phone },
    ];

    for (const field of standardFields) {
      if (field.value) {
        const inputField = document.getElementById(field.id) as HTMLInputElement;
        if (inputField && inputField instanceof HTMLInputElement) {
          console.log(`Found ${field.id} field by ID`);
          inputField.value = field.value;
          inputField.dispatchEvent(new Event("input", { bubbles: true }));
          inputField.dispatchEvent(new Event("change", { bubbles: true }));
          fieldsHandled++;
        }
      }
    }

    // Handle Greenhouse React Select dropdowns (gender, location, etc)
    if (
      profile.gender ||
      profile.location ||
      profile.visaStatus ||
      profile.noticePeriod
    ) {
      const reactSelectsHandled = await handleGreenhouseReactSelects(profile);
      fieldsHandled += reactSelectsHandled;
    }

    // Handle Greenhouse dynamic question fields
    if (
      profile.linkedin ||
      profile.github ||
      profile.portfolio ||
      profile.howDidYouHear
    ) {
      const additionalFields = handleGreenhouseQuestionFields(profile);
      fieldsHandled += additionalFields;
    }

    // Handle file uploads
    const fileFieldsHandled = await handleGreenhouseFileUploads(profile);
    fieldsHandled += fileFieldsHandled;
    console.log(`Handled ${fileFieldsHandled} file uploads`);
  } catch (error) {
    console.error("Error handling Greenhouse custom fields:", error);
  }

  console.log(`Greenhouse fields handler completed: ${fieldsHandled} fields filled`);
  return fieldsHandled;
};

/**
 * Handle Greenhouse React Select dropdowns (like gender, location, etc)
 */
const handleGreenhouseReactSelects = async (profile: UserProfile): Promise<number> => {
  let fieldsHandled = 0;

  try {
    // Find all select containers
    const selectContainers = document.querySelectorAll(".select__container");
    console.log(`Found ${selectContainers.length} select containers`);

    for (const container of selectContainers) {
      const label = container.querySelector("label");
      if (!label) continue;

      const labelText = label.textContent?.toLowerCase() || "";
      const labelFor = label.getAttribute("for");

      if (!labelFor) continue;

      // Match label text to profile fields
      let valueToSelect: string | undefined = undefined;

      if (labelText.includes("gender") && profile.gender) {
        console.log(`Found gender select with id: ${labelFor}`);
        valueToSelect = profile.gender;
      } else if (labelText.includes("visa") || labelText.includes("sponsorship")) {
        // Handle visa/sponsorship fields
        if (profile.visaStatus === "requires_sponsorship") {
          valueToSelect = "Yes";
        } else if (profile.visaStatus === "does_not_require_sponsorship") {
          valueToSelect = "No";
        }
      } else if (labelText.includes("notice") || labelText.includes("available")) {
        valueToSelect = profile.noticePeriod;
      } else if (
        (labelText.includes("location") || labelFor === "candidate-location") &&
        profile.location
      ) {
        console.log(`Found location select with id: ${labelFor}`);
        valueToSelect = profile.location;
      }

      if (valueToSelect) {
        // Find the input element
        const inputElement = document.getElementById(labelFor);
        if (!inputElement) {
          console.log(`Could not find input element with id ${labelFor}`);
          continue;
        }

        console.log(`Processing ${labelText} field with value: ${valueToSelect}`);

        // Special handling for location field which needs more time to populate suggestions
        const isLocationField =
          labelFor === "candidate-location" || labelText.includes("location");

        // First set the input value
        inputElement.focus();
        if (inputElement instanceof HTMLInputElement) {
          inputElement.value = valueToSelect;
          inputElement.dispatchEvent(new Event("input", { bubbles: true }));
        }

        // Click on the input to open the dropdown
        inputElement.click();
        console.log(`Clicked on ${labelText} input to open dropdown`);

        // Wait for dropdown options to appear (longer for location fields)
        await new Promise((resolve) => setTimeout(resolve, isLocationField ? 500 : 200));

        // Find the React Select option that matches our value
        const options = document.querySelectorAll(".select__option");
        console.log(`Found ${options.length} options for ${labelText}`);

        let optionFound = false;
        for (const option of options) {
          const optionText = option.textContent?.trim() || "";
          // For location, we need to be more flexible with matching
          if (isLocationField) {
            if (
              optionText.toLowerCase().includes(valueToSelect.toLowerCase()) ||
              valueToSelect.toLowerCase().includes(optionText.toLowerCase().split(",")[0])
            ) {
              // Click the matching option
              console.log(`Clicking location option "${optionText}"`);
              (option as HTMLElement).click();
              optionFound = true;
              fieldsHandled++;
              break;
            }
          } else {
            // Standard matching for other fields
            if (optionText.toLowerCase().includes(valueToSelect.toLowerCase())) {
              // Click the matching option
              console.log(`Clicking option "${optionText}" for ${labelText}`);
              (option as HTMLElement).click();
              optionFound = true;
              fieldsHandled++;
              break;
            }
          }
        }

        // If exact match not found, try first option
        if (!optionFound && options.length > 0) {
          console.log(
            `No exact match found for "${valueToSelect}", using first option: ${options[0].textContent}`
          );
          (options[0] as HTMLElement).click();
          fieldsHandled++;
        }

        // If no dropdown appeared or no options found, try direct input for non-location fields
        if (!optionFound && !options.length && !isLocationField) {
          console.log(`No options found, attempting direct input for ${labelText}`);
          if (inputElement instanceof HTMLInputElement) {
            inputElement.setAttribute("value", valueToSelect);
            inputElement.dispatchEvent(new Event("input", { bubbles: true }));
            inputElement.dispatchEvent(new Event("change", { bubbles: true }));
          }
        }

        // For location field, if no match found, try setting value and pressing Enter
        if (!optionFound && isLocationField) {
          console.log(`No location match found, trying to set value and press Enter`);
          if (inputElement instanceof HTMLInputElement) {
            inputElement.value = valueToSelect;
            inputElement.dispatchEvent(new Event("input", { bubbles: true }));
            // Press Enter to confirm selection
            const enterEvent = new KeyboardEvent("keydown", {
              key: "Enter",
              code: "Enter",
              bubbles: true,
            });
            inputElement.dispatchEvent(enterEvent);
          }
        }
      }
    }

    // Special handling for candidate-location if not found through normal processing
    if (profile.location && !fieldsHandled) {
      const locationField = document.getElementById("candidate-location");
      if (locationField) {
        console.log(`Found location field by direct ID, handling separately`);
        locationField.focus();
        if (locationField instanceof HTMLInputElement) {
          locationField.value = profile.location;
          locationField.dispatchEvent(new Event("input", { bubbles: true }));
        }

        // Wait for suggestions to populate
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Press down arrow to select first suggestion and Enter to confirm
        locationField.dispatchEvent(
          new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
        );
        await new Promise((resolve) => setTimeout(resolve, 100));
        locationField.dispatchEvent(
          new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
        );
        fieldsHandled++;
      }
    }
  } catch (error) {
    console.error("Error handling Greenhouse React Select fields:", error);
  }

  return fieldsHandled;
};

/**
 * Helper function to handle Greenhouse's dynamic question fields that use
 * IDs like question_12345678
 */
const handleGreenhouseQuestionFields = (profile: UserProfile): number => {
  let fieldsHandled = 0;

  // Get all question field labels to match with our profile data
  const labels = document.querySelectorAll("label[id^='question_']");
  console.log(`Found ${labels.length} dynamic question fields`);

  labels.forEach((label) => {
    const labelText = label.textContent?.toLowerCase() || "";
    const forAttribute = label.getAttribute("for");

    if (!forAttribute) return;

    const inputField = document.getElementById(forAttribute) as HTMLInputElement;
    if (!inputField || !(inputField instanceof HTMLInputElement)) return;

    // Match label to profile fields
    if (labelText.includes("linkedin") && profile.linkedin) {
      console.log(`Filling LinkedIn field: ${forAttribute}`);
      inputField.value = profile.linkedin;
      inputField.dispatchEvent(new Event("input", { bubbles: true }));
      inputField.dispatchEvent(new Event("change", { bubbles: true }));
      fieldsHandled++;
    } else if (
      (labelText.includes("github") || labelText.includes("git")) &&
      profile.github
    ) {
      console.log(`Filling GitHub field: ${forAttribute}`);
      inputField.value = profile.github;
      inputField.dispatchEvent(new Event("input", { bubbles: true }));
      inputField.dispatchEvent(new Event("change", { bubbles: true }));
      fieldsHandled++;
    } else if (
      (labelText.includes("portfolio") || labelText.includes("website")) &&
      profile.portfolio
    ) {
      console.log(`Filling portfolio/website field: ${forAttribute}`);
      inputField.value = profile.portfolio;
      inputField.dispatchEvent(new Event("input", { bubbles: true }));
      inputField.dispatchEvent(new Event("change", { bubbles: true }));
      fieldsHandled++;
    } else if (labelText.includes("how did you hear") && profile.howDidYouHear) {
      console.log(`Filling "how did you hear" field: ${forAttribute}`);
      inputField.value = profile.howDidYouHear;
      inputField.dispatchEvent(new Event("input", { bubbles: true }));
      inputField.dispatchEvent(new Event("change", { bubbles: true }));
      fieldsHandled++;
    } else if (
      (labelText.includes("notice period") || labelText.includes("when can you start")) &&
      profile.noticePeriod
    ) {
      console.log(`Filling notice period field: ${forAttribute}`);
      inputField.value = profile.noticePeriod;
      inputField.dispatchEvent(new Event("input", { bubbles: true }));
      inputField.dispatchEvent(new Event("change", { bubbles: true }));
      fieldsHandled++;
    }
  });

  return fieldsHandled;
};
