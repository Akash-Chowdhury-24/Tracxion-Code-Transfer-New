import { useContext, useEffect, useState } from "react";
import { globalContext } from "../../../context/context";
import { useLocation, useParams } from "react-router-dom";
import CommonLoader from "../../../Component/common-loader";
import CommonTable from "../../../Component/common-table";

function SingleDepartment() {

  const { setBreadcrumbs, setPageTitle, setButtonList, setSubPageTitle } = useContext(globalContext);
  const params = useParams();
  const departmentId = params.id;
  const { departmentName } = useLocation().state;


  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // staff list for department
  const [staffListForDepartment, setStaffListForDepartment] = useState([
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      role: 'Admin',
      department: departmentName,
      staffImage: '/avatar-2.svg',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      phone: '1234567890',
      role: 'Admin',
      department: departmentName,
      staffImage: '/avatar-2.svg',
    },
    {
      id: 3,
      firstName: 'Jim',
      lastName: 'Beam',
      email: 'jim.beam@example.com',
      phone: '1234567890',
      role: 'Admin',
      department: departmentName,
      staffImage: '/avatar-2.svg',
    },
    {
      id: 4,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      role: 'Admin',
      department: departmentName,
      staffImage: '/avatar-2.svg',
    },
  ]);
  const [filteredStaffListForDepartment, setFilteredStaffListForDepartment] = useState([]);


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

  const fetchStaffListForDepartment = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/staffs/department/${departmentId}`);
      const data = await response.json();
      console.log("staff list for department fetched", data);
      if (data.status === 'success') {
        return data.data;
      } else {
        return [];
      }
    } catch (error) {
      console.log("error fetching staff list for department", error);
      return [];
    }
  }

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    if (searchValue.trim() === '') {
      setFilteredStaffListForDepartment(staffListForDepartment);
    } else {
      const filtered = staffListForDepartment.filter(staff => {
        const fullName = `${staff.firstName} ${staff.lastName}`.toLowerCase();
        const searchLower = e.target.value.toLowerCase();
        return fullName.startsWith(searchLower);
      });
      setFilteredStaffListForDepartment(filtered);
    }
  }


  useEffect(() => {
    setPageTitle(departmentName);
    setBreadcrumbs([
      { title: 'Staffs', link: '/staffs' },
      { title: 'All Departments', link: '/staffs/all-departments' },
      { title: departmentName, link: `/staffs/all-departments/${departmentId}`, state: { departmentName: departmentName } },
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
  }, [departmentId, departmentName, searchTerm]);

  useEffect(() => {
    const dataToUse = searchTerm.trim() === '' ? staffListForDepartment : filteredStaffListForDepartment;
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
  }, [staffListForDepartment, filteredStaffListForDepartment, searchTerm]);

  useEffect(() => {
    setFilteredStaffListForDepartment(staffListForDepartment);
  }, [staffListForDepartment]);

  useEffect(() => {
    setBreadcrumbs([
      { title: 'Staffs', link: '/staffs' },
      { title: 'All Departments', link: '/staffs/all-departments' },
      { title: departmentName, link: `/staffs/all-departments/${departmentId}`, state: { departmentName: departmentName } },
    ]);
    setPageTitle(departmentName);
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
      const data = await fetchStaffListForDepartment();
      // setStaffListForDepartment(data);
      setLoading(false);
    }
    fetchData();
  }, [departmentId, departmentName]);


  if (loading) {
    return <CommonLoader text="Loading staff list for department..." />
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

export default SingleDepartment;