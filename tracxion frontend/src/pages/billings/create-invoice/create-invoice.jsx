import { useContext, useEffect, useState } from "react";
import { globalContext } from "../../../context/context";
import "./create-invoice.css";
import { useNavigate } from "react-router-dom";
import CommonSelect from "../../../Component/common-select";
import CommonInput from "../../../Component/common-input";
import { Alert, FormControlLabel, Radio } from "@mui/material";
import CommonToggleSwitch from "../../../Component/common-toggle-switch";
import CommonLoader from "../../../Component/common-loader";
import CommonAlert from "../../../Component/common-alert";

function CreateInvoice() {

  const { setPageTitle, setButtonList, setBreadcrumbs, setSubPageTitle } = useContext(globalContext);
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
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


  // handle create invoice
  const handleCreateInvoice = async () => {
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
        console.log("sending data ", {
          "company": selectedCompany,
          "invoice_start_date": invoiceDetails.startDate,
          "invoice_end_date": invoiceDetails.endDate,
          "usage_type": invoiceDetails.usage === 'Voice' ? 'V' : invoiceDetails.usage === 'Chat' ? 'C' : 'A',
          "apply_discount": discountDetails.apply,
          "amount": calculatedAmounts.totalAmount,
          "discount_value": discountDetails.discountValue,
          "discount_type": discountDetails.discountType === 'Percentage' ? 'P' : 'F'
        })
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/createnewinvoice`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('tracxion admin token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            "company": selectedCompany,
            "invoice_start_date": invoiceDetails.startDate,
            "invoice_end_date": invoiceDetails.endDate,
            "usage_type": invoiceDetails.usage === 'Voice' ? 'V' : invoiceDetails.usage === 'Chat' ? 'C' : 'A',
            "apply_discount": discountDetails.apply,
            "amount": calculatedAmounts.totalAmount,
            "discount_value": discountDetails.discountValue,
            "discount_type": discountDetails.discountType === 'Percentage' ? 'P' : 'F'
          }),
        });
        const data = await response.json();
        console.log("invoice created", data);
        if (data.statusCode === 200 || data.message === `Invoice generated for ${selectedCompany}`) {
          navigate('/billings');
          return;
        }
        setAlertMsg(data.message);
        setTimeout(() => {
          setAlertMsg([]);
        }, 3000);
      } catch (error) {
        console.log("error in creating invoice", error);
        setAlertMsg(error.message);
        setTimeout(() => {
          setAlertMsg([]);
        }, 3000);
      }
    }
  };

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
  useEffect(() => {
    setPageTitle('Create Invoice');
    setBreadcrumbs([
      { title: 'All Bills', link: '/billings' },
      { title: 'Create Invoice', link: '/billings/create-invoice' },
    ]);
    setSubPageTitle({});

    const fetchingData = async () => {
      setLoading(true);
      const companyData = await fetchCompanyData();
      const rates = await fetchRates();
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
        text: submitting ? 'Creating...' : 'Create',
        onClick: handleCreateInvoice,
        backgroundColor: '#00A1F9',
        textColor: 'white',
        borderColor: '#00A1F9',
        disabled: submitting
      },
    ]);
  }, [submitting, selectedCompany, invoiceDetails, discountDetails, calculatedAmounts]);

  // Update calculations whenever relevant data changes
  useEffect(() => {
    if (invoiceDetails.usage) {
      calculateAmounts();
    }
  }, [invoiceDetails.usage, rates, discountDetails]);


  if (loading) {
    return <CommonLoader text="Loading..." />
  }

  return (
    <div>
      {alertMsg.length > 0 && <CommonAlert msg={alertMsg} />}

      <div className="create-invoice-header-container">
        <img src="/logo.svg" alt="" />
        <div className="create-invoice-header-address-container">
          <div>
            <p>Office 149, 450 South Brand Brooklyn</p>
            <p>San Diego County, CA 91905, USA</p>
            <p>+1 (123) 456 7891, +44 (876) 543 2198</p>
          </div>
        </div>
      </div>

      <h2 className="create-invoice-title">Invoice To:</h2>
      <div className="create-invoice-to-container">
        <div className="create-invoice-to-container-left">
          <CommonSelect
            label=""
            name="company"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            options={companyOptions}
            required
            error={selectedCompany === ''}
            placeholder="Select Company"
            className="create-invoice-to-container-left-select"
          />
        </div>

        {selectedCompany && <div className="create-invoice-to-container-right">
          <p>{getSelectedCompanyDetails(selectedCompany)?.companyName}</p>
          <p>{getSelectedCompanyDetails(selectedCompany)?.addressLine1}</p>
          <p>{getSelectedCompanyDetails(selectedCompany)?.addressLine2}</p>
          <p>{getSelectedCompanyDetails(selectedCompany)?.city} , {getSelectedCompanyDetails(selectedCompany)?.state} , {getSelectedCompanyDetails(selectedCompany)?.zipCode}</p>
          <p>{getSelectedCompanyDetails(selectedCompany)?.phone}</p>
          <p>{getSelectedCompanyDetails(selectedCompany)?.email}</p>
        </div>}
      </div>

      <div className="create-invoice-input-container">
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
          className="create-invoice-input-container-input"
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
          className="create-invoice-input-container-input"
        />
      </div>

      <div className="create-invoice-usage-container">
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


      <div className="create-invoice-discount-container">
        <div className="create-invoice-discount-container-left">
          <h3>Apply Discounts <span>*</span> </h3>
          <CommonToggleSwitch
            checked={discountDetails.apply}
            onChange={(checked, e) => setDiscountDetails({ ...discountDetails, apply: checked })}
          />
        </div>
      </div>
      {discountDetails.apply && <div className="create-invoice-discount-container-right">
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
        className="create-invoice-input-container-input"
      />}

      <div className="create-invoice-divider">
      </div>

      <h2 className="create-invoice-title">Summary</h2>
      <div className="create-invoice-amount-container">
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

      <div className="create-invoice-divider">
      </div>

      <div className="create-invoice-amount-container">
        <div>
          <p>Total: </p>
          <p>${calculatedAmounts.finalAmount.toFixed(2)}</p>
        </div>
      </div>

      <div className="create-invoice-notes-container">
        <p>Notes: </p>
        <div>
          It was a pleasure working with you and your team. We hope you will keep us in mind for future projects. Thank You!
        </div>
      </div>

    </div>
  );
}

export default CreateInvoice;