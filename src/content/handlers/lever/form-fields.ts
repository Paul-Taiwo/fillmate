import { UserProfile } from "../../../types";

/**
 * Handle Lever.co form fields
 * Handles form fields with specific requirements in Lever.co
 */
export const handleLeverFormFields = async (profile: UserProfile): Promise<number> => {
  let fieldsHandled = 0;

  // Handle location field specifically
  if (profile.location) {
    const locationFieldsHandled = await handleLocationField(profile.location);
    fieldsHandled += locationFieldsHandled;
  }

  // Handle visa sponsorship field if available
  if (profile.visaStatus) {
    const visaFieldsHandled = await handleVisaField(profile.visaStatus);
    fieldsHandled += visaFieldsHandled;
  }

  return fieldsHandled;
};

interface LocationData {
  name: string;
}

/**
 * Special handling for Lever.co visa sponsorship field
 * Lever.co uses radio buttons for yes/no visa sponsorship questions
 */
export const handleVisaField = async (visaStatus: string): Promise<number> => {
  try {
    console.log(
      "Attempting to fill visa sponsorship field on Lever.co with:",
      visaStatus
    );

    // Convert the visa status to a boolean value for "requires sponsorship"
    const requiresSponsorship =
      visaStatus.toLowerCase() === "requires_sponsorship" ||
      visaStatus.toLowerCase() === "yes" ||
      visaStatus.toLowerCase().includes("sponsor");

    console.log(`Converted visa status to requiresSponsorship=${requiresSponsorship}`);

    // Find visa-related questions by looking for specific text patterns
    const allQuestionContainers = document.querySelectorAll("li.application-question");
    let visaQuestionContainer: Element | null = null;

    const visaKeywords = [
      "visa",
      "sponsor",
      "work permit",
      "authorization",
      "authorisation",
    ];

    for (const container of allQuestionContainers) {
      const questionText = container.textContent?.toLowerCase() || "";
      if (visaKeywords.some((keyword) => questionText.includes(keyword))) {
        console.log("Found visa question:", questionText);
        visaQuestionContainer = container;
        break;
      }
    }

    if (!visaQuestionContainer) {
      console.log("No visa sponsorship question found on this form");
      return 0;
    }

    // Find the radio button group inside the visa question container
    const radioGroup = visaQuestionContainer.querySelector(
      'ul[data-qa="multiple-choice"]'
    );
    if (!radioGroup) {
      console.log("Could not find radio button group in visa question");
      return 0;
    }

    // Find all radio buttons in the group
    const radioButtons = radioGroup.querySelectorAll('input[type="radio"]');
    if (radioButtons.length === 0) {
      console.log("No radio buttons found in visa question");
      return 0;
    }

    // Determine which radio button to select (Yes or No)
    const targetValue = requiresSponsorship ? "Yes" : "No";
    let targetRadio: HTMLInputElement | null = null;

    // Find the radio button with the matching value
    for (const radio of radioButtons) {
      if (!(radio instanceof HTMLInputElement)) continue;

      if (radio.value === targetValue) {
        targetRadio = radio;
        break;
      }
    }

    // If we still haven't found a matching radio button, try to identify by label text
    if (!targetRadio) {
      console.log(
        `Could not find radio button with value="${targetValue}", trying to match by label`
      );

      for (const radio of radioButtons) {
        if (!(radio instanceof HTMLInputElement)) continue;

        const label = radio.closest("label");
        const labelText = label?.textContent?.trim().toLowerCase() || "";

        if (
          (requiresSponsorship &&
            (labelText.includes("yes") || labelText.includes("require"))) ||
          (!requiresSponsorship &&
            (labelText.includes("no") ||
              labelText.includes("don't") ||
              labelText.includes("not")))
        ) {
          targetRadio = radio;
          break;
        }
      }
    }

    // If we found a radio button to check, select it
    if (targetRadio) {
      console.log(`Selecting "${targetRadio.value}" for visa sponsorship question`);

      // Check if not already selected
      if (!targetRadio.checked) {
        // Multiple approaches to ensure it gets selected
        targetRadio.checked = true;
        targetRadio.setAttribute("checked", "checked");

        // Dispatch events to trigger any listeners
        targetRadio.dispatchEvent(new Event("change", { bubbles: true }));
        targetRadio.dispatchEvent(new Event("click", { bubbles: true }));

        // Also try clicking the label
        const parentLabel = targetRadio.closest("label");
        if (parentLabel) {
          parentLabel.click();
        }

        return 1;
      } else {
        console.log("Radio button was already selected");
        return 0;
      }
    }

    console.log("Could not find appropriate radio button for visa sponsorship");
    return 0;
  } catch (error) {
    console.error("Error handling Lever.co visa field:", error);
    return 0;
  }
};

/**
 * Special handling for Lever.co location field
 * Lever.co uses a special structure with a visible input, hidden input, and dropdown
 */
export const handleLocationField = async (locationValue: string): Promise<number> => {
  try {
    console.log("Attempting to fill location on Lever.co with:", locationValue);

    // Find the location input and container
    const locationInput = document.getElementById("location-input");
    if (!locationInput || !(locationInput instanceof HTMLInputElement)) {
      console.warn(
        "Could not find location input with ID 'location-input', trying alternative selectors"
      );

      // Try alternative selectors if the ID-based approach fails
      const locationInputs = document.querySelectorAll(
        'input[placeholder*="location" i], input[aria-label*="location" i], input[name*="location" i]'
      );

      if (locationInputs.length > 0) {
        for (const input of locationInputs) {
          if (input instanceof HTMLInputElement) {
            console.log("Found alternative location input:", input);
            return await fillLocationInput(input, locationValue);
          }
        }
      }

      console.warn("Could not find any location input field");
      return 0;
    }

    return await fillLocationInput(locationInput, locationValue);
  } catch (error) {
    console.error("Error handling Lever.co location:", error);
    return 0;
  }
};

