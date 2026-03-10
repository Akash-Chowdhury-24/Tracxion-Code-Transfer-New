import { useContext, useEffect, useState } from "react";
import { globalContext } from "../../../context/context";
import "./view-invoice.css";
import { useNavigate, useParams } from "react-router-dom";
import CommonSelect from "../../../Component/common-select";
import CommonInput from "../../../Component/common-input";
import { FormControlLabel, Radio } from "@mui/material";
import CommonToggleSwitch from "../../../Component/common-toggle-switch";
import CommonLoader from "../../../Component/common-loader";


function ViewInvoice() {
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

  const [invoiceData, setInvoiceData] = useState({
    companyId: 2,
    startDate: '2025-01-01',
    endDate: '2025-01-01',
    usage: 'Voice',
    applyDiscount: true,
    discountType: 'Percentage',
    discountValue: '10',
  });

  const [selectedCompany, setSelectedCompany] = useState('');
  const [invoiceDetails, setInvoiceDetails] = useState({
    startDate: '',
    endDate: '',
    usage: '',
  });

  const [discountDetails, setDiscountDetails] = useState({
    apply: false,
    discountType: '',
    discountValue: '',
  });


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
    setPageTitle('Invoice');
    setButtonList([]);
    setBreadcrumbs([
      { title: 'All Bills', link: '/billings' },
      { title: 'View Invoice', link: `/billings/view-invoice/${invoiceId}` },
    ]);
    setSubPageTitle({});
    const fetchingData = async () => {
      setLoading(true);
      const companyData = await fetchCompanyData();
      const rates = await fetchRates();
      const invoiceFetchData = await fetchInvoiceData(invoiceId);
      // setCompanyData(companyData);
      // setRates(rates);
      setLoading(false);
    }
    fetchingData();
  }, [invoiceId]);

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

  if (loading) {
    return <CommonLoader text="Loading..." />
  }

  return (
    <div>

      <div className="view-invoice-header-container">
        <img src="/logo.svg" alt="" />
        <div className="view-invoice-header-address-container">
          <div>
            <p>Office 149, 450 South Brand Brooklyn</p>
            <p>San Diego County, CA 91905, USA</p>
            <p>+1 (123) 456 7891, +44 (876) 543 2198</p>
          </div>
        </div>
      </div>

      <h2 className="view-invoice-title">Invoice To:</h2>
      <div className="view-invoice-to-container">
        <div className="view-invoice-to-container-left">
          <div className="view-invoice-company-display">
            <h3>Company:</h3>
            <p>{getSelectedCompanyDetails(selectedCompany)?.companyName || 'N/A'}</p>
          </div>
        </div>

        {selectedCompany && <div className="view-invoice-to-container-right">
          <p>{getSelectedCompanyDetails(selectedCompany)?.companyName}</p>
          <p>{getSelectedCompanyDetails(selectedCompany)?.addressLine1}</p>
          <p>{getSelectedCompanyDetails(selectedCompany)?.addressLine2}</p>
          <p>{getSelectedCompanyDetails(selectedCompany)?.city} , {getSelectedCompanyDetails(selectedCompany)?.state} , {getSelectedCompanyDetails(selectedCompany)?.zipCode}</p>
          <p>{getSelectedCompanyDetails(selectedCompany)?.phone}</p>
          <p>{getSelectedCompanyDetails(selectedCompany)?.email}</p>
        </div>}
      </div>

      <div className="view-invoice-divider">
      </div>


      <div className="view-invoice-date-container">
        <div>
          <p>Start Date: </p>
          <p>{invoiceDetails.startDate || 'N/A'}</p>
        </div>
        <div>
          <p>End Date: </p>
          <p>{invoiceDetails.endDate || 'N/A'}</p>
        </div>
        <div>
          <p>Usage: </p>
          <p>{invoiceDetails.usage || 'N/A'}</p>
        </div>
        <div>
          <p>Apply Discounts: </p>
          <p>{discountDetails.apply ? 'Yes' : 'No'}</p>
        </div>
        {discountDetails.apply &&
          <div>
            <p>Discount Type: </p>
            <p>{discountDetails.discountType || 'N/A'}</p>
          </div>}
        {discountDetails.apply &&
          <div>
            <p>Discount Value: </p>
            <p>{discountDetails.discountValue || 'N/A'}{discountDetails.discountType === 'Percentage' ? '%' : ''}</p>
          </div>}
      </div>

      <div className="view-invoice-divider">
      </div>

      <h2 className="view-invoice-title">Summary</h2>
      <div className="view-invoice-amount-container">
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

      <div className="view-invoice-divider">
      </div>

      <div className="view-invoice-amount-container">
        <div>
          <p>Total: </p>
          <p>${calculatedAmounts.finalAmount.toFixed(2)}</p>
        </div>
      </div>

      <div className="view-invoice-notes-container">
        <p>Notes: </p>
        <div>
          It was a pleasure working with you and your team. We hope you will keep us in mind for future projects. Thank You!
        </div>
      </div>

    </div>
  );
}

export default ViewInvoice;