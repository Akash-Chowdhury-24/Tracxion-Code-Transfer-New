import { useContext, useEffect, useState } from "react";
import { globalContext } from "../../../context/context";
import "./edit-invoice.css";
import { useNavigate, useParams } from "react-router-dom";
import CommonSelect from "../../../Component/common-select";
import CommonInput from "../../../Component/common-input";
import { Alert, FormControlLabel, Radio } from "@mui/material";
import CommonToggleSwitch from "../../../Component/common-toggle-switch";
import CommonLoader from "../../../Component/common-loader";

function EditInvoice() {

  const { setPageTitle, setButtonList, setBreadcrumbs, setSubPageTitle } = useContext(globalContext);
  const navigate = useNavigate();
  const params = useParams();
  const invoiceId = params.id;

  const [loading, setLoading] = useState(false);

  const [companyData, setCompanyData] = useState([
    {
      id: 1,
      logo: '/avatar-2.svg',
      companyName: 'TechCorp Solutions',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@techcorp.com',
      phone: '1234567890',
      addressLine1: '123 Main St',
      addressLine2: 'Apt 1',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
    },
    {
      id: 2,
      logo: '/avatar-2.svg',
      companyName: 'Global Industries',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@global.com',
      phone: '0987654321',
      addressLine1: '123 Main St',
      addressLine2: 'Apt 1',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
    },
    {
      id: 3,
      logo: '/avatar-2.svg',
      companyName: 'Innovation Labs',
      firstName: 'Jim',
      lastName: 'Wilson',
      email: 'jim.wilson@innovation.com',
      phone: '5555555555',
      addressLine1: '123 Main St',
      addressLine2: 'Apt 1',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
    },
    {
      id: 4,
      logo: '/avatar-2.svg',
      companyName: 'Digital Marketing Pro',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@digitalmarketing.com',
      phone: '1111111111',
      addressLine1: '123 Main St',
      addressLine2: 'Apt 1',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
    },
    {
      id: 5,
      logo: '/avatar-2.svg',
      companyName: 'Cloud Services Inc',
      firstName: 'Mike',
      lastName: 'Brown',
      email: 'mike.brown@cloudservices.com',
      phone: '2222222222',
      addressLine1: '123 Main St',
      addressLine2: 'Apt 1',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
    }
  ]);
  const [companyOptions, setCompanyOptions] = useState([]);

  const [usageOptions, setUsageOptions] = useState([
    {
      label: 'Voice',
      value: 'Voice'
    },
    {
      label: 'Chat',
      value: 'Chat'
    },
    {
      label: 'Voice and Chat',
      value: 'Voice and Chat'
    }
  ]);

  const [rates, setRates] = useState({
    voiceBillingType: 'Per Minute',
    voiceBillingRate: 10,
    chatBillingType: 'Per Character',
    chatBillingRate: 10,
  });


  const [invoiceData, setInvoiceData] = useState({
    companyId: 2,
    startDate: '2025-01-01',
    endDate: '2025-01-01',
    usage: 'Voice',
    applyDiscount: true,
    discountType: 'Percentage',
    discountValue: '10',
  });


  // Calculated amounts state
  const [calculatedAmounts, setCalculatedAmounts] = useState({
    voiceAmount: 0,
    chatAmount: 0,
    totalAmount: 0,
    discountAmount: 0,
    finalAmount: 0,
  });


  const [selectedCompany, setSelectedCompany] = useState('');
  const [invoiceDetails, setInvoiceDetails] = useState({
    startDate: '',
    endDate: '',
    usage: '',
  });
  const [invoiceDetailsError, setInvoiceDetailsError] = useState({
    startDate: false,
    endDate: false,
  });

  const [discountDetails, setDiscountDetails] = useState({
    apply: false,
    discountType: '',
    discountValue: '',
  });
  const [discountDetailsError, setDiscountDetailsError] = useState({
    discountType: false,
    discountValue: false,
  });


  const [alertMsg, setAlertMsg] = useState([]);

  const fetchCompanyData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/companies`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('tracxion admin token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      const data = await response.json();
      console.log("company data", data);
      if (data.status === 'success') {
        return data.data;
      } else {
        return [];
      }
    } catch (error) {
      console.log("error fetching company data", error);
      return [];
    }
  }
  const fetchRates = async () => {
    try {
      const response = await fetch('');
      const data = await response.json();
      console.log("rates fetched", data);
      if (data.statusCode === 200) {
        return data.data;
      } else {
        return {};
      }
    } catch (error) {
      console.log("error in fetching rates", error);
      return {};
    }
  }

  const fetchInvoiceData = async (invoiceId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/invoices/${invoiceId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('tracxion admin token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      console.log("invoice data", data);
      if (data.statusCode === 200) {
        return data.data;
      } else {
        return {};
      }
    } catch (error) {
      console.log("error in fetching invoice data", error);
      return {};
    }
  }

  useEffect(() => {
    setPageTitle(`Edit Invoice: #${invoiceId}`);
    setButtonList([
      {
        type: 'button',
        text: 'Cancel',
        onClick: () => { navigate('/billings') },
        backgroundColor: 'transparent',
        textColor: '#2C2D33',
        borderColor: 'transparent'
      },
      {
        type: 'button',
        text: 'Update',
        onClick: handleUpdateInvoice,
        backgroundColor: '#00A1F9',
        textColor: 'white',
        borderColor: '#00A1F9'
      },
    ]);
    setBreadcrumbs([
      { title: 'All Bills', link: '/billings' },
      { title: `Edit Invoice: #${invoiceId}`, link: `/billings/edit-invoice/${invoiceId}` },
    ]);
    setSubPageTitle({});
    const fetchingData = async () => {
      setLoading(true);
      const companyData = await fetchCompanyData();
      const rates = await fetchRates();
      const invoiceData = await fetchInvoiceData(invoiceId);
      // setCompanyData(companyData);
      // setRates(rates);
      setLoading(false);
    }
    fetchingData();
  }, []);

  useEffect(() => {
    const options = companyData.map(company => ({
      label: company.companyName,
      value: company.id
    }));
    setCompanyOptions(options);
  }, [companyData]);

  useEffect(() => {
    setSelectedCompany(invoiceData.companyId);
    setInvoiceDetails({
      startDate: invoiceData.startDate,
      endDate: invoiceData.endDate,
      usage: invoiceData.usage,
    });
    setDiscountDetails({
      apply: invoiceData.applyDiscount,
      discountType: invoiceData.discountType,
      discountValue: invoiceData.discountValue,
    });
  }, [invoiceData]);

  const CustomRadio = (props) => {
    return (
      <Radio
        disableRipple
        color="default"
        checkedIcon={
          <span
            style={{
              width: 19,
              height: 19,
              border: '6px solid #00A1F9',
              borderRadius: '50%',
              backgroundColor: 'white',
              backgroundClip: 'content-box',
              padding: 0
            }}
          />
        }
        icon={
          <span
            style={{
              width: 25,
              height: 25,
              border: '1.5px solid #00A1F9',
              borderRadius: '50%',
              padding: 0,
              backgroundColor: 'transparent'
            }}
          />
        }
        {...props}
      />
    );
  };


  const getSelectedCompanyDetails = (id) => {
    const company = companyData.find(company => company.id === id);
    return company;
  }

  // Calculate amounts based on usage type and rates
  const calculateAmounts = () => {
    let voiceAmount = 0;
    let chatAmount = 0;
    let totalAmount = 0;

    // Calculate voice amount - use the voice billing rate directly
    if (invoiceDetails.usage === 'Voice' || invoiceDetails.usage === 'Voice and Chat') {
      voiceAmount = rates.voiceBillingRate;
    }

    // Calculate chat amount - use the chat billing rate directly
    if (invoiceDetails.usage === 'Chat' || invoiceDetails.usage === 'Voice and Chat') {
      chatAmount = rates.chatBillingRate;
    }

    totalAmount = voiceAmount + chatAmount;

    // Calculate discount
    let discountAmount = 0;
    if (discountDetails.apply && discountDetails.discountValue) {
      if (discountDetails.discountType === 'Percentage') {
        discountAmount = (totalAmount * parseFloat(discountDetails.discountValue)) / 100;
      } else if (discountDetails.discountType === 'Fixed') {
        discountAmount = parseFloat(discountDetails.discountValue);
      }
    }

    const finalAmount = totalAmount - discountAmount;

    setCalculatedAmounts({
      voiceAmount,
      chatAmount,
      totalAmount,
      discountAmount,
      finalAmount,
    });
  };

  // Update calculations whenever relevant data changes
  useEffect(() => {
    if (invoiceDetails.usage) {
      calculateAmounts();
    }
  }, [invoiceDetails.usage, rates, discountDetails]);

  // Handle edit invoice
  const handleUpdateInvoice = async () => {
    const errors = [];

    if (selectedCompany === '') {
      errors.push('Company is required');
    }
    if (invoiceDetails.startDate === '') {
      errors.push('Start Date is required');
    }
    if (invoiceDetails.endDate === '') {
      errors.push('End Date is required');
    }
    if (invoiceDetails.usage === '') {
      errors.push('Usage is required');
    }
    if (discountDetails.apply && discountDetails.discountType === '') {
      errors.push('Discount Type is required');
    }
    if (discountDetails.apply && discountDetails.discountValue === '') {
      errors.push('Discount Value is required');
    }

    if (errors.length > 0) {
      setAlertMsg(errors);
      setTimeout(() => {
        setAlertMsg([]);
      }, 3000);
    } else {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/invoices/${invoiceId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('tracxion admin token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            id: invoiceId,
            companyId: selectedCompany,
            startDate: invoiceDetails.startDate,
            endDate: invoiceDetails.endDate,
            usage: invoiceDetails.usage,
            discountApply: discountDetails.apply,
            discountType: discountDetails.discountType,
            discountValue: discountDetails.discountValue,
          }),
        });
        const data = await response.json();
        console.log("invoice updated", data);
        if (data.statusCode === 200) {
          navigate('/billings');
        }
        setAlertMsg(data.message);
      } catch (error) {
        console.log("error in updating invoice", error);
      }
    }
  };

  if (loading) {
    return <CommonLoader text="Loading..." />
  }

  return (
    <div>
      {alertMsg.length > 0 && <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
        <ul>
          {alertMsg.map((msg, index) =>
            <li
              key={index}
              style={{
                fontSize: '1vw',
                fontFamily: 'Poppins',
                fontWeight: '400',
                color: '#2C2D33',
                margin: '0%',
              }}>
              {msg}
            </li>)}
        </ul>

      </Alert>
      }

      <div className="edit-invoice-header-container">
        <img src="/logo.svg" alt="" />
        <div className="edit-invoice-header-address-container">
          <h3>Invoice: #{invoiceId}</h3>
          <div>
            <p>Office 149, 450 South Brand Brooklyn</p>
            <p>San Diego County, CA 91905, USA</p>
            <p>+1 (123) 456 7891, +44 (876) 543 2198</p>
          </div>
        </div>
      </div>

      <h2 className="edit-invoice-title">Invoice To:</h2>
      <div className="edit-invoice-to-container">
        <div className="edit-invoice-to-container-left">
          <CommonSelect
            label=""
            name="company"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            options={companyOptions}
            required
            error={selectedCompany === ''}
            placeholder="Select Company"
            className="edit-invoice-to-container-left-select"
          />
        </div>

        {selectedCompany && <div className="edit-invoice-to-container-right">
          <p>{getSelectedCompanyDetails(selectedCompany)?.companyName}</p>
          <p>{getSelectedCompanyDetails(selectedCompany)?.addressLine1}</p>
          <p>{getSelectedCompanyDetails(selectedCompany)?.addressLine2}</p>
          <p>{getSelectedCompanyDetails(selectedCompany)?.city} , {getSelectedCompanyDetails(selectedCompany)?.state} , {getSelectedCompanyDetails(selectedCompany)?.zipCode}</p>
          <p>{getSelectedCompanyDetails(selectedCompany)?.phone}</p>
          <p>{getSelectedCompanyDetails(selectedCompany)?.email}</p>
        </div>}
      </div>

      <div className="edit-invoice-input-container">
        <CommonInput
          label="Start Date"
          name="startDate"
          type="date"
          value={invoiceDetails.startDate}
          onChange={(e) => {
            setInvoiceDetails({ ...invoiceDetails, startDate: e.target.value });
            setInvoiceDetailsError({ ...invoiceDetailsError, startDate: e.target.value === '' });
          }}
          error={invoiceDetailsError.startDate}
          required
          errorMsg="Start Date is required"
          placeholder="Start Date"
          half
          className="edit-invoice-input-container-input"
        />
        <CommonInput
          label="End Date"
          name="endDate"
          type="date"
          value={invoiceDetails.endDate}
          onChange={(e) => {
            setInvoiceDetails({ ...invoiceDetails, endDate: e.target.value });
            setInvoiceDetailsError({ ...invoiceDetailsError, endDate: e.target.value === '' });
          }}
          error={invoiceDetailsError.endDate}
          required
          errorMsg="End Date is required"
          placeholder="End Date"
          half
          className="edit-invoice-input-container-input"
        />
      </div>

      <div className="edit-invoice-usage-container">
        <h3>Usage <span>*</span></h3>
        <div>
          {usageOptions.map((option, index) => (
            <FormControlLabel
              key={index}
              control={<CustomRadio />}
              label={option.label}
              checked={invoiceDetails.usage === option.value}
              onChange={() => {
                setInvoiceDetails(prev => ({
                  ...prev,
                  usage: option.value
                }));
              }}
              sx={{
                '& .MuiFormControlLabel-label': {
                  color: '#2C2D33',
                  fontWeight: '400',
                  fontSize: '1vw',
                  fontFamily: 'Poppins',
                  textWrap: 'nowrap',
                }
              }}
            />
          ))}
        </div>
      </div>


      <div className="edit-invoice-discount-container">
        <div className="edit-invoice-discount-container-left">
          <h3>Apply Discounts <span>*</span> </h3>
          <CommonToggleSwitch
            checked={discountDetails.apply}
            onChange={(checked, e) => setDiscountDetails({ ...discountDetails, apply: checked })}
          />
        </div>
      </div>
      {discountDetails.apply && <div className="edit-invoice-discount-container-right">
        <FormControlLabel
          control={<CustomRadio />}
          label={"Percentage"}
          checked={discountDetails.discountType === "Percentage"}
          onChange={() => {
            setDiscountDetails(prev => ({
              ...prev,
              discountType: "Percentage"
            }));
          }}
          sx={{
            '& .MuiFormControlLabel-label': {
              color: '#2C2D33',
              fontWeight: '400',
              fontSize: '1vw',
              fontFamily: 'Poppins',
              textWrap: 'nowrap',
            }
          }}
        />
        <FormControlLabel
          control={<CustomRadio />}
          label={"Fixed"}
          checked={discountDetails.discountType === "Fixed"}
          onChange={() => {
            setDiscountDetails(prev => ({
              ...prev,
              discountType: "Fixed"
            }));
          }}
          sx={{
            '& .MuiFormControlLabel-label': {
              color: '#2C2D33',
              fontWeight: '400',
              fontSize: '1vw',
              fontFamily: 'Poppins',
              textWrap: 'nowrap',
            }
          }}
        />
      </div>}

      {discountDetails.apply && <CommonInput
        label="Discount Value"
        name="discountValue"
        type="number"
        value={discountDetails.discountValue}
        onChange={(e) => {
          setDiscountDetails({ ...discountDetails, discountValue: e.target.value });
          setDiscountDetailsError({ ...discountDetailsError, discountValue: e.target.value.trim() === '' });
        }}
        error={discountDetailsError.discountValue}
        required
        errorMsg="Discount Value is required"
        placeholder="Discount Value"
        className="edit-invoice-input-container-input"
      />}

      <div className="edit-invoice-divider">
      </div>

      <h2 className="edit-invoice-title">Summary</h2>
      <div className="edit-invoice-amount-container">
        <div>
          <p>Amount: </p>
          <p>${calculatedAmounts.totalAmount.toFixed(2)}</p>
        </div>
        {discountDetails.apply && discountDetails.discountType && (
          <div>
            <p>Discount Type: </p>
            <p>{discountDetails.discountType}</p>
          </div>
        )}
        {discountDetails.apply && calculatedAmounts.discountAmount > 0 && (
          <div>
            <p>Discount: </p>
            <p>${calculatedAmounts.discountAmount.toFixed(2)}</p>
          </div>
        )}
      </div>

      <div className="edit-invoice-divider">
      </div>

      <div className="edit-invoice-amount-container">
        <div>
          <p>Total: </p>
          <p>${calculatedAmounts.finalAmount.toFixed(2)}</p>
        </div>
      </div>

      <div className="edit-invoice-notes-container">
        <p>Notes: </p>
        <div>
          It was a pleasure working with you and your team. We hope you will keep us in mind for future projects. Thank You!
        </div>
      </div>

    </div>
  );
}

export default EditInvoice;