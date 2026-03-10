import { useNavigate, useParams } from 'react-router-dom';
import './view-company.css'
import { useContext, useEffect, useState } from 'react';
import CommonTable from '../../../Component/common-table';
import { globalContext } from '../../../context/context';
import CommonLoader from '../../../Component/common-loader';
import CommonDialog from '../../../Component/common-dialog';
import CommonDeleteDialog from '../../../Component/common-delete-dialog';

function ViewCompany() {
  const { setBreadcrumbs, setPageTitle, setButtonList, setSubPageTitle } = useContext(globalContext);
  const navigate = useNavigate();
  const params = useParams();
  const companyId = params.id;

  // Company Data
  const [companyData, setCompanyData] = useState({
    companyName: 'Company 1',
    companyLogo: '/logo.svg',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
    addressLine1: '123 Main St',
    addressLine2: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
  });
  const [loading, setLoading] = useState(false);


  // Billing Data
  const [billingData, setBillingData] = useState([
    {
      billingId: '1',
      usage: '100',
      startDate: '2021-01-01',
      endDate: '2021-01-01',
      amount: '100',
      status: 'Paid'
    },
    {
      billingId: '2',
      usage: '200',
      startDate: '2021-01-01',
      endDate: '2021-01-01',
      amount: '200',
      status: 'Paid'
    },
    {
      billingId: '3',
      usage: '300',
      startDate: '2021-01-01',
      endDate: '2021-01-01',
      amount: '300',
      status: 'Paid'
    },
  ]);

  // Billing Table 
  const billingHeaders = [
    {
      title: 'Billing ID',
      value: 'billingId'
    },
    {
      title: "Usage",
      value: 'usage'
    },
    {
      title: "Start Date",
      value: 'startDate'
    },
    {
      title: "End Date",
      value: 'endDate'
    },
    {
      title: "Amount",
      value: 'amount'
    },
    {
      title: "Status",
      value: 'status'
    }
  ];

  const [billingTableData, setBillingTableData] = useState([]);


  // Allow Special Rate
  const [allowSpecialRate, setAllowSpecialRate] = useState({
    voiceBillingType: 'Per Minute',
    voiceBillingRate: '0.001',
    chatBillingType: 'Per Character',
    chatBillingRate: '0.001',
  });


  // Allow Special Rate From Data
  const [allowSpecialRateFromData, setAllowSpecialRateFromData] = useState({
    voiceBillingType: '',
    voiceBillingRate: '',
    chatBillingType: '',
    chatBillingRate: '',
  });

  const [allowSpecialRateErrors, setAllowSpecialRateErrors] = useState({
    voiceBillingType: false,
    voiceBillingRate: false,
    chatBillingType: false,
    chatBillingRate: false,
  });

  const allowSpecialRateFromSection = [
    {
      id: "voice billing type",
      type: "radio 2",
      title: "Voice Billing Type",
      dataKey: "voiceBillingType",
      options: [
        { label: "Per Minute", value: "Per Minute" },
        { label: "Per Session", value: "Per Session" },
      ],
      required: true,
    },
    {
      type: "fields",
      id: "voice billing rate",
      fields: [
        {
          type: "number",
          name: "voiceBillingRate",
          label: "Voice Billing Rate",
          placeholder: "Enter Voice Billing Rate",
          required: true,
          width: "full",
        }
      ]
    },
    {
      id: "divider",
      type: "divider",
    },
    {
      id: "chat billing type",
      type: "radio 2",
      title: "Chat Billing Type",
      dataKey: "chatBillingType",
      options: [
        { label: "Per Character", value: "Per Character" },
        { label: "Per Session", value: "Per Session" },
      ],
      required: true,
    },
    {
      type: "fields",
      id: "chat billing rate",
      fields: [
        {
          type: "number",
          name: "chatBillingRate",
          label: "Chat Billing Rate",
          placeholder: "Enter Chat Billing Rate",
          required: true,
          width: "full",
        }
      ]
    },
  ];

  // Allow Special Rate Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogFormData, setDialogFormData] = useState({});
  const [dialogErrors, setDialogErrors] = useState({});
  const [dialogFromSection, setDialogFromSection] = useState([]);
  const [dialogSubmitButtonText, setDialogSubmitButtonText] = useState('');
  const [dialogOnSubmit, setDialogOnSubmit] = useState(() => { });


  // Delete Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDialogTitle, setDeleteDialogTitle] = useState('');
  const [deleteDialogDescription, setDeleteDialogDescription] = useState('');
  const [deleteDialogHandleSubmit, setDeleteDialogHandleSubmit] = useState(() => { });
  const fetchCompanyDetails = async (companyId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/companies/${companyId}`);
      const data = await response.json();
      if (data.status === 200) {
        return data;
      } else {
        return null;
      }
    } catch (error) {
      console.log("error in fetchCompanyDetails", error);
    }
  }
  const fetchAllowSpecialRate = async (companyId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/companies/${companyId}/allow-special-rate`);
      const data = await response.json();
      console.log("allow special rate", data);
      if (data.status === 200) {
        return data;
      } else {
        return null;
      }
    } catch (error) {
      console.log("error in fetchAllowSpecialRate", error);
    }
  }

  const handleDeleteCompany = async () => {
    setDeleteDialogOpen(true);
    setDeleteDialogTitle("Delete Company");
    setDeleteDialogDescription(`Are you sure you want to delete ${companyData.companyName}?`);
    setDeleteDialogHandleSubmit(() => handleDeleteCompanySubmit);
  }

  const handleDeleteCompanySubmit = async () => {
    console.log("handleDeleteCompany");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/companies/${companyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('tracxion admin token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      if (data.status === 200) {
        navigate('/companies');
      }
    } catch (error) {
      console.log("error in handleDeleteCompany", error);
    }
  }

  const handleAllowSpecialRate = () => {
    setOpenDialog(true);
    setDialogTitle("Allow Special Rate");
    setDialogFormData(allowSpecialRate);
    setDialogErrors(allowSpecialRateErrors);
    setDialogFromSection(allowSpecialRateFromSection);
    setDialogSubmitButtonText("Apply");
    setDialogOnSubmit(() => handleAllowSpecialRateSubmit);
  }

  const handleAllowSpecialRateSubmit = (formData) => {
    console.log("handleAllowSpecialRateSubmit", formData);

  }

  useEffect(() => {
    setPageTitle(`${companyData.companyName}`);
    setBreadcrumbs([
      { title: 'Companies', link: '/companies' },
      { title: `${companyData.companyName}`, link: `/companies/view-company/${companyId}` }
    ]);
    setButtonList([
      {
        type: 'button',
        text: 'Delete',
        onClick: () => { handleDeleteCompany() },
        backgroundColor: 'transparent',
        textColor: '#2C2D33',
        borderColor: 'transparent'
      },
      {
        type: 'button',
        text: 'Edit',
        onClick: () => { navigate(`/companies/edit-company/${companyId}`) },
        backgroundColor: '#00A1F9',
        textColor: 'white',
        borderColor: '#00A1F9'
      },
      {
        type: 'button',
        text: 'Staffs',
        onClick: () => { navigate(`/companies/view-company/${companyId}/staffs`, { state: { companyName: companyData.companyName } }) },
        backgroundColor: 'transparent',
        textColor: '#00A1F9',
        borderColor: '#00A1F9'
      },
      {
        type: 'button',
        text: 'Allow special rate',
        onClick: () => { handleAllowSpecialRate() },
        backgroundColor: 'transparent',
        textColor: '#00A1F9',
        borderColor: '#00A1F9'
      },
    ]);
    setSubPageTitle({});
    // const fetchData = async () => {
    //  setLoading(true);
    //   const data = await fetchCompanyDetails(companyId);
    //   const allowSpecialRate = await fetchAllowSpecialRate(companyId);
    //   if(data){
    //     setCompanyData(data);
    //     setAllowSpecialRate(allowSpecialRate);
    //     setLoading(false);
    //   }
    // }
    // fetchData();
  }, [companyId])

  useEffect(() => {
    const tableData = billingData.map((item) => ({
      billingId: item.billingId,
      usage: item.usage,
      startDate: item.startDate,
      endDate: item.endDate,
      amount: item.amount,
      status: item.status
    }));
    setBillingTableData(tableData);
  }, [billingData]);

  if (loading) {
    return <CommonLoader text="Loading company details..." />
  }
  return (
    <div>
      <div className="single-company-container">

        <div className="single-company-details-container">
          <div className="single-company-avatar-container">
            <img src={companyData.companyLogo} alt="" />
            <h1>{companyData.companyName}</h1>
          </div>
          <div className="single-company-info-container">
            <h1 >Owner Details</h1>
            <div className="single-company-line"> </div>
            <p>Name: <span>{companyData.firstName} {companyData.lastName}</span></p>
            {/* <p>Username: <span>{customerData.userName}</span></p> */}
            <p>Email: <span>{companyData.email}</span></p>
            <p>Phone: <span>{companyData.phone}</span></p>
            <p>Address: <span>{companyData.addressLine1} {companyData.addressLine2} {companyData.city} {companyData.state} {companyData.zipCode}</span></p>
          </div>
        </div>

        <div className="single-company-table-container">
          <div className="single-company-table-header-container">
            <h2>Billings</h2>
          </div>
          <CommonTable
            headers={billingHeaders}
            tableData={billingTableData}
            specificReturn="billingId"
          />

        </div>
      </div>

      <CommonDialog
        open={openDialog}
        setOpen={setOpenDialog}
        title={dialogTitle}
        formData={dialogFormData}
        setFormData={setDialogFormData}
        errors={dialogErrors}
        setErrors={setDialogErrors}
        formSections={dialogFromSection}
        submitButtonText={dialogSubmitButtonText}
        onSubmit={dialogOnSubmit}
      />

      <CommonDeleteDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        title={deleteDialogTitle}
        description={deleteDialogDescription}
        handleSubmit={deleteDialogHandleSubmit}
      />
    </div>
  );
}

export default ViewCompany;