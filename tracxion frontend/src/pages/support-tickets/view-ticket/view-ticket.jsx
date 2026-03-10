import { useContext, useEffect, useState } from "react";
import { globalContext } from "../../../context/context";
import './view-ticket.css';
import { useNavigate, useParams } from "react-router-dom";
import CommonLoader from "../../../Component/common-loader";
import CommonDialog from "../../../Component/common-dialog";
import CommonButton from "../../../Component/common-button";
function ViewTicket() {
  const { setPageTitle, setBreadcrumbs, setButtonList, setSubPageTitle } = useContext(globalContext);
  const params = useParams();
  const ticketId = params.id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);


  // support ticket data
  const [supportTicketData, setSupportTicketData] = useState({
    id: 1,
    company: "Company 1",
    userName: "John Doe",
    date: "2021-01-01",
    time: "10:00:00",
    status: "Open",
    staff: 1,
    subject: "Subject 1",
    description: "Description 1",
  });

  // staff data
  const [staffList, setStaffList] = useState([
    {
      value: 1,
      label: "Staff 1",
    },
    {
      value: 2,
      label: "Staff 2",
    },
    {
      value: 3,
      label: "Staff 3",
    }
  ]);

  // assign variables
  const [assignFormData, setAssignFormData] = useState({
    staff: "",
  });
  const [assignFormErrors, setAssignFormErrors] = useState({
    staff: false,
  });
  const [assignFormSections, setAssignFormSections] = useState([
    {
      id: 'assign-staff',
      type: 'fields',
      fields: [
        {
          type: 'select',
          label: 'Staff',
          options: staffList,
          name: 'staff',
          required: true,
          width: 'full',
          placeholder: 'Select Staff',
        }
      ]
    }
  ]);


  // change status variables
  const [changeStatusFormData, setChangeStatusFormData] = useState({
    status: "",
  });
  const [changeStatusFormErrors, setChangeStatusFormErrors] = useState({
    status: false,
  });
  const [changeStatusFormSections, setChangeStatusFormSections] = useState([
    {
      id: 'change-status',
      type: 'fields',
      fields: [
        {
          type: 'select',
          label: 'Status',
          options: [
            {
              value: 'Open',
              label: 'Open',
            },
            {
              value: 'Closed',
              label: 'Closed',
            },
          ],
          name: 'status',
          required: true,
          width: 'full',
          placeholder: 'Select Status',
        }
      ]
    }
  ]);

  // dialog variables
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogFormData, setDialogFormData] = useState({});
  const [dialogErrors, setDialogErrors] = useState({});
  const [dialogFormSection, setDialogFormSection] = useState([]);
  const [dialogSubmitText, setDialogSubmitText] = useState('');
  const [dialogOnSubmit, setDialogOnSubmit] = useState(() => { });

  const fetchSupportTicketData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/support-tickets/${ticketId}`);
      const data = await response.json();
      console.log("data in fetchSupportTicketData", data);
      if (data.status === "success") {
        return data.data;
      } else {
        console.log("error in fetchSupportTicketData", data.message);
        return {};
      }
    } catch (error) {
      console.log("error in fetchSupportTicketData", error);
      return {};
    }
  }


  const handleAssignStaff = () => {
    setDialogOpen(true);
    setDialogTitle("Assign Staff");
    setDialogFormData({
      staff: supportTicketData.staff,
    });
    setDialogErrors(assignFormErrors);
    setDialogFormSection(assignFormSections);
    setDialogSubmitText("Assign Staff");
    setDialogOnSubmit(() => handleAssignStaffSubmit);
  }

  const handleChangeStatus = () => {
    setDialogOpen(true);
    setDialogTitle("Change Status");
    setDialogFormData({
      status: supportTicketData.status,
    });
    setDialogErrors(changeStatusFormErrors);
    setDialogFormSection(changeStatusFormSections);
    setDialogSubmitText("Change Status");
    setDialogOnSubmit(() => handleChangeStatusSubmit);
  }

  const handleAssignStaffSubmit = (formData) => {
    console.log("handleAssignStaffSubmit", formData);
  }

  const handleChangeStatusSubmit = (formData) => {
    console.log("handleChangeStatusSubmit", formData);
  }

  useEffect(() => {
    setPageTitle(`Ticket #${ticketId}`);
    setBreadcrumbs([
      { title: "Support Tickets", link: "/support-tickets" },
      { title: `Ticket #${ticketId}`, link: `/support-tickets/view-ticket/${ticketId}` }
    ]);
    setButtonList([
      {
        type: 'button',
        text: 'Assign Staff',
        onClick: () => { handleAssignStaff() },
        backgroundColor: 'transparent',
        textColor: '#00A1F9',
        borderColor: '#00A1F9'
      },
      {
        type: 'button',
        text: 'Change Status',
        onClick: () => { handleChangeStatus() },
        backgroundColor: '#00A1F9',
        textColor: 'white',
        borderColor: '#00A1F9'
      },
    ])

    const fetching = async () => {
      setLoading(true);
      // const data = await fetchSupportTicketData();
      // setSupportTicketData(data);
      setLoading(false);
    }
    fetching();

  }, [ticketId]);

  useEffect(() => {
    setSubPageTitle({
      text: `${supportTicketData.status}`,
      className: `view-ticket-sub-page-title ${supportTicketData.status === 'Open' ? 'open' : 'closed'}`,
    });
  }, [supportTicketData]);




  if (loading) {
    return <CommonLoader text="Loading Support Ticket Data" />
  }
  return (
    <div>

      <div className="view-ticket-container">
        <div className="view-ticket-header">
          <h2>Company Name: <span>{supportTicketData.company}</span></h2>
          <CommonButton
            text="Download Attachments"
            onClick={() => { }}
            backgroundColor="transparent"
            textColor="#00A1F9"
            borderColor="#00A1F9"
          />
        </div>
        <div className="view-ticket-details">
          <p>User: <span>{supportTicketData.userName}</span></p>
          <p>Date: <span>{supportTicketData.date}</span></p>
          <p>Time: <span>{supportTicketData.time}</span></p>
          <p>Subject: <span>{supportTicketData.subject}</span></p>
          <p>Description:</p>
          <p><span>{supportTicketData.description}</span></p>
        </div>

      </div>

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
    </div>
  );
}

export default ViewTicket;