import { useContext, useEffect, useState } from "react";
import { globalContext } from "../../../context/context";
import CommonTable from "../../../Component/common-table";
import CommonLoader from "../../../Component/common-loader";
import CommonDialog from "../../../Component/common-dialog";
import CommonDeleteDialog from "../../../Component/common-delete-dialog";
import { useNavigate } from "react-router-dom";

function AllRoles() {
  const { setBreadcrumbs, setPageTitle, setButtonList, setSubPageTitle } = useContext(globalContext);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // roles list
  const [rolesList, setRolesList] = useState([
    {
      id: 1,
      roleName: 'Admin',
      numberOfStaff: 10,
      userPermissions: [
        { id: 1, value: "Admin" },
        { id: 2, value: "HR" },
      ],
    },
    {
      id: 2,
      roleName: 'HR',
      numberOfStaff: 20,
      userPermissions: [
        { id: 2, value: "HR" },
      ],
    },
    {
      id: 3,
      roleName: 'Marketing',
      numberOfStaff: 30,
      userPermissions: [
        { id: 3, value: "Marketing" },
        { id: 4, value: "Sales" },
      ],
    },
    {
      id: 4,
      roleName: 'Sales',
      numberOfStaff: 40,
      userPermissions: [
        { id: 5, value: "Sales" },
        { id: 6, value: "Finance" },
      ],
    },
    {
      id: 5,
      roleName: 'Finance',
      numberOfStaff: 50,
      userPermissions: [
        { id: 7, value: "Finance" },
      ],
    },
  ]);
  const [filteredRolesList, setFilteredRolesList] = useState([]);


  // table data and headers
  const [rolesTableData, setRolesTableData] = useState([]);
  const roleHeaders = [
    {
      title: 'Role Name',
      value: 'roleName',
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
  const [roleFormData, setRoleFormData] = useState({
    roleName: '',
    userPermissions: [
      { id: 1, value: "" },
    ],
  });
  const [roleFormErrors, setRoleFormErrors] = useState({
    roleName: false,
    userPermissions_0: false,
  });
  const roleFormSection = [
    {
      id: 'role name',
      type: 'fields',
      fields: [
        {
          type: 'text',
          label: 'Role Name',
          name: 'roleName',
          required: true,
          width: 'full',
          placeholder: 'Enter Role Name',
        }
      ]
    },
    {
      id: "userPermissionsSection",
      type: "dynamic selection",
      title: "Permissions",
      dataKey: "userPermissions",
      required: true,
      placeholder: "Select a Module",
      buttonText: "Add Permission",
      buttonBackgroundColor: "#00A1F9",
      buttonTextColor: "#FFFFFF",
      buttonBorderColor: "#00A1F9",
      options: [
        { label: "Admin", value: "Admin" },
        { label: "HR", value: "HR" },
        { label: "Marketing", value: "Marketing" },
        { label: "Sales", value: "Sales" },
        { label: "Finance", value: "Finance" },
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

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/roles`);
      const data = await response.json();
      console.log("roles fetched", data);
      if (data.status === 'success') {
        return data.data;
      } else {
        return [];
      }
    } catch (error) {
      console.log("error fetching roles", error);
      return [];
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);

    if (e.target.value.trim() === '') {
      setFilteredRolesList(rolesList);
    } else {
      setFilteredRolesList(rolesList.filter(role => role.roleName.toLowerCase().startsWith(e.target.value.toLowerCase())));
    }
  }

  useEffect(() => {
    setFilteredRolesList(rolesList);
  }, [rolesList]);

  useEffect(() => {
    setBreadcrumbs([
      { title: 'Staffs', link: '/staffs' },
      { title: 'All Roles', link: '/staffs/all-roles' },
    ]);
    setPageTitle('All Roles');
    setButtonList([
      {
        type: 'button',
        text: 'Add New Role',
        onClick: () => { handleAddRole() },
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
      { title: 'All Roles', link: '/staffs/all-roles' },
    ]);
    setPageTitle('All Roles');
    setButtonList([
      {
        type: 'button',
        text: 'Add New Role',
        onClick: () => { handleAddRole() },
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
      const data = await fetchRoles();
      // setRolesList(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const dataToUse = searchTerm.trim() === '' ? rolesList : filteredRolesList;
    const tableData = dataToUse.map((item) => ({
      id: item.id,
      roleName: item.roleName,
      numberOfStaff: item.numberOfStaff,
    }));
    setRolesTableData(tableData);
  }, [rolesList, filteredRolesList, searchTerm]);

  const handleAddRole = () => {
    setDialogOpen(true);
    setDialogTitle('Add Role');
    setDialogFormData(roleFormData);
    setDialogErrors(roleFormErrors);
    setDialogFormSection(roleFormSection);
    setDialogSubmitText('Add');
    setDialogOnSubmit(() => handleAddRoleSubmit);
  }
  const handleAddRoleSubmit = (formData) => {
    console.log("formData to add", formData);
  }

  const handleActionClick = (action, id) => {
    console.log("action", action);
    console.log("id", id);
    const roleName = rolesList.find(role => role.id === id).roleName;
    if (action === 'edit') {
      setDialogOpen(true);
      setDialogTitle('Edit Role');
      setDialogFormData(rolesList.find(role => role.id === id));
      setDialogErrors(roleFormErrors);
      setDialogFormSection(roleFormSection);
      setDialogSubmitText('Update');
      setDialogOnSubmit(() => handleUpdateRoleSubmit);
    } else if (action === 'delete') {
      setDeleteDialogOpen(true);
      setDeleteDialogTitle('Delete Role');
      setDeleteDialogDescription(`${roleName} will be deleted permanently. You can't undo this action.`);
      setDeleteDialogHandleSubmit(() => () => handleDeleteRoleSubmit(id));
    } else if (action === 'view') {
      navigate(`${id}`, { state: { roleName: roleName } });
    }
  }

  const handleDeleteRoleSubmit = (id) => {
    console.log("id to delete", id);
  }

  const handleUpdateRoleSubmit = (formData) => {
    console.log("formData to update", formData);
  }

  if (loading) {
    return <CommonLoader text="Loading roles..." />
  }

  return (
    <div>

      <CommonTable
        tableData={rolesTableData}
        headers={roleHeaders}
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

export default AllRoles;