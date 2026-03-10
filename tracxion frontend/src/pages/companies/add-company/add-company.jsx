import { useContext, useEffect, useState } from 'react';
import './add-company.css';
import { globalContext } from '../../../context/context';
import { useNavigate } from 'react-router-dom';
import CommonFileUpload from '../../../Component/common-file-upload';
import CommonInput from '../../../Component/common-input';
import CommonAlert from '../../../Component/common-alert';

function AddCompany() {

  const { setBreadcrumbs, setPageTitle, setButtonList, setSubPageTitle } = useContext(globalContext);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [alertMsg, setAlertMsg] = useState([]);

  const [companyDetailsFormData, setCompanyDetailsFormData] = useState({
    companyName: '',
    companyLogo: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [companyDetailsErrors, setCompanyDetailsErrors] = useState({
    companyName: false,
    companyLogo: false,
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    addressLine1: false,
    city: false,
    state: false,
    zipCode: false,
  });



  const handleAddCompany = async () => {
    console.log('Add Company');
    const errors = [];
    console.log("companyDetailsFormData", companyDetailsFormData);
    if (!companyDetailsFormData.companyName) {
      errors.push('Company Name is required');
    }
    if (!companyDetailsFormData.firstName) {
      errors.push('Company Owner First Name is required');
    }
    if (!companyDetailsFormData.lastName) {
      errors.push('Company Owner Last Name is required');
    }
    if (!companyDetailsFormData.email) {
      errors.push('Company Email is required');
    }
    if (!companyDetailsFormData.phone) {
      errors.push('Company Contact Number is required');
    }
    if (!companyDetailsFormData.addressLine1) {
      errors.push('Company Address is required');
    }
    if (!companyDetailsFormData.city) {
      errors.push('City is required');
    }
    if (!companyDetailsFormData.state) {
      errors.push('State is required');
    }
    if (!companyDetailsFormData.zipCode) {
      errors.push('Zip Code is required');
    }
    if (!companyDetailsFormData.companyLogo) {
      errors.push('Company Logo is required');
    }
    if (errors.length > 0) {
      console.log(errors);
      setAlertMsg(errors);
      setTimeout(() => {
        setAlertMsg([]);
      }, 3000);
    } else {
      try {
        const dataToSend = new FormData();

        if (companyDetailsFormData.companyLogo) {
          dataToSend.append('file', companyDetailsFormData.companyLogo);
        }
        dataToSend.append('data', JSON.stringify({
          company_name: companyDetailsFormData.companyName,
          company_owner_first_name: companyDetailsFormData.firstName,
          company_owner_last_name: companyDetailsFormData.lastName,
          company_email: companyDetailsFormData.email,
          company_contact_number: companyDetailsFormData.phone,
          company_address: companyDetailsFormData.addressLine1,
          company_address_line_2: companyDetailsFormData.addressLine2,
          company_city_nm: companyDetailsFormData.city,
          company_st_nm: companyDetailsFormData.state,
          company_zp_cd: companyDetailsFormData.zipCode,
        }));

        setSubmitting(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/uploadcompany`, {
          method: 'POST',
          body: dataToSend,
        });
        const data = await response.json();
        console.log("company added", data);
        if (data.status === 200 || data.message === `Hello ${companyDetailsFormData.companyName} Your POST request worked`) {
          navigate('/companies');
          return;
        }
        setAlertMsg(data.message);
        setTimeout(() => {
          setAlertMsg([]);
        }, 3000);

      } catch (error) {
        console.log("error in add company", error);
        setAlertMsg(error.message);
        setTimeout(() => {
          setAlertMsg([]);
        }, 3000);
      } finally {
        setSubmitting(false);
      }
    }
  };
  const handleCompanyDetailsFormDataChange = (e) => {
    const { name, value } = e.target;
    setCompanyDetailsFormData({ ...companyDetailsFormData, [name]: value });
    setCompanyDetailsErrors({ ...companyDetailsErrors, [name]: value.trim() === '' });
  };

  useEffect(() => {
    setBreadcrumbs([
      { title: 'Companies', link: '/companies' },
      { title: 'Add Company', link: '/companies/add-company' },
    ]);
    setPageTitle('Add Company');
    setSubPageTitle({});
  }, []);

  useEffect(() => {
    setButtonList([
      {
        type: 'button',
        text: 'Cancel',
        onClick: () => { navigate('/companies') },
        backgroundColor: 'transparent',
        textColor: '#2C2D33',
        borderColor: 'transparent'
      },
      {
        type: 'button',
        text: submitting ? 'Adding...' : 'Add',
        onClick: handleAddCompany,
        backgroundColor: '#00A1F9',
        textColor: 'white',
        borderColor: '#00A1F9',
        disabled: submitting
      },
    ]);
  }, [submitting, companyDetailsFormData]);

  return (
    <div>
      {alertMsg.length > 0 && <CommonAlert msg={alertMsg} />}
      <div className='add-company-title-container'>
        <h2>Company Details</h2>
      </div>
      <CommonInput
        label='Company Name'
        name='companyName'
        type='text'
        value={companyDetailsFormData.companyName}
        onChange={handleCompanyDetailsFormDataChange}
        error={companyDetailsErrors.companyName}
        placeholder='Enter Company Name'
        required={true}
        errorMsg='Company Name is required'
      />

      <div className='add-company-title-container'>
        <h2>Company Logo</h2>
      </div>
      <CommonFileUpload
        onFilesChange={(files) => {
          console.log(files);
          setCompanyDetailsFormData({
            ...companyDetailsFormData,
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
        value={companyDetailsFormData.companyLogo}
      />

      <div className='add-company-title-container'>
        <h2>Owner Details</h2>
      </div>
      <div className='add-company-input-container1'>
        <CommonInput
          label='First Name'
          name='firstName'
          type='text'
          value={companyDetailsFormData.firstName}
          onChange={handleCompanyDetailsFormDataChange}
          error={companyDetailsErrors.firstName}
          placeholder='Enter First Name'
          required={true}
          errorMsg='First Name is required'
          half={true}
          className="add-company-input-extra-css"
        />
        <CommonInput
          label='Last Name'
          name='lastName'
          type='text'
          value={companyDetailsFormData.lastName}
          onChange={handleCompanyDetailsFormDataChange}
          error={companyDetailsErrors.lastName}
          placeholder='Enter Last Name'
          required={true}
          errorMsg='Last Name is required'
          half={true}
          className="add-company-input-extra-css"
        />
        <CommonInput
          label='Email'
          name='email'
          type='email'
          value={companyDetailsFormData.email}
          onChange={handleCompanyDetailsFormDataChange}
          error={companyDetailsErrors.email}
          placeholder='Enter Email'
          required={true}
          errorMsg='Email is required'
          half={true}
          className="add-company-input-extra-css"
        />
        <CommonInput
          label='Phone'
          name='phone'
          type='phone'
          value={companyDetailsFormData.phone}
          onChange={handleCompanyDetailsFormDataChange}
          error={companyDetailsErrors.phone}
          placeholder='Enter Phone'
          required={true}
          errorMsg='Phone is required'
          half={true}
          className="add-company-input-extra-css"
        />
        <CommonInput
          label='Address Line 1'
          name='addressLine1'
          type='text'
          value={companyDetailsFormData.addressLine1}
          onChange={handleCompanyDetailsFormDataChange}
          error={companyDetailsErrors.addressLine1}
          placeholder='Enter Address Line 1'
          required={true}
          errorMsg='Address Line 1 is required'
          half={true}
          className="add-company-input-extra-css"
        />
        <CommonInput
          label='Address Line 2'
          name='addressLine2'
          type='text'
          value={companyDetailsFormData.addressLine2}
          onChange={handleCompanyDetailsFormDataChange}
          placeholder='Enter Address Line 2'
          half={true}
          className="add-company-input-extra-css"
        />
      </div>
      <div className='add-company-input-container2'>
        <CommonInput
          label='City'
          name='city'
          type='text'
          value={companyDetailsFormData.city}
          onChange={handleCompanyDetailsFormDataChange}
          error={companyDetailsErrors.city}
          placeholder='Enter City'
          required={true}
          errorMsg='City is required'
          half={true}
          className="add-company-input-extra-css2"
        />
        <CommonInput
          label='State'
          name='state'
          type='text'
          value={companyDetailsFormData.state}
          onChange={handleCompanyDetailsFormDataChange}
          error={companyDetailsErrors.state}
          placeholder='Enter State'
          required={true}
          errorMsg='State is required'
          half={true}
          className="add-company-input-extra-css2"
        />
        <CommonInput
          label='Zip Code'
          name='zipCode'
          type='text'
          value={companyDetailsFormData.zipCode}
          onChange={handleCompanyDetailsFormDataChange}
          error={companyDetailsErrors.zipCode}
          placeholder='Enter Zip Code'
          required={true}
          errorMsg='Zip Code is required'
          half={true}
          className="add-company-input-extra-css2"
        />
      </div>
    </div>
  );
}

export default AddCompany;