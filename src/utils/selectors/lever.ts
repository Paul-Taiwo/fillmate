import { MappedFields } from "../mapping-types";

export const leverSelectors: MappedFields = {
  name: { selectors: [{ name: "name" }, { label: "Full Name" }], value: undefined },
  email: {
    selectors: [
      { name: "email" },
      { elementType: "input", name: /email/i, id: /email/i },
      { label: "Email" },
    ],
    value: undefined,
  },
  phone: {
    selectors: [
      { name: "phone" },
      { elementType: "input", name: /phone/i, id: /phone/i },
      { label: "Phone" },
    ],
    value: undefined,
  },
  location: {
    selectors: [{ name: "location" }, { label: "Location" }],
    value: undefined,
  },
  linkedin: {
    selectors: [{ name: "urls[LinkedIn]" }, { label: /LinkedIn/i }],
    value: undefined,
  },
  github: {
    selectors: [{ name: "urls[GitHub]" }, { label: /GitHub/i }],
    value: undefined,
  },
  portfolio: {
    selectors: [
      { name: "urls[Portfolio]" },
      { name: "urls[Website]" },
      { label: /Portfolio|Personal Website|Website/i },
    ],
    value: undefined,
  },
  visaStatus: {
    selectors: [{ name: /sponsor/i }, { label: /sponsor/i }],
    value: undefined,
  },
  gender: { selectors: [{ name: /gender/i }, { label: /gender/i }], value: undefined },
};
