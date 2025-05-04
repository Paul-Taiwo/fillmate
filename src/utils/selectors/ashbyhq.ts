import { MappedFields } from "../mapping-types";

export const ashbyHqSelectors: MappedFields = {
  name: {
    selectors: [
      { name: "name" },
      { label: "Full Name" },
      { label: "Name" },
      { id: "_systemfield_name" },
    ],
    value: undefined,
  },
  email: {
    selectors: [
      { name: "email" },
      { elementType: "input", name: /email/i, id: /email/i },
      { label: "Email" },
      { id: "_systemfield_email" },
    ],
    value: undefined,
  },
  phone: {
    selectors: [
      { name: "phone" },
      { elementType: "input", name: /phone/i, id: /phone/i },
      { label: "Phone" },
      { label: "Phone Number" },
      { placeholder: "Phone" },
      { id: "_systemfield_phone" },
      { selector: 'div._fieldEntry_hkyf8_29 input[type="tel"]' },
      { selector: 'div[class*="fieldEntry"] input[type="tel"]' },
      { selector: 'label[for*="phone"] ~ div input' },
    ],
    value: undefined,
  },
  location: {
    selectors: [
      { name: "locationString" },
      { label: "Location" },
      { label: "Current Location" },
      { placeholder: "Current Location" },
      { id: "_systemfield_location" },
      { selector: 'div._fieldEntry_hkyf8_29 input[placeholder*="location" i]' },
      { selector: 'label[for*="location"] ~ div input' },
      { selector: 'div[class*="fieldEntry"] input[name*="location" i]' },
    ],
    value: undefined,
  },
  linkedin: {
    selectors: [
      { name: "candidateProfileLinks.linkedInUrl" },
      { label: /LinkedIn/i },
      { placeholder: "LinkedIn URL" },
      { selector: 'input[placeholder*="LinkedIn" i]' },
      { selector: 'label[for*="linkedin" i] ~ div input' },
    ],
    value: undefined,
  },
  github: {
    selectors: [
      { name: "candidateProfileLinks.gitHubUrl" },
      { label: /GitHub/i },
      { placeholder: "GitHub URL" },
      { selector: 'input[placeholder*="GitHub" i]' },
      { selector: 'label[for*="github" i] ~ div input' },
    ],
    value: undefined,
  },
  visaStatus: {
    selectors: [
      { label: /Work authorization|Sponsorship/i },
      { label: /require work visa/i },
      { label: /legally authorized/i },
      { selector: 'div._fieldEntry_hkyf8_29 select[id*="visa" i]' },
      { selector: 'div._fieldEntry_hkyf8_29 select[id*="sponsor" i]' },
      { selector: 'div._fieldEntry_hkyf8_29 select[id*="authorization" i]' },
      { selector: 'label[for*="visa" i] ~ div select' },
      { selector: 'label[for*="sponsor" i] ~ div select' },
      { selector: 'label[for*="authorization" i] ~ div select' },
      { selector: 'div[class*="dropdownContainer"] div[role="button"]' },
    ],
    value: undefined,
  },
  gender: {
    selectors: [
      { label: /Gender/i },
      { name: /gender/i },
      { selector: 'div._fieldEntry_hkyf8_29 select[id*="gender" i]' },
      { selector: 'label[for*="gender" i] ~ div select' },
      { selector: 'div[class*="fieldEntry"] select[id*="gender" i]' },
      { selector: 'div[class*="dropdownContainer"] div[role="button"]' },
    ],
    value: undefined,
  },
  noticePeriod: {
    selectors: [
      { label: /Notice Period|Current Notice|Notice/i },
      { name: /noticePeriod|notice/i },
      { placeholder: /Notice Period|How much notice/i },
      { selector: 'div._fieldEntry_hkyf8_29 input[placeholder*="notice" i]' },
      { selector: 'label[for*="notice" i] ~ div input' },
      { selector: 'div[class*="fieldEntry"] input[name*="notice" i]' },
    ],
    value: undefined,
  },
  howDidYouHear: {
    selectors: [
      { label: /How did you hear|Source|Referral|How did you find/i },
      { name: /howDidYouHear|source|referral/i },
      { placeholder: /How did you hear|Source|Referral/i },
      { selector: 'div._fieldEntry_hkyf8_29 select[id*="source" i]' },
      { selector: 'div._fieldEntry_hkyf8_29 select[id*="referral" i]' },
      { selector: 'label[for*="source" i] ~ div select' },
      { selector: 'label[for*="referral" i] ~ div select' },
      { selector: 'div[class*="fieldEntry"] select[id*="source" i]' },
      { selector: 'div[class*="dropdownContainer"] div[role="button"]' },
    ],
    value: undefined,
  },
};
