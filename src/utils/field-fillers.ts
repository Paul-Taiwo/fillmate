import { FieldSelector } from "./mapping-types";
import { findFormField } from "./field-finders";

/**
 * Fills a found form field with the provided value.
 * Handles input, textarea, and select elements.
 * Returns true if successful, false otherwise.
 */
export const fillFormField = (
  selectors: FieldSelector[],
  value: string | number
): boolean => {
  const field = findFormField(selectors);

  if (!field) {
    // No warning here, handled by caller (executeAutofill)
    return false;
  }

  console.log(`Attempting to fill field: `, field, ` with value: "${value}"`);

  if (
    field.tagName.toLowerCase() === "input" ||
    field.tagName.toLowerCase() === "textarea"
  ) {
    const inputElement = field as HTMLInputElement | HTMLTextAreaElement;
    inputElement.value = String(value);
    // Dispatch events to simulate user input, needed by some frameworks (React, Vue, etc.)
    inputElement.dispatchEvent(new Event("input", { bubbles: true }));
    inputElement.dispatchEvent(new Event("change", { bubbles: true }));
    inputElement.dispatchEvent(new Event("blur", { bubbles: true })); // Simulate losing focus
    return true;
  } else if (field.tagName.toLowerCase() === "select") {
    const selectElement = field as HTMLSelectElement;
    let optionFound = false;
    const lowerCaseValue = String(value).toLowerCase();

    // Try exact match first (value or text)
    for (let i = 0; i < selectElement.options.length; i++) {
      const option = selectElement.options[i];
      if (
        option.value.toLowerCase() === lowerCaseValue ||
        option.textContent?.trim().toLowerCase() === lowerCaseValue
      ) {
        selectElement.selectedIndex = i;
        optionFound = true;
        break;
      }
    }
    // Attempt partial match if exact match failed
    if (!optionFound) {
      for (let i = 0; i < selectElement.options.length; i++) {
        const option = selectElement.options[i];
        if (option.textContent?.trim().toLowerCase().includes(lowerCaseValue)) {
          selectElement.selectedIndex = i;
          optionFound = true;
          console.log(`Partial match found for "${value}" -> "${option.textContent}"`);
          break;
        }
      }
    }

    if (optionFound) {
      selectElement.dispatchEvent(new Event("change", { bubbles: true }));
      selectElement.dispatchEvent(new Event("blur", { bubbles: true }));
      return true;
    } else {
      console.warn(`Value "${value}" not found in select options for field:`, field);
      return false;
    }
  }
  console.warn(`Unsupported field type: ${field.tagName} for field:`, field);
  return false;
};
