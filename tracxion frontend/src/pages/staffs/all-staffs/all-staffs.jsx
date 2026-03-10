import { useContext, useEffect, useState } from "react";
import { globalContext } from "../../../context/context";
import { useNavigate } from "react-router-dom";
import CommonLoader from "../../../Component/common-loader";
import CommonTable from "../../../Component/common-table";
import CommonDeleteDialog from "../../../Component/common-delete-dialog";
import CommonViewDialog from "../../../Component/common-view-dialog";
import CommonAlert from "../../../Component/common-alert";

function AllStaffs() {
  const { setBreadcrumbs, setPageTitle, setButtonList, setSubPageTitle } = useContext(globalContext);
  const navigate = useNavigate();

  const [filteredStaffsList, setFilteredStaffsList] = useState([]);
  const [staffsList, setStaffsList] = useState([]);
  const [alertMsg, setAlertMsg] = useState([]);
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
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getstaffs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      console.log("response", response);
      const data = await response.json();
      console.log("staff data", data);
      if (data.status === 200 && data.staff_details) {
        return data?.staff_details;
      }
        return [];
    } catch (error) {
      console.log("error fetching staff data", error);
      return [];
    } finally {
      setLoading(false);
    }
  }

  // Search functionality
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    if (searchValue.trim() === '') {
      setFilteredStaffsList(staffsList);
    } else {
      const filteredData = staffsList.filter((item) => {
        return item.staffName.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.department.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.email.toLowerCase().includes(searchValue.toLowerCase());
      });
      setFilteredStaffsList(filteredData);
    }
  };


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
  }, [searchTerm, navigate]);

  useEffect(() => {
    const fetchingData = async () => {
      const data = await fetchStaffData();
      const mappedData = data.map((item, index) => {
        // Parse staff_name to extract first and last name
        const nameParts = item.staff_name?.trim().split(' ') || [];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        return {
          id: item?.staff_id || `staff-${index}`,
          firstName: firstName,
          lastName: lastName,
          staffName: item.staff_name,
          department: item.department,
          email: item.email,
          phone: item.phone,
          staffImage: item?.staffImage || '/avatar-2.svg',
          role: item?.role || 'N/A',
        };
      });
      setFilteredStaffsList(mappedData);
      setStaffsList(mappedData);
    }
    fetchingData();
  }, []);

  // Map staff data to table format
  useEffect(() => {
    const tableData = filteredStaffsList.map((item) => ({
      id: item.id,
      staffName: {
        image: item.staffImage,
        name: item.staffName || `${item.firstName} ${item.lastName}`,
        id: item.id
      },
      department: item.department,
      email: item.email,
      phone: item.phone
    }));
    setStaffTableData(tableData);
  }, [filteredStaffsList]);


  const handleActionClick = (action, id) => {
    console.log("action", action);
    console.log("id", id);
    if (action === 'edit') {
      navigate(`edit-staff/${id}`);
    } else if (action === 'delete') {
      const staff = staffsList.find(staff => staff.id === id);
      if (staff) {
        const staffName = staff.staffName || `${staff.firstName} ${staff.lastName}`;
        console.log("staff name", staffName);
        setDeleteDialogOpen(true);
        setDeleteDialogTitle('Delete Staff');
        setDeleteDialogDescription(`Are you sure you want to delete ${staffName}?`);
        setDeleteDialogHandleSubmit(() => () => handleDeleteStaff(id));
      }
    } else if (action === 'view') {
      const staff = staffsList.find(staff => staff.id === id);
      if (staff) {
        const fullName = staff.staffName || `${staff.firstName} ${staff.lastName}`;
        setViewDialogOpen(true);
        setViewDialogTitle(`${fullName} (${staff.id})`);
        setViewDialogContent({
          image: staff.staffImage,
          description: [
            {
              title: 'Staff Name',
              value: fullName,
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
              title: 'Department',
              value: staff.department,
            },
            {
              title: 'Role',
              value: staff.role || 'N/A',
            },
          ]
        });
      }
    }
  }

  const handleDeleteStaff = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/opronsinglerecord`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          module_name: 'staff',
          record_name: id,
          operation_type: 'D',
          user: 'admin',
        }),
      });
      const data = await response.json();
      console.log("staff deleted", data);
      if (data.status === 'success' || data.status === 200) {
        const newStaffsList = staffsList.filter(staff => staff.id !== id);
        setStaffsList(newStaffsList);
        setFilteredStaffsList(newStaffsList);
      }
      else {
        setAlertMsg([data.message]);
        setTimeout(() => {
          setAlertMsg([]);
        }, 3000);
      }
    }
    catch (error) {
      console.log("error deleting staff", error);
      setAlertMsg([error.message]);
      setTimeout(() => {
        setAlertMsg([]);
      }, 3000);
    }
  }

  if (loading) {
    return <CommonLoader text="Loading staffs..." />
  }



  return (
    <div>
      {alertMsg.length > 0 && <CommonAlert msg={alertMsg} />}
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