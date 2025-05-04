import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { UserProfile } from "../../types";
import { getUserProfile, saveUserProfile } from "../../storage/userProfile";
import { toast } from "react-toastify";

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
        const errorMsg = "Error loading profile.";
        toast.error(errorMsg);
        setIsLoading(false);
      });
  }, []);

  // Helper function to show toast and set status message
  const showToast = (message: string, isError = false) => {
    if (isError) {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSourceCheckboxChange = (source: string, isChecked: boolean) => {
    setProfile((prev) => {
      // Current sources as comma-separated string
      const currentSources = prev.howDidYouHear || "";

      // Convert to array, filter empty strings
      let sourcesArray = currentSources
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (isChecked && !sourcesArray.includes(source)) {
        // Add source if checked and not already in list
        sourcesArray.push(source);
      } else if (!isChecked) {
        // Remove source if unchecked
        sourcesArray = sourcesArray.filter((s) => s !== source);
      }

      // Join back to comma-separated string
      return { ...prev, howDidYouHear: sourcesArray.join(", ") };
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
        const errorMsg = `Error: File "${file.name}" is too large (Max ${MAX_FILE_SIZE_MB}MB).`;
        showToast(errorMsg, true);
        inputElement.value = "";
        setProfile((prev) => ({ ...prev, [fileType]: undefined }));
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
            showToast(`File "${file.name}" ready.`);
          }
        };

        reader.onerror = () => {
          console.error("FileReader error:", reader.error);
          const errorMsg = `Error reading file "${file.name}".`;
          showToast(errorMsg, true);
          inputElement.value = "";
          setProfile((prev) => ({ ...prev, [fileType]: undefined }));
        };

        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error handling file:", error);
        const errorMsg = `Error processing file "${file.name}".`;
        showToast(errorMsg, true);
        inputElement.value = "";
        setProfile((prev) => ({ ...prev, [fileType]: undefined }));
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

    try {
      await saveUserProfile(profile);
      showToast("Profile saved successfully!");
    } catch (error: unknown) {
      console.error("Failed to save profile:", error);
      if (
        error instanceof Error &&
        error.message &&
        error.message.includes("QUOTA_BYTES")
      ) {
        showToast(
          "Error: Could not save profile. Storage quota exceeded. Try removing large files.",
          true
        );
      } else {
        showToast("Error saving profile. See console for details.", true);
      }
    }
  };

  return {
    profile,
    isLoading,
    handleInputChange,
    handleSourceCheckboxChange,
    handleFileChange,
    handleCustomQAChange,
    addCustomQA,
    removeCustomQA,
    handleSubmit,
  };
};
