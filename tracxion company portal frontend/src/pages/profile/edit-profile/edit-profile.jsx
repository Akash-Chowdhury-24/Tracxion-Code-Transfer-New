import { useContext, useEffect, useState } from "react";
import { globalContext } from "../../../context/context";
import { useNavigate } from "react-router-dom";
import './edit-profile.css';
import CommonLoader from "../../../Component/common-loader";
import CommonInput from "../../../Component/common-input";
import CommonFileUpload from "../../../Component/common-file-upload";

function EditProfile() {
  const { setBreadcrumbs, setPageTitle, setButtonList, setSubPageTitle } = useContext(globalContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    companyName: 'TechCorp Solutions',
    companyLogo: '/avatar.svg',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@techcorp.com',
    phone: '1234567890',
    addressLine1: '123 Main St',
    addressLine2: 'Apt 1',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
  });
  const [profileDataErrors, setProfileDataErrors] = useState({
    companyName: false,
    companyLogo: false,
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    addressLine1: false,
    addressLine2: false,
    city: false,
    state: false,
    zipCode: false,
  });

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
        method: 'GET',
      });
      const data = await response.json();
      console.log("profile data", data);
      if (data.statusCode === 200) {
        return data.data;
      } else {
        return {};
      }
    }
    catch (error) {
      console.log("error in fetching profile data", error);
      return {};
    }
  }

  useEffect(() => {
    setPageTitle('Edit Profile');
    setBreadcrumbs([
      { title: 'Profile', link: '/profile' },
      { title: 'Edit Profile', link: '/profile/edit-profile' },
    ]);
    setButtonList([
      {
        type: 'button',
        text: 'Cancel',
        onClick: () => { navigate('/profile') },
        backgroundColor: 'transparent',
        textColor: '#2C2D33',
        borderColor: 'transparent'
      },
      {
        type: 'button',
        text: 'Update',
        onClick: () => { console.log('Update') },
        backgroundColor: '#00A1F9',
        textColor: 'white',
        borderColor: '#00A1F9'
      },
    ]);

    const fetchingData = async () => {
      setLoading(true);
      // const profileData = await fetchProfileData();
      // setProfileData(profileData);
      setLoading(false);
    }
    fetchingData();
  }, []);

  const handleProfileDataChange = (e) => {
    const { name, value } = e.target;
  }

  if (loading) {
    return <CommonLoader text="Loading Profile Data..." />;
  }

  return (
    <div>
      <div className='edit-profile-title-container'>
        <h2>Company Details</h2>
      </div>
      <CommonInput
        label="Company Name"
        name="companyName"
        type="text"
        value={profileData.companyName}
        onChange={handleProfileDataChange}
        required
        placeholder="Enter Company Name"
        error={profileDataErrors.companyName}
        errorMsg="Company Name is required"
      />

      <div className='edit-profile-title-container'>
        <h2>Company Logo</h2>
      </div>
      <CommonFileUpload
        onFilesChange={(files) => {
          console.log(files);
          setProfileData({
            ...profileData,
            companyLogo: files
          })
        }}
        multiple={false}
        maxFiles={1}
        acceptedTypes="image"
        maxFileSize={200 * 1024}
        placeholder='Max 200KB file are allowed | Dimension 200*200'
        browseText='Browse File'
        // supportText='Only support .png and .jpg files'
        value={profileData.companyLogo}
      />

      <div className='edit-profile-title-container'>
        <h2>Owner Details</h2>
      </div>
      <div className='edit-profile-input-container1'>
        <CommonInput
          label='First Name'
          name='firstName'
          type='text'
          value={profileData.firstName}
          onChange={handleProfileDataChange}
          error={profileDataErrors.firstName}
          placeholder='Enter First Name'
          required={true}
          errorMsg='First Name is required'
          half={true}
          className="edit-profile-input-extra-css"
        />
        <CommonInput
          label='Last Name'
          name='lastName'
          type='text'
          value={profileData.lastName}
          onChange={handleProfileDataChange}
          error={profileDataErrors.lastName}
          placeholder='Enter Last Name'
          required={true}
          errorMsg='Last Name is required'
          half={true}
          className="edit-profile-input-extra-css"
        />
        <CommonInput
          label='Email'
          name='email'
          type='email'
          value={profileData.email}
          onChange={handleProfileDataChange}
          error={profileDataErrors.email}
          placeholder='Enter Email'
          required={true}
          errorMsg='Email is required'
          half={true}
          className="edit-profile-input-extra-css"
        />
        <CommonInput
          label='Phone'
          name='phone'
          type='phone'
          value={profileData.phone}
          onChange={handleProfileDataChange}
          error={profileDataErrors.phone}
          placeholder='Enter Phone'
          required={true}
          errorMsg='Phone is required'
          half={true}
          className="edit-profile-input-extra-css"
        />
        <CommonInput
          label='Address Line 1'
          name='addressLine1'
          type='text'
          value={profileData.addressLine1}
          onChange={handleProfileDataChange}
          error={profileDataErrors.addressLine1}
          placeholder='Enter Address Line 1'
          required={true}
          errorMsg='Address Line 1 is required'
          half={true}
          className="edit-profile-input-extra-css"
        />
        <CommonInput
          label='Address Line 2'
          name='addressLine2'
          type='text'
          value={profileData.addressLine2}
          onChange={handleProfileDataChange}
          placeholder='Enter Address Line 2'
          half={true}
          className="edit-profile-input-extra-css"
        />
      </div>
      <div className='edit-profile-input-container2'>
        <CommonInput
          label='City'
          name='city'
          type='text'
          value={profileData.city}
          onChange={handleProfileDataChange}
          error={profileDataErrors.city}
          placeholder='Enter City'
          required={true}
          errorMsg='City is required'
          half={true}
          className="edit-profile-input-extra-css2"
        />
        <CommonInput
          label='State'
          name='state'
          type='text'
          value={profileData.state}
          onChange={handleProfileDataChange}
          error={profileDataErrors.state}
          placeholder='Enter State'
          required={true}
          errorMsg='State is required'
          half={true}
          className="edit-profile-input-extra-css2"
        />
        <CommonInput
          label='Zip Code'
          name='zipCode'
          type='text'
          value={profileData.zipCode}
          onChange={handleProfileDataChange}
          error={profileDataErrors.zipCode}
          placeholder='Enter Zip Code'
          required={true}
          errorMsg='Zip Code is required'
          half={true}
          className="edit-profile-input-extra-css2"
        />
      </div>
    </div>
  );
}

export default EditProfile;