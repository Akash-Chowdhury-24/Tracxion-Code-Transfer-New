import { createContext, useEffect, useMemo, useRef, useState } from "react";

export const customerMsgContext = createContext();

export const CustomerMsgProvider = ({ children }) => {

  const [allMessages, setAllMessages] = useState([]);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {

    const connectToWebSocket = () => {
      wsRef.current = new WebSocket(`${import.meta.env.VITE_WEB_SOCKET_URL}?agentId=supervisor1&usertype=S`)

      wsRef.current.onopen = () => {
        console.log('WebSocket connection opened');
      }

      wsRef.current.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        console.log("msg.type", msg.type)
        console.log("msg.payload", msg.payload)
        const payload = msg.payload;
        if (msg.type === 'data' && payload) {
          // Parse the body JSON string if it exists
          let bodyData = {};
          if (payload.body) {
            try {
              bodyData = typeof payload.body === 'string' ? JSON.parse(payload.body) : payload.body;
            } catch (e) {
              console.error('Error parsing body:', e);
            }
          }

          // Get current date/time for messages that don't have timestamp
          const now = new Date();
          const currentDate = now.toISOString().split('T')[0];
          const currentTime = now.toISOString().split('T')[1].split('.')[0];

          const dataToAdd = {
            // customer details
            customerId: payload?.customer_contact_number || 'demo-customer-123', // Need proper customer ID from backend for now using the customer contact number
            customerName: bodyData?.userID || payload?.customer_contact_number || 'Demo Customer', // Need proper customer name from backend for now using the user id
            conversationType: 'whatsapp chat', // Need proper conversation type from backend (whatsapp chat/voice)
            customerImage: '/avatar-2.svg', // Need proper customer image URL from backend
            customerPhone: payload?.customer_contact_number || bodyData?.customer_contact_number,
            customerEmail: 'customer@demo.com', // Need proper customer email from backend
            conversationId: `customer=${bodyData?.customer_contact_number}--agent=${bodyData?.agent_id}`, // Using this demo id since no conversation id is coming from backend

            // message details
            date: currentDate, // Need proper timestamp/date from backend
            message: bodyData?.user_text,
            sender: payload?.direction === 'D' ? 'customer' : 'agent',
            senderId: payload?.customer_contact_number, // using the customer contact number as the sender id since no sender id is coming from backend
            receiver: payload?.direction === 'D' ? 'agent' : 'customer',
            receiverId: bodyData?.agent_id, // using the agent id as the receiver id since no receiver id is coming from backend
            time: currentTime, // Need proper timestamp/time from backend
            status: (payload?.sentiment || bodyData?.sentiment || 'NORMAL').toLowerCase(),
            suggestions: payload?.suggestion || [],
            sentimentScore: payload?.sentiment_summary || bodyData?.sentiment_score || {},
            dominantLanguage: bodyData?.dominant_language || [],
            entities: bodyData?.entities || [],
            language: payload?.language || bodyData?.dominant_language?.[0]?.LanguageCode || '',

            // agent details
            agentId: bodyData?.agent_id || payload?.agent_id,
            agentName: 'Agent Smith', // Need proper agent name from backend
            agentEmail: 'agent.smith@demo.com', // Need proper agent email from backend
            agentPhone: '+1234567890', // Need proper agent phone from backend
            agentImage: '/avatar.svg', // Need proper agent image URL from backend
            empresaId: bodyData?.empresa_id || 'demo-empresa', // Available from body
          }
          setAllMessages(prev => [...prev, dataToAdd]);
        }

      }

      wsRef.current.onclose = () => {
        console.log('WebSocket connection closed');
        reconnectTimeoutRef.current = setTimeout(() => {
          connectToWebSocket();
        }, 2000);
      }

      wsRef.current.onerror = (error) => {
        console.log('WebSocket connection error', error);
      }

    }
    connectToWebSocket();
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
      // Clear again in case onclose scheduled a new reconnect
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    }

  }, [])

  const value = useMemo(() => ({
    allMessages,
    setAllMessages,
  }), [allMessages]);

  return <customerMsgContext.Provider value={value}>
    {children}
  </customerMsgContext.Provider>;
};