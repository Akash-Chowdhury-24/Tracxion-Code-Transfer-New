import { useContext, useEffect, useState } from "react";
import { globalContext } from "../../../context/context";
import { useNavigate } from "react-router-dom";
import CommonDeleteDialog from "../../../Component/common-delete-dialog";
import CommonTable from "../../../Component/common-table";
import CommonLoader from "../../../Component/common-loader";

function AllRaiseADispute() {

  const { setBreadcrumbs, setPageTitle, setButtonList, setSubPageTitle } = useContext(globalContext);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();


  // table data and headers
  const headers = [
    {
      title: 'Case ID',
      value: 'id',
    },
    {
      title: 'Date',
      value: 'date',
    },
    {
      title: 'Time',
      value: 'time',
    },
    {
      title: 'Status',
      value: 'status',
    },
    {
      title: 'Actions',
      value: 'action',
    },
  ]
  const [tableData, setTableData] = useState([]);

  // case data 
  const [caseData, setCaseData] = useState([
    {
      id: 1,
      date: '2021-01-01',
      time: '10:00:00',
      status: 'Open',
      subject: 'Subject 1',
      description: 'Description 1',
      files: []
    },
    {
      id: 2,
      date: '2021-01-02',
      time: '11:00:00',
      status: 'Closed',
      subject: 'Subject 2',
      description: 'Description 2',
      files: []
    },
    {
      id: 3,
      date: '2021-01-03',
      time: '12:00:00',
      status: 'Open',
      subject: 'Subject 3',
      description: 'Description 3',
      files: []
    },
    {
      id: 4,
      date: '2021-01-04',
      time: '13:00:00',
      status: 'Closed',
      subject: 'Subject 4',
      description: 'Description 4',
      files: []
    },
  ]);
  const [filteredCaseData, setFilteredCaseData] = useState([]);


  // Delete Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDialogTitle, setDeleteDialogTitle] = useState('');
  const [deleteDialogDescription, setDeleteDialogDescription] = useState('');
  const [deleteDialogHandleSubmit, setDeleteDialogHandleSubmit] = useState(() => { });

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    if (searchValue.trim() === '') {
      setFilteredCaseData(caseData);
    }
    else {
      const filtered = caseData.filter(c => {
        const date = c.date.toLowerCase();
        const time = c.time.toLowerCase();
        const status = c.status.toLowerCase();
        const searchLower = searchValue.toLowerCase();

        return date.includes(searchLower) || time.includes(searchLower) || status.includes(searchLower);
      });
      setFilteredCaseData(filtered);
    }
  }

  const fetchCaseData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/cases`);
      const data = await response.json();
      console.log("case data fetched", data);
      if (data.status === 'success') {
        return data.data;
      } else {
        return [];
      }
    } catch (error) {
      console.log("error fetching case data", error);
      return [];
    }
  }

  useEffect(() => {
    setBreadcrumbs([
      { title: 'Raise a Dispute', link: '/raise-a-dispute' },
    ]);
    setPageTitle('Dispute');
    setButtonList([
      {
        type: 'button',
        text: 'Add New Ticket',
        onClick: () => { navigate('add-ticket') },
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
  }, [searchTerm]);

  useEffect(() => {
    setBreadcrumbs([
      { title: 'Raise a Dispute', link: '/raise-a-dispute' },
    ]);
    setPageTitle('Dispute');
    setButtonList([
      {
        type: 'button',
        text: 'Add New Ticket',
        onClick: () => { navigate('add-ticket') },
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
      // const data = await fetchCaseData();
      // setCaseData(data);
      setLoading(false);
    }
    fetchingData();
  }, []);

  useEffect(() => {
    setFilteredCaseData(caseData);
  }, [caseData]);

  useEffect(() => {
    const dataToUse = searchTerm.trim() === '' ? caseData : filteredCaseData;
    const tableData = dataToUse.map((item) => ({
      id: item.id,
      date: item.date,
      time: item.time,
      status: item.status,
    }));
    setTableData(tableData);
  }, [caseData, filteredCaseData, searchTerm]);

  const handleActionClick = (action, id) => {
    console.log("action", action);
    console.log("id", id);
    const caseItem = caseData.find((item) => item.id === id);
    if (action === 'view') {
      navigate(`view-ticket/${id}`);
    }
    if (action === 'delete') {
      setDeleteDialogOpen(true);
      setDeleteDialogTitle('Delete Case');
      setDeleteDialogDescription(`"${caseItem.subject}" will be deleted permanently. You can't undo this action.`);
      setDeleteDialogHandleSubmit(() => () => handleDeleteCaseSubmit(id));
    }
    if (action === 'edit') {
      navigate(`edit-ticket/${id}`);
    }
  }

  const handleDeleteCaseSubmit = (id) => {
    console.log("id to delete", id);
  }

  if (loading) {
    return <CommonLoader text="Loading cases..." />;
  }

  return (
    <div>
      <CommonTable
        tableData={tableData}
        headers={headers}
        handleActionClick={handleActionClick}
        specificReturn="id"
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

export default AllRaiseADispute;