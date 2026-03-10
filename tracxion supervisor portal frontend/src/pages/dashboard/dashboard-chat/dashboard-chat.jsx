import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './dashboard-chat.css';
import { customerMsgContext } from "../../../context/customer-msg-context";


function DashboardChat() {
  // const [searchParams] = useSearchParams();
  // const customerId = searchParams.get('customerId') || null;
  // const conversationId = searchParams.get('conversationId') || null;
  const params = useParams();
  const conversationId = params.conversationId || null;
  if (!conversationId) return null;
  const { allMessages } = useContext(customerMsgContext);

  const [submitting, setSubmitting] = useState(false);
  const [sentiment, setSentiment] = useState('');


  // TEMPORARY CHANGE: Remove the sentiment state
  // const[sentiment, setSentiment] = useState('');

  const [customerDetails, setCustomerDetails] = useState({
    // customerId: 1,
    // customerName: 'Leslie Alexander',
    // customerEmail: 'leslie.alexander@example.com',
    // customerPhone: '+1234567890',
    // customerImage: '/avatar-2.svg',
    // conversationType: 'whatsapp chat',
    // conversationId: 1,
    // status: 'positive',
  });
  const [agentDetails, setAgentDetails] = useState({
    // agentId: 3,
    // agentName: 'Agent Smith',
    // agentEmail: 'agent.doe@example.com',
    // agentPhone: '+1234567890',
    // agentImage: '/avatar.svg',
  });
  const [messages, setMessages] = useState([
    // {
    //   date: '2025-01-01',
    //   message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dolor mollis leo proin turpis eu hac. Tortor dolor eu at bibendum suspendisse. Feugiat mi eu, rhoncus diam consectetur libero morbi pharetra. Id tristique mi eget eget tristique orci.',
    //   sender: 'customer',
    //   senderId: 1,
    //   receiver: 'agent',
    //   receiverId: 3,
    //   time: '10:15 pm',
    //   status: 'positive',
    // },
    // {
    //   date: '2025-01-01',
    //   message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dolor mollis leo proin turpis eu hac. Tortor dolor eu at bibendum suspendisse.',
    //   sender: 'agent',
    //   senderId: 3,
    //   receiver: 'customer',
    //   receiverId: 1,
    //   time: '12:15 pm',
    // }
  ]);

  // const [empresaIdOfThisConversation, setEmpresaIdOfThisConversation] = useState('');

  const [showSuggestionInput, setShowSuggestionInput] = useState(false);
  const [suggestionText, setSuggestionText] = useState('');

  // Helper function to format time from "19:01:47.027051" to "7:01 pm"
  const formatTimeToAMPM = (timeString) => {
    if (!timeString) return '';

    // Extract hours and minutes from time string (e.g., "19:01:47.027051" -> "19:01")
    const timeParts = timeString.split(':');
    if (timeParts.length < 2) return timeString;

    const hours = parseInt(timeParts[0], 10);
    const minutes = timeParts[1].substring(0, 2); // Get only minutes (first 2 chars), ignore seconds

    // Convert to 12-hour format
    const hours12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'pm' : 'am';

    return `${hours12}:${minutes} ${ampm}`;
  };

  // Helper function to format date from "2025-01-01" to "January 1" or "Today", "Yesterday"
  const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if it's today
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }

    // Check if it's yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }

    // Format as "Month Day" (e.g., "January 1", "August 20")
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[date.getMonth()];
    const day = date.getDate();

    return `${month} ${day}`;
  };

  useEffect(() => {
    if (!conversationId) return;

    const messagesPartOfThisConversation = allMessages.filter(message => message.conversationId === conversationId);

    if (messagesPartOfThisConversation.length === 0) {
      setCustomerDetails({});
      setAgentDetails({});
      setMessages([]);
      setSentiment('');
      return;
    }

    const customerData = {
      customerId: messagesPartOfThisConversation[0]?.customerId,
      customerName: messagesPartOfThisConversation[0]?.customerName,
      customerEmail: messagesPartOfThisConversation[0]?.customerEmail,
      customerPhone: messagesPartOfThisConversation[0]?.customerPhone,
      customerImage: messagesPartOfThisConversation[0]?.customerImage,
      conversationType: messagesPartOfThisConversation[0]?.conversationType,
      conversationId: messagesPartOfThisConversation[0]?.conversationId,
      status: messagesPartOfThisConversation[0]?.status,
    }
    setCustomerDetails(customerData);

    const agentData = {
      agentId: messagesPartOfThisConversation[0]?.agentId,
      agentName: messagesPartOfThisConversation[0]?.agentName,
      agentEmail: messagesPartOfThisConversation[0]?.agentEmail,
      agentPhone: messagesPartOfThisConversation[0]?.agentPhone,
      agentImage: messagesPartOfThisConversation[0]?.agentImage,
    }
    setAgentDetails(agentData);

    const messagesData = messagesPartOfThisConversation.map(message => ({
      date: message.date,
      message: message.message,
      sender: message.sender,
      senderId: message.senderId,
      receiver: message.receiver,
      receiverId: message.receiverId,
      time: formatTimeToAMPM(message.time),
      status: message.status,
      suggestions: message.suggestions,
    }));
    setMessages(messagesData);

    // setEmpresaIdOfThisConversation(messagesPartOfThisConversation[0]?.empresaId);

    setSentiment(messagesData[messagesData.length - 1]?.status || '');
  }, [conversationId, allMessages])
  const handleSuggestionSubmit = async () => {
    if (suggestionText.trim()) {
      setSubmitting(true);
      // const newMessage = {
      //   date: new Date().toISOString().split('T')[0],
      //   message: suggestionText,
      //   sender: 'agent',
      //   senderId: agentDetails.agentId,
      //   receiver: 'customer',
      //   receiverId: customerDetails.customerId,
      //   time: new Date().toLocaleTimeString('en-US', {
      //     hour: 'numeric',
      //     minute: '2-digit',
      //     hour12: true
      //   }).toLowerCase(),
      // };
      try {
        console.log("data to send", {
          "empersendid": customerDetails.customerPhone,
          "text": suggestionText
        })
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL3}send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "empersendid": customerDetails.customerPhone,
            "text": suggestionText
          }),
        })
        const data = await response.json();
        console.log("data", data);

        if (data?.status === 'sent'|| response.ok) {
          setSuggestionText('');
          setShowSuggestionInput(false);
        } else {
          alert('Error adding suggestion:', data.message || response.statusText);
        }
      } catch (error) {
        console.error('Error adding suggestion:', error);
      }
      setSubmitting(false);
    }
  };

  // Show no-chat-selected state when no conversation is selected or no messages found
  if (!conversationId || messages.length === 0 || !customerDetails.customerName) {
    return (
      <div className="dashboard-chat-container">
        <div className="dashboard-chat-no-selection">
          <div className="dashboard-chat-no-selection-content">
            <div className="dashboard-chat-no-selection-icon">
              <img src="/logo.svg" alt="" />
            </div>
            <h2 className="dashboard-chat-no-selection-title">Tracxion Supervisor Portal</h2>
            <p className="dashboard-chat-no-selection-description">
              Select a customer from the sidebar to start viewing their conversation
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-chat-container">
      {/* Header */}
      <div className="dashboard-chat-header">
        <div className="dashboard-chat-customer-info">
          <img src={customerDetails.customerImage} alt={customerDetails.customerName} className="dashboard-chat-customer-avatar" />
          <div className="dashboard-chat-customer-details">
            <h3 className="dashboard-chat-customer-name">{customerDetails.customerName}</h3>
            <p className="dashboard-chat-customer-id">#{customerDetails.customerId}</p>
          </div>
        </div>

        <div className={`dashboard-chat-status-tag ${sentiment || customerDetails.status || ''}`}>
          {sentiment === 'positive' ? 'Positive' : sentiment === 'negative' ? 'Negative' : sentiment === 'mixed' ? 'Mixed' : 'Neutral'}
        </div>
        {/* <div className={`dashboard-chat-status-tag ${sentiment}`}>
          {sentiment === 'positive' ? 'Positive' : 'Negative'}
        </div> */}
        <div className="dashboard-chat-menu-icon">
          <span>⋮</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="dashboard-chat-messages-container">
        <div className="dashboard-chat-messages-list">
          {messages.map((message, index) => {
            // Show date separator if this is the first message or if the date changed from previous message
            const showDateSeparator = index === 0 || messages[index - 1].date !== message.date;

            return (
              <div key={index}>
                {showDateSeparator && (
                  <div className="dashboard-chat-date-separator">
                    <span>{formatDate(message.date)}</span>
                  </div>
                )}
                <div className={`dashboard-chat-message ${message.sender}`}>
                  {message.sender === 'customer' && (
                    <img src={customerDetails.customerImage} alt={customerDetails.customerName} className="dashboard-chat-message-avatar" />
                  )}

                  <div className="dashboard-chat-message-content">
                    <div className={`dashboard-chat-message-bubble ${message.sender} ${message.status}`}>
                      <p className="dashboard-chat-message-text">{message.message}</p>
                    </div>
                    <p className="dashboard-chat-message-time">{message.time}</p>
                    {/* TEMPORARY: Sentiment analysis table - will be removed later */}
                    {/* {message.sentimentData && (
                  <div className="dashboard-chat-sentiment-table">
                    <table style={{ 
                      fontSize: '11px', 
                      borderCollapse: 'collapse', 
                      marginTop: '8px',
                      width: '100%',
                      backgroundColor: '#f9f9f9',
                      borderRadius: '4px',
                      padding: '4px'
                    }}>
                      <thead>
                        <tr>
                          <th style={{ padding: '4px 8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Sentiment</th>
                          <th style={{ padding: '4px 8px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ padding: '4px 8px' }}>Positive</td>
                          <td style={{ padding: '4px 8px', textAlign: 'right' }}>
                            {(message.sentimentData.sentiment_score?.Positive * 100).toFixed(2)}%
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: '4px 8px' }}>Negative</td>
                          <td style={{ padding: '4px 8px', textAlign: 'right' }}>
                            {(message.sentimentData.sentiment_score?.Negative * 100).toFixed(2)}%
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: '4px 8px' }}>Neutral</td>
                          <td style={{ padding: '4px 8px', textAlign: 'right' }}>
                            {(message.sentimentData.sentiment_score?.Neutral * 100).toFixed(2)}%
                          </td>
                        </tr>
                        <tr>
                          <td style={{ padding: '4px 8px' }}>Mixed</td>
                          <td style={{ padding: '4px 8px', textAlign: 'right' }}>
                            {(message.sentimentData.sentiment_score?.Mixed * 100).toFixed(2)}%
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    {message.sentimentData.entities && message.sentimentData.entities.length > 0 && (
                      <div style={{ marginTop: '6px', fontSize: '11px' }}>
                        <strong>Entities:</strong> {message.sentimentData.entities.join(', ')}
                      </div>
                    )}
                  </div>
                )} */}
                  </div>

                  {message.sender === 'agent' && (
                    <img src={agentDetails.agentImage} alt={agentDetails.agentName} className="dashboard-chat-message-avatar" />
                  )}
                </div>
              </div>
            );
          })}

          {/* Suggestions from Last Message */}
          {(() => {
            // Find the last message that has suggestions
            const lastMessageWithSuggestions = [...messages].reverse().find(msg =>
              msg.suggestions && Array.isArray(msg.suggestions) && msg.suggestions.length > 0
            );

            if (lastMessageWithSuggestions) {
              return (
                <div className="dashboard-chat-suggestions-container">
                  <div className="dashboard-chat-suggestions-list">
                    {lastMessageWithSuggestions.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="dashboard-chat-suggestion-item"
                        onClick={() => {
                          setSuggestionText(suggestion);
                          setShowSuggestionInput(true);
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </div>
      </div>

      {/* Suggestion Section */}
      {!showSuggestionInput ? (
        <div className="dashboard-chat-suggestion-prompt">
          <p className="dashboard-chat-prompt-text">Want to suggest?</p>
          <div className="dashboard-chat-suggestion-buttons">
            <button
              className="dashboard-chat-suggestion-btn dashboard-chat-yes-btn"
              onClick={() => setShowSuggestionInput(true)}
            >
              Yes
            </button>
            <button className="dashboard-chat-suggestion-btn dashboard-chat-no-btn">No</button>
          </div>
        </div>
      ) : (
        <div className="dashboard-chat-suggestion-input-section">
          <h4 className="dashboard-chat-input-title">Suggestion for Agent</h4>
          <div className="dashboard-chat-input-container">
            <textarea
              value={suggestionText}
              onChange={(e) => setSuggestionText(e.target.value)}
              placeholder="Write a message..."
              className="dashboard-chat-suggestion-textarea"
            />
            <button
              className="dashboard-chat-send-btn"
              onClick={handleSuggestionSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <div className="dashboard-chat-loader"></div>
              ) : (
                <img src="/send-icon.svg" alt="send" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardChat;