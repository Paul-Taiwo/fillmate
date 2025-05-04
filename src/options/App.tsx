import React from "react";
import {
  PersonalInfo,
  ProfessionalLinks,
  ProfileDetails,
  Documents,
  // CustomQA,
} from "./components";
import { useProfileForm } from "./hooks/useProfileForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const App: React.FC = () => {
  const {
    profile,
    isLoading,
    handleInputChange,
    handleSourceCheckboxChange,
    handleFileChange,
    // handleCustomQAChange,
    // addCustomQA,
    // removeCustomQA,
    handleSubmit,
  } = useProfileForm();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='app-container'>
      <h1>Job Application Profile Settings</h1>
      <form onSubmit={handleSubmit}>
        <PersonalInfo profile={profile} handleInputChange={handleInputChange} />
        <ProfessionalLinks profile={profile} handleInputChange={handleInputChange} />
        <ProfileDetails
          profile={profile}
          handleInputChange={handleInputChange}
          handleSourceCheckboxChange={handleSourceCheckboxChange}
        />
        <Documents profile={profile} handleFileChange={handleFileChange} />
        {/* <CustomQA
          profile={profile}
          handleCustomQAChange={handleCustomQAChange}
          addCustomQA={addCustomQA}
          removeCustomQA={removeCustomQA}
        /> */}
        <button type='submit'>Save Profile</button>
      </form>

      {/* Add ToastContainer at the bottom of your app */}
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default App;
