import { useNavigate } from "react-router-dom"

export default function Home() {
    const navigate = useNavigate()
    return (
        <div>
            <p>HELLO</p>
            <button onClick={() => navigate("/login")}>Login</button>
        </div>
    )
}

// import { useEffect, useState, useRef } from 'react';
// import { GATEWAY_URL } from '../config';
// import { Client } from '@stomp/stompjs';
// import type { IMessage } from '@stomp/stompjs';
// import SockJS from 'sockjs-client';


// import { useAuth } from "../auth/AuthContext";

// interface Chat {
//     id: number;
//     title: string;
//     description?: string;
//     members: { userId: string; role: string }[];
//     createdAt: string;
//     group: boolean;
// }

// interface Message {
//     id: string;
//     chatId: string;
//     content: string;
//     sender: string;
//     timestamp: string;
// }

// const HomePage = () => {
//     const { user, loading, logout } = useAuth();

//     if (loading) return <div>Loading...</div>;
//     if (!user) return <div>Not authenticated</div>;

//     const [chats, setChats] = useState<Chat[]>([]);
//     const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [input, setInput] = useState('');
//     const stompClient = useRef<Client | null>(null);


//     const loadChats = async () => {
//         try {
//             const response = await authFetch(`${GATEWAY_URL}/chats`);
//             const data = await response.json();
//             setChats(data);
//         } catch (err) {
//             console.error('Failed to fetch chats', err);
//         }
//     };

//     const createChat = async () => {
//         const mockChat = { title: 'New Chat', description: 'Mock chat description' };
//         try {
//             await authFetch(`${GATEWAY_URL}/chats`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(mockChat),
//             });
//             await loadChats();
//         } catch (err) {
//             console.error('Failed to create chat', err);
//         }
//     };

//     const loadMessages = async (chatId: number) => {
//         try {
//             const response = await authFetch(`${GATEWAY_URL}/chats/${chatId}/messages`);
//             const data = await response.json();
//             setMessages(data);
//         } catch (err) {
//             console.error('Failed to fetch messages', err);
//         }
//     };
//     const connectWebSocket = (chatId: number) => {
//         if (stompClient.current) stompClient.current.deactivate();

//         const socketFactory = () => new SockJS(`${GATEWAY_URL}/ws`);
//         const client = new Client({
//             webSocketFactory: socketFactory,
//             reconnectDelay: 5000,
//             debug: (str) => console.log(str),
//         });

//         client.onConnect = () => {
//             client.subscribe(`/topic/chat.${chatId}`, (msg: IMessage) => {
//                 const message: Message = JSON.parse(msg.body);
//                 setMessages(prev => [...prev, message]);
//             });
//         };

//         client.onStompError = (frame) => {
//             console.error('STOMP error', frame);
//         };

//         client.activate();
//         stompClient.current = client;
//     };


//     const sendMessage = () => {
//         if (!selectedChat || !input.trim() || !stompClient.current?.connected) return;
//         stompClient.current.publish({
//             destination: `/app/chat.${selectedChat.id}.send`,
//             body: JSON.stringify({ content: input }),
//         });
//         setInput('');
//     };

//     const selectChat = (chat: Chat) => {
//         setSelectedChat(chat);
//         loadMessages(chat.id);
//         connectWebSocket(chat.id);
//     };

//     useEffect(() => {
//         loadChats();
//         return () => {
//             stompClient.current?.deactivate();
//         };
//     }, []);

//     return (
//         <div style={{ display: 'flex', gap: '1rem' }}>
//             <div style={{ flex: 1 }}>
//                 <button onClick={createChat}>Create Chat</button>
//                 <ul>
//                     {chats.map(chat => (
//                         <li
//                             key={chat.id}
//                             onClick={() => selectChat(chat)}
//                             style={{ cursor: 'pointer', fontWeight: chat.id === selectedChat?.id ? 'bold' : 'normal' }}
//                         >
//                             {chat.title}
//                         </li>
//                     ))}
//                 </ul>
//             </div>

//             <div style={{ flex: 3, display: 'flex', flexDirection: 'column', height: '80vh', border: '1px solid #ccc', padding: '0.5rem' }}>
//                 <div style={{ flex: 1, overflowY: 'auto', marginBottom: '0.5rem' }}>
//                     {messages.map(msg => (
//                         <div key={msg.id}>
//                             <strong>{msg.sender}:</strong> {msg.content}
//                         </div>
//                     ))}
//                 </div>
//                 <div style={{ display: 'flex' }}>
//                     <input style={{ flex: 1 }} value={input} onChange={e => setInput(e.target.value)} />
//                     <button onClick={sendMessage}>Send</button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default HomePage;
