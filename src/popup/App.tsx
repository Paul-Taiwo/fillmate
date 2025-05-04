import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { UserProfile } from "../types";
import { getUserProfile, saveUserProfile } from "../storage/userProfile";
import "./App.css"; // Optional: Add styles later

const MAX_FILE_SIZE_MB = 4;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    github: "",
    linkedin: "",
    location: "",
    visaStatus: "",
    gender: "",
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

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    fileType: "resumeFile" | "coverLetterFile"
  ) => {
    e.preventDefault(); // Prevent default behavior

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

      console.log("File selected:", file);

      // Use a more reliable approach for file reading
      try {
        const reader = new FileReader();

        reader.onloadend = () => {
          if (reader.readyState === FileReader.DONE) {
            const result = reader.result as string;
            // Update profile only after successful read
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

        // Start reading the file
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

  // Open profile editor in a new window
  const openInNewWindow = () => {
    chrome.windows.create({
      url: chrome.runtime.getURL("src/popup/index.html"),
      type: "popup",
      width: 500,
      height: 700,
    });
    window.close(); // Close the popup
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='app-container'>
      <h1>Job Application Autofill</h1>
      <div className='actions-bar'>
        <button
          type='button'
          onClick={openInNewWindow}
          className='open-window-button'
          title='Open in new window for easier file uploads'>
          📋 Open in Window
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <h2>Personal Information</h2>
        <label>
          Name:{" "}
          <input
            type='text'
            name='name'
            value={profile.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Email:{" "}
          <input
            type='email'
            name='email'
            value={profile.email}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Phone:{" "}
          <input
            type='tel'
            name='phone'
            value={profile.phone}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Location:{" "}
          <input
            type='text'
            name='location'
            value={profile.location}
            onChange={handleInputChange}
          />
        </label>

        <h2>Professional Links</h2>
        <label>
          LinkedIn:{" "}
          <input
            type='url'
            name='linkedin'
            value={profile.linkedin}
            onChange={handleInputChange}
          />
        </label>
        <label>
          GitHub:{" "}
          <input
            type='url'
            name='github'
            value={profile.github}
            onChange={handleInputChange}
          />
        </label>

        <h2>Details</h2>
        <label>
          Gender:
          <select name='gender' value={profile.gender} onChange={handleInputChange}>
            <option value=''>Select...</option>
            <option value='male'>Male</option>
            <option value='female'>Female</option>
            <option value='non-binary'>Non-binary</option>
            <option value='prefer-not-to-say'>Prefer not to say</option>
          </select>
        </label>
        <label>
          Visa Requirement:
          <select
            name='visaStatus'
            value={profile.visaStatus}
            onChange={handleInputChange}>
            <option value=''>Select...</option>
            <option value='requires_sponsorship'>Requires Sponsorship</option>
            <option value='does_not_require_sponsorship'>
              Does Not Require Sponsorship
            </option>
            <option value='unknown'>Unknown</option>
          </select>
        </label>

        <h2>Documents</h2>
        <label>
          Resume:
          <input
            type='file'
            accept='.pdf,.doc,.docx'
            onChange={(e) => handleFileChange(e, "resumeFile")}
          />
          {profile.resumeFile && <span>{profile.resumeFile.name}</span>}
        </label>
        <label>
          Cover Letter:
          <input
            type='file'
            accept='.pdf,.doc,.docx'
            onChange={(e) => handleFileChange(e, "coverLetterFile")}
          />
          {profile.coverLetterFile && <span>{profile.coverLetterFile.name}</span>}
        </label>

        <h2>Custom Questions & Answers</h2>
        {profile.customQA.map((qa, index) => (
          <div key={index} className='custom-qa-item'>
            <textarea
              name={`customQA-${index}-question`}
              placeholder='Question'
              value={qa.question}
              onChange={(e) => handleCustomQAChange(index, "question", e.target.value)}
            />
            <textarea
              name={`customQA-${index}-answer`}
              placeholder='Answer'
              value={qa.answer}
              onChange={(e) => handleCustomQAChange(index, "answer", e.target.value)}
            />
            <button type='button' onClick={() => removeCustomQA(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type='button' onClick={addCustomQA}>
          Add Question
        </button>

        <button type='submit'>Save Profile</button>
        {statusMessage && <p className='status-message'>{statusMessage}</p>}
      </form>
    </div>
  );
};

export default App;
