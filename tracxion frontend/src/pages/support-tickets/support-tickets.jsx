import { useContext, useEffect, useState } from "react";
import { globalContext } from "../../context/context";
import CommonTable from "../../Component/common-table";
import CommonLoader from "../../Component/common-loader";
import CommonDialog from "../../Component/common-dialog";
import { useNavigate } from "react-router-dom";

function SupportTickets() {

  const { setPageTitle, setButtonList, setBreadcrumbs, setSubPageTitle } = useContext(globalContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  // staff data 
  const [staffList, setStaffList] = useState([
    {
      value: 1,
      label: "Staff 1",
    },
    {
      value: 2,
      label: "Staff 2",
    },
    {
      value: 3,
      label: "Staff 3",
    }
  ]);

  // support tickets data
  const [supportTicketsData, setSupportTicketsData] = useState([
    {
      id: 1,
      company: "Company 1",
      userName: "John Doe",
      date: "2021-01-01",
      time: "10:00:00",
      status: "Open",
      staff: 1,
      subject: "Subject 1",
      description: "Description 1",
    },
    {
      id: 2,
      company: "Company 2",
      userName: "Jane Doe",
      date: "2021-01-02",
      time: "11:00:00",
      status: "Closed",
      staff: 2,
      subject: "Subject 2",
      description: "Description 2",
    },
    {
      id: 3,
      company: "Company 3",
      userName: "Jim Doe",
      date: "2021-01-03",
      time: "14:00:00",
      status: "Open",
      staff: 3,
      subject: "Subject 3",
      description: "Description 3",
    },
    {
      id: 4,
      company: "Company 4",
      userName: "Jill Doe",
      date: "2021-01-04",
      time: "15:00:00",
      status: "Closed",
      staff: '',
      subject: "Subject 4",
      description: "Description 4",
    },
  ]);
  const [filteredSupportTicketsData, setFilteredSupportTicketsData] = useState(supportTicketsData);

  // table data
  const [supportTicketsTableData, setSupportTicketsTableData] = useState([]);
  const supportTicketsHeaders = [
    {
      title: "Case ID",
      value: "id",
    },
    {
      title: "Company",
      value: "company",
    },
    {
      title: "User Name",
      value: "userName",
    },
    {
      title: "Date",
      value: "date",
    },
    {
      title: "Time",
      value: "time",
    },
    {
      title: "Status",
      value: "status",
    },
    {
      title: "Actions",
      value: "action",
    }
  ];
  const actionButtons = [
    {
      label: "View",
      action: "view",
    },
    {
      label: "Assign",
      action: "assign",
    },
    {
      label: "Change Status",
      action: "changeStatus",
    },
  ];

  // assign variables
  const [assignFormData, setAssignFormData] = useState({
    staff: "",
  });
  const [assignFormErrors, setAssignFormErrors] = useState({
    staff: false,
  });
  const [assignFormSections, setAssignFormSections] = useState([
    {
      id: 'assign-staff',
      type: 'fields',
      fields: [
        {
          type: 'select',
          label: 'Staff',
          options: staffList,
          name: 'staff',
          required: true,
          width: 'full',
          placeholder: 'Select Staff',
        }
      ]
    }
  ]);


  // change status variables
  const [changeStatusFormData, setChangeStatusFormData] = useState({
    status: "",
  });
  const [changeStatusFormErrors, setChangeStatusFormErrors] = useState({
    status: false,
  });
  const [changeStatusFormSections, setChangeStatusFormSections] = useState([
    {
      id: 'change-status',
      type: 'fields',
      fields: [
        {
          type: 'select',
          label: 'Status',
          options: [
            {
              value: 'Open',
              label: 'Open',
            },
            {
              value: 'Closed',
              label: 'Closed',
            },
          ],
          name: 'status',
          required: true,
          width: 'full',
          placeholder: 'Select Status',
        }
      ]
    }
  ]);

  // dialog variables
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogFormData, setDialogFormData] = useState({});
  const [dialogErrors, setDialogErrors] = useState({});
  const [dialogFormSection, setDialogFormSection] = useState([]);
  const [dialogSubmitText, setDialogSubmitText] = useState('');
  const [dialogOnSubmit, setDialogOnSubmit] = useState(() => { });

  const fetchSupportTicketsData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/support-tickets`);
      const data = await response.json();
      console.log("support tickets data in fetchSupportTicketsData", data);
      if (data.status === "success") {
        return data.data;
      } else {
        console.log("error in fetchSupportTicketsData", data.message);
        return [];
      }
    } catch (error) {
      console.log("error in fetchSupportTicketsData", error);
      return [];
    }
  }

  const handleSearch = (e) => {
    const searchValue = e.target.value.trim().toLowerCase();
    setSearchTerm(searchValue);

    if (searchValue === "") {
      setFilteredSupportTicketsData(supportTicketsData);
    } else {
      const filteredData = supportTicketsData.filter((item) => {
        const company = item.company.toLowerCase();
        const userName = item.userName.toLowerCase();
        const status = item.status.toLowerCase();

        return company.startsWith(searchValue) || userName.startsWith(searchValue) || status.includes(searchValue);
      });
      setFilteredSupportTicketsData(filteredData);
    }
  }

  useEffect(() => {
    setPageTitle("All Support Tickets");
    setBreadcrumbs([
      {
        title: "All Support Tickets",
        link: "/support-tickets"
      }
    ])
    setButtonList([
      {
        type: 'search',
        name: 'search',
        value: searchTerm,
        onChange: handleSearch,
        inputType: 'text',
      }
    ]);
    setSubPageTitle({});

  }, [searchTerm])
  useEffect(() => {
    setPageTitle("All Support Tickets");
    setBreadcrumbs([
      {
        title: "All Support Tickets",
        link: "/support-tickets"
      }
    ])
    setButtonList([
      {
        type: 'search',
        name: 'search',
        value: searchTerm,
        onChange: handleSearch,
        inputType: 'text',
      }
    ]);
    setSubPageTitle({});
    const fetching = async () => {
      setLoading(true);
      // const data = await fetchSupportTicketsData();
      // setSupportTicketsData(data);
      setLoading(false);
    }
    fetching();

  }, [])
  useEffect(() => {
    setFilteredSupportTicketsData(supportTicketsData);
  }, [supportTicketsData])
  useEffect(() => {
    const dataToUse = searchTerm.trim() === "" ? supportTicketsData : filteredSupportTicketsData;
    const tableData = dataToUse.map((item) => ({
      id: item.id,
      company: item.company,
      userName: item.userName,
      date: item.date,
      time: item.time,
      status: item.status,
    }))
    setSupportTicketsTableData(tableData);
  }, [supportTicketsData, searchTerm, filteredSupportTicketsData])



  const handleActionClick = (action, id) => {
    console.log("action in handleActionClick", action, id);
    const supportTicketData = supportTicketsData.find((item) => item.id === id);
    if (action === "assign") {
      setDialogOpen(true);
      setDialogTitle("Assign Staff");
      setDialogFormData({
        staff: supportTicketData.staff,
        id: supportTicketData.id,
      });
      setDialogErrors(assignFormErrors);
      setDialogFormSection(assignFormSections);
      setDialogSubmitText("Assign");
      setDialogOnSubmit(() => handleAssignSubmit);
    } else if (action === "changeStatus") {
      setDialogOpen(true);
      setDialogTitle("Change Status");
      setDialogFormData({
        status: supportTicketData.status,
        id: supportTicketData.id,
      });
      setDialogErrors(changeStatusFormErrors);
      setDialogFormSection(changeStatusFormSections);
      setDialogSubmitText("Change Status");
      setDialogOnSubmit(() => handleChangeStatusSubmit);
    } else if (action === "view") {
      navigate(`view-ticket/${id}`);
    }
  }

  const handleAssignSubmit = (formData) => {
    console.log("handleAssignSubmit", formData);
  }
  const handleChangeStatusSubmit = (formData) => {
    console.log("handleChangeStatusSubmit", formData);
  }

  if (loading) {
    return <CommonLoader text="Loading Support Tickets Data" />
  }
  return (
    <div>
      <CommonTable
        tableData={supportTicketsTableData}
        headers={supportTicketsHeaders}
        actionButtons={actionButtons}
        handleActionClick={handleActionClick}
        specificReturn="id"
      />

      <CommonDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        title={dialogTitle}
        formData={dialogFormData}
        setFormData={setDialogFormData}
        errors={dialogErrors}
        setErrors={setDialogErrors}
        formSections={dialogFormSection}
        submitButtonText={dialogSubmitText}
        onSubmit={dialogOnSubmit}
      />
    </div>
  );
}

export default SupportTickets;