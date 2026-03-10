import { useContext, useEffect, useState } from "react";
import { globalContext } from "../../../context/context";
import { useNavigate } from "react-router-dom";
import "./view-profile.css";

function ViewProfile() {
  const { setPageTitle, setBreadcrumbs, setButtonList, setSubPageTitle } = useContext(globalContext);


  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    companyName: "Company 1",
    companyLogo: "/avatar.svg",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "1234567890",
    addressLine1: "123 Main St , Apt 1",
    addressLine2: "New York, NY, 10001",
    city: "New York",
    state: "NY",
    zipCode: "10001",
  });


  const fetchProfileData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profile`);
      const data = await response.json();
      console.log("profile data fetched", data);
      if (data.status === 'success') {
        return data.data;
      } else {
        return {};
      }
    } catch (error) {
      console.log("error in fetching profile data", error);
      return {};
    }
  }

  useEffect(() => {
    setPageTitle("View Profile");
    setBreadcrumbs([
      { title: "View Profile", link: "/profile" },
    ]);
    setButtonList([
      {
        type: 'button',
        text: "Edit",
        onClick: () => { navigate('/profile/edit-profile') },
        backgroundColor: "#00A1F9",
        textColor: "white",
        borderColor: "#00A1F9",
      },
    ]);

    const fetchingData = async () => {
      setLoading(true);
      // const data = await fetchProfileData();
      // setProfileData(data);
      setLoading(false);
    }
    fetchingData();
  }, []);

  return (
    <div className="view-profile-container">
      <div className="view-profile-company-logo">
        <img src={profileData?.companyLogo} alt="" />
      </div>
      <div className="view-profile-company-details">
        <h1 className="view-profile-company-name">{profileData?.companyName}</h1>
        
        <h3 className="view-profile-owner-details-title">Owner Details</h3>
        <div className="view-profile-divider"></div>

        <div className="view-profile-owner-details">
          <p>Name: <span>{profileData?.firstName} {profileData?.lastName}</span></p>
          <p>Email: <span>{profileData?.email}</span></p>
          <p>Phone: <span>{profileData?.phone}</span></p>
          <p>Address: <span>{profileData?.addressLine1} {profileData?.addressLine2} {profileData?.city} {profileData?.state} {profileData?.zipCode}</span></p>
        </div>
      </div>
    </div>
  );
}

export default ViewProfile;