import { useEffect } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

export default function ChatBot () {
    useEffect(() => {
        createChat({
            webhookUrl: import.meta.env.VITE_URL_BOT
        });
    }, []);

    return (<div></div>);
};