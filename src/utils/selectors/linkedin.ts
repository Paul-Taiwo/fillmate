import { MappedFields } from "../mapping-types";

export const linkedInSelectors: MappedFields = {
  name: {
    selectors: [
      { selector: "[data-test-form-element] input[id*=personName]" },
      { label: /Name/i },
    ],
    value: undefined,
  },
  email: {
    selectors: [
      { selector: "[data-test-form-element] input[id*=emailAddress]" },
      { elementType: "input", name: /email/i, id: /email/i },
    ],
    value: undefined,
  },
  phone: {
    selectors: [
      { selector: "[data-test-form-element] input[id*=phoneNumber]" },
      { elementType: "input", name: /phone/i, id: /phone/i },
    ],
    value: undefined,
  },
  location: {
    selectors: [
      { selector: "[data-test-form-element] input[id*=physicalLocation]" },
      { label: /City/i },
    ],
    value: undefined,
  },
  linkedin: { selectors: [{ label: /LinkedIn Profile/i }], value: undefined },
  github: { selectors: [{ label: /Website|GitHub/i }], value: undefined },
  portfolio: {
    selectors: [
      { label: /Website|Portfolio/i },
      { selector: "[data-test-form-element] input[id*=website]" },
    ],
    value: undefined,
  },
  visaStatus: {
    selectors: [{ label: /authorized to work|sponsorship/i }],
    value: undefined,
  },
  gender: { selectors: [{ label: /gender/i }], value: undefined },
};
