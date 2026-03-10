import { useContext, useEffect, useState } from "react";
import { globalContext } from "../../../context/context";
import { useLocation, useParams } from "react-router-dom";
import CommonTable from "../../../Component/common-table";
import CommonLoader from "../../../Component/common-loader";

function CompanyStaffs() {
  const { setBreadcrumbs, setPageTitle, setButtonList, setSubPageTitle } = useContext(globalContext);
  const params = useParams();
  const companyId = params.id;
  const { companyName } = useLocation().state;

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStaffList, setFilteredStaffList] = useState([]);

  const [staffList, setStaffList] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      department: 'IT',
      image: '/avatar-2.svg'
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '1234567890',
      department: 'HR',
      image: '/avatar-2.svg'
    },
    {
      id: 3,
      name: 'Jim Beam',
      email: 'jim.beam@example.com',
      phone: '1234567890',
      department: 'Sales',
      image: '/avatar-2.svg'
    },
    {
      id: 4,
      name: 'Jill Smith',
      email: 'jill.smith@example.com',
      phone: '1234567890',
      department: 'Marketing',
      image: '/avatar-2.svg'
    },
  ]);

  const staffHeaders = [
    {
      title: 'Staff Name',
      value: 'staffName'
    },
    {
      title: 'Department',
      value: 'department'
    },
    {
      title: 'Email',
      value: 'email'
    },
    {
      title: 'Phone',
      value: 'phone'
    }
  ];

  const [staffTableData, setStaffTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    if (searchValue.trim() === '') {
      setFilteredStaffList(staffList);
    } else {
      const filtered = staffList.filter(staff =>
        staff.name.toLowerCase().startsWith(searchValue.toLowerCase())
      );
      setFilteredStaffList(filtered);
    }
  };

  const fetchStaffList = async (companyId) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/staffs`);
    const data = await response.json();
    console.log("staff list", data);
    if (data.status === 200) {
      return data.data;
    } else {
      return [];
    }
  };

  useEffect(() => {
    setBreadcrumbs([
      { title: 'Companies', link: '/companies' },
      { title: `${companyName}`, link: `/companies/view-company/${companyId}` },
      { title: 'Staffs', link: `/companies/view-company/${companyId}/staffs` }
    ]);
    setPageTitle(`Staffs`);
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
    // const fetchingData = async () => {
    //   setLoading(true);
    //   const staffList = await fetchStaffList(companyId);
    //   setStaffList(staffList);
    //   setLoading(false);
    // }
    // fetchingData();

  }, [companyId])

  useEffect(() => {
    setBreadcrumbs([
      { title: 'Companies', link: '/companies' },
      { title: `${companyName}`, link: `/companies/view-company/${companyId}` },
      { title: 'Staffs', link: `/companies/view-company/${companyId}/staffs` }
    ]);
    setPageTitle(`Staffs`);
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
  }, [companyId, searchTerm]);

  useEffect(() => {
    setFilteredStaffList(staffList);
  }, [staffList]);

  useEffect(() => {
    const dataToUse = searchTerm.trim() === '' ? staffList : filteredStaffList;
    const tableData = dataToUse.map((item) => ({
      id: item.id,
      staffName: {
        image: item.image,
        name: item.name,
        id: item.id
      },
      department: item.department,
      email: item.email,
      phone: item.phone
    }));
    setStaffTableData(tableData);
  }, [staffList, filteredStaffList, searchTerm]);


  if (loading) {
    return <CommonLoader text="Loading staff list..." />;
  }
  return (
    <div>
      <CommonTable
        tableData={staffTableData}
        headers={staffHeaders}
      />

    </div>
  );
}

export default CompanyStaffs;