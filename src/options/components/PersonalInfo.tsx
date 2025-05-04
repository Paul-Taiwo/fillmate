import React, { ChangeEvent } from "react";
import { UserProfile } from "../../types";

interface PersonalInfoProps {
  profile: UserProfile;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ profile, handleInputChange }) => {
  return (
    <div className='section-container'>
      <h2>Personal Information</h2>

      <div className='form-row'>
        <div className='form-group'>
          <label htmlFor='name'>Name</label>
          <input
            id='name'
            type='text'
            name='name'
            value={profile.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor='email'>Email</label>
          <input
            id='email'
            type='email'
            name='email'
            value={profile.email}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className='form-row'>
        <div className='form-group'>
          <label htmlFor='phone'>Phone</label>
          <input
            id='phone'
            type='tel'
            name='phone'
            value={profile.phone}
            onChange={handleInputChange}
          />
        </div>

        <div className='form-group'>
          <label htmlFor='location'>Location</label>
          <input
            id='location'
            type='text'
            name='location'
            value={profile.location}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
