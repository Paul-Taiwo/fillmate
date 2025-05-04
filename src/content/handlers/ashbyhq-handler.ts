import { UserProfile } from "../../types";
import { dataUrlToFile, assignFileToInput } from "../utils/file-handlers";

/**
 * Special handling for AshbyHQ file uploads
 * AshbyHQ uses a custom file upload component that requires special handling
 */
export const handleAshbyHqFileUploads = async (profile: UserProfile): Promise<number> => {
  let fieldsHandled = 0;

  if (profile.resumeFile?.dataUrl) {
    try {
      // Find AshbyHQ's specific hidden file input (based on their HTML structure)
      const fileInput = document.getElementById(
        "_systemfield_resume"
      ) as HTMLInputElement;

      if (!fileInput) {
        console.log(
          "Could not find file input with ID '_systemfield_resume', trying alternative approaches"
        );

        // Try to find resume sections by scanning for labels/text containing CV/Resume
        const resumeLabels = Array.from(document.querySelectorAll("label")).filter(
          (label) => {
            const text = label.textContent?.toLowerCase() || "";
            return (
              text.includes("resume") ||
              text.includes("cv") ||
              text.includes("curriculum vitae")
            );
          }
        );

        console.log(`Found ${resumeLabels.length} resume/CV related labels`);

        // Try each label to find file input
        for (const label of resumeLabels) {
          if (label.htmlFor) {
            const associatedElement = document.getElementById(label.htmlFor);

            // Sometimes the for attribute points to a container, not the input itself
            if (associatedElement) {
              const fileInputNearLabel =
                associatedElement.querySelector('input[type="file"]') ||
                (associatedElement instanceof HTMLInputElement &&
                associatedElement.type === "file"
                  ? associatedElement
                  : null);

              if (fileInputNearLabel instanceof HTMLInputElement) {
                console.log(
                  "Found file input through label association:",
                  fileInputNearLabel
                );

                // Convert dataUrl to File
                const resumeFile = await dataUrlToFile(
                  profile.resumeFile.dataUrl,
                  profile.resumeFile.name
                );

                if (resumeFile) {
                  assignFileToInput(fileInputNearLabel, resumeFile);
                  fieldsHandled++;

                  // Look for upload button nearby
                  const parentContainer =
                    fileInputNearLabel.closest("div._fieldEntry_hkyf8_29") ||
                    fileInputNearLabel.parentElement?.parentElement;

                  if (parentContainer) {
                    const nearbyButton = parentContainer.querySelector("button");
                    if (nearbyButton) {
                      setTimeout(() => {
                        nearbyButton.click();
                      }, 500);
                    }
                  }

                  return fieldsHandled;
                }
              }
            }
          }

          // If htmlFor didn't work, try looking at nearby elements
          const container = label.nextElementSibling || label.parentElement;
          if (container) {
            const fileInputNearLabel = container.querySelector('input[type="file"]');

            if (fileInputNearLabel instanceof HTMLInputElement) {
              console.log("Found file input near label:", fileInputNearLabel);

              // Convert dataUrl to File
              const resumeFile = await dataUrlToFile(
                profile.resumeFile.dataUrl,
                profile.resumeFile.name
              );

              if (resumeFile) {
                assignFileToInput(fileInputNearLabel, resumeFile);
                fieldsHandled++;

                // Look for upload button nearby
                const nearbyButton = container.querySelector("button");
                if (nearbyButton) {
                  setTimeout(() => {
                    nearbyButton.click();
                  }, 500);
                }

                return fieldsHandled;
              }
            }
          }
        }

        // Final approach: look for buttons with text "Upload File" or "Upload Resume"
        // and check if there's a hidden file input nearby
        const uploadButtons = Array.from(document.querySelectorAll("button")).filter(
          (button) => {
            const text = button.textContent?.toLowerCase() || "";
            return (
              text.includes("upload file") ||
              text.includes("upload resume") ||
              text.includes("upload cv")
            );
          }
        );

        console.log(`Found ${uploadButtons.length} upload buttons`);

        for (const button of uploadButtons) {
          // Check surrounding container for file input
          const container =
            button.closest("div._fieldEntry_hkyf8_29") ||
            button.closest("div._container_6k3nb_71") ||
            button.parentElement?.parentElement;

          if (container) {
            const hiddenFileInput = container.querySelector('input[type="file"]');

            if (hiddenFileInput instanceof HTMLInputElement) {
              console.log("Found hidden file input near upload button:", hiddenFileInput);

              // Convert dataUrl to File
              const resumeFile = await dataUrlToFile(
                profile.resumeFile.dataUrl,
                profile.resumeFile.name
              );

              if (resumeFile) {
                assignFileToInput(hiddenFileInput, resumeFile);
                fieldsHandled++;

                // Click the button to trigger any UI updates
                setTimeout(() => {
                  button.click();
                }, 500);

                return fieldsHandled;
              }
            }
          }
        }

        // Last resort: try any file input
        const fallbackInput =
          document.querySelector('input[type="file"][accept*=".pdf"]') ||
          document.querySelector('input[type="file"][id*="resume" i]') ||
          document.querySelector('input[type="file"]');

        if (fallbackInput instanceof HTMLInputElement) {
          console.log("Found fallback file input:", fallbackInput);

          // Convert dataUrl to File
          const resumeFile = await dataUrlToFile(
            profile.resumeFile.dataUrl,
            profile.resumeFile.name
          );

          if (resumeFile) {
            assignFileToInput(fallbackInput, resumeFile);
            fieldsHandled++;
          }
        } else {
          console.warn("No suitable file input found for resume upload");
        }

        return fieldsHandled;
      }

      console.log("Found AshbyHQ file input:", fileInput);

      // Convert dataUrl to File
      const resumeFile = await dataUrlToFile(
        profile.resumeFile.dataUrl,
        profile.resumeFile.name
      );

      if (!resumeFile) {
        console.error("Failed to convert resume dataUrl to File");
        return fieldsHandled;
      }

      // Assign file to the input
      assignFileToInput(fileInput, resumeFile);
      fieldsHandled++;

      // Find and click the upload button to ensure the UI updates
      // Look for the button near the file input that contains "Upload File" text
      const uploadButton = Array.from(document.querySelectorAll("button")).find(
        (btn) =>
          btn.textContent?.includes("Upload File") &&
          btn.closest("div")?.contains(fileInput)
      );

      if (uploadButton) {
        console.log("Found upload button, clicking to ensure UI updates");
        setTimeout(() => {
          uploadButton.click();
        }, 500);
      } else {
        // Fallback approach - find any element that might be the upload button in the vicinity
        const fallbackButtons = document.querySelectorAll(
          '._button_6k3nb_107, button:contains("Upload")'
        );

        if (fallbackButtons.length > 0) {
          console.log("Using fallback button");
          setTimeout(() => {
            (fallbackButtons[0] as HTMLElement).click();
          }, 500);
        }
      }

      // Create and dispatch a change event on the file input to ensure it registers
      const changeEvent = new Event("change", { bubbles: true });
      fileInput.dispatchEvent(changeEvent);
    } catch (error) {
      console.error("Error handling AshbyHQ resume upload:", error);
    }
  }

  return fieldsHandled;
};

