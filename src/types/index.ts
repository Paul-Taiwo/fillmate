export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  location: string;
  visaStatus: string;
  gender: string;
  noticePeriod: string;
  howDidYouHear: string;
  resumeFile?: { name: string; dataUrl: string }; // Store file info and content
  coverLetterFile?: { name: string; dataUrl: string }; // Store file info and content
  customQA: { question: string; answer: string }[];
}
