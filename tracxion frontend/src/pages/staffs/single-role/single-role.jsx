import { useContext, useEffect, useState } from "react";
import { globalContext } from "../../../context/context";
import { useLocation, useParams } from "react-router-dom";
import CommonLoader from "../../../Component/common-loader";
import CommonTable from "../../../Component/common-table";

function SingleRole() {
  const { setBreadcrumbs, setPageTitle, setButtonList, setSubPageTitle } = useContext(globalContext);
  const params = useParams();
  const roleId = params.id;
  const { roleName } = useLocation().state;


  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // staff list for role
  const [staffListForRole, setStaffListForRole] = useState([
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      role: roleName,
      department: 'Department 1',
      staffImage: '/avatar-2.svg',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      phone: '1234567890',
      role: roleName,
      department: 'Department 2',
      staffImage: '/avatar-2.svg',
    },
    {
      id: 3,
      firstName: 'Jim',
      lastName: 'Beam',
      email: 'jim.beam@example.com',
      phone: '1234567890',
      role: roleName,
      department: 'Department 3',
      staffImage: '/avatar-2.svg',
    },
    {
      id: 4,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      role: roleName,
      department: 'Department 4',
      staffImage: '/avatar-2.svg',
    },
  ]);
  const [filteredStaffListForRole, setFilteredStaffListForRole] = useState([]);


  // table data and headers
  const [tableData, setTableData] = useState([]);
  const tableHeaders = [
    {
      title: 'Staff Name',
      value: 'staffName',
    },
    {
      title: 'Email',
      value: 'email',
    },
    {
      title: 'Phone',
      value: 'phone',
    }
  ];

  const fetchStaffListForRole = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/staffs/role/${roleId}`);
      const data = await response.json();
      console.log("staff list for role fetched", data);
      if (data.status === 'success') {
        return data.data;
      } else {
        return [];
      }
    } catch (error) {
      console.log("error fetching staff list for role", error);
      return [];
    }
  }

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    if (searchValue.trim() === '') {
      setFilteredStaffListForRole(staffListForRole);
    } else {
      const filtered = staffListForRole.filter(staff => {
        const fullName = `${staff.firstName} ${staff.lastName}`.toLowerCase();
        const searchLower = e.target.value.toLowerCase();
        return fullName.startsWith(searchLower);
      });
      setFilteredStaffListForRole(filtered);
    }
  }


  useEffect(() => {
    setPageTitle(roleName);
    setBreadcrumbs([
      { title: 'Staffs', link: '/staffs' },
      { title: 'All Roles', link: '/staffs/all-roles' },
      { title: roleName, link: `/staffs/all-roles/${roleId}`, state: { roleName: roleName } },
    ]);
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
  }, [roleId, roleName, searchTerm]);

  useEffect(() => {
    const dataToUse = searchTerm.trim() === '' ? staffListForRole : filteredStaffListForRole;
    const tableData = dataToUse.map((item) => ({
      id: item.id,
      staffName: {
        name: `${item.firstName} ${item.lastName}`,
        id: item.id,
        image: item.staffImage,
      },
      email: item.email,
      phone: item.phone,
    }));
    setTableData(tableData);
  }, [staffListForRole, filteredStaffListForRole, searchTerm]);

  useEffect(() => {
    setFilteredStaffListForRole(staffListForRole);
  }, [staffListForRole]);

  useEffect(() => {
    setBreadcrumbs([
      { title: 'Staffs', link: '/staffs' },
      { title: 'All Roles', link: '/staffs/all-roles' },
      { title: roleName, link: `/staffs/all-roles/${roleId}`, state: { roleName: roleName } },
    ]);
    setPageTitle(roleName);
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
    const fetchData = async () => {
      setLoading(true);
      const data = await fetchStaffListForRole();
      // setStaffListForRole(data);
      setLoading(false);
    }
    fetchData();
  }, [roleId, roleName]);


  if (loading) {
    return <CommonLoader text="Loading staff list for role..." />
  }

  return (
    <div>
      <CommonTable
        tableData={tableData}
        headers={tableHeaders}
      />
    </div>
  );
}

export default SingleRole;