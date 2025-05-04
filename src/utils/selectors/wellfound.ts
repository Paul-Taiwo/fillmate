import { MappedFields } from "../mapping-types";

export const wellfoundSelectors: MappedFields = {
  // Formerly AngelList
  name: { selectors: [{ id: "user_name" }, { name: "user[name]" }], value: undefined },
  email: {
    selectors: [
      { id: "user_email" },
      { elementType: "input", name: /email/i, id: /email/i },
    ],
    value: undefined,
  },
  phone: {
    selectors: [
      { id: "user_phone" },
      { elementType: "input", name: /phone/i, id: /phone/i },
    ],
    value: undefined,
  },
  location: {
    selectors: [{ id: "user_location_tag_picker" }, { label: "Location" }],
    value: undefined,
  },
  linkedin: {
    selectors: [{ name: "linkedin_url" }, { placeholder: /linkedin/i }],
    value: undefined,
  },
  github: {
    selectors: [{ name: "github_url" }, { placeholder: /github/i }],
    value: undefined,
  },
  portfolio: {
    selectors: [
      { name: "website" },
      { name: "portfolio_url" },
      { placeholder: /portfolio|website/i },
    ],
    value: undefined,
  },
  visaStatus: { selectors: [{ label: /sponsor/i }], value: undefined },
  gender: { selectors: [{ label: /gender/i }], value: undefined },
};
