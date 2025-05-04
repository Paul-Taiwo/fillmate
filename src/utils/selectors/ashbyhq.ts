import { MappedFields } from "../mapping-types";

export const ashbyHqSelectors: MappedFields = {
  name: { selectors: [{ name: "name" }, { label: "Name" }], value: undefined },
  email: {
    selectors: [
      { name: "email" },
      { elementType: "input", name: /email/i, id: /email/i },
    ],
    value: undefined,
  },
  phone: {
    selectors: [
      { name: "phone" },
      { elementType: "input", name: /phone/i, id: /phone/i },
    ],
    value: undefined,
  },
  location: {
    selectors: [{ name: "locationString" }, { label: "Location" }],
    value: undefined,
  },
  linkedin: {
    selectors: [{ name: "candidateProfileLinks.linkedInUrl" }, { label: /LinkedIn/i }],
    value: undefined,
  },
  github: {
    selectors: [{ name: "candidateProfileLinks.gitHubUrl" }, { label: /GitHub/i }],
    value: undefined,
  },
  visaStatus: {
    selectors: [{ label: /Work authorization|Sponsorship/i }],
    value: undefined,
  },
  gender: { selectors: [{ label: /Gender/i }], value: undefined },
};
