import { useContext, useEffect, useState } from "react";
import { globalContext } from "../../../context/context";
import { useNavigate } from "react-router-dom";
import CommonLoader from "../../../Component/common-loader";
import CommonTable from "../../../Component/common-table";
import CommonDeleteDialog from "../../../Component/common-delete-dialog";
import CommonViewDialog from "../../../Component/common-view-dialog";

function AllStaffs() {
  const { setBreadcrumbs, setPageTitle, setButtonList, setSubPageTitle } = useContext(globalContext);
  const navigate = useNavigate();

  const [staffsList, setStaffsList] = useState([
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      role: 'Admin',
      department: 'IT',
      staffImage: '/demo-image.svg',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '0987654321',
      role: 'User',
      department: 'HR',
      staffImage: '/avatar-2.svg',
    },
    {
      id: 3,
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@example.com',
      phone: '1112223333',
      role: 'Admin',
      department: 'IT',
      staffImage: '/avatar-2.svg',
    },
    {
      id: 4,
      firstName: 'Emily',
      lastName: 'Brown',
      email: 'emily.brown@example.com',
      phone: '4445556666',
      role: 'User',
      department: 'HR',
      staffImage: '/avatar-2.svg',
    },
    {
      id: 5,
      firstName: 'David',
      lastName: 'Wilson',
      email: 'david.wilson@example.com',
      phone: '5556667777',
      role: 'Admin',
      department: 'IT',
      staffImage: '/avatar-2.svg',
    },
    {
      id: 6,
      firstName: 'Olivia',
      lastName: 'Taylor',
      email: 'olivia.taylor@example.com',
      phone: '6667778888',
      role: 'User',
      department: 'HR',
      staffImage: '/avatar-2.svg',
    }
  ]);

  const staffsHeaders = [
    {
      title: 'Staff Name',
      value: 'staffName',
    },
    {
      title: 'Department',
      value: 'department',
    },
    {
      title: 'Email',
      value: 'email',
    },
    {
      title: 'Phone',
      value: 'phone',
    },
    {
      title: 'Actions',
      value: 'action',
    }
  ]

  const [staffTableData, setStaffTableData] = useState([]);
  const [filteredStaffData, setFilteredStaffData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDialogTitle, setDeleteDialogTitle] = useState('');
  const [deleteDialogDescription, setDeleteDialogDescription] = useState('');
  const [deleteDialogHandleSubmit, setDeleteDialogHandleSubmit] = useState(() => { });


  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewDialogTitle, setViewDialogTitle] = useState('');
  const [viewDialogContent, setViewDialogContent] = useState({});

  const fetchStaffData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/staffs`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('tracxion admin token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      const data = await response.json();
      console.log("staff data", data);
      if (data.status === 'success') {
        return data.data;
      } else {
        return [];
      }
    } catch (error) {
      console.log("error fetching staff data", error);
    }
  }

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    if (searchValue.trim() === '') {
      setFilteredStaffData(staffsList);
    } else {
      const filtered = staffsList.filter(staff => {
        const fullName = `${staff.firstName} ${staff.lastName}`.toLowerCase();
        const email = staff.email.toLowerCase();
        const department = staff.department.toLowerCase();
        const phone = staff.phone.toLowerCase();
        const searchLower = searchValue.toLowerCase();

        return fullName.startsWith(searchLower) ||
          email.startsWith(searchLower) ||
          department.startsWith(searchLower) ||
          phone.startsWith(searchLower);
      });
      setFilteredStaffData(filtered);
    }
  };


  useEffect(() => {
    setBreadcrumbs([
      { title: 'Staffs', link: '/staffs' },
    ]);
    setPageTitle('Staffs');
    setButtonList([
      {
        type: 'button',
        text: 'Add New Staff',
        onClick: () => { navigate('add-staff') },
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
      {
        type: 'dropdown',
        dropdownItems: [
          {
            text: 'Roles',
            onClick: () => { navigate('all-roles') },
          },
          {
            text: 'Departments',
            onClick: () => { navigate('all-departments') },
          }
        ],
      }
    ]);
    setSubPageTitle({});
  }, [searchTerm, navigate]);


  useEffect(() => {
    setBreadcrumbs([
      { title: 'Staffs', link: '/staffs' },
    ]);
    setPageTitle('All Staffs');
    setButtonList([
      {
        type: 'button',
        text: 'Add New Staff',
        onClick: () => { navigate('add-staff') },
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
      {
        type: 'dropdown',
        dropdownItems: [
          {
            text: 'Roles',
            onClick: () => { navigate('all-roles') },
          },
          {
            text: 'Departments',
            onClick: () => { navigate('all-departments') },
          }
        ],
      }
    ]);
    setSubPageTitle({});
    // const fetchingData = async () => {
    //   setLoading(true);
    //   const data = await fetchStaffData();
    //   setStaffsList(data);
    //   setLoading(false);
    // }
    // fetchingData();
  }, []);

  useEffect(() => {
    setFilteredStaffData(staffsList);
  }, [staffsList]);

  useEffect(() => {
    const dataToUse = searchTerm.trim() === '' ? staffsList : filteredStaffData;
    const tableData = dataToUse.map((item) => ({
      id: item.id,
      staffName: {
        image: item.staffImage,
        name: item.firstName + ' ' + item.lastName,
        id: item.id
      },
      department: item.department,
      email: item.email,
      phone: item.phone
    }));
    setStaffTableData(tableData);
  }, [staffsList, filteredStaffData, searchTerm]);


  const handleActionClick = (action, id) => {
    console.log("action", action);
    console.log("id", id);
    if (action === 'edit') {
      navigate(`edit-staff/${id}`);
    } else if (action === 'delete') {
      const staffName = staffsList.find(staff => staff.id === id).firstName + ' ' + staffsList.find(staff => staff.id === id).lastName;
      console.log("staff name", staffName);
      setDeleteDialogOpen(true);
      setDeleteDialogTitle('Delete Staff');
      setDeleteDialogDescription(`${staffName} will be deleted permanently. You can't undo this action.`);
      setDeleteDialogHandleSubmit(() => () => handleDeleteStaff(id));
    } else if (action === 'view') {
      const staff = staffsList.find(staff => staff.id === id);
      setViewDialogOpen(true);
      setViewDialogTitle(staff.firstName + ' ' + staff.lastName + '(' + staff.id + ')');
      setViewDialogContent({
        image: staff.staffImage,
        description: [
          {
            title: 'First Name',
            value: staff.firstName,
          },
          {
            title: 'Last Name',
            value: staff.lastName,
          },
          {
            title: 'Email',
            value: staff.email,
          },
          {
            title: 'Phone',
            value: staff.phone,
          },
          {
            title: 'Role',
            value: staff.role,
          },
          {
            title: 'Department',
            value: staff.department,
          },
        ]
      });
    }
  }

  const handleDeleteStaff = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/staffs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('tracxion admin token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      const data = await response.json();
      console.log("staff deleted", data);
      if (data.status === 'success') {
        setDeleteDialogOpen(false);
        setStaffsList(prevData => prevData.filter(staff => staff.id !== id));
      }
    }
    catch (error) {
      console.log("error deleting staff", error);
    }
  }

  if (loading) {
    return <CommonLoader text="Loading staffs..." />
  }



  return (
    <div>
      <CommonTable
        tableData={staffTableData}
        headers={staffsHeaders}
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

      <CommonViewDialog
        open={viewDialogOpen}
        setOpen={setViewDialogOpen}
        title={viewDialogTitle}
        content={viewDialogContent}
      />
    </div>
  );
}

export default AllStaffs;