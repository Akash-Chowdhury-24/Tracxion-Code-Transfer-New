import { useContext, useEffect, useState } from "react";
import { globalContext } from "../../../context/context";
import { useNavigate } from "react-router-dom";
import './add-staff.css';
import CommonInput from "../../../Component/common-input";
import CommonSelect from "../../../Component/common-select";
import CommonFileUpload from "../../../Component/common-file-upload";
import CommonLoader from "../../../Component/common-loader";



function AddStaff() {
  const { setBreadcrumbs, setPageTitle, setButtonList, setSubPageTitle } = useContext(globalContext);
  const navigate = useNavigate();

  const [staffFormData, setStaffFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    staffImage: '',
  });

  const [loading, setLoading] = useState(false);
  const [staffFormErrors, setStaffFormErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
  });

  const [staffRoles, setStaffRoles] = useState([
    {
      label: 'Admin',
      value: 1,
    },
    {
      label: 'User',
      value: 2,
    },
    {
      label: 'Manager',
      value: 3,
    },
    {
      label: 'Staff',
      value: 4,
    },
  ]);
  const [staffDepartments, setStaffDepartments] = useState([
    {
      label: 'IT',
      value: 1,
    },
    {
      label: 'HR',
      value: 2,
    },
    {
      label: 'Marketing',
      value: 3,
    },
    {
      label: 'Sales',
      value: 4,
    },
    {
      label: 'Finance',
      value: 5,
    },
    {
      label: 'Legal',
      value: 6,
    },
  ]);

  const fetchStaffRoles = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/staff-roles`);
      const data = await response.json();
      console.log("staff roles fetched", data);
      if (data.status === 'success') {
        return data.data;
      } else {
        return [];
      }
    } catch (error) {
      console.log("error fetching staff roles", error);
      return [];
    }
  }
  const fetchStaffDepartments = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/staff-departments`);
    const data = await response.json();
    console.log("staff departments fetched", data);
    if (data.status === 'success') {
      return data.data;
    } else {
      return [];
    }
  }

  useEffect(() => {
    setBreadcrumbs([
      { title: 'Staffs', link: '/staffs' },
      { title: 'Add Staff', link: '/staffs/add-staff' },
    ]);
    setPageTitle('Add Staff');
    setButtonList([
      {
        type: 'button',
        text: 'Cancel',
        onClick: () => { navigate('/staffs') },
        backgroundColor: 'transparent',
        textColor: '#2C2D33',
        borderColor: 'transparent'
      },
      {
        type: 'button',
        text: 'Add',
        onClick: () => { console.log('Add') },
        backgroundColor: '#00A1F9',
        textColor: 'white',
        borderColor: '#00A1F9'
      },
    ]);
    setSubPageTitle({});
    const fetchData = async () => {
      // setLoading(true);
      // const [staffRoles, staffDepartments] = await Promise.all([fetchStaffRoles(), fetchStaffDepartments()]);
      // console.log("staff roles fetched", staffRoles);
      // console.log("staff departments fetched", staffDepartments);
      // setLoading(false);
    }
    fetchData();
  }, []);

  const handleStaffFormDataChange = (e) => {
    const { name, value } = e.target;
    setStaffFormData({ ...staffFormData, [name]: value });
    setStaffFormErrors({ ...staffFormErrors, [name]: value.trim() === '' });
  }

  if (loading) {
    return <CommonLoader text="Loading..." />;
  }

  return (
    <div>
      <div className="add-staff-input-container">
        <CommonInput
          label="First Name"
          type="text"
          name="firstName"
          value={staffFormData.firstName}
          onChange={handleStaffFormDataChange}
          required
          placeholder="Enter First Name"
          error={staffFormErrors.firstName}
          errorMsg="First Name is required"
          half
          className="add-staff-input-extra-css"
        />
        <CommonInput
          label="Last Name"
          type="text"
          name="lastName"
          value={staffFormData.lastName}
          onChange={handleStaffFormDataChange}
          required
          placeholder="Enter Last Name"
          error={staffFormErrors.lastName}
          errorMsg="Last Name is required"
          half
          className="add-staff-input-extra-css"
        />
        <CommonInput
          label="Email"
          type="email"
          name="email"
          value={staffFormData.email}
          onChange={handleStaffFormDataChange}
          required
          placeholder="Enter Email"
          error={staffFormErrors.email}
          errorMsg="Email is required"
          half
          className="add-staff-input-extra-css"
        />
        <CommonInput
          label="Phone"
          type="phone"
          name="phone"
          value={staffFormData.phone}
          onChange={handleStaffFormDataChange}
          required
          placeholder="Enter Phone"
          error={staffFormErrors.phone}
          errorMsg="Phone is required"
          half
          className="add-staff-input-extra-css"
        />
        <CommonSelect
          label="Role"
          name="role"
          value={staffFormData.role}
          onChange={handleStaffFormDataChange}
          // required
          placeholder="Select Role"
          // error={staffFormErrors.role}
          // errorMsg="Role is required"
          half
          className="add-staff-input-extra-css"
          options={staffRoles}
        />
        <CommonSelect
          label="Department"
          name="department"
          value={staffFormData.department}
          onChange={handleStaffFormDataChange}
          placeholder="Select Department"
          half
          // required
          // error={staffFormErrors.department}
          // errorMsg="Department is required"
          className="add-staff-input-extra-css"
          options={staffDepartments}
        />
      </div>

      <CommonFileUpload
        onFilesChange={(files) => {
          console.log(files);
          setStaffFormData({
            ...staffFormData,
            staffImage: files
          })
        }}
        multiple={false}
        maxFiles={1}
        acceptedTypes="image"
        maxFileSize={200 * 1024}
        placeholder='Max 200KB file are allowed | Dimension 200*200'
        browseText='Browse File'
        // supportText='Only support .png and .jpg files'
        value={staffFormData.staffImage}
      />

    </div>
  );
}

export default AddStaff;