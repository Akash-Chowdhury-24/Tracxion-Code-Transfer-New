import { useContext, useEffect, useState } from 'react';
import './edit-company.css';
import { globalContext } from '../../../context/context';
import { useNavigate, useParams } from 'react-router-dom';
import CommonFileUpload from '../../../Component/common-file-upload';
import CommonInput from '../../../Component/common-input';
import CommonLoader from '../../../Component/common-loader';
import CommonAlert from '../../../Component/common-alert';

function EditCompany() {

  const { setBreadcrumbs, setPageTitle, setButtonList, setSubPageTitle } = useContext(globalContext);
  const navigate = useNavigate();
  const params = useParams();
  const companyId = params.id;
  const [loading, setLoading] = useState(false);
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

  const fetchCompany = async (companyId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/opronsinglerecord`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          module_name: "company",
          record_name: companyId,
          operation_type: "V",
          user: "admin"
        })
      });
      const data = await response.json();
      console.log("company fetched", data);
      if (data.status === 200) {
        return data.details[0];
      } else {
        return {};
      }
    } catch (error) {
      console.log("error in fetchCompany", error);
      return {};
    }
  }

  useEffect(() => {
    setBreadcrumbs([
      { title: 'Companies', link: '/companies' },
      { title: 'Edit Company', link: `/companies/edit-company/${companyId}` },
    ]);
    setPageTitle(`${companyDetailsFormData.companyName}`);
    setSubPageTitle({});
    const fetchData = async () => {
      setLoading(true);
      const companyData = await fetchCompany(companyId);
      if (companyData) {
        setCompanyDetailsFormData({
          companyName: companyData?.company_name || '',
          companyLogo: companyData?.logo || '',
          firstName: companyData?.company_owner_first_name || '',
          lastName: companyData?.company_owner_last_name || '',
          email: companyData?.company_email || '',
          phone: companyData?.company_contact_number || '',
          addressLine1: companyData?.company_address || '',
          addressLine2: companyData?.company_address_line_2 || '',
          city: companyData?.company_city_nm || '',
          state: companyData?.company_st_nm || '',
          zipCode: companyData?.company_zp_cd || '',
        });
      }
      setLoading(false);
    }
    fetchData();
  }, [companyId]);

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
        text: submitting ? 'Editing...' : 'Edit',
        onClick: handleEditCompany,
        backgroundColor: '#00A1F9',
        textColor: 'white',
        borderColor: '#00A1F9',
        disabled: submitting
      },
    ]);
  }, [submitting, companyDetailsFormData]);

  const handleCompanyDetailsFormDataChange = (e) => {
    const { name, value } = e.target;
    setCompanyDetailsFormData({ ...companyDetailsFormData, [name]: value });
    setCompanyDetailsErrors({ ...companyDetailsErrors, [name]: value.trim() === '' });
  };

  const handleEditCompany = async () => {
    console.log("companyDetailsFormData", companyDetailsFormData);
    const errors = [];
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
      setAlertMsg(errors);
      setTimeout(() => {
        setAlertMsg([]);
      }, 3000);
      return;
    }
    try {
      const dataToSend = new FormData();

      if (companyDetailsFormData.companyLogo instanceof File) {
        dataToSend.append('file', companyDetailsFormData.companyLogo);
      }
      dataToSend.append('data', JSON.stringify({
        company_id:companyId,
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
      for (const [key, value] of dataToSend.entries()) {
        console.log(key, value);
      }
      setSubmitting(true);
      const [response, response2] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/uploadcompany`, {
          method: 'POST',
          body: dataToSend,
        }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/opronsinglerecord`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            module_name: 'company',
            record_name: companyId,
            operation_type: 'E',
            user: 'admin',
          }),
        }),
      ]);
      const data = await response.json();
      console.log("company edited", data);
      if ((data.status === 200 || data.message === `Hello ${companyDetailsFormData.companyName} Your POST request worked`) && (response2.status === 200)) {
        navigate('/companies');
        return;
      }
      setAlertMsg(data.message);
      setTimeout(() => {
        setAlertMsg([]);
      }, 3000);
      return;
    } catch (error) {
      console.log("error in edit company", error);
      setAlertMsg(error.message);
      setTimeout(() => {
        setAlertMsg([]);
      }, 3000);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <CommonLoader text="Loading Company Details..." />
  }

  return (
    <div>
      {alertMsg.length > 0 && <CommonAlert msg={alertMsg} />}
      <div className='edit-company-title-container'>
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

      <div className='edit-company-title-container'>
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

      <div className='edit-company-title-container'>
        <h2>Owner Details</h2>
      </div>
      <div className='edit-company-input-container1'>
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
          className="edit-company-input-extra-css"
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
          className="edit-company-input-extra-css"
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
          className="edit-company-input-extra-css"
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
          className="edit-company-input-extra-css"
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
          className="edit-company-input-extra-css"
        />
        <CommonInput
          label='Address Line 2'
          name='addressLine2'
          type='text'
          value={companyDetailsFormData.addressLine2}
          onChange={handleCompanyDetailsFormDataChange}
          placeholder='Enter Address Line 2'
          half={true}
          className="edit-company-input-extra-css"
        />
      </div>
      <div className='edit-company-input-container2'>
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
          className="edit-company-input-extra-css2"
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
          className="edit-company-input-extra-css2"
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
          className="edit-company-input-extra-css2"
        />
      </div>
    </div>
  );
}

export default EditCompany;