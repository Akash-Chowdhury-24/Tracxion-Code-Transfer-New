import { useContext, useEffect, useState } from "react";
import { globalContext } from "../../../context/context";
import { useNavigate } from "react-router-dom";
import CommonInput from "../../../Component/common-input";
import CommonFileUpload from "../../../Component/common-file-upload";
import './add-dispute.css';

function AddDispute() {
  const { setBreadcrumbs, setPageTitle, setButtonList, setSubPageTitle } = useContext(globalContext);
  const navigate = useNavigate();

  const [ticketFormData, setTicketFormData] = useState({
    subject: '',
    description: '',
    files: [],
  });
  const [ticketFormErrors, setTicketFormErrors] = useState({
    subject: false,
    description: false,
    files: false,
  });
  
  useEffect(() => {
    setBreadcrumbs([
      { title: 'Raise a Dispute', link: '/raise-a-dispute' },
      { title: 'Add Ticket', link: '/raise-a-dispute/add-ticket' },
    ]);
    setPageTitle('Add Ticket');
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
        text: 'Add',
        onClick: () => { console.log('Add') },
        backgroundColor: '#00A1F9',
        textColor: 'white',
        borderColor: '#00A1F9'
      }
    ]);
    setSubPageTitle({});
  }, []);


  const handleTicketFormDataChange = (e) => {
    const { name, value } = e.target;
    setTicketFormData({ ...ticketFormData, [name]: value });
    setTicketFormErrors({ ...ticketFormErrors, [name]: value.trim() === '' });
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

      <div className="add-ticket-title-container">
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

export default AddDispute;