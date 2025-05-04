import { UserProfile } from "../../../types";

/**
 * Handle AshbyHQ checkbox fields, specifically for "How did you hear about us?"
 */
export const handleAshbyHqCheckboxFields = async (
  profile: UserProfile
): Promise<number> => {
  let fieldsHandled = 0;

  // Handle How Did You Hear About Us field
  if (profile.howDidYouHear) {
    // Find all fieldsets on the page
    const allFieldsets = document.querySelectorAll("fieldset");

    // Try to find the source fieldset using various common patterns
    let sourceFieldset = null;
    const keywords = ["hear about us", "how did you find", "source", "referral"];

    // Find the correct fieldset
    for (const fieldset of allFieldsets) {
      const text = fieldset.textContent?.toLowerCase() || "";
      if (keywords.some((keyword) => text.includes(keyword))) {
        sourceFieldset = fieldset;
        break;
      }
    }

    if (sourceFieldset) {
      // Look for all checkboxes within this fieldset
      const checkboxes = sourceFieldset.querySelectorAll('input[type="checkbox"]');

      if (checkboxes.length > 0) {
        // Track if we've selected a checkbox
        let selected = false;

        // Try to match user sources with checkbox options
        for (const checkbox of checkboxes) {
          const inputElement = checkbox as HTMLInputElement;
          const labelElement =
            inputElement.parentElement?.querySelector("label") ||
            inputElement.closest("label") ||
            document.querySelector(`label[for="${inputElement.id}"]`);

          const labelText = labelElement?.textContent?.toLowerCase().trim() || "";

          // Check if the user profile sources match this option
          const sources = profile.howDidYouHear.toLowerCase().split(",");
          let shouldSelect = false;

          for (const source of sources) {
            const trimmedSource = source.trim();

            // Check for a match between the source and label
            if (
              (trimmedSource === "linkedin" && labelText.includes("linkedin")) ||
              (labelText === "linkedin" && trimmedSource.includes("linkedin")) ||
              labelText.includes(trimmedSource) ||
              trimmedSource.includes(labelText)
            ) {
              shouldSelect = true;
              break;
            }
          }

          // If found a match, select it
          if (shouldSelect) {
            try {
              inputElement.checked = true;
              inputElement.dispatchEvent(new Event("change", { bubbles: true }));
              selected = true;
              fieldsHandled++;

              // Also click the label for good measure
              if (labelElement instanceof HTMLElement) {
                setTimeout(() => {
                  try {
                    labelElement.click();
                  } catch (e) {
                    // Silently handle click errors
                  }
                }, 50);
              }
            } catch (e) {
              // Continue to next checkbox if there's an error
            }
          }
        }

        // If nothing was selected, just select the first checkbox as fallback
        if (!selected && checkboxes.length > 0) {
          const firstCheckbox = checkboxes[0] as HTMLInputElement;
          try {
            firstCheckbox.checked = true;
            firstCheckbox.dispatchEvent(new Event("change", { bubbles: true }));
            fieldsHandled++;
          } catch (e) {
            // Silently handle errors
          }
        }
      }
    } else {
      // Last resort - try to find any checkbox
      const anyCheckbox = document.querySelector('input[type="checkbox"]');
      if (anyCheckbox instanceof HTMLInputElement) {
        try {
          anyCheckbox.checked = true;
          anyCheckbox.dispatchEvent(new Event("change", { bubbles: true }));
          fieldsHandled++;
        } catch (e) {
          // Silently handle errors
        }
      }
    }
  }

  return fieldsHandled;
};
