import { useContext, useEffect, useState } from "react";
import { globalContext } from "../../../context/context";
import CommonTable from "../../../Component/common-table";
import CommonDialog from "../../../Component/common-dialog";
import CommonDeleteDialog from "../../../Component/common-delete-dialog";
import CommonLoader from "../../../Component/common-loader";

function Holidays() {

  const { setPageTitle, setButtonList, setBreadcrumbs, setSubPageTitle } = useContext(globalContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // holiday varibles 
  const [holidaysData, setHolidaysData] = useState([
    {
      id: 1,
      date: "2025-01-01",
      holidayName: "New Year",
      assignedDepartment: "Select Departments",
      departments: [1, 2, 3],
    },
    {
      id: 2,
      date: "2025-01-02",
      holidayName: "Independence Day",
      assignedDepartment: "All Departments",
      departments: [],
    },
    {
      id: 3,
      date: "2025-01-03",
      holidayName: "Christmas",
      assignedDepartment: "All Departments",
      departments: [],
    },
    {
      id: 4,
      date: "2025-01-04",
      holidayName: "Republic Day",
      assignedDepartment: "Select Departments",
      departments: [1, 2, 3, 4],
    },
  ]);
  const [filteredHolidaysData, setFilteredHolidaysData] = useState([]);


  // department varibles 
  const [departmentsList, setDepartmentsList] = useState([
    {
      value: 1,
      label: "Department 1",
    },
    {
      value: 2,
      label: "Department 2",
    },
    {
      value: 3,
      label: "Department 3",
    },
    {
      value: 4,
      label: "Department 4",
    },
    {
      value: 5,
      label: "Department 5",
    },
  ]);

  // holiday table data
  const holidatTableHeaders = [
    {
      title: "Holiday Name",
      value: "holidayName",
    },
    {
      title: "Date",
      value: "date",
    },
    {
      title: "Assigned Department",
      value: "assignedDepartment",
    },
    {
      title: "Actions",
      value: "action",
    }
  ]
  const [holidayTableData, setHolidayTableData] = useState([]);
  const actionButtons = [
    {
      label: "Edit",
      action: "edit",
    },
    {
      label: "Delete",
      action: "delete",
    }
  ]

  // holiday dialog variables
  const [hoildayFormData, setHoildayFormData] = useState({
    holidayName: "",
    date: "",
    assignedDepartment: "",
    departments: [],
  });
  const [holidayErrors, setHolidayErrors] = useState({
    holidayName: false,
    date: false,
    assignedDepartment: false,
    departments: false,
  });
  const holidayFormSections = [
    {
      id: "normal fields",
      type: "fields",
      fields: [
        {
          label: "Holiday Name",
          name: "holidayName",
          type: "text",
          placeholder: "Enter Holiday Name",
          required: true,
          width: "full",
        },
        {
          label: "Date",
          name: "date",
          type: "date",
          placeholder: "Select Date",
          required: true,
          width: "full",
        },
      ]
    },
    {
      id: "departments",
      type: "radio",
      title: "Assigned Department",
      dataKey: "assignedDepartment",
      required: true,
      options: [
        {
          label: "All Departments",
          value: "All Departments",
        },
        {
          label: "Select Departments",
          value: "Select Departments",
          fields: [
            {
              label: "Select Departments",
              name: "departments",
              type: "select",
              options: departmentsList,
              required: true,
              width: "full",
              placeholder: "Select Departments",
              multiselect: true,
            },
          ],
        },
      ],
    },
  ]


  // dialog variables
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogFormData, setDialogFormData] = useState({});
  const [dialogErrors, setDialogErrors] = useState({});
  const [dialogFormSection, setDialogFormSection] = useState([]);
  const [dialogSubmitText, setDialogSubmitText] = useState('');
  const [dialogOnSubmit, setDialogOnSubmit] = useState(() => { });

  // delete dialog variables
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDialogTitle, setDeleteDialogTitle] = useState('');
  const [deleteDialogDescription, setDeleteDialogDescription] = useState('');
  const [deleteDialogHandleSubmit, setDeleteDialogHandleSubmit] = useState(() => { });

  const fetchHolidaysData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/holidays`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${JSON.parse(localStorage.getItem("tracxion admin token"))}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
      const data = await response.json();
      console.log("holidays data in fetchHolidaysData", data);
      if (data.status === 'success') {
        return data.data;
      } else {
        return [];
      }
    } catch (error) {
      console.log("error in fetching holidays data", error);
      return [];
    }
  }

  const handleSearch = (e) => {
    const searchValue = e.target.value.trim();
    setSearchTerm(searchValue);

    if (searchValue === "") {
      setFilteredHolidaysData(holidaysData);
    } else {
      const filteredData = holidaysData.filter((item) => {
        const holidayName = item.holidayName.toLowerCase();
        const date = item.date.toLowerCase();

        return holidayName.startsWith(searchValue) || date.includes(searchValue);
      });
      setFilteredHolidaysData(filteredData);
    }
  }

  useEffect(() => {
    setPageTitle("Holidays");
    setBreadcrumbs([
      { title: 'Working Hours', link: '/working-hours' },
      { title: 'Holidays', link: '/working-hours/holidays' },
    ])
    setButtonList([
      {
        type: 'button',
        text: 'Add New Holiday',
        onClick: () => { handleAddHoliday() },
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
      }
    ]);
    setSubPageTitle({});
  }, [searchTerm]);
  useEffect(() => {
    setPageTitle("Holidays");
    setBreadcrumbs([
      { title: 'Working Hours', link: '/working-hours' },
      { title: 'Holidays', link: '/working-hours/holidays' },
    ])
    setButtonList([
      {
        type: 'button',
        text: 'Add New Holiday',
        onClick: () => { handleAddHoliday() },
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
      }
    ]);
    setSubPageTitle({});
    const fetching = async () => {
      setLoading(true);
      // const data = await fetchHolidaysData();
      // setHolidaysData(data);
      setLoading(false);
    }
    fetching();
  }, []);
  useEffect(() => {
    setFilteredHolidaysData(holidaysData);
  }, [holidaysData]);
  useEffect(() => {
    const dataToUse = searchTerm.trim() === '' ? holidaysData : filteredHolidaysData;
    const tableData = dataToUse.map((item) => ({
      id: item.id,
      holidayName: item.holidayName,
      date: item.date,
      assignedDepartment: giveDepartmentNames(item.assignedDepartment, item.departments),
    }));
    setHolidayTableData(tableData);
  }, [holidaysData, filteredHolidaysData, searchTerm]);

  const giveDepartmentNames = (assignedDepartment, departments) => {
    // If it's "All Departments", return "All"
    if (assignedDepartment === "All Departments") {
      return "All";
    }

    // If departments array exists and has items, map through it to get department names
    if (Array.isArray(departments) && departments.length > 0) {
      const departmentNames = departments.map((department) => {
        const name = departmentsList.find((item) => item.value === department)?.label;
        return name;
      }).filter(Boolean).join(', ');

      return departmentNames || "No departments assigned";
    }

    // If no departments array or it's empty, return "Select Departments"
    return "Select Departments";
  }

  const handleAddHoliday = () => {
    setDialogOpen(true);
    setDialogTitle('Add Holiday');
    setDialogFormData(hoildayFormData);
    setDialogErrors(holidayErrors);
    setDialogFormSection(holidayFormSections);
    setDialogSubmitText('Add');
    setDialogOnSubmit(() => handleAddHolidaySubmit);
  }
  const handleAddHolidaySubmit = (formData) => {
    console.log("formData in handleAddHolidaySubmit", formData);
  }

  const handleActionClick = (action, id) => {
    console.log("action in handleActionClick", action, id);
    if (action === "edit") {
      const holidayData = holidaysData.find((item) => item.id === id);
      setDialogOpen(true);
      setDialogTitle('Edit Holiday');
      setDialogFormData(holidayData);
      setDialogErrors(holidayErrors);
      setDialogFormSection(holidayFormSections);
      setDialogSubmitText('Update');
      setDialogOnSubmit(() => handleUpdateHolidaySubmit);
    } else if (action === "delete") {
      const holidayName = holidaysData.find((item) => item.id === id).holidayName;
      setDeleteDialogOpen(true);
      setDeleteDialogTitle('Delete Holiday');
      setDeleteDialogDescription(`Are you sure you want to delete ${holidayName}?`);
      setDeleteDialogHandleSubmit(() => () => handleDeleteHoliday(id));
    }
  }

  const handleUpdateHolidaySubmit = (formData) => {
    console.log("formData in handleUpdateHolidaySubmit", formData);
  }

  const handleDeleteHoliday = (id) => {
    console.log("handleDeleteHoliday", id);
  }

  if(loading) {
    return <CommonLoader text="Loading Holidays Data" />
  }

  return (
    <div>
      <CommonTable
        tableData={holidayTableData}
        headers={holidatTableHeaders}
        handleActionClick={handleActionClick}
        specificReturn="id"
        actionButtons={actionButtons}
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

export default Holidays;