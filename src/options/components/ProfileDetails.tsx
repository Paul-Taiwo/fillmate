import React, { ChangeEvent } from "react";
import { UserProfile } from "../../types";

interface ProfileDetailsProps {
  profile: UserProfile;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleSourceCheckboxChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({
  profile,
  handleInputChange,
  handleSourceCheckboxChange,
}) => {
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

        <div className='form-group'>
          <div className='radio-group'>
            <label className='radio-group-label'>Notice Period</label>
            <div className='radio-options'>
              <label>
                <input
                  type='radio'
                  name='noticePeriod'
                  value='Immediately available'
                  checked={profile.noticePeriod === "Immediately available"}
                  onChange={handleInputChange}
                />
                Immediately available
              </label>
              <label>
                <input
                  type='radio'
                  name='noticePeriod'
                  value='1 month'
                  checked={profile.noticePeriod === "1 month"}
                  onChange={handleInputChange}
                />
                1 month
              </label>
              <label>
                <input
                  type='radio'
                  name='noticePeriod'
                  value='2 months'
                  checked={profile.noticePeriod === "2 months"}
                  onChange={handleInputChange}
                />
                2 months
              </label>
              <label>
                <input
                  type='radio'
                  name='noticePeriod'
                  value='3 months or more'
                  checked={profile.noticePeriod === "3 months or more"}
                  onChange={handleInputChange}
                />
                3 months or more
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className='checkbox-group'>
        <label className='checkbox-group-label'>How Did You Hear About Us?</label>
        <div className='checkbox-options'>
          {[
            "LinkedIn",
            "Twitter",
            "Job Board",
            "Glassdoor",
            "Family / Friends",
            "News / Media",
            "Event / Conference",
            "Company Website",
            "Other",
          ].map((source) => (
            <label key={source}>
              <input
                type='checkbox'
                name={source}
                checked={profile.howDidYouHear
                  .split(",")
                  .map((s) => s.trim())
                  .includes(source)}
                onChange={handleSourceCheckboxChange}
              />
              {source}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
