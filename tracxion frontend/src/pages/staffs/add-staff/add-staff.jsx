import { useCallback, useContext, useEffect, useState } from "react";
import { globalContext } from "../../../context/context";
import { useNavigate } from "react-router-dom";
import './add-staff.css';
import CommonInput from "../../../Component/common-input";
import CommonSelect from "../../../Component/common-select";
import CommonFileUpload from "../../../Component/common-file-upload";
import CommonLoader from "../../../Component/common-loader";
import CommonAlert from "../../../Component/common-alert";



function AddStaff() {
  const { setBreadcrumbs, setPageTitle, setButtonList, setSubPageTitle } = useContext(globalContext);
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [alertMsg, setAlertMsg] = useState([]);
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

  const handleStaffFormDataChange = (e) => {
    const { name, value } = e.target;
    setStaffFormData({ ...staffFormData, [name]: value });
    if (name === 'role' || name === 'department') {
      setStaffFormErrors({ ...staffFormErrors, [name]: value === null });
    } else {
      setStaffFormErrors({ ...staffFormErrors, [name]: value.trim() === '' });
    }
  }

  const handleAddStaff = async () => {
    console.log('Add Staff');
    console.log("staffFormData", staffFormData);
    const errors = [];
    if (!staffFormData.firstName) {
      errors.push('First Name is required');
    }
    if (!staffFormData.lastName) {
      errors.push('Last Name is required');
    }
    if (!staffFormData.email) {
      errors.push('Email is required');
    }
    if (!staffFormData.phone) {
      errors.push('Phone is required');
    }
    // if (!staffFormData.role) {
    //   errors.push('Role is required');
    // }
    // if (!staffFormData.department) {
    //   errors.push('Department is required');
    // }
    if (!staffFormData.staffImage) {
      errors.push('Staff Image is required');
    }
    if (errors.length > 0) {
      setAlertMsg(errors);
      setTimeout(() => {
        setAlertMsg([]);
      }, 3000);
      return;
    }
    try {
      const dataToSend = new FormData();
      
      if (staffFormData.staffImage instanceof File) {
        dataToSend.append('file', staffFormData.staffImage);
      }
      dataToSend.append('data', JSON.stringify({
        first_name: staffFormData.firstName,
        last_name: staffFormData.lastName,
        email: staffFormData.email,
        phone: staffFormData.phone,
        role: staffFormData.role,
        department: staffFormData.department,
      }));
      for (const [key, value] of dataToSend.entries()) {
        console.log(key, value);
      }
      setSubmitting(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/uploadstaff`, {
        method: 'POST',
        body: dataToSend,
      });
      const data = await response.json();
      console.log("staff added", data);
      if (data.status === 200 || data.message === `Hello ${staffFormData.firstName} Your POST request worked`) {
        navigate('/staffs');
        return;
      }
      setAlertMsg(data.message);
      setTimeout(() => {
        setAlertMsg([]);
      }, 3000);
      return;
    } catch (error) {
      console.log("error in add staff", error);
      setAlertMsg(error.message);
      setTimeout(() => {
        setAlertMsg([]);
      }, 3000);
    } finally {
      setSubmitting(false);
    }
  }
  useEffect(() => {
    setBreadcrumbs([
      { title: 'Staffs', link: '/staffs' },
      { title: 'Add Staff', link: '/staffs/add-staff' },
    ]);
    setPageTitle('Add Staff');
    setSubPageTitle({});
    const fetchData = async () => {
      // setLoading(true);
      // const [staffRoles, staffDepartments] = await Promise.all([fetchStaffRoles(), fetchStaffDepartments()]);
      // console.log("staff roles fetched", staffRoles);
      // console.log("staff departments fetched", staffDepartments);
      // setLoading(false);
    }
    fetchData();
  }, [navigate]);

  useEffect(() => {
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
        text: submitting ? 'Adding...' : 'Add',
        onClick: handleAddStaff,
        backgroundColor: '#00A1F9',
        textColor: 'white',
        borderColor: '#00A1F9',
        disabled: submitting
      },
    ]);
  }, [submitting, staffFormData]);


  if (loading) {
    return <CommonLoader text="Loading..." />;
  }

  return (
    <div>
      {alertMsg.length > 0 && <CommonAlert msg={alertMsg} />}
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