import { useContext, useEffect, useState } from "react";
import { globalContext } from "../../../context/context";
import { useNavigate, useParams } from "react-router-dom";
import CommonInput from "../../../Component/common-input";
import CommonFileUpload from "../../../Component/common-file-upload";
import './edit-dispute.css';
import CommonLoader from "../../../Component/common-loader";

function EditDispute() {
  const { setBreadcrumbs, setPageTitle, setButtonList, setSubPageTitle } = useContext(globalContext);
  const navigate = useNavigate();
  const params = useParams();
  const ticketId = params.id;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [ticketFormData, setTicketFormData] = useState({
    subject: 'Subject of the ticket',
    description: 'Description of the ticket',
    files: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
  });
  const [ticketFormErrors, setTicketFormErrors] = useState({
    subject: false,
    description: false,
    files: false,
  });

  const fetchTicketData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tickets/${ticketId}`, {
        method: 'GET',
      });
      const data = await response.json();
      console.log("ticket data", data);
      if (data.statusCode === 200) {
        return data.data;
      } else {
        return {};
      }
    }
    catch (error) {
      console.log("error in fetching ticket data", error);
      return {};
    }
  }
  
  useEffect(() => {
    setBreadcrumbs([
      { title: 'Raise a Dispute', link: '/raise-a-dispute' },
      { title: 'Edit Ticket', link: `/raise-a-dispute/edit-ticket/${ticketId}` },
    ]);
    setPageTitle('Edit Ticket');
    setButtonList([
      {
        type: 'button',
        text: 'Cancel',
        onClick: () => { navigate('/raise-a-dispute') },
        backgroundColor: 'transparent',
        textColor: '#2C2D33',
        borderColor: 'transparent'
      },
      {
        type: 'button',
        text: 'Save',
        onClick: () => { console.log('Edit') },
        backgroundColor: '#00A1F9',
        textColor: 'white',
        borderColor: '#00A1F9'
      }
    ]);
    setSubPageTitle({});
    const fetchingData = async () => {
      setLoading(true);
      // const ticketData = await fetchTicketData();
      // setTicketFormData(ticketData);
      setLoading(false);
    }
    fetchingData();
  }, []);


  const handleTicketFormDataChange = (e) => {
    const { name, value } = e.target;
    setTicketFormData({ ...ticketFormData, [name]: value });
    setTicketFormErrors({ ...ticketFormErrors, [name]: value.trim() === '' });
  }

  if (loading) {
    return <CommonLoader text="Loading Ticket Data..." />;
  }

  return (
    <div>

      <CommonInput 
        label="Subject"
        name="subject"
        type="text"
        value={ticketFormData.subject}
        onChange={handleTicketFormDataChange}
        required
        placeholder="Enter Subject"
        error={ticketFormErrors.subject}
        errorMsg="Subject is required"
      />
      <CommonInput 
        label="Description"
        name="description"
        type="textarea"
        value={ticketFormData.description}
        onChange={handleTicketFormDataChange}
        required
        placeholder="Enter Description"
        error={ticketFormErrors.description}
        errorMsg="Description is required"
        multiline
        rows={4}
      />

      <div className="edit-ticket-title-container">
        <h2>Upload Files</h2>
      </div>
      <CommonFileUpload
        onFilesChange={(files) => {
          setTicketFormData({ ...ticketFormData, files: files });
          setTicketFormErrors({ ...ticketFormErrors, files: files.length === 0 });
        }}
        multiple={true}
        maxFiles={5}
        acceptedTypes="all"
        maxFileSize={200 * 1024}
        placeholder='Max 200KB file are allowed | Dimension 200*200'
        browseText='Browse File'
        value={ticketFormData.files}
      />
    </div>
  );
}

export default EditDispute;