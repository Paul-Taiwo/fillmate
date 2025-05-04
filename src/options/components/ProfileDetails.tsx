import React from "react";
import { UserProfile } from "../../types";

interface ProfileDetailsProps {
  profile: UserProfile;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleSourceCheckboxChange: (source: string, isChecked: boolean) => void;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({
  profile,
  handleInputChange,
  handleSourceCheckboxChange,
}) => {
  // Parse the current sources to determine which checkboxes should be checked
  const currentSources = profile.howDidYouHear
    ? profile.howDidYouHear
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  // Helper function to check if a source is selected
  const isSourceSelected = (source: string) => currentSources.includes(source);

  // Handle checkbox change
  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    handleSourceCheckboxChange(value, checked);
  };

  return (
    <div className='section-container'>
      <h2>Details</h2>

      <div className='form-row'>
        <div className='form-group'>
          <label htmlFor='gender'>Gender</label>
          <select
            id='gender'
            name='gender'
            value={profile.gender}
            onChange={handleInputChange}>
            <option value=''>Select...</option>
            <option value='male'>Male</option>
            <option value='female'>Female</option>
            <option value='non-binary'>Non-binary</option>
            <option value='prefer-not-to-say'>Prefer not to say</option>
          </select>
        </div>
      </div>

      <div className='form-row'>
        <div className='form-group'>
          <div className='radio-group'>
            <label className='radio-group-label'>Visa Requirement</label>
            <div className='radio-options'>
              <label>
                <input
                  type='radio'
                  name='visaStatus'
                  value='does_not_require_sponsorship'
                  checked={profile.visaStatus === "does_not_require_sponsorship"}
                  onChange={handleInputChange}
                />
                No, I don't require sponsorship
              </label>
              <label>
                <input
                  type='radio'
                  name='visaStatus'
                  value='requires_sponsorship'
                  checked={profile.visaStatus === "requires_sponsorship"}
                  onChange={handleInputChange}
                />
                Yes, I require sponsorship
              </label>
              <label>
                <input
                  type='radio'
                  name='visaStatus'
                  value='unknown'
                  checked={profile.visaStatus === "unknown"}
                  onChange={handleInputChange}
                />
                Not specified
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className='form-row'>
        <div className='form-group'>
          <label htmlFor='noticePeriod'>Notice Period</label>
          <select
            id='noticePeriod'
            name='noticePeriod'
            value={profile.noticePeriod}
            onChange={handleInputChange}>
            <option value=''>Select...</option>
            <option value='Immediately available'>Immediately available</option>
            <option value='1 week'>1 week</option>
            <option value='2 weeks'>2 weeks</option>
            <option value='1 month'>1 month</option>
            <option value='2 months'>2 months</option>
            <option value='3 months or more'>3 months or more</option>
          </select>
        </div>
      </div>

      <div className='form-row'>
        <div className='form-group'>
          <div className='checkbox-group'>
            <label className='checkbox-group-label'>How Did You Hear About Us?</label>
            <div className='checkbox-options'>
              <label>
                <input
                  type='checkbox'
                  value='LinkedIn'
                  checked={isSourceSelected("LinkedIn")}
                  onChange={onCheckboxChange}
                />
                LinkedIn
              </label>
              <label>
                <input
                  type='checkbox'
                  value='Twitter'
                  checked={isSourceSelected("Twitter")}
                  onChange={onCheckboxChange}
                />
                Twitter
              </label>
              <label>
                <input
                  type='checkbox'
                  value='Job Board'
                  checked={isSourceSelected("Job Board")}
                  onChange={onCheckboxChange}
                />
                Job Board
              </label>
              <label>
                <input
                  type='checkbox'
                  value='Glassdoor'
                  checked={isSourceSelected("Glassdoor")}
                  onChange={onCheckboxChange}
                />
                Glassdoor
              </label>
              <label>
                <input
                  type='checkbox'
                  value='Family/Friends'
                  checked={isSourceSelected("Family/Friends")}
                  onChange={onCheckboxChange}
                />
                Family/Friends
              </label>
              <label>
                <input
                  type='checkbox'
                  value='News/Media'
                  checked={isSourceSelected("News/Media")}
                  onChange={onCheckboxChange}
                />
                News/Media
              </label>
              <label>
                <input
                  type='checkbox'
                  value='Event/Conference'
                  checked={isSourceSelected("Event/Conference")}
                  onChange={onCheckboxChange}
                />
                Event/Conference
              </label>
              <label>
                <input
                  type='checkbox'
                  value='Company Website'
                  checked={isSourceSelected("Company Website")}
                  onChange={onCheckboxChange}
                />
                Company Website
              </label>
              <label>
                <input
                  type='checkbox'
                  value='Other'
                  checked={isSourceSelected("Other")}
                  onChange={onCheckboxChange}
                />
                Other
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className='form-row'>
        <div className='form-group'>
          <label htmlFor='location'>Location</label>
          <input
            type='text'
            id='location'
            name='location'
            placeholder='e.g. London, UK'
            value={profile.location}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
