import { UserProfile } from "../../types";
import { handleAshbyHqFileUploads, handleAshbyHqCustomFields } from "../handlers/ashbyhq";
import { handleGreenhouseCustomFields } from "../handlers/greenhouse";
import { handleLeverCustomFields } from "../handlers/lever";

// Define types for site handlers
export type SiteHandler = (profile: UserProfile) => Promise<number>;

export interface SiteHandlerConfig {
  patterns: string[];
  handler: SiteHandler;
  name: string;
}

/**
 * Registry of all site-specific handlers
 * To add a new job site handler, simply add a new entry to this array
 */
export const siteHandlers: SiteHandlerConfig[] = [
  {
    name: "AshbyHQ",
    patterns: ["ashbyhq.com"],
    handler: async (profile) => {
      // Handle custom field filling first
      const fieldsHandled = await handleAshbyHqCustomFields(profile);
      // Then handle file uploads
      const fileFieldsHandled = await handleAshbyHqFileUploads(profile);
      return fieldsHandled + fileFieldsHandled;
    },
  },
  {
    name: "Greenhouse",
    patterns: ["greenhouse.io", "boards.greenhouse.io"],
    handler: handleGreenhouseCustomFields,
  },
  {
    name: "Lever",
    patterns: ["lever.co", "jobs.lever.co"],
    handler: handleLeverCustomFields,
  },
];

/**
 * Finds the appropriate handler for the current site based on hostname
 * @param hostname The current site's hostname
 * @returns The matched site handler config or undefined if no match
 */
export const findSiteHandler = (hostname: string): SiteHandlerConfig | undefined => {
  return siteHandlers.find((site) =>
    site.patterns.some((pattern) => hostname.includes(pattern))
  );
};
