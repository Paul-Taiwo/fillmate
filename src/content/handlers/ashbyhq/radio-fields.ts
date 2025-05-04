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

    // Step 1: Find all fieldsets with matching class names from the examples
    const fieldsets = document.querySelectorAll(
      'fieldset[class*="_container_"][class*="_fieldEntry_"]'
    );
    console.log(`Found ${fieldsets.length} fieldsets with matching class pattern`);

    // Step 2: Filter fieldsets to those with notice period labels
    const noticePeriodFieldsets = Array.from(fieldsets).filter((fieldset) => {
      const label = fieldset.querySelector(
        'label[class*="_label_"][class*="ashby-application-form-question-title"]'
      );
      if (!label) return false;

      const labelText = label.textContent?.toLowerCase() || "";
      return (
        labelText.includes("notice period") ||
        labelText.includes("notice") ||
        labelText.includes("begin working")
      );
    });

    console.log(
      `Found ${noticePeriodFieldsets.length} fieldsets with notice period labels`
    );

    // Map of normalized values to what they might appear as in different forms
    const matchingMap = {
      "immediately available": [
        "immediately available",
        "available immediately",
        "immediate",
        "available",
      ],
      "1 month": ["1 month", "2 - 4 weeks", "2-4 weeks", "2 to 4 weeks", "one month"],
      "2 months": ["2 months", "4 - 8 weeks", "4-8 weeks", "4 to 8 weeks", "two months"],
      "3 months or more": [
        "3 months or more",
        "8 weeks +",
        "8 weeks+",
        "8+",
        "three months",
      ],
    };

    // Step 3: Process each matching fieldset
    for (const fieldset of noticePeriodFieldsets) {
      console.log("Processing notice period fieldset");

      // Step 4: Find all radio inputs and their labels in this fieldset
      const options = Array.from(fieldset.querySelectorAll('div[class*="_option_"]'));

      if (options.length === 0) {
        console.log("No option divs found in this fieldset");
        continue;
      }

      console.log(`Found ${options.length} option divs`);

      // Step 5: Validate the structure of radio options
      const validOptions = options.filter((option) => {
        const radio = option.querySelector('input[type="radio"]');
        const label = option.querySelector(`label[class*="_label_"]`);
        return radio && label;
      });

      if (validOptions.length === 0) {
        console.log("No valid radio options found");
        continue;
      }

      console.log(`Found ${validOptions.length} valid radio options`);

      // Step 6: Get the target value to look for
      const normalizedLower = normalizedNoticePeriod.toLowerCase();
      let targetValue = "";

      // Find which category this normalized value belongs to
      for (const [key, values] of Object.entries(matchingMap)) {
        if (
          key === normalizedLower ||
          values.some((v) => normalizedLower.includes(v.toLowerCase()))
        ) {
          targetValue = key;
          break;
        }
      }

      if (!targetValue) {
        console.log("Could not determine target value from normalized notice period");
        targetValue = normalizedLower; // Fallback to direct match
      }

      console.log(`Target value to look for: "${targetValue}"`);

      // Step 7: Find the matching option
      let matchedOption = null;
      let matchedLabel = "";

      // First try exact option text match
      for (const option of validOptions) {
        const label = option.querySelector(`label[class*="_label_"]`);
        if (!label) continue;

        const labelText = label.textContent?.toLowerCase().trim() || "";
        console.log(`Checking option: "${labelText}"`);

        // Check if this label matches our target value or any of its variations
        const possibleMatches =
          matchingMap[targetValue as keyof typeof matchingMap] || [];

        if (
          labelText === targetValue ||
          possibleMatches.some((match) => labelText === match.toLowerCase())
        ) {
          console.log(`Found exact match: "${labelText}"`);
          matchedOption = option;
          matchedLabel = labelText;
          break;
        }
      }

      // If no exact match, try partial match
      if (!matchedOption) {
        for (const option of validOptions) {
          const label = option.querySelector(`label[class*="_label_"]`);
          if (!label) continue;

          const labelText = label.textContent?.toLowerCase().trim() || "";
          const possibleMatches =
            matchingMap[targetValue as keyof typeof matchingMap] || [];

          // Check for partial matches
          if (
            possibleMatches.some(
              (match) =>
                labelText.includes(match.toLowerCase()) ||
                match.toLowerCase().includes(labelText)
            )
          ) {
            console.log(`Found partial match: "${labelText}"`);
            matchedOption = option;
            matchedLabel = labelText;
            break;
          }
        }
      }

      // Step 8: If we found a match, select it
      if (matchedOption) {
        const radio = matchedOption.querySelector(
          'input[type="radio"]'
        ) as HTMLInputElement;
        const label = matchedOption.querySelector(
          `label[class*="_label_"]`
        ) as HTMLElement;

        if (radio && label) {
          console.log(`Selecting option: "${matchedLabel}" via radio id=${radio.id}`);

          try {
            // More aggressive approach to ensure the radio gets checked

            // Method 1: Direct property manipulation
            radio.checked = true;
            console.log(`Set checked=true on radio`);

            // Method 2: Handle via attributes
            radio.setAttribute("checked", "checked");
            console.log(`Set checked attribute`);

            // Method 3: Focus then click (sometimes this sequence matters)
            radio.focus();
            console.log(`Focused radio`);

            // Method 4: Click the parent span container
            const parentSpan = radio.closest('span[class*="_container_"]');
            if (parentSpan instanceof HTMLElement) {
              parentSpan.click();
              console.log(`Clicked parent span`);
            }

            // Method 5: Click the radio directly
            setTimeout(() => {
              try {
                radio.click();
                console.log(`Clicked radio directly`);
              } catch (e) {
                console.error("Error clicking radio:", e);
              }
            }, 50);

            // Method 6: Click the label (often the most reliable in custom UIs)
            setTimeout(() => {
              try {
                label.click();
                console.log(`Clicked label`);

                // Double-check if radio is checked after clicking label
                console.log(`Radio checked state after label click: ${radio.checked}`);
              } catch (e) {
                console.error("Error clicking label:", e);
              }
            }, 100);

            // Method 7: Dispatch multiple event types
            radio.dispatchEvent(new Event("input", { bubbles: true }));
            radio.dispatchEvent(new Event("change", { bubbles: true }));
            radio.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
            radio.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
            radio.dispatchEvent(new MouseEvent("click", { bubbles: true }));
            console.log(`Dispatched multiple events`);

            fieldsHandled++;
            return fieldsHandled;
          } catch (e) {
            console.error("Error selecting radio option:", e);
          }
        }
      } else {
        console.log("No matching option found in this fieldset");
      }
    }

    // Step 10: If we get here, try a more general approach as fallback
    console.log("Fieldset approach failed, trying direct radio button search");

    // Find all radio buttons on the page
    const allRadios = document.querySelectorAll('input[type="radio"]');
    console.log(`Found ${allRadios.length} radio buttons on page`);

    for (const radio of allRadios) {
      // Must have ID to find label
      if (!radio.id) continue;

      const label = document.querySelector(`label[for="${radio.id}"]`);
      if (!label) continue;

      const labelText = label.textContent?.toLowerCase().trim() || "";

      // Only consider labels that look like notice period options
      if (
        labelText.includes("immediately") ||
        labelText.includes("available") ||
        labelText.includes("month") ||
        labelText.includes("week") ||
        labelText.match(/\d+\s*(-|to)\s*\d+\s*week/)
      ) {
        console.log(`Found potential notice period radio: "${labelText}"`);

        // Find if the container has notice period text
        const container = radio.closest("fieldset") || radio.closest("div");
        const containerText = container?.textContent?.toLowerCase() || "";

        if (containerText.includes("notice") || containerText.includes("begin working")) {
          console.log("This radio appears to be in a notice period container");

          // Check if this matches our normalized value
          const normalizedLower = normalizedNoticePeriod.toLowerCase();
          let isMatch = false;

          for (const [key, values] of Object.entries(matchingMap)) {
            if (
              (key === normalizedLower ||
                values.some((v) => normalizedLower.includes(v.toLowerCase()))) &&
              (labelText === key.toLowerCase() ||
                values.some(
                  (v) =>
                    labelText === v.toLowerCase() || labelText.includes(v.toLowerCase())
                ))
            ) {
              isMatch = true;
              break;
            }
          }

          if (isMatch) {
            console.log(`Found matching radio button: "${labelText}"`);

            try {
              const radioInput = radio as HTMLInputElement;

              // Apply the same aggressive methods here
              radioInput.checked = true;
              radioInput.setAttribute("checked", "checked");
              radioInput.focus();

              // Click parent container if available
              const parentSpan = radioInput.closest('span[class*="_container_"]');
              if (parentSpan instanceof HTMLElement) {
                parentSpan.click();
              }

              setTimeout(() => {
                try {
                  radioInput.click();
                } catch (e) {
                  // Silent error
                }
              }, 50);

              if (label instanceof HTMLElement) {
                setTimeout(() => {
                  try {
                    label.click();
                    // Verify checked state
                    console.log(`Fallback radio checked state: ${radioInput.checked}`);
                  } catch (e) {
                    // Silent error
                  }
                }, 100);
              }

              // Dispatch multiple events
              radioInput.dispatchEvent(new Event("input", { bubbles: true }));
              radioInput.dispatchEvent(new Event("change", { bubbles: true }));
              radioInput.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
              radioInput.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
              radioInput.dispatchEvent(new MouseEvent("click", { bubbles: true }));

              fieldsHandled++;
              return fieldsHandled;
            } catch (e) {
              console.error("Error selecting fallback radio:", e);
            }
          }
        }
      }
    }

    console.log("All approaches failed to find matching notice period option");
  }

  return fieldsHandled;
};
