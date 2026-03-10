import { useContext, useEffect, useState } from "react";
import { globalContext } from "../../../context/context";
import { useNavigate } from "react-router-dom";
import CommonLoader from "../../../Component/common-loader";
import CommonTable from "../../../Component/common-table";
import CommonDialog from "../../../Component/common-dialog";

function AllBills() {
  const { setBreadcrumbs, setPageTitle, setButtonList, setSubPageTitle } = useContext(globalContext);

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);


  // this is the bill list
  const [billingData, setBillingData] = useState([
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      userId: 1,
      startData: '2025-01-01',
      endData: '2025-01-01',
      status: 'Unpaid',
      amount: 100,
      usage: "Voice"
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Doe',
      userId: 2,
      startData: '2025-01-01',
      endData: '2025-01-01',
      amount: 100,
      status: 'Unpaid',
      usage: "Chat"
    },
    {
      id: 3,
      firstName: 'Jim',
      lastName: 'Beam',
      userId: 3,
      startData: '2025-01-01',
      endData: '2025-01-01',
      status: 'Paid',
      amount: 100,
      usage: "Voice"
    },
    {
      id: 4,
      firstName: 'Jill',
      lastName: 'Doe',
      userId: 4,
      startData: '2025-01-01',
      endData: '2025-01-01',
      status: 'Paid',
      amount: 100,
      usage: "Voice and Chat"
    }
  ]);
  const [filteredBillingData, setFilteredBillingData] = useState([]);

  // table variables
  const billingHeaders = [
    {
      title: 'Company Name',
      value: 'companyName'
    },
    {
      title: 'Billing ID',
      value: 'billingId'
    },
    {
      title: 'Start Date',
      value: 'startDate'
    },
    {
      title: 'End Date',
      value: 'endDate'
    },
    {
      title: 'Usage',
      value: 'usage'
    },
    {
      title: 'Amount',
      value: 'amount'
    },
    {
      title: 'Status',
      value: 'status'
    },
    {
      title: 'Actions',
      value: 'action'
    }
  ];
  const [billingTableData, setBillingTableData] = useState([]);
  const actionButtons = [
    { label: 'Edit', action: 'Edit' },
    { label: 'View', action: 'View' },
    { label: 'Change Status', action: 'Change Status' },
  ]

  // manage rate variables
  const [rates, setRates] = useState({
    voiceBillingType: 'Per Minute',
    voiceBillingRate: 10,
    chatBillingType: 'Per Character',
    chatBillingRate: 10,
  });
  const [manageRateFromData, setManageRateFromData] = useState({
    voiceBillingType: '',
    voiceBillingRate: '',
    chatBillingType: '',
    chatBillingRate: '',
  });
  const [manageRateErrors, setManageRateErrors] = useState({
    voiceBillingType: false,
    voiceBillingRate: false,
    chatBillingType: false,
    chatBillingRate: false,
  });
  const manageRateFromSection = [
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


  // change status variables
  const [changeStatusFromData, setChangeStatusFromData] = useState({
    status: '',
  });
  const [changeStatusErrors, setChangeStatusErrors] = useState({
    status: false,
  });
  const changeStatusFromSection = [
    {
      id: "status",
      type: "fields",
      fields: [
        {
          type: "select",
          name: "status",
          label: "Status",
          options: [
            { label: "Paid", value: "Paid" },
            { label: "Unpaid", value: "Unpaid" },
          ],
          required: true,
          width: "full",
        }
      ]
    },
  ];


  // dialog variables
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogFormData, setDialogFormData] = useState({});
  const [dialogErrors, setDialogErrors] = useState({});
  const [dialogFromSection, setDialogFromSection] = useState([]);
  const [dialogSubmitButtonText, setDialogSubmitButtonText] = useState('');
  const [dialogOnSubmit, setDialogOnSubmit] = useState(() => { });


  const fetchBillingData = async () => {
    try {
      const response = await fetch('');
      const data = await response.json();
      console.log("billing data fetched", data);
      if (data.statusCode === 200) {
        return data.data;
      } else {
        return [];
      }
    } catch (error) {
      console.log("error in fetching billing data", error);
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
  const handleSearch = (e) => {
    const searchValue = e.target.value.trim().toLowerCase();
    setSearchTerm(searchValue);

    if (searchValue === '') {
      setFilteredBillingData(billingData);
    } else {
      const filteredData = billingData.filter((item) => {
        const fullName = item.firstName + ' ' + item.lastName;
        const usage = item.usage;

        return fullName.toLowerCase().startsWith(searchValue) || usage.toLowerCase().startsWith(searchValue);
      });
      setFilteredBillingData(filteredData);
    }
  }

  const handleManageRate = () => {
    setOpenDialog(true);
    setDialogTitle('Manage Rates');
    setDialogFromSection(manageRateFromSection);
    setDialogFormData(rates);
    setDialogErrors(manageRateErrors);
    setDialogSubmitButtonText('Save');
    setDialogOnSubmit(() => handleManageRateSubmit);
  }
  const handleManageRateSubmit = async (formData) => {
    console.log("formData for manage rate", formData);
    const user = JSON.parse(localStorage.getItem('tracxion user'));
    console.log("user", user);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/managerates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('tracxion admin token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          "voice_billing_type": formData.voiceBillingType === 'Per Minute' ? 'M' : 'S',
          "voice_billing_rate": formData.voiceBillingRate,
          "chat_billing_type": formData.chatBillingType === 'Per Character' ? 'C' : 'S',
          "chat_billing_rate": formData.chatBillingRate,
          "user_id": user.role,
        }),
      });
      const data = await response.json();
      console.log("rate managed", data);

    } catch (error) {
      console.log("error in managing rate", error);
    }
  }

  useEffect(() => {
    setBreadcrumbs([
      { title: 'All Bills', link: '/billings' },
    ]);
    setPageTitle('All Bills');
    setButtonList([
      {
        type: 'button',
        text: 'Manage Rates',
        onClick: () => { handleManageRate() },
        backgroundColor: 'transparent',
        textColor: '#00A1F9',
        borderColor: '#00A1F9'
      },
      {
        type: 'button',
        text: 'Create Invoice',
        onClick: () => { navigate('create-invoice') },
        backgroundColor: '#00A1F9',
        textColor: 'white',
        borderColor: '#00A1F9'
      },
      {
        type: 'search',
        name: 'search',
        value: searchTerm,
        onChange: handleSearch,
        inputType: 'text',
      },
    ]);
    setSubPageTitle({});
  }, [searchTerm, navigate]);

  useEffect(() => {
    setBreadcrumbs([
      { title: 'All Bills', link: '/billings' },
    ]);
    setPageTitle('All Bills');
    setButtonList([
      {
        type: 'button',
        text: 'Manage Rates',
        onClick: () => { handleManageRate() },
        backgroundColor: 'transparent',
        textColor: '#00A1F9',
        borderColor: '#00A1F9'
      },
      {
        type: 'button',
        text: 'Create Invoice',
        onClick: () => { navigate('create-invoice') },
        backgroundColor: '#00A1F9',
        textColor: 'white',
        borderColor: '#00A1F9'
      },
      {
        type: 'search',
        name: 'search',
        value: searchTerm,
        onChange: handleSearch,
        inputType: 'text',
      },
    ]);
    setSubPageTitle({});
    const fetchingData = async () => {
      setLoading(true);
      const data = await fetchBillingData();
      const rates = await fetchRates();
      // setRates(rates);
      // setBillingData(data);
      setLoading(false);
    }
    fetchingData();
  }, []);

  useEffect(() => {
    setFilteredBillingData(billingData);
  }, [billingData]);

  useEffect(() => {
    const data = searchTerm.trim() === '' ? billingData : filteredBillingData;

    const tableData = data.map((item) => ({
      companyName: {
        name: item.firstName + ' ' + item.lastName,
        id: item.userId,
        image: '/avatar-2.svg'
      },
      billingId: item.id,
      startDate: item.startData,
      endDate: item.endData,
      usage: item.usage,
      amount: item.amount,
      status: item.status,
    }));
    setBillingTableData(tableData);
  }, [billingData, filteredBillingData, searchTerm]);

  const handleActionClick = (action, id) => {
    console.log("action", action);
    console.log("id", id);
    if (action === 'Change Status') {
      const bill = billingData.find((item) => item.id === id);
      const status = bill.status;
      setOpenDialog(true);
      setDialogTitle('Change Status');
      setDialogFromSection(changeStatusFromSection);
      setDialogFormData({
        status: status,
      });
      setDialogErrors(changeStatusErrors);
      setDialogSubmitButtonText('Save');
      setDialogOnSubmit(handleChangeStatusSubmit);
    }
    if (action === 'View') {
      navigate(`/billings/view-invoice/${id}`);
    }
    if (action === 'Edit') {
      navigate(`/billings/edit-invoice/${id}`);
    }
  }

  const handleChangeStatusSubmit = (formData) => {
    console.log("formData for change status", formData);
  }

  if (loading) {
    return <div><CommonLoader /></div>;
  }
  return (
    <div>
      <CommonTable
        tableData={billingTableData}
        headers={billingHeaders}
        handleActionClick={handleActionClick}
        specificReturn='billingId'
        actionButtons={actionButtons}
      />
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
    </div>
  );
}

export default AllBills;