/**
 * Helper function to fill a location input and handle the dropdown
 */
const fillLocationInput = async (
  locationInput: HTMLInputElement,
  locationValue: string
): Promise<number> => {
  console.log("Filling location input:", locationInput);

  // Get the location container element that wraps everything
  const locationContainer = locationInput.closest(
    "li.application-question, div.application-field"
  );
  if (!locationContainer) {
    console.warn("Could not find location container");
    return 0;
  }

  // Find the hidden input that stores the actual selected value
  const hiddenInputEl =
    document.getElementById("selected-location") ||
    locationContainer.querySelector('input[type="hidden"]');

  if (hiddenInputEl && !(hiddenInputEl instanceof HTMLInputElement)) {
    console.warn("Hidden input exists but is not an input element");
  }

  // APPROACH 1: Focus and type directly
  console.log("APPROACH 1: Direct typing with focus events");

  // Focus the input first
  locationInput.focus();
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Clear it first
  locationInput.value = "";
  locationInput.dispatchEvent(new Event("input", { bubbles: true }));
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Now set the new value
  locationInput.value = locationValue;

  // Dispatch all relevant events in sequence
  ["input", "change", "keydown", "keyup"].forEach((eventType) => {
    locationInput.dispatchEvent(new Event(eventType, { bubbles: true }));
  });

  // Wait for dropdown to appear
  await new Promise((resolve) => setTimeout(resolve, 500));

  // APPROACH 2: Try to interact with dropdown
  console.log("APPROACH 2: Interact with dropdown if present");

  // Find different possible dropdown containers
  const dropdownContainers = [
    locationContainer.querySelector(".dropdown-container"),
    locationContainer.querySelector(".dropdown-menu"),
    locationContainer.querySelector("ul[role='listbox']"),
    document.querySelector(".dropdown-container"),
    document.querySelector("div[role='listbox']"),
    document.querySelector("ul.location-results"),
  ].filter(Boolean);

  for (const container of dropdownContainers) {
    if (container instanceof HTMLElement) {
      console.log("Found dropdown container:", container);

      // Make sure it's visible (force it if necessary)
      container.style.display = "block";
      container.style.visibility = "visible";
      container.style.opacity = "1";

      // Find dropdown options
      const options = container.querySelectorAll(
        "li, div.dropdown-location, div[role='option'], a"
      );
      console.log(`Found ${options.length} dropdown options`);

      // Try to find the best matching option
      let bestOption: HTMLElement | null = null;
      let bestScore = 0;

      // Check each option for a match
      for (const option of options) {
        if (option instanceof HTMLElement) {
          const optionText = option.textContent?.trim().toLowerCase() || "";
          const locationLower = locationValue.toLowerCase();

          // Simple matching score - could be improved with fuzzy matching
          let score = 0;
          if (optionText === locationLower) score = 100;
          else if (optionText.includes(locationLower)) score = 80;
          else if (locationLower.includes(optionText)) score = 60;
          else {
            // Check for partial matches (e.g., "New York" should match "New York City")
            const optionWords = optionText.split(/\s+/);
            const locationWords = locationLower.split(/\s+/);

            for (const word of locationWords) {
              if (optionWords.includes(word)) score += 10;
            }
          }

          console.log(
            `Option "${optionText}" scored ${score} for match with "${locationLower}"`
          );

          if (score > bestScore) {
            bestScore = score;
            bestOption = option;
          }
        }
      }

      // Click the best option if found
      if (bestOption && bestScore > 0) {
        console.log(
          `Clicking best match option: "${bestOption.textContent}" with score ${bestScore}`
        );
        bestOption.click();
        await new Promise((resolve) => setTimeout(resolve, 300));
        return 1;
      } else if (options.length > 0) {
        // If no good match, click the first option
        const firstOption = options[0];
        if (firstOption instanceof HTMLElement) {
          console.log(
            "No ideal match found, clicking first option:",
            firstOption.textContent
          );
          firstOption.click();
          await new Promise((resolve) => setTimeout(resolve, 300));
          return 1;
        }
      }
    }
  }

  // APPROACH 3: Set the hidden input directly
  console.log("APPROACH 3: Direct manipulation of hidden input");
  if (hiddenInputEl instanceof HTMLInputElement) {
    console.log("Setting hidden input directly");
    // Create a JSON object for the selected location
    const locationData: LocationData = { name: locationValue };
    hiddenInputEl.value = JSON.stringify(locationData);

    // Dispatch events on both inputs
    ["input", "change"].forEach((eventType) => {
      hiddenInputEl.dispatchEvent(new Event(eventType, { bubbles: true }));
      locationInput.dispatchEvent(new Event(eventType, { bubbles: true }));
    });

    // Finalize by blurring the input
    locationInput.blur();
    return 1;
  }

  // APPROACH 4: Brute force approach
  console.log("APPROACH 4: Brute force approach as last resort");

  // Set the visible input
  locationInput.value = locationValue;
  locationInput.dispatchEvent(new Event("change", { bubbles: true }));
  locationInput.dispatchEvent(new Event("blur", { bubbles: true }));

  // Manually add a visual indicator of selection if possible
  const formField = locationInput.closest(".application-field");
  if (formField) {
    // Add an attribute or class that might indicate selection
    formField.setAttribute("data-filled", "true");
    console.log("Added 'data-filled' attribute to form field");
  }

  console.log("Location field handling completed with brute force approach");
  return 1;
};
