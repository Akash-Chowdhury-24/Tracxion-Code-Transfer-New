import { useContext, useEffect, useState } from "react";
import { globalContext } from "../../../context/context";
import CommonTable from "../../../Component/common-table";
import CommonLoader from "../../../Component/common-loader";
import CommonDialog from "../../../Component/common-dialog";
import CommonDeleteDialog from "../../../Component/common-delete-dialog";
import { useNavigate } from "react-router-dom";

function AllDepartments() {

  const { setBreadcrumbs, setPageTitle, setButtonList, setSubPageTitle } = useContext(globalContext);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // departments list
  const [departmentsList, setDepartmentsList] = useState([
    {
      id: 1,
      departmentName: 'IT',
      numberOfStaff: 10,
    },
    {
      id: 2,
      departmentName: 'HR',
      numberOfStaff: 20,
    },
    {
      id: 3,
      departmentName: 'Marketing',
      numberOfStaff: 30,
    },
    {
      id: 4,
      departmentName: 'Sales',
      numberOfStaff: 40,
    },
    {
      id: 5,
      departmentName: 'Finance',
      numberOfStaff: 50,
    },
  ]);
  const [filteredDepartmentsList, setFilteredDepartmentsList] = useState([]);


  // table data and headers
  const [departmentsTableData, setDepartmentsTableData] = useState([]);
  const departmentHeaders = [
    {
      title: 'Department Name',
      value: 'departmentName',
    },
    {
      title: 'Number of Staff',
      value: 'numberOfStaff',
    },
    {
      title: 'Actions',
      value: 'action',
    }
  ]


  // add and edit form data and errors
  const [departmentFormData, setDepartmentFormData] = useState({
    departmentName: '',
  });
  const [departmentFormErrors, setDepartmentFormErrors] = useState({
    departmentName: false,
  });
  const departmentFormSection = [
    {
      id: 'department name',
      type: 'fields',
      fields: [
        {
          type: 'text',
          label: 'Department Name',
          name: 'departmentName',
          required: true,
          width: 'full',
          placeholder: 'Enter Department Name',
        }
      ]
    }
  ];


  // add and edit dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogFormData, setDialogFormData] = useState({});
  const [dialogErrors, setDialogErrors] = useState({});
  const [dialogFormSection, setDialogFormSection] = useState([]);
  const [dialogSubmitText, setDialogSubmitText] = useState('');
  const [dialogOnSubmit, setDialogOnSubmit] = useState(() => { });



  // Delete Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDialogTitle, setDeleteDialogTitle] = useState('');
  const [deleteDialogDescription, setDeleteDialogDescription] = useState('');
  const [deleteDialogHandleSubmit, setDeleteDialogHandleSubmit] = useState(() => { });

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/departments`);
      const data = await response.json();
      console.log("departments fetched", data);
      if (data.status === 'success') {
        return data.data;
      } else {
        return [];
      }
    } catch (error) {
      console.log("error fetching departments", error);
      return [];
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);

    if (e.target.value.trim() === '') {
      setFilteredDepartmentsList(departmentsList);
    } else {
      setFilteredDepartmentsList(departmentsList.filter(department => department.departmentName.toLowerCase().startsWith(e.target.value.toLowerCase())));
    }
  }

  useEffect(() => {
    setFilteredDepartmentsList(departmentsList);
  }, [departmentsList]);

  useEffect(() => {
    setBreadcrumbs([
      { title: 'Staffs', link: '/staffs' },
      { title: 'All Departments', link: '/staffs/all-departments' },
    ]);
    setPageTitle('All Departments');
    setButtonList([
      {
        type: 'button',
        text: 'Add New Department',
        onClick: () => { handleAddDepartment() },
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
      { title: 'Staffs', link: '/staffs' },
      { title: 'All Departments', link: '/staffs/all-departments' },
    ]);
    setPageTitle('All Departments');
    setButtonList([
      {
        type: 'button',
        text: 'Add New Department',
        onClick: () => { handleAddDepartment() },
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

    const fetchData = async () => {
      setLoading(true);
      const data = await fetchDepartments();
      // setDepartmentsList(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const dataToUse = searchTerm.trim() === '' ? departmentsList : filteredDepartmentsList;
    const tableData = dataToUse.map((item) => ({
      id: item.id,
      departmentName: item.departmentName,
      numberOfStaff: item.numberOfStaff,
    }));
    setDepartmentsTableData(tableData);
  }, [departmentsList, filteredDepartmentsList, searchTerm]);

  const handleAddDepartment = () => {
    setDialogOpen(true);
    setDialogTitle('Add Department');
    setDialogFormData(departmentFormData);
    setDialogErrors(departmentFormErrors);
    setDialogFormSection(departmentFormSection);
    setDialogSubmitText('Add');
    setDialogOnSubmit(() => handleAddDepartmentSubmit);
  }
  const handleAddDepartmentSubmit = (formData) => {
    console.log("formData to add", formData);
  }

  const handleActionClick = (action, id) => {
    console.log("action", action);
    console.log("id", id);
    const departmentName = departmentsList.find(department => department.id === id).departmentName;
    if (action === 'edit') {
      setDialogOpen(true);
      setDialogTitle('Edit Department');
      setDialogFormData(departmentsList.find(department => department.id === id));
      setDialogErrors(departmentFormErrors);
      setDialogFormSection(departmentFormSection);
      setDialogSubmitText('Update');
      setDialogOnSubmit(() => handleUpdateDepartmentSubmit);
    } else if (action === 'delete') {
      setDeleteDialogOpen(true);
      setDeleteDialogTitle('Delete Department');
      setDeleteDialogDescription(`"${departmentName}" will be deleted permanently. You can't undo this action.`);
      setDeleteDialogHandleSubmit(() => () => handleDeleteDepartmentSubmit(id));
    } else if (action === 'view') {
      navigate(`${id}`, { state: { departmentName: departmentName } });
    }
  }

  const handleDeleteDepartmentSubmit = (id) => {
    console.log("id to delete", id);
  }

  const handleUpdateDepartmentSubmit = (formData) => {
    console.log("formData to update", formData);
  }

  if (loading) {
    return <CommonLoader text="Loading departments..." />
  }

  return (
    <div>

      <CommonTable
        tableData={departmentsTableData}
        headers={departmentHeaders}
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

export default AllDepartments;