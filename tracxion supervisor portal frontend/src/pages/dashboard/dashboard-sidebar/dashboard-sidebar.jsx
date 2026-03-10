import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import './dashboard-sidebar.css'
import { useContext, useEffect, useState } from 'react';
import { customerMsgContext } from '../../../context/customer-msg-context';
function DashboardSidebar() {

  const navigate = useNavigate();
  // const [searchParams] = useSearchParams();
  // const customerId = searchParams.get('customerId') || null;
  // const conversationId = searchParams.get('conversationId') || null;
  const { allMessages, setAllMessages } = useContext(customerMsgContext);
  const params = useParams();

  const conversationId = params.conversationId || null;


  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState([
    // {
    //   customerId: 1,
    //   customerName: 'John Doe',
    //   conversationType: 'whatsapp chat',
    //   customerImage: '/avatar-2.svg',
    //   customerEmail: 'john.doe@example.com',
    //   conversationId: 1,
    // },
    // {
    //   customerId: 1,
    //   customerName: 'Jane Doe',
    //   conversationType: 'voice',
    //   customerImage: '/avatar-2.svg',
    //   customerEmail: 'jane.doe@example.com',
    //   conversationId: 2,
    // },
    // {
    //   customerId: 3,
    //   customerName: 'Jim Beam',
    //   conversationType: 'both',
    //   customerImage: '/avatar-2.svg',
    //   customerEmail: 'jim.beam@example.com',
    //   conversationId: 3,
    // },
    // {
    //   customerId: 4,
    //   customerName: 'Katrina Bel',
    //   conversationType: 'whatsapp chat',
    //   customerImage: '/avatar-2.svg',
    //   customerEmail: 'katrina.bel@example.com',
    //   conversationId: 4,
    // },
    // {
    //   customerId: 5,
    //   customerName: 'John Wick',
    //   conversationType: 'voice',
    //   customerImage: '/avatar-2.svg',
    //   customerEmail: 'john.wick@example.com',
    //   conversationId: 5,
    // },
    // {
    //   customerId: 6,
    //   customerName: 'Micheal Jordan',
    //   conversationType: 'both',
    //   customerImage: '/avatar-2.svg',
    //   customerEmail: 'micheal.jordan@example.com',
    //   conversationId: 6,
    // },
    // {
    //   customerId: 7,
    //   customerName: 'Lebron James',
    //   conversationType: 'voice',
    //   customerImage: '/avatar-2.svg',
    //   customerEmail: 'lebron.james@example.com',
    //   conversationId: 7,
    // },
    // {
    //   customerId: 8,
    //   customerName: 'Kobe Bryant',
    //   conversationType: 'both',
    //   customerImage: '/avatar-2.svg',
    //   customerEmail: 'kobe.bryant@example.com',
    //   conversationId: 8,
    // },
    // {
    //   customerId: 9,
    //   customerName: 'Stephen Curry',
    //   conversationType: 'whatsapp chat',
    //   customerImage: '/avatar-2.svg',
    //   customerEmail: 'stephen.curry@example.com',
    //   conversationId: 9,
    // },
    // {
    //   customerId: 10,
    //   customerName: 'Kevin Durant',
    //   conversationType: 'voice',
    //   customerImage: '/avatar-2.svg',
    //   customerEmail: 'kevin.durant@example.com',
    //   conversationId: 10,
    // },
  ]);
  const [conversationType, setConversationType] = useState('whatsapp chat');

  // Filter customers based on conversation type and search
  const filteredCustomers = customers.filter(customer => {
    // First filter by conversation type
    const matchesConversationType = conversationType === 'both' ||
      customer.conversationType === conversationType ||
      customer.conversationType === 'both';

    // Then filter by search within the conversation type results
    if (!search.trim()) {
      return matchesConversationType;
    }

    const searchTerm = search.toLowerCase();
    const matchesSearch = customer.customerName.toLowerCase().includes(searchTerm) ||
      customer.customerEmail.toLowerCase().includes(searchTerm);

    return matchesConversationType && matchesSearch;
  });

  useEffect(() => {
    // Filter objects with unique conversationIds from allMessages
    const seenConversationIds = new Set();
    const uniqueConversationObjects = allMessages.filter(message => {
      if (!message.conversationId) return false;
      if (seenConversationIds.has(message.conversationId)) {
        return false;
      }
      seenConversationIds.add(message.conversationId);
      return true;
    });

    const customersData = uniqueConversationObjects.map((convo) => (
      {
        customerId: convo.customerId,
        customerName: convo.customerName,
        conversationType: convo.conversationType,
        customerImage: convo.customerImage,
        customerEmail: convo.customerEmail,
        conversationId: convo.conversationId,
        customerPhone: convo.customerPhone,
      }
    ));
    setCustomers(customersData);
  }, [allMessages, conversationId])

  // Handle conversation type change
  const handleConversationTypeChange = (e) => {
    setConversationType(e.target.value);
    setSearch(''); // Clear search when conversation type changes
  };


  const handleEndConversation = async (conversationId) => {
    console.log("conversationId", conversationId);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL2}remove/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

const data = await response.json();
console.log("conversation deleted response",data);
      if (response.ok && response.status === 200) {
        console.log("conversation ended successfully");
        // for the time being we are doing with customer name but in future we will do with conversation id
        setAllMessages(allMessages.filter(message => message.customerName !== conversationId));
      } else {
        console.log("failed to end conversation");
      }
    } catch (error) {
      console.log("error", error);
    }
  }
  return (
    <div className='dashboard-sidebar-container'>
      <div className='dashboard-sidebar-header-section-container'>
        <h3>Agents</h3>
        <div className='dashboard-sidebar-header-section-input-container'>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search'
          />
          <img src="/search-icon.svg" alt="search" />
        </div>
      </div>


      <div className='dashboard-sidebar-conversation-type-section-container'>
        <label htmlFor="conversation-type">Select Conversation Type</label>
        <select
          name="conversation-type"
          id="conversation-type"
          value={conversationType}
          onChange={handleConversationTypeChange}
        >
          <option value="whatsapp chat">Whatsapp Chat</option>
          <option value="voice">Voice</option>
          <option value="both">Both</option>
        </select>
      </div>

      <div className='dashboard-sidebar-conversation-list-section-container'>
        {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => {
          const isSelected = conversationId == customer.conversationId; // Use == for type coercion
          return (
            <div className={`dashboard-sidebar-conversation-list-item-container ${isSelected ? 'selected' : ''}`} key={customer.customerId} onClick={() => navigate(`/dashboard/chat/${customer.conversationId}`)}>
              <img src={customer.customerImage} alt={customer.customerName} />
              <div className='dashboard-sidebar-conversation-list-item-content-container'>
                <h4>{customer.customerName}</h4>
                <p>{customer.customerPhone || customer.customerEmail}</p>
              </div>
              <img 
                src="/delete-icon.svg" 
                alt="delete" 
                className="dashboard-sidebar-delete-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEndConversation(customer.customerName);
                }}
              />
            </div>
          );
        }) : <div className='dashboard-sidebar-conversation-list-item-container-no-customers-found'>
          <p>No customers found</p>
        </div>}
      </div>
    </div>
  );
}

export default DashboardSidebar;