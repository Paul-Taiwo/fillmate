import React, { ChangeEvent } from "react";
import { UserProfile } from "../../types";

interface ProfessionalLinksProps {
  profile: UserProfile;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
}

const ProfessionalLinks: React.FC<ProfessionalLinksProps> = ({
  profile,
  handleInputChange,
}) => {
  return (
    <div className='section-container'>
      <h2>Professional Links</h2>

      <div className='form-row'>
        <div className='form-group'>
          <label htmlFor='linkedin'>LinkedIn</label>
          <input
            id='linkedin'
            type='url'
            name='linkedin'
            value={profile.linkedin}
            onChange={handleInputChange}
          />
        </div>

        <div className='form-group'>
          <label htmlFor='github'>GitHub</label>
          <input
            id='github'
            type='url'
            name='github'
            value={profile.github}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfessionalLinks;
