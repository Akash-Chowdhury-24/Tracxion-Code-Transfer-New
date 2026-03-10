import { useContext, useEffect, useState } from "react";
import { globalContext } from "../../../context/context";
import { useNavigate } from "react-router-dom";
import CommonLoader from "../../../Component/common-loader";
import CommonTable from "../../../Component/common-table";

function AllBills() {
  const { setBreadcrumbs, setPageTitle, setButtonList , setSubPageTitle} = useContext(globalContext);

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
    { label: 'View', action: 'View' },
  ]


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
  const handleSearch = (e) => {
    const searchValue = e.target.value.trim().toLowerCase();
    setSearchTerm(searchValue);

    if (searchValue === '') {
      setFilteredBillingData(billingData);
    } else {
      const filteredData = billingData.filter((item) => {
        const startDate = item.startData;
        const endDate = item.endData;
        const usage = item.usage;
        const amount = item.amount;
        const status = item.status;

        return startDate.toLowerCase().startsWith(searchValue) || endDate.toLowerCase().startsWith(searchValue) || usage.toLowerCase().startsWith(searchValue) || amount.toLowerCase().startsWith(searchValue) || status.toLowerCase().startsWith(searchValue);
      });
      setFilteredBillingData(filteredData);
    }
  }


  useEffect(() => {
    setBreadcrumbs([
      { title: 'Billings', link: '/billings' },
    ]);
    setPageTitle('Billings');
    setButtonList([
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
      { title: 'Billings', link: '/billings' },
    ]);
    setPageTitle('Billings');
    setButtonList([
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
    if (action === 'View') {
      navigate(`/billings/view-invoice/${id}`);
    } 
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
    </div>
  );
}

export default AllBills;