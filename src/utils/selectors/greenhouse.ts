import { MappedFields } from "../mapping-types";

export const greenhouseSelectors: MappedFields = {
  name: {
    selectors: [{ label: "Full Name" }, { id: "first_name" }, { id: "last_name" }],
    value: undefined,
  },
  email: {
    selectors: [
      { id: "email" },
      { label: "Email" },
      { name: "job_application[email]" },
      { elementType: "input", id: /email/i },
      { elementType: "input", name: /email/i },
    ],
    value: undefined,
  },
  phone: {
    selectors: [
      { id: "phone" },
      { label: "Phone" },
      { name: "job_application[phone]" },
      { elementType: "input", name: /phone/i, id: /phone/i },
    ],
    value: undefined,
  },
  location: {
    selectors: [{ id: "job_application_location" }, { label: "Location" }],
    value: undefined,
  },
  linkedin: {
    selectors: [{ label: /LinkedIn Profile/i }, { name: /linkedin/i }],
    value: undefined,
  },
  github: {
    selectors: [{ label: /GitHub URL/i }, { name: /github/i }],
    value: undefined,
  },
  portfolio: {
    selectors: [
      { label: /Portfolio|Personal Website|Website URL/i },
      { name: /portfolio|website/i },
      { placeholder: /portfolio|website/i },
    ],
    value: undefined,
  },
  visaStatus: { selectors: [{ label: /require sponsorship|visa/i }], value: undefined },
  gender: { selectors: [{ label: /gender/i }], value: undefined },
};
