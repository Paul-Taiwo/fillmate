import { UserProfile } from "../types";
import { MappedFields } from "./mapping-types";
import { greenhouseSelectors } from "./selectors/greenhouse";
import { leverSelectors } from "./selectors/lever";
import { ashbyHqSelectors } from "./selectors/ashbyhq";
import { wellfoundSelectors } from "./selectors/wellfound";
import { linkedInSelectors } from "./selectors/linkedin";
import { genericSelectors } from "./selectors/generic";

/**
 * Creates a mapping from the UserProfile to specific field selectors
 * based on the current page's hostname.
 */
export const mapProfileToFields = (
  profile: UserProfile,
  hostname: string
): MappedFields => {
  let siteSpecificSelectors: MappedFields = {};

  // Determine site-specific selectors based on hostname
  if (hostname.includes("greenhouse.io") || hostname.includes("boards.greenhouse.io")) {
    siteSpecificSelectors = greenhouseSelectors;
  } else if (hostname.includes("lever.co") || hostname.includes("jobs.lever.co")) {
    siteSpecificSelectors = leverSelectors;
  } else if (hostname.includes("ashbyhq.com")) {
    siteSpecificSelectors = ashbyHqSelectors;
  } else if (hostname.includes("wellfound.com")) {
    siteSpecificSelectors = wellfoundSelectors;
  } else if (hostname.includes("linkedin.com")) {
    siteSpecificSelectors = linkedInSelectors;
  }

  // Start with an empty object for the final result
  const combinedSelectors: MappedFields = {};

  // Iterate through all potential profile keys (derived from genericSelectors keys)
  const allPossibleKeys = Object.keys(genericSelectors) as Array<
    keyof typeof genericSelectors
  >;

  for (const key of allPossibleKeys) {
    // Use a type guard to ensure the key is valid for UserProfile
    if (key in profile) {
      // Check if the profile actually has data for this key
      const profileKey = key as keyof Omit<
        UserProfile,
        "resumeFile" | "coverLetterFile" | "customQA"
      >;
      const profileValue = profile[profileKey];

      // Check if profileValue is not undefined or null before proceeding
      if (profileValue !== undefined && profileValue !== null) {
        const siteMapping = siteSpecificSelectors[key];
        const genericMapping = genericSelectors[key];

        if (siteMapping) {
          // Prefer site-specific selectors
          combinedSelectors[key] = {
            selectors: siteMapping.selectors,
            value: profileValue as string | number, // Assert type after check
          };
        } else if (genericMapping) {
          // Fallback to generic selectors
          combinedSelectors[key] = {
            selectors: genericMapping.selectors,
            value: profileValue as string | number, // Assert type after check
          };
        }
      }
    }
  }

  // Special handling for name splitting (consider moving to executeAutofill)
  if (hostname.includes("greenhouse.io") && profile.name) {
    const nameParts = profile.name.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");
    console.log("Greenhouse detected: First Name:", firstName, "Last Name:", lastName);
    // Ensure the original 'name' mapping still exists if needed
    if (!combinedSelectors.name && genericSelectors.name) {
      combinedSelectors.name = { ...genericSelectors.name, value: profile.name };
    } else if (combinedSelectors.name) {
      combinedSelectors.name.value = profile.name; // Ensure value is set
    }
    // Potential future enhancement: add separate firstName/lastName mappings
    // combinedSelectors.firstName = { selectors: [{ id: 'first_name' }], value: firstName };
    // combinedSelectors.lastName = { selectors: [{ id: 'last_name' }], value: lastName };
  }

  console.log("Final Mapped Fields:", combinedSelectors);
  return combinedSelectors;
};