/**
 * Find and fill AshbyHQ specific form fields that might not be standard inputs
 */
export const handleAshbyHqCustomFields = async (
  profile: UserProfile
): Promise<number> => {
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
        console.log("Found location field:", locationField);
        locationField.value = profile.location;
        locationField.dispatchEvent(new Event("input", { bubbles: true }));
        locationField.dispatchEvent(new Event("change", { bubbles: true }));
        fieldsHandled++;
      } else {
        // Try finding by label - scan all labels for location-related text
        const locationLabels = Array.from(document.querySelectorAll("label")).filter(
          (label) =>
            label.textContent?.toLowerCase().includes("location") ||
            label.textContent?.toLowerCase().includes("city")
        );

        for (const label of locationLabels) {
          // Try to find input near this label
          if (label.htmlFor) {
            const inputByFor = document.getElementById(label.htmlFor);
            if (inputByFor && inputByFor instanceof HTMLInputElement) {
              inputByFor.value = profile.location;
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
              input.value = profile.location;
              input.dispatchEvent(new Event("input", { bubbles: true }));
              input.dispatchEvent(new Event("change", { bubbles: true }));
              fieldsHandled++;
              break;
            }
          }
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
        if (profile.visaStatus === "requires_sponsorship") {
          valueToSelect = "No"; // "No, I am not authorized"
        } else if (profile.visaStatus === "does_not_require_sponsorship") {
          valueToSelect = "Yes"; // "Yes, I am authorized"
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

        if (handled) break;
      }
    }

    // Handle Gender dropdown (similar approach to visa)
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
    console.error("Error handling AshbyHQ custom fields:", error);
  }

  console.log(`AshbyHQ custom fields handler completed: ${fieldsHandled} fields filled`);
  return fieldsHandled;
};
