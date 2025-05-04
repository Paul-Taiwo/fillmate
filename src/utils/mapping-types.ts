import { UserProfile } from "../types";

// Defines how to find a field
export type FieldSelector = {
  label?: string | RegExp | (string | RegExp)[];
  placeholder?: string | RegExp;
  name?: string | RegExp;
  id?: string | RegExp;
  selector?: string; // Direct CSS selector
  elementType?: "input" | "textarea" | "select";
};

// Represents the mapping for a single profile field, including selectors and value
export interface FieldMapping {
  selectors: FieldSelector[];
  value: string | number | undefined;
}

// The complete structure mapping profile keys to their FieldMapping
// Use Partial because not all profile fields might have a mapping defined
export type MappedFields = Partial<{
  [key in keyof Omit<
    UserProfile,
    "resumeFile" | "coverLetterFile" | "customQA"
  >]: FieldMapping;
}>;
