import { UserProfile } from "../../../types";
import { getAshbyHqNoticePeriod } from "../../../storage/userProfile";

/**
 * Handle AshbyHQ radio button fields, specifically for notice period
 */
export const handleAshbyHqRadioFields = async (profile: UserProfile): Promise<number> => {
  let fieldsHandled = 0;

  // Handle Notice Period field
  if (profile.noticePeriod) {
    console.log("Handling notice period:", profile.noticePeriod);

    // Get notice period normalized for AshbyHQ format
    const normalizedNoticePeriod = getAshbyHqNoticePeriod(profile.noticePeriod);
    console.log("Normalized for AshbyHQ:", normalizedNoticePeriod);

    // First try the exact structure shown in the HTML
    const noticePeriodFieldset = document.querySelector(
      'fieldset[class*="_container_"][class*="_fieldEntry_"]'
    );

    if (noticePeriodFieldset) {
      // Verify it's the notice period fieldset by checking the label
      const fieldsetLabel = noticePeriodFieldset.querySelector(
        "label.ashby-application-form-question-title"
      );

      if (
        fieldsetLabel &&
        fieldsetLabel.textContent?.toLowerCase().includes("notice period")
      ) {
        console.log(
          "Found notice period fieldset with exact structure:",
          fieldsetLabel.textContent
        );

        // Get all the radio options with their labels
        const optionDivs = noticePeriodFieldset.querySelectorAll(
          'div[class*="_option_"]'
        );
        console.log(`Found ${optionDivs.length} notice period options`);

        // Log all available option labels for debugging
        optionDivs.forEach((optionDiv) => {
          const label = optionDiv.querySelector('label[class*="_label_"]');
          console.log(`Option: ${label?.textContent}`);
        });

        // Normalize the user's notice period value
        const userNotice = normalizedNoticePeriod.toLowerCase().trim();
        console.log("Normalized user notice period:", userNotice);

        // Find the matching option
        let optionToSelect = null;
        let optionLabel = "";

        for (const optionDiv of optionDivs) {
          const label = optionDiv.querySelector('label[class*="_label_"]');
          const input = optionDiv.querySelector('input[type="radio"]');

          if (label && input) {
            const labelText = label.textContent?.toLowerCase().trim() || "";
            console.log(`Comparing: "${labelText}" with "${userNotice}"`);

            // Exact match
            if (labelText === userNotice) {
              console.log(`✓ Exact match found: "${labelText}"`);
              optionToSelect = input;
              optionLabel = labelText;
              break;
            }

            // Include match
            if (labelText.includes(userNotice) || userNotice.includes(labelText)) {
              console.log(
                `✓ Include match found: "${labelText}" contains or is contained in "${userNotice}"`
              );
              optionToSelect = input;
              optionLabel = labelText;
              break;
            }

            // Special cases
            if (
              (userNotice === "immediately available" ||
                userNotice.includes("immediate") ||
                userNotice.includes("available") ||
                userNotice === "0" ||
                userNotice === "asap") &&
              labelText.includes("immediately")
            ) {
              console.log(`✓ Special match found for "immediately available"`);
              optionToSelect = input;
              optionLabel = labelText;
              break;
            }

            if (
              (userNotice === "1 month" ||
                userNotice.includes("1 month") ||
                userNotice.includes("one month") ||
                userNotice === "1" ||
                userNotice === "one") &&
              labelText.includes("1 month")
            ) {
              console.log(`✓ Special match found for "1 month"`);
              optionToSelect = input;
              optionLabel = labelText;
              break;
            }

            if (
              (userNotice === "2 months" ||
                userNotice.includes("2 month") ||
                userNotice.includes("two month") ||
                userNotice === "2" ||
                userNotice === "two") &&
              labelText.includes("2 month")
            ) {
              console.log(`✓ Special match found for "2 months"`);
              optionToSelect = input;
              optionLabel = labelText;
              break;
            }

            if (
              (userNotice === "3 months or more" ||
                userNotice.includes("3 month") ||
                userNotice.includes("three month") ||
                userNotice.includes("more") ||
                userNotice === "3" ||
                userNotice === "three") &&
              labelText.includes("3 month")
            ) {
              console.log(`✓ Special match found for "3 months or more"`);
              optionToSelect = input;
              optionLabel = labelText;
              break;
            }
          }
        }

        // Select the option
        if (optionToSelect instanceof HTMLInputElement) {
          console.log(`Selecting notice period option: "${optionLabel}"`);
          console.log(
            `Radio button id: ${optionToSelect.id}, name: ${optionToSelect.name}`
          );

          optionToSelect.checked = true;
          console.log(`Set checked = true`);

          optionToSelect.click(); // Some implementations require a click
          console.log(`Clicked the radio input`);

          optionToSelect.dispatchEvent(new Event("change", { bubbles: true }));
          console.log(`Dispatched change event`);

          // Also try clicking the label to handle custom radio implementations
          const labelFor = optionToSelect.id;
          if (labelFor) {
            const associatedLabel = document.querySelector(`label[for="${labelFor}"]`);
            if (associatedLabel instanceof HTMLElement) {
              console.log(`Found associated label for=${labelFor}, will click it`);
              setTimeout(() => {
                associatedLabel.click();
                console.log(`Clicked the associated label`);
              }, 100);
            }
          }

          fieldsHandled++;
          console.log(`Successfully handled notice period field`);
          return fieldsHandled;
        } else {
          console.warn("No matching option found for notice period");
          // Log the available options again for clarification
          console.log("Available options:");
          optionDivs.forEach((optionDiv) => {
            const label = optionDiv.querySelector('label[class*="_label_"]');
            console.log(`- ${label?.textContent}`);
          });
        }
      } else {
        console.log(
          "Found fieldset but it's not for notice period:",
          fieldsetLabel ? fieldsetLabel.textContent : "no label found"
        );
      }
    } else {
      console.log("Could not find notice period fieldset with the exact structure");
    }

    // Fallback to more generic detection if the exact structure didn't work
    console.log("Falling back to generic notice period detection");

    // Look for any fieldset with a label containing "notice period"
    const noticeFieldsets = Array.from(document.querySelectorAll("fieldset")).filter(
      (fieldset) => {
        const label = fieldset.querySelector("label");
        return label && label.textContent?.toLowerCase().includes("notice period");
      }
    );

    console.log(`Found ${noticeFieldsets.length} fieldsets with notice period label`);

    for (const fieldset of noticeFieldsets) {
      // Find all radio inputs in this fieldset
      const radioInputs = fieldset.querySelectorAll('input[type="radio"]');

      if (radioInputs.length > 0) {
        console.log(`Found ${radioInputs.length} radio inputs in notice period fieldset`);

        // Try to find labels for each radio
        const userNotice = normalizedNoticePeriod.toLowerCase().trim();
        let selectedInput = null;

        for (const input of radioInputs) {
          if (input.id) {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label) {
              const labelText = label.textContent?.toLowerCase().trim() || "";
              console.log(`Checking radio option: "${labelText}"`);

              // Check for matches using the same logic as above
              if (
                labelText === userNotice ||
                labelText.includes(userNotice) ||
                userNotice.includes(labelText)
              ) {
                console.log(`Match found: "${labelText}"`);
                selectedInput = input;
                break;
              }

              // Special cases
              if (
                (userNotice === "immediately available" ||
                  userNotice.includes("immediate") ||
                  userNotice.includes("available") ||
                  userNotice === "0" ||
                  userNotice === "asap") &&
                labelText.includes("immediately")
              ) {
                console.log(`Special match found for "immediately available"`);
                selectedInput = input;
                break;
              }

              if (
                (userNotice === "1 month" ||
                  userNotice.includes("1 month") ||
                  userNotice.includes("one month") ||
                  userNotice === "1" ||
                  userNotice === "one") &&
                labelText.includes("1 month")
              ) {
                console.log(`Special match found for "1 month"`);
                selectedInput = input;
                break;
              }

              if (
                (userNotice === "2 months" ||
                  userNotice.includes("2 month") ||
                  userNotice.includes("two month") ||
                  userNotice === "2" ||
                  userNotice === "two") &&
                labelText.includes("2 month")
              ) {
                console.log(`Special match found for "2 months"`);
                selectedInput = input;
                break;
              }

              if (
                (userNotice === "3 months or more" ||
                  userNotice.includes("3 month") ||
                  userNotice.includes("three month") ||
                  userNotice.includes("more") ||
                  userNotice === "3" ||
                  userNotice === "three") &&
                labelText.includes("3 month")
              ) {
                console.log(`Special match found for "3 months or more"`);
                selectedInput = input;
                break;
              }
            }
          }
        }

        if (selectedInput instanceof HTMLInputElement) {
          console.log(`Selected notice period radio input: ${selectedInput.id}`);
          selectedInput.checked = true;
          selectedInput.click(); // Some implementations require a click
          selectedInput.dispatchEvent(new Event("change", { bubbles: true }));

          fieldsHandled++;
          console.log(`Successfully handled notice period field (fallback method)`);
          return fieldsHandled;
        } else {
          console.log("No matching radio option found in fieldset");
        }
      }
    }

    // Final fallback for text inputs
    console.log("Trying text input fallback for notice period");
    const noticePeriodField =
      document.querySelector('input[placeholder*="Notice Period" i]') ||
      document.querySelector('input[name*="notice" i]') ||
      document.querySelector('label[for*="notice" i] ~ div input');

    if (noticePeriodField instanceof HTMLInputElement) {
      console.log("Found notice period text field:", noticePeriodField);
      // Use the original value for text inputs to maintain compatibility with other sites
      noticePeriodField.value = profile.noticePeriod;
      noticePeriodField.dispatchEvent(new Event("input", { bubbles: true }));
      noticePeriodField.dispatchEvent(new Event("change", { bubbles: true }));
      fieldsHandled++;
      console.log(`Successfully handled notice period field (text input method)`);
    } else {
      console.log("Could not find any notice period input field, all methods failed");
    }
  } else {
    console.log("No notice period value provided in profile");
  }

  return fieldsHandled;
};
