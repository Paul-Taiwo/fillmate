import { MappedFields } from "../mapping-types";

// Generic selectors (fallback)
export const genericSelectors: MappedFields = {
  name: {
    selectors: [
      { label: /name/i },
      { name: /name/i },
      { id: /name/i },
      { placeholder: /name/i },
    ],
    value: undefined,
  },
  email: {
    selectors: [
      { label: /email/i },
      { name: /email/i },
      { id: /email/i },
      { elementType: "input", name: /email/i, id: /email/i },
      { placeholder: /email/i },
    ],
    value: undefined,
  },
  phone: {
    selectors: [
      { label: /phone/i },
      { name: /phone/i },
      { id: /phone/i },
      { elementType: "input", name: /phone/i, id: /phone/i },
      { placeholder: /phone/i },
    ],
    value: undefined,
  },
  linkedin: {
    selectors: [
      { label: /linkedin/i },
      { name: /linkedin/i },
      { id: /linkedin/i },
      { placeholder: /linkedin/i },
    ],
    value: undefined,
  },
  github: {
    selectors: [
      { label: /github|git/i },
      { name: /github|git/i },
      { id: /github|git/i },
      { placeholder: /github|git/i },
    ],
    value: undefined,
  },
  location: {
    selectors: [
      { label: /location|city|address/i },
      { name: /location|city|address/i },
      { id: /location|city|address/i },
      { placeholder: /location|city|address/i },
    ],
    value: undefined,
  },
  visaStatus: {
    selectors: [
      { label: /visa|sponsor|authorization|authorised/i },
      { name: /visa|sponsor|authorization|authorised/i },
      { id: /visa|sponsor|authorization|authorised/i },
    ],
    value: undefined,
  },
  gender: {
    selectors: [{ label: /gender|sex/i }, { name: /gender|sex/i }, { id: /gender|sex/i }],
    value: undefined,
  },
};
