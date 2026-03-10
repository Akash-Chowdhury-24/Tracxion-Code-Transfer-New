import { useContext, useEffect, useState } from "react";
import { globalContext } from "../../../context/context";
import CommonTable from "../../../Component/common-table";
import { useNavigate } from "react-router-dom";
import CommonLoader from "../../../Component/common-loader";
import CommonDeleteDialog from "../../../Component/common-delete-dialog";
import CommonDialog from "../../../Component/common-dialog";
import CommonAlert from "../../../Component/common-alert";

function AllAnnouncements() {
  const { setBreadcrumbs, setPageTitle, setButtonList, setSubPageTitle } = useContext(globalContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [alertMsg, setAlertMsg] = useState([]);


  // announcement list
  const [announcementList, setAnnouncementList] = useState([
    {
      id: 1,
      announcementName: 'Announcement 1',
      announcementDescription: 'Announcement 1 Description',
      announcementType: 'All Companies',
    },
    {
      id: 2,
      announcementName: 'Announcement 2',
      announcementDescription: 'Announcement 2 Description',
      announcementType: 'Selective Companies',
      announcementCompanies: ['Company 1', 'Company 2'],
    },
    {
      id: 3,
      announcementName: 'Announcement 3',
      announcementDescription: 'Announcement 3 Description',
      announcementType: 'All Tracxion Staffs',
    },
    {
      id: 4,
      announcementName: 'Announcement 4',
      announcementDescription: 'Announcement 4 Description',
      announcementType: 'Selective Tracxion Staffs',
      announcementStaffs: ['Staff 1', 'Staff 2'],
    },
    {
      id: 5,
      announcementName: 'Announcement 5',
      announcementDescription: 'Announcement 5 Description',
      announcementType: 'Selective Tracxion Departments',
      announcementDepartments: ['Department 1', 'Department 2'],
    },
    {
      id: 6,
      announcementName: 'Announcement 6',
      announcementDescription: 'Announcement 6 Description',
      announcementType: 'All Tracxion Departments',
    },
  ]);
  const [filteredAnnouncementList, setFilteredAnnouncementList] = useState([]);


  // announcement table
  const announcementHeaders = [
    {
      title: 'Announcement Name',
      value: 'announcementName',
    },
    {
      title: 'Announcement Description',
      value: 'announcementDescription',
    },
    {
      title: 'Actions',
      value: 'action',
    }
  ]
  const [announcementTableData, setAnnouncementTableData] = useState([]);
  const announcementActions = [
    {
      label: 'Edit',
      action: 'edit',
    },
    {
      label: 'Delete',
      action: 'delete',
    },
  ]

  // add and edit
  const [announcementFormData, setAnnouncementFormData] = useState({
    announcementName: '',
    announcementDescription: '',
    announcementType: '',
    announcementCompanies: [],
    announcementStaffs: [],
    announcementDepartments: [],
  });
  const [announcementErrors, setAnnouncementErrors] = useState({
    announcementName: false,
    announcementDescription: '',
    announcementType: false,
    announcementCompanies: false,
    announcementStaffs: false,
    announcementDepartments: false,
  });
  const announcementFormSections = [
    {
      id: "announcementName",
      type: "fields",
      fields: [
        {
          type: "text",
          label: "Announcement Name",
          placeholder: "Enter Announcement Name",
          name: "announcementName",
          required: true,
          width: "full",
        }
      ]
    },
    {
      id: "announcementType",
      type: "conditional",
      primaryField: {
        type: "select",
        name: "announcementType",
        label: "Announcement Type",
        required: true,
        options: [
          { label: "All Companies", value: "All Companies" },
          { label: "Selective Companies", value: "Selective Companies" },
          { label: "All Tracxion Staffs", value: "All Tracxion Staffs" },
          { label: "Selective Tracxion Staffs", value: "Selective Tracxion Staffs" },
          { label: "All Tracxion Departments", value: "All Tracxion Departments" },
          { label: "Selective Tracxion Departments", value: "Selective Tracxion Departments" },
        ],
      },
      conditions: [
        {
          when: "Selective Companies",
          fields: [
            {
              type: "select",
              name: "announcementCompanies",
              label: "Announcement Companies",
              required: true,
              options: [
                { label: "Company 1", value: "Company 1" },
                { label: "Company 2", value: "Company 2" },
              ],
              width: "full",
              multiselect: true,
            }
          ]
        },
        {
          when: "Selective Tracxion Staffs",
          fields: [
            {
              type: "select",
              name: "announcementStaffs",
              label: "Announcement Staffs",
              required: true,
              options: [
                { label: "Staff 1", value: "Staff 1" },
                { label: "Staff 2", value: "Staff 2" },
              ],
              width: "full",
              multiselect: true,
            }
          ]
        },
        {
          when: "Selective Tracxion Departments",
          fields: [
            {
              type: "select",
              name: "announcementDepartments",
              label: "Announcement Departments",
              required: true,
              options: [
                { label: "Department 1", value: "Department 1" },
                { label: "Department 2", value: "Department 2" },
              ],
              width: "full",
              multiselect: true,
            }
          ]
        }
      ],
    },
    {
      id: "announcementDescription",
      type: "fields",
      fields: [
        {
          type: "text",
          label: "Announcement Description",
          placeholder: "Enter Announcement Description",
          name: "announcementDescription",
          required: true,
          width: "full",
          multiline: true,
          row: 4,
        }
      ]
    }
  ]

  // add and edit dialog 
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogFormData, setDialogFormData] = useState({});
  const [dialogErrors, setDialogErrors] = useState({});
  const [dialogFormSection, setDialogFormSection] = useState([]);
  const [dialogSubmitText, setDialogSubmitText] = useState('');
  const [dialogOnSubmit, setDialogOnSubmit] = useState(() => { });


  // delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDialogTitle, setDeleteDialogTitle] = useState('');
  const [deleteDialogDescription, setDeleteDialogDescription] = useState('');
  const [deleteDialogHandleSubmit, setDeleteDialogHandleSubmit] = useState(() => { });


  const fetchAnnouncementData = async () => {
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
      console.log("announcement data", data);
      if (data.status === 'success') {
        return data.data;
      } else {
        return [];
      }
    } catch (error) {
      console.log("error fetching announcement data", error);
    }
  }

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    if (searchValue.trim() === '') {
      setFilteredAnnouncementList(announcementList);
    } else {
      const filtered = announcementList.filter(announcement => {
        const announcementName = announcement.announcementName.toLowerCase();
        const searchLower = searchValue.toLowerCase();

        return announcementName.startsWith(searchLower)
      });
      setFilteredAnnouncementList(filtered);
    }
  };


  useEffect(() => {
    setBreadcrumbs([
      { title: 'All Announcements', link: '/announcements' }
    ]);
    setPageTitle('Announcements');
    setButtonList([
      {
        type: 'button',
        text: 'Add New Announcement',
        onClick: () => { handleAddAnnouncement() },
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
  }, [searchTerm, navigate]);

  useEffect(() => {
    setBreadcrumbs([
      { title: 'All Announcements', link: '/announcements' }
    ]);
    setPageTitle('Announcements');
    setButtonList([
      {
        type: 'button',
        text: 'Add New Announcement',
        onClick: () => { handleAddAnnouncement() },
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
    const fetchingData = async () => {
      setLoading(true);
      //   const data = await fetchAnnouncementData();
      //   setAnnouncementList(data);
      setLoading(false);
    }
    fetchingData();
  }, []);

  useEffect(() => {
    setFilteredAnnouncementList(announcementList);
  }, [announcementList]);

  useEffect(() => {
    const dataToUse = searchTerm.trim() === '' ? announcementList : filteredAnnouncementList;
    const tableData = dataToUse.map((item) => ({
      id: item.id,
      announcementName: item.announcementName,
      announcementDescription: item.announcementDescription,
    }));
    setAnnouncementTableData(tableData);
  }, [announcementList, filteredAnnouncementList, searchTerm]);


  const handleAddAnnouncement = () => {
    setDialogOpen(true);
    setDialogTitle('Add Announcement');
    setDialogFormData(announcementFormData);
    setDialogErrors(announcementErrors);
    setDialogFormSection(announcementFormSections);
    setDialogSubmitText('Add');
    setDialogOnSubmit(() => handleAddAnnouncementSubmit);
  }

  const handleAddAnnouncementSubmit = async (formData) => {
    console.log("announcement form data to add", formData);
    // Map UI type to API keys
    const mapType = (announcementType) => {
      switch (announcementType) {
        case 'All Companies':
          return { type: 'A', categoryKey: 'A', values: [''] };
        case 'Selective Companies':
          return { type: 'C', categoryKey: 'C', values: formData.announcementCompanies || [] };
        case 'All Tracxion Staffs':
          return { type: 'T', categoryKey: 'T', values: [''] };
        case 'Selective Tracxion Staffs':
          return { type: 'D', categoryKey: 'D', values: formData.announcementStaffs || [] };
        case 'All Tracxion Departments':
          // No explicit key provided for "All Departments"; using 'S' family consistently
          return { type: 'S', categoryKey: 'S', values: [''] };
        case 'Selective Tracxion Departments':
          return { type: 'S', categoryKey: 'S', values: formData.announcementDepartments || [] };
        default:
          return { type: '', categoryKey: '', values: [''] };
      }
    };
    const { type, categoryKey, values } = mapType(formData.announcementType);
    const user = JSON.parse(localStorage.getItem('tracxion user'));
    console.log("user", user);
    console.log("sending data", {
      name: formData.announcementName,
      type: type,
      category: {
        key: categoryKey,
        values: values.length > 0 ? values : [''],
      },
      desc: formData.announcementDescription,
      created_by: user.role,
    });
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/newassignment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.announcementName,
          type: type,
          category: {
            key: categoryKey,
            values: values.length > 0 ? values : [''],
          },
          desc: formData.announcementDescription,
          created_by: user.role,
        }),
      });
      const data = await response.json();
      console.log("announcement added", data);
      if (data.status === 200) {
        // window.location.reload();
      } else {
        setAlertMsg([data.message]);
        setTimeout(() => {
          setAlertMsg([]);
        }, 3000);
      }
    } catch (error) {
      console.log("error adding announcement", error);
      setAlertMsg([error.message]);
      setTimeout(() => {
        setAlertMsg([]);
      }, 3000);
    }
  }



  const handleActionClick = (action, id) => {
    console.log("action", action);
    console.log("id", id);
    if (action === 'delete') {
      const announcementName = announcementList.find(announcement => announcement.id === id).announcementName;
      console.log("announcement name", announcementName);
      setDeleteDialogOpen(true);
      setDeleteDialogTitle('Delete Announcement');
      setDeleteDialogDescription(`Are you sure you want to delete ${announcementName}?`);
      setDeleteDialogHandleSubmit(() => () => handleDeleteAnnouncement(id));
    } else if (action === 'edit') {
      const announcement = announcementList.find(announcement => announcement.id === id);
      console.log("announcement", announcement);
      setDialogOpen(true);
      setDialogTitle('Edit Announcement');
      setDialogFormData(announcement);
      setDialogErrors(announcementErrors);
      setDialogFormSection(announcementFormSections);
      setDialogSubmitText('Update');
      setDialogOnSubmit(() => handleUpdateAnnouncementSubmit);
    }
  }
  const handleUpdateAnnouncementSubmit = (formData) => {
    console.log("announcement form data to update", formData);
  }

  const handleDeleteAnnouncement = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/announcements/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('tracxion admin token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      const data = await response.json();
      console.log("announcement deleted", data);
      if (data.status === 'success') {
        setDeleteDialogOpen(false);
        setAnnouncementList(prevData => prevData.filter(announcement => announcement.id !== id));
      }
    }
    catch (error) {
      console.log("error deleting announcement", error);
    }
  }

  if (loading) {
    return <CommonLoader text="Loading announcements..." />
  }

  return (
    <div>
      {alertMsg.length > 0 && <CommonAlert msg={alertMsg} />}
      <CommonTable
        tableData={announcementTableData}
        headers={announcementHeaders}
        actionButtons={announcementActions}
        specificReturn="id"
        handleActionClick={handleActionClick}
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

export default AllAnnouncements;