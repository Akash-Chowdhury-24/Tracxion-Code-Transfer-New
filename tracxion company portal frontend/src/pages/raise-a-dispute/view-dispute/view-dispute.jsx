import { useContext, useEffect, useState } from "react";
import { globalContext } from "../../../context/context";
import './view-dispute.css';
import { useNavigate, useParams } from "react-router-dom";
import CommonLoader from "../../../Component/common-loader";
import CommonDialog from "../../../Component/common-dialog";
import CommonButton from "../../../Component/common-button";
import CommonDeleteDialog from "../../../Component/common-delete-dialog";
function ViewDispute() {
  const { setPageTitle, setBreadcrumbs, setButtonList, setSubPageTitle } = useContext(globalContext);
  const params = useParams();
  const ticketId = params.id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);


  // support ticket data
  const [ticketData, setTicketData] = useState({
    id: 1,
    date: "2021-01-01",
    time: "10:00:00",
    status: "Open",
    subject: "Subject 1",
    description: "Description 1",
    files: ["https://via.placeholder.com/150", "https://via.placeholder.com/150"],
  });

  // Delete Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDialogTitle, setDeleteDialogTitle] = useState('');
  const [deleteDialogDescription, setDeleteDialogDescription] = useState('');
  const [deleteDialogHandleSubmit, setDeleteDialogHandleSubmit] = useState(() => { });

  const fetchTicketData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/raise-a-dispute/${ticketId}`);
      const data = await response.json();
      console.log("data in fetchTicketData", data);
      if (data.status === "success") {
        return data.data;
      } else {
        console.log("error in fetchTicketData", data.message);
        return {};
      }
    } catch (error) {
      console.log("error in fetchTicketData", error);
      return {};
    }
  }

  useEffect(() => {
    setPageTitle(`Ticket #${ticketId}`);
    setBreadcrumbs([
      { title: "Raise a Dispute", link: "/raise-a-dispute" },
      { title: `Ticket #${ticketId}`, link: `/raise-a-dispute/view-ticket/${ticketId}` }
    ]);
    setButtonList([
      {
        type: 'button',
        text: 'Delete',
        onClick: () => { handleDeleteTicket() },
        backgroundColor: 'transparent',
        textColor: '#00A1F9',
        borderColor: '#00A1F9'
      },
      {
        type: 'button',
        text: 'Edit',
        onClick: () => { navigate(`/raise-a-dispute/edit-ticket/${ticketId}`) },
        backgroundColor: '#00A1F9',
        textColor: 'white',
        borderColor: '#00A1F9'
      },
    ])

    const fetching = async () => {
      setLoading(true);
      // const data = await fetchTicketData();
      // setTicketData(data);
      setLoading(false);
    }
    fetching();

  }, [ticketId]);

  useEffect(() => {
    setSubPageTitle({
      text: `${ticketData.status}`,
      className: `view-ticket-sub-page-title ${ticketData.status === 'Open' ? 'open' : 'closed'}`,
    });
  }, [ticketData]);

  const handleDeleteTicket = () => {
    setDeleteDialogOpen(true);
    setDeleteDialogTitle('Delete Ticket');
    setDeleteDialogDescription(`${ticketData.subject} will be deleted permanently. You can't undo this action.`);
    setDeleteDialogHandleSubmit(() => handleDeleteTicketSubmit);
  }

  const handleDeleteTicketSubmit = () => {
    console.log("handleDeleteTicketSubmit", ticketId);
  }

  const handleDownloadAttachments = () => {
    console.log("handleDownloadAttachments", ticketData.files);
    ticketData.files.forEach(file => {
      const link = document.createElement('a');
      link.href = file;
      link.download = file.split('/').pop();
      link.click();
    });
  }

  if (loading) {
    return <CommonLoader text="Loading Ticket Data" />
  }
  return (
    <div>

      <div className="view-ticket-container">
        <div className="view-ticket-header">
          <CommonButton
            text="Download Attachments"
            onClick={() => {handleDownloadAttachments()}}
            backgroundColor="transparent"
            textColor="#00A1F9"
            borderColor="#00A1F9"
          />
        </div>
        <div className="view-ticket-details">
          <p>Date: <span>{ticketData.date}</span></p>
          <p>Time: <span>{ticketData.time}</span></p>
          <p>Subject: <span>{ticketData.subject}</span></p>
          <p>Description:</p>
          <p><span>{ticketData.description}</span></p>
        </div>

      </div>

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

export default ViewDispute;