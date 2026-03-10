import { useContext, useEffect, useState } from "react";
import { globalContext } from "../../../context/context";
import CommonInput from "../../../Component/common-input";
import CommonTable from "../../../Component/common-table";
import { useNavigate } from "react-router-dom";
import CommonDeleteDialog from "../../../Component/common-delete-dialog";
import CommonLoader from "../../../Component/common-loader";
import CommonAlert from "../../../Component/common-alert";

function AllCompanies() {
  const { setBreadcrumbs, setPageTitle, setButtonList, setSubPageTitle } = useContext(globalContext);

  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const [filteredCompanyData, setFilteredCompanyData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const headers = [
    {
      title: 'Company Name',
      value: 'companyName'
    },
    {
      title: 'POC',
      value: 'poc'
    },
    {
      title: 'Email',
      value: 'email'
    },
    {
      title: 'Phone',
      value: 'phone'
    },
    {
      title: 'Action',
      value: 'action'
    }
  ];

  const [tableData, setTableData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDialogTitle, setDeleteDialogTitle] = useState('');
  const [deleteDialogDescription, setDeleteDialogDescription] = useState('');
  const [deleteDialogHandleSubmit, setDeleteDialogHandleSubmit] = useState(() => { });

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/getcompanies`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      console.log(response)
      const data = await response.json();
      console.log("company data", data);
      if (data.status === 200 && data.company_details) {
        setCompanyData(data?.company_details);
        return data?.company_details;
      }
        return [];
    } catch (error) {
      console.log("error fetching company data", error);
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
      setFilteredCompanyData(companyData);
    } else {
      const filteredData = companyData.filter((item) => {
        return item.companyName.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.poc.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.email.toLowerCase().includes(searchValue.toLowerCase());
      });
      setFilteredCompanyData(filteredData);
    }
  };

  useEffect(() => {
    setBreadcrumbs([
      { title: 'Companies', link: '/companies' },
    ]);
    setPageTitle('All Companies');
    setButtonList([
      {
        type: 'button',
        text: 'Add New Company',
        onClick: () => { navigate('add-company') },
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
  }, [searchTerm, navigate]);

  useEffect(() => {
    const fetchingData = async () => {
      setLoading(true);
      const data = await fetchCompanyData();
      const mappedData = data.map((item, index) => ({
        id: item?.company_id || `company-${index}`,
        companyName: item.company_name,
        poc: item.POC,
        email: item.email,
        phone: item.phone,
        logo: item?.logo || "/avatar-2.svg"
      }));
      setFilteredCompanyData(mappedData);
      setCompanyData(mappedData)
      setLoading(false);
    }
    fetchingData();
  }, []);

  // Map company data to table format
  useEffect(() => {
    const tableData = filteredCompanyData.map((item) => ({
      id: item.id,
      companyName: {
        image: item.logo,
        name: item.companyName,
        id: item.id
      },
      poc: item.poc,
      email: item.email,
      phone: item.phone
    }));
    setTableData(tableData);
  }, [filteredCompanyData]);


  const handleActionClick = (action, id) => {
    console.log("action", action);
    console.log("id", id);
    if (action === 'edit') {
      navigate(`/companies/edit-company/${id}`);
    } else if (action === 'delete') {
      const company = companyData.find(company => company.id === id);
      if (company) {
        const companyName = company.companyName;
        console.log("company name", companyName);
        setDeleteDialogOpen(true);
        setDeleteDialogTitle('Delete Company');
        setDeleteDialogDescription(`Are you sure you want to delete ${companyName}?`);
        setDeleteDialogHandleSubmit(() => () => handleDeleteCompany(id));
      }
    } else if (action === 'view') {
      navigate(`/companies/view-company/${id}`);
    }
  }

  const handleDeleteCompany = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/opronsinglerecord`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          module_name: 'company',
          record_name: id,
          operation_type: 'D',
          user: 'admin',
        }),
      });
      const data = await response.json();
      console.log("company deleted", data);
      if (data.status === 'success' || data.status === 200) {
        const newCompanyData = companyData.filter(company => company.id !== id);
        setCompanyData(newCompanyData);
        setFilteredCompanyData(newCompanyData);
        setDeleteDialogOpen(false);
      }
      else {
        setAlertMsg([data.message]);
        setTimeout(() => {
          setAlertMsg([]);
        }, 3000);
      }
    }
    catch (error) {
      console.log("error deleting company", error);
      setAlertMsg([error.message]);
      setTimeout(() => {
        setAlertMsg([]);
      }, 3000);
    }
  }

  if (loading) {
    return <CommonLoader text="Loading companies..." />
  }

  return (
    <div>
      {alertMsg.length > 0 && <CommonAlert msg={alertMsg} />}
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

export default AllCompanies;