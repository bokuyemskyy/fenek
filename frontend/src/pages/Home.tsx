import { useEffect, useState } from 'react';
import { authFetch } from '../auth/authFetch';
import { GATEWAY_URL } from '../config';

const Home = () => {
    const [chats, setChats] = useState<any[]>([]);

    const loadChats = async () => {
        try {
            const response = await authFetch(`${GATEWAY_URL}/chats`);
            const data = await response.json();
            setChats(data);
        } catch (err) {
            console.error('Failed to fetch chats', err);
        }
    };

    const createChat = async () => {
        const mockChat = { name: 'New Chat', description: 'Mock chat description' };
        try {
            const response = await authFetch(`${GATEWAY_URL}/chats`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mockChat),
            });
            const created = await response.json();
            setChats(prev => [...prev, created]);
        } catch (err) {
            console.error('Failed to create chat', err);
        }
    };

    useEffect(() => {
        loadChats();
    }, []);


    return (
        <>
            Welcome home. <br />
            Here are all your chats:
            <ul>
                {chats.map(chat => (
                    <li key={chat.id}>{chat.name}</li>
                ))}
            </ul>
            <button onClick={createChat}>Create Chat</button>
        </>
    )
}

export default Home;