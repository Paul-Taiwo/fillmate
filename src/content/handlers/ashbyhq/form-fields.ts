import { UserProfile } from "../../../types";

/**
 * Handle basic AshbyHQ form fields like name, email, phone, etc.
 */
export const handleAshbyHqBasicFields = async (profile: UserProfile): Promise<number> => {
  let fieldsHandled = 0;

  try {
    // AshbyHQ often uses custom components that wrap inputs or have complex structures
    console.log("Starting direct AshbyHQ field handling");

    // Handle Name fields
    if (profile.name) {
      // Try to find the main name field by ID first
      const nameField = document.getElementById("_systemfield_name") as HTMLInputElement;

      if (nameField && nameField instanceof HTMLInputElement) {
        console.log("Found name field by ID");
        nameField.value = profile.name;
        nameField.dispatchEvent(new Event("input", { bubbles: true }));
        nameField.dispatchEvent(new Event("change", { bubbles: true }));
        fieldsHandled++;
      } else {
        // Try first/last name combination if full name doesn't exist
        const nameParts = profile.name.trim().split(/\s+/);
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ");

        // Try more specific selectors for first/last name fields
        const firstNameField =
          document.querySelector('input[name="firstName"]') ||
          document.querySelector('input[placeholder*="First name" i]') ||
          document.querySelector('input[id*="firstName" i]') ||
          document.querySelector('label[for*="firstName" i] ~ div input');

        const lastNameField =
          document.querySelector('input[name="lastName"]') ||
          document.querySelector('input[placeholder*="Last name" i]') ||
          document.querySelector('input[id*="lastName" i]') ||
          document.querySelector('label[for*="lastName" i] ~ div input');

        if (firstNameField instanceof HTMLInputElement) {
          firstNameField.value = firstName;
          firstNameField.dispatchEvent(new Event("input", { bubbles: true }));
          firstNameField.dispatchEvent(new Event("change", { bubbles: true }));
          fieldsHandled++;
        }

        if (lastNameField instanceof HTMLInputElement) {
          lastNameField.value = lastName;
          lastNameField.dispatchEvent(new Event("input", { bubbles: true }));
          lastNameField.dispatchEvent(new Event("change", { bubbles: true }));
          fieldsHandled++;
        }
      }
    }

    // Handle Phone Number field
    if (profile.phone) {
      // First try direct element ID
      const phoneField =
        (document.getElementById("_systemfield_phone") as HTMLInputElement) ||
        document.querySelector('input[type="tel"]') ||
        document.querySelector('input[placeholder*="Phone" i]') ||
        document.querySelector('div._fieldEntry_hkyf8_29 input[type="tel"]') ||
        document.querySelector('label[for*="phone"] ~ div input');

      if (phoneField instanceof HTMLInputElement) {
        console.log("Found phone field:", phoneField);
        phoneField.value = profile.phone;
        phoneField.dispatchEvent(new Event("input", { bubbles: true }));
        phoneField.dispatchEvent(new Event("change", { bubbles: true }));
        fieldsHandled++;
      } else {
        // Try finding by label - scan all labels for phone-related text
        const phoneLabels = Array.from(document.querySelectorAll("label")).filter(
          (label) => label.textContent?.toLowerCase().includes("phone")
        );

        for (const label of phoneLabels) {
          // Try to find input near this label
          if (label.htmlFor) {
            const inputByFor = document.getElementById(label.htmlFor);
            if (inputByFor && inputByFor instanceof HTMLInputElement) {
              inputByFor.value = profile.phone;
              inputByFor.dispatchEvent(new Event("input", { bubbles: true }));
              inputByFor.dispatchEvent(new Event("change", { bubbles: true }));
              fieldsHandled++;
              break;
            }
          }

          // Look for input in the next element
          const container = label.nextElementSibling;
          if (container) {
            const input = container.querySelector("input");
            if (input instanceof HTMLInputElement) {
              input.value = profile.phone;
              input.dispatchEvent(new Event("input", { bubbles: true }));
              input.dispatchEvent(new Event("change", { bubbles: true }));
              fieldsHandled++;
              break;
            }
          }
        }
      }
    }

    // Handle Location field
    if (profile.location) {
      // First try by direct ID
      const locationField =
        (document.getElementById("_systemfield_location") as HTMLInputElement) ||
        document.querySelector('input[placeholder*="Location" i]') ||
        document.querySelector('input[placeholder*="Current Location" i]') ||
        document.querySelector('input[name*="location" i]') ||
        document.querySelector('label[for*="location" i] ~ div input');

      if (locationField instanceof HTMLInputElement) {
        locationField.value = profile.location;
        locationField.dispatchEvent(new Event("input", { bubbles: true }));
        locationField.dispatchEvent(new Event("change", { bubbles: true }));
        fieldsHandled++;
      } else {
        // Try finding by label - scan all labels for location-related text
        const locationLabels = Array.from(document.querySelectorAll("label")).filter(
          (label) => {
            const text = label.textContent?.toLowerCase() || "";
            return (
              text.includes("location") ||
              text.includes("city") ||
              text.includes("country") ||
              text.includes("residence")
            );
          }
        );

        for (const label of locationLabels) {
          let handled = false;

          // Try to find input near this label
          if (label.htmlFor) {
            const inputElement = document.getElementById(label.htmlFor);

            // Handle regular input
            if (inputElement instanceof HTMLInputElement) {
              inputElement.value = profile.location;
              inputElement.dispatchEvent(new Event("input", { bubbles: true }));
              inputElement.dispatchEvent(new Event("change", { bubbles: true }));
              fieldsHandled++;
              handled = true;
            }

            // Handle combobox/dropdown pattern from AshbyHQ
            if (!handled) {
              // Look for the container that has the input + button combination
              const container =
                document.querySelector(
                  `div._inputContainer_v5ami_28[id="${label.htmlFor}"]`
                ) ||
                label
                  .closest("div._fieldEntry_hkyf8_29")
                  ?.querySelector("div._inputContainer_v5ami_28") ||
                inputElement?.closest("div._inputContainer_v5ami_28");

              if (container) {
                const comboboxInput =
                  container.querySelector('input[role="combobox"]') ||
                  container.querySelector("input");

                if (comboboxInput instanceof HTMLInputElement) {
                  // Enter the location value
                  comboboxInput.value = profile.location;
                  comboboxInput.dispatchEvent(new Event("input", { bubbles: true }));
                  comboboxInput.dispatchEvent(new Event("change", { bubbles: true }));

                  // Click the dropdown button to show options
                  const dropdownButton =
                    container.querySelector("button._toggleButton_v5ami_32") ||
                    container.querySelector("button");

                  if (dropdownButton instanceof HTMLElement) {
                    // Click to open the dropdown
                    dropdownButton.click();

                    // Wait for dropdown and then select the first option
                    setTimeout(() => {
                      const options =
                        document.querySelectorAll('li[role="option"]') ||
                        document.querySelectorAll('div[role="option"]');

                      // Click the first option that contains our text
                      for (const option of options) {
                        if (
                          option instanceof HTMLElement &&
                          option.textContent
                            ?.toLowerCase()
                            .includes(profile.location.toLowerCase())
                        ) {
                          option.click();
                          break;
                        }
                      }

                      // If no match found, click the first option
                      if (options.length > 0 && options[0] instanceof HTMLElement) {
                        options[0].click();
                      }
                    }, 500);

                    fieldsHandled++;
                    handled = true;
                  }
                }
              }
            }
          }

          // If we haven't handled it yet, check the next element
          if (!handled) {
            const container = label.nextElementSibling;
            if (container) {
              const input = container.querySelector("input");
              if (input instanceof HTMLInputElement) {
                input.value = profile.location;
                input.dispatchEvent(new Event("input", { bubbles: true }));
                input.dispatchEvent(new Event("change", { bubbles: true }));
                fieldsHandled++;
                handled = true;
              }
            }
          }

          if (handled) break;
        }
      }
    }

    // Handle LinkedIn/GitHub fields
    if (profile.linkedin) {
      const linkedinField =
        document.querySelector('input[placeholder*="LinkedIn" i]') ||
        document.querySelector('input[name*="linkedin" i]') ||
        document.querySelector('label[for*="linkedin" i] ~ div input');

      if (linkedinField instanceof HTMLInputElement) {
        console.log("Found LinkedIn field:", linkedinField);
        linkedinField.value = profile.linkedin;
        linkedinField.dispatchEvent(new Event("input", { bubbles: true }));
        linkedinField.dispatchEvent(new Event("change", { bubbles: true }));
        fieldsHandled++;
      }
    }

    if (profile.github) {
      // Try both GitHub and general portfolio fields
      const githubField =
        document.querySelector('input[placeholder*="GitHub" i]') ||
        document.querySelector('input[name*="github" i]') ||
        document.querySelector('label[for*="github" i] ~ div input') ||
        document.querySelector('input[placeholder*="Portfolio" i]') ||
        document.querySelector('input[name*="portfolio" i]');

      if (githubField instanceof HTMLInputElement) {
        console.log("Found GitHub field:", githubField);
        githubField.value = profile.github;
        githubField.dispatchEvent(new Event("input", { bubbles: true }));
        githubField.dispatchEvent(new Event("change", { bubbles: true }));
        fieldsHandled++;
      }
    }

    // Handle Gender dropdown
    if (profile.gender) {
      const genderLabels = Array.from(document.querySelectorAll("label")).filter(
        (label) => label.textContent?.toLowerCase().includes("gender")
      );

      console.log(`Found ${genderLabels.length} gender related labels`);

      for (const label of genderLabels) {
        // Handle select element
        let handled = false;

        if (label.htmlFor) {
          const selectElement = document.getElementById(label.htmlFor);
          if (selectElement instanceof HTMLSelectElement) {
            for (let i = 0; i < selectElement.options.length; i++) {
              const option = selectElement.options[i];
              // Match our gender value with the option text
              if (option.text.toLowerCase().includes(profile.gender.toLowerCase())) {
                selectElement.selectedIndex = i;
                selectElement.dispatchEvent(new Event("change", { bubbles: true }));
                fieldsHandled++;
                handled = true;
                break;
              }
            }
          }
        }

        // If no select element found, check for custom dropdown
        if (!handled) {
          const container =
            label.closest("div._fieldEntry_hkyf8_29") ||
            label.parentElement?.parentElement;

          if (container) {
            // Click on any button or div that looks like a dropdown trigger
            const dropdownTrigger = container.querySelector(
              'div[class*="dropdown"], button, div[role="button"]'
            );

            if (dropdownTrigger instanceof HTMLElement) {
              console.log("Found dropdown trigger for gender:", dropdownTrigger);
              // Click to open dropdown
              dropdownTrigger.click();

              // Wait for dropdown to open
              setTimeout(() => {
                // Look for options containing our target text
                const options = document.querySelectorAll(
                  'div[role="option"], li, div[class*="option"]'
                );

                for (const option of options) {
                  if (
                    option instanceof HTMLElement &&
                    option.textContent
                      ?.toLowerCase()
                      .includes(profile.gender.toLowerCase())
                  ) {
                    option.click();
                    fieldsHandled++;
                    break;
                  }
                }
              }, 500);

              handled = true;
            }
          }
        }

        if (handled) break;
      }
    }

    // Handle Visa Status dropdown
    if (profile.visaStatus) {
      // Find visa/work authorization related fields
      const visaLabels = Array.from(document.querySelectorAll("label")).filter(
        (label) => {
          const text = label.textContent?.toLowerCase() || "";
          return (
            text.includes("visa") ||
            text.includes("authorization") ||
            text.includes("work permit") ||
            text.includes("sponsorship") ||
            text.includes("authorized")
          );
        }
      );

      console.log(`Found ${visaLabels.length} visa/authorization related labels`);

      // Try to handle each potential visa field
      for (const label of visaLabels) {
        // Map our visa status values to typical dropdown options
        let valueToSelect = "";
        let requiresSponsorship = false;
        if (profile.visaStatus === "requires_sponsorship") {
          valueToSelect = "Yes"; // "Yes, I require sponsorship"
          requiresSponsorship = true;
        } else if (profile.visaStatus === "does_not_require_sponsorship") {
          valueToSelect = "No"; // "No, I don't require sponsorship"
          requiresSponsorship = false;
        }

        // Check if a dropdown select exists
        let handled = false;

        // First try standard select element
        if (label.htmlFor) {
          const selectElement = document.getElementById(label.htmlFor);
          if (selectElement instanceof HTMLSelectElement) {
            for (let i = 0; i < selectElement.options.length; i++) {
              const option = selectElement.options[i];
              if (option.text.toLowerCase().includes(valueToSelect.toLowerCase())) {
                selectElement.selectedIndex = i;
                selectElement.dispatchEvent(new Event("change", { bubbles: true }));
                fieldsHandled++;
                handled = true;
                break;
              }
            }
          }

          // Check for AshbyHQ button-based visa status field (Yes/No buttons)
          if (!handled) {
            const container =
              document.querySelector(`div._yesno_hkyf8_143[id="${label.htmlFor}"]`) ||
              document.querySelector(`div._yesno_hkyf8_143`) ||
              document.querySelector(`div[class*="_yesno_"]`);

            if (container) {
              console.log("Found AshbyHQ button-based visa status field");
              const buttons = container.querySelectorAll("button");

              if (buttons.length >= 2) {
                // AshbyHQ typically has Yes/No buttons
                const yesButton = buttons[0]; // First button is usually "Yes"
                const noButton = buttons[1]; // Second button is usually "No"

                if (requiresSponsorship) {
                  console.log("Clicking 'Yes' for visa sponsorship");
                  yesButton.click();
                } else {
                  console.log("Clicking 'No' for visa sponsorship");
                  noButton.click();
                }

                fieldsHandled++;
                handled = true;
              }
            }
          }
        }

        // If no select element found, check for custom dropdown
        if (!handled) {
          const container =
            label.closest("div._fieldEntry_hkyf8_29") ||
            label.parentElement?.parentElement;

          if (container) {
            // Check for AshbyHQ button-based visa status field first
            const yesNoContainer = container.querySelector('div[class*="_yesno_"]');
            if (yesNoContainer) {
              const buttons = yesNoContainer.querySelectorAll("button");

              if (buttons.length >= 2) {
                // AshbyHQ typically has Yes/No buttons
                const yesButton = buttons[0]; // First button is usually "Yes"
                const noButton = buttons[1]; // Second button is usually "No"

                if (requiresSponsorship) {
                  console.log("Clicking 'Yes' for visa sponsorship");
                  yesButton.click();
                } else {
                  console.log("Clicking 'No' for visa sponsorship");
                  noButton.click();
                }

                fieldsHandled++;
                handled = true;
              }
            } else {
              // Click on any button or div that looks like a dropdown trigger
              const dropdownTrigger = container.querySelector(
                'div[class*="dropdown"], button, div[role="button"]'
              );

              if (dropdownTrigger instanceof HTMLElement) {
                console.log("Found dropdown trigger for visa status:", dropdownTrigger);
                // Click to open dropdown
                dropdownTrigger.click();

                // Wait for dropdown to open
                setTimeout(() => {
                  // Look for options containing our target text
                  const options = document.querySelectorAll(
                    'div[role="option"], li, div[class*="option"]'
                  );
                  console.log(`Found ${options.length} potential options`);

                  for (const option of options) {
                    if (
                      option instanceof HTMLElement &&
                      option.textContent
                        ?.toLowerCase()
                        .includes(valueToSelect.toLowerCase())
                    ) {
                      console.log("Clicking option:", option.textContent);
                      option.click();
                      fieldsHandled++;
                      break;
                    }
                  }
                }, 500);

                handled = true;
              }
            }
          }
        }

        if (handled) break;
      }
    }

    // Check for company/employer field
    const currentCompanyField =
      document.querySelector('input[name*="company" i]') ||
      document.querySelector('input[placeholder*="Current company" i]') ||
      document.querySelector('input[placeholder*="Current employer" i]') ||
      document.querySelector('label[for*="company" i] ~ div input');

    if (currentCompanyField instanceof HTMLInputElement && profile.customQA) {
      // Try to find company info in customQA
      const companyQA = profile.customQA.find(
        (qa) =>
          qa.question.toLowerCase().includes("company") ||
          qa.question.toLowerCase().includes("employer")
      );

      if (companyQA?.answer) {
        currentCompanyField.value = companyQA.answer;
        currentCompanyField.dispatchEvent(new Event("input", { bubbles: true }));
        currentCompanyField.dispatchEvent(new Event("change", { bubbles: true }));
        fieldsHandled++;
      }
    }
  } catch (error) {
    console.error("Error handling AshbyHQ basic fields:", error);
  }

  console.log(`AshbyHQ basic fields handler completed: ${fieldsHandled} fields filled`);
  return fieldsHandled;
};
