import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { UserProfile } from "../../types";
import { getUserProfile, saveUserProfile } from "../../storage/userProfile";

const MAX_FILE_SIZE_MB = 4;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const useProfileForm = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    github: "",
    linkedin: "",
    portfolio: "",
    location: "",
    visaStatus: "",
    gender: "",
    noticePeriod: "",
    howDidYouHear: "",
    customQA: [{ question: "", answer: "" }],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string>("");

  useEffect(() => {
    // Load existing profile on component mount
    getUserProfile()
      .then((loadedProfile) => {
        if (loadedProfile) {
          setProfile(loadedProfile);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading profile:", err);
        setStatusMessage("Error loading profile.");
        setIsLoading(false);
      });
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSourceCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setProfile((prev) => {
      const currentSources = prev.howDidYouHear
        ? prev.howDidYouHear
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      let newSources;
      if (checked) {
        if (!currentSources.includes(name)) {
          newSources = [...currentSources, name];
        } else {
          newSources = currentSources;
        }
      } else {
        newSources = currentSources.filter((source) => source !== name);
      }

      const newSourcesString = newSources.join(",");
      return { ...prev, howDidYouHear: newSourcesString };
    });
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    fileType: "resumeFile" | "coverLetterFile"
  ) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    const inputElement = e.target;

    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setStatusMessage(
          `Error: File "${file.name}" is too large (Max ${MAX_FILE_SIZE_MB}MB).`
        );
        inputElement.value = "";
        setProfile((prev) => ({ ...prev, [fileType]: undefined }));
        setTimeout(() => setStatusMessage(""), 5000);
        return;
      }

      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.readyState === FileReader.DONE) {
            const result = reader.result as string;
            setProfile((prev) => ({
              ...prev,
              [fileType]: { name: file.name, dataUrl: result },
            }));
            setStatusMessage(`File "${file.name}" ready.`);
            setTimeout(() => setStatusMessage(""), 3000);
          }
        };

        reader.onerror = () => {
          console.error("FileReader error:", reader.error);
          setStatusMessage(`Error reading file "${file.name}".`);
          inputElement.value = "";
          setProfile((prev) => ({ ...prev, [fileType]: undefined }));
          setTimeout(() => setStatusMessage(""), 5000);
        };

        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error handling file:", error);
        setStatusMessage(`Error processing file "${file.name}".`);
        inputElement.value = "";
        setProfile((prev) => ({ ...prev, [fileType]: undefined }));
        setTimeout(() => setStatusMessage(""), 5000);
      }
    } else {
      setProfile((prev) => ({ ...prev, [fileType]: undefined }));
    }
  };

  const handleCustomQAChange = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    const newCustomQA = [...profile.customQA];
    newCustomQA[index] = { ...newCustomQA[index], [field]: value };
    setProfile((prev) => ({ ...prev, customQA: newCustomQA }));
  };

  const addCustomQA = () => {
    setProfile((prev) => ({
      ...prev,
      customQA: [...prev.customQA, { question: "", answer: "" }],
    }));
  };

  const removeCustomQA = (index: number) => {
    const newCustomQA = profile.customQA.filter((_, i) => i !== index);
    setProfile((prev) => ({ ...prev, customQA: newCustomQA }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatusMessage("Saving...");
    try {
      await saveUserProfile(profile);
      setStatusMessage("Profile saved successfully!");
    } catch (error: unknown) {
      console.error("Failed to save profile:", error);
      if (
        error instanceof Error &&
        error.message &&
        error.message.includes("QUOTA_BYTES")
      ) {
        setStatusMessage(
          "Error: Could not save profile. Storage quota exceeded. Try removing large files."
        );
      } else {
        setStatusMessage("Error saving profile. See console for details.");
      }
    }
    setTimeout(() => setStatusMessage(""), 5000);
  };

  return {
    profile,
    isLoading,
    statusMessage,
    handleInputChange,
    handleSourceCheckboxChange,
    handleFileChange,
    handleCustomQAChange,
    addCustomQA,
    removeCustomQA,
    handleSubmit,
  };
};
