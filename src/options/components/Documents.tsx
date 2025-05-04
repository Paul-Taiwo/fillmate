import React, { ChangeEvent } from "react";
import { UserProfile } from "../../types";

interface DocumentsProps {
  profile: UserProfile;
  handleFileChange: (
    e: ChangeEvent<HTMLInputElement>,
    fileType: "resumeFile" | "coverLetterFile"
  ) => void;
}

const Documents: React.FC<DocumentsProps> = ({ profile, handleFileChange }) => {
  return (
    <div className='section-container'>
      <h2>Documents</h2>

      <div className='form-row'>
        <div className='form-group'>
          <label htmlFor='resumeFile'>Resume</label>
          <input
            id='resumeFile'
            type='file'
            accept='.pdf,.doc,.docx'
            onChange={(e) => handleFileChange(e, "resumeFile")}
          />
          {profile.resumeFile && <span>{profile.resumeFile.name}</span>}
        </div>

        <div className='form-group'>
          <label htmlFor='coverLetterFile'>Cover Letter</label>
          <input
            id='coverLetterFile'
            type='file'
            accept='.pdf,.doc,.docx'
            onChange={(e) => handleFileChange(e, "coverLetterFile")}
          />
          {profile.coverLetterFile && <span>{profile.coverLetterFile.name}</span>}
        </div>
      </div>
    </div>
  );
};

export default Documents;
