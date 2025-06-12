import { useEffect } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

export default function ChatBot() {
    useEffect(() => {
        // Inyectar estilos CSS personalizados
        const style = document.createElement('style');
        style.textContent = styleChat
        document.head.appendChild(style);

        createChat({
            webhookUrl: import.meta.env.VITE_URL_BOT,
            target: '#n8n-chat',
            mode: 'window',
            loadPreviousSession: true,
            defaultLanguage: 'es',
            initialMessages: [
                'Hola! 👋',
                'En que puedo ayudarte hoy?'
            ],
            i18n: {
                es: {
                    title: 'Spa Sentirse Bien',
                    subtitle: "Disponible para ayudarte las 24 horas",
                    footer: '',
                    getStarted: 'Comenzar conversación',
                    inputPlaceholder: 'Ingrese su consulta',
                },
            },
        });

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <div id="n8n-chat"></div>
    );
}

const styleChat = `
            :root {
                --chat--color-primary: #198754;
                --chat--color-primary-shade-50: #157347;
                --chat--color-primary-shade-100: #146c43;
                --chat--color-secondary: #198754;
                --chat--color-secondary-shade-50: #157347;
                --chat--color-white: #ffffff;
                --chat--color-light: #f8f9fa;
                --chat--color-light-shade-50: #f1f3f5;
                --chat--color-light-shade-100: #e9ecef;
                --chat--color-medium: #6c757d;
                --chat--color-dark: #212529;
                --chat--color-disabled: #adb5bd;
                --chat--color-typing: #495057;

                --chat--spacing: 1rem;
                --chat--border-radius: 0.5rem;
                --chat--transition-duration: 0.15s;

                --chat--window--width: 400px;
                --chat--window--height: 600px;

                --chat--header-height: auto;
                --chat--header--padding: 1.5rem;
                --chat--header--background: #198754;
                --chat--header--color: var(--chat--color-white);
                --chat--header--border-top: none;
                --chat--header--border-bottom: none;
                --chat--heading--font-size: 1.5rem;
                --chat--subtitle--font-size: 0.95rem;
                --chat--subtitle--line-height: 1.6;

                --chat--textarea--height: 55px;

                --chat--message--font-size: 0.95rem;
                --chat--message--padding: 1rem;
                --chat--message--border-radius: 0.5rem;
                --chat--message-line-height: 1.6;
                --chat--message--bot--background: var(--chat--color-white);
                --chat--message--bot--color: var(--chat--color-dark);
                --chat--message--bot--border: none;
                --chat--message--user--background: #198754;
                --chat--message--user--color: var(--chat--color-white);
                --chat--message--user--border: none;
                --chat--message--pre--background: rgba(25, 135, 84, 0.1);

                --chat--toggle--background:rgb(207, 56, 114);
                --chat--toggle--hover--background:rgb(207, 56, 114);
                --chat--toggle--active--background: rgb(207, 56, 114);
                --chat--toggle--color: var(--chat--color-white);
                --chat--toggle--size: 64px;
            }

            /* Estilos limpios con solo blancos y verdes */
            .n8n-chat {
                border: none !important;
            }

            .n8n-chat .n8n-chat-header {
                box-shadow: none !important;
                background: linear-gradient(to right, #198754, #20c997) !important;
                text-align: center important;
            }
            
            .n8n-chat chat-heading {
                text-align: center !important;
            }

            .n8n-chat .n8n-chat-messages {
                background: #f8f9fa !important;
            }

            .n8n-chat .n8n-chat-message.bot {
                box-shadow: none !important;
                margin-bottom: 0.75rem !important;
                background: white !important;
            }

            .n8n-chat .n8n-chat-message.user {
                box-shadow: none !important;
                margin-bottom: 0.75rem !important;
                background: #198754 !important;
            }

            .n8n-chat .n8n-chat-input-wrapper {
                border-top: 1px solid #e9ecef !important;
                background: white !important;
                padding: 1rem !important;
            }

            .n8n-chat .n8n-chat-input {
                border: 1px solid #e9ecef !important;
                border-radius: 0.5rem !important;
                padding: 0.75rem !important;
                background: white !important;
            }

            .n8n-chat .n8n-chat-input:focus {
                outline: 2px solid rgba(25, 135, 84, 0.3) !important;
                outline-offset: 2px !important;
            }

            .n8n-chat .n8n-chat-send-button {
                background: #198754 !important;
                border: none !important;
                border-radius: 0.5rem !important;
            }

            .n8n-chat .n8n-chat-send-button:hover {
                background: #157347 !important;
            }

            .n8n-chat-toggle {
                box-shadow: 0 0.25rem 0.5rem rgba(25, 135, 84, 0.2) !important;
                border: none !important;
                background: #198754 !important;
            }

            /* Efectos sutiles */
            .n8n-chat-message.bot {
                transition: transform 0.15s ease, opacity 0.15s ease;
            }
            
            .n8n-chat-message.user {
                transition: transform 0.15s ease, opacity 0.15s ease;
            }
            
            .n8n-chat-send-button {
                transition: background-color 0.15s ease !important;
            }
            
            .n8n-chat-toggle {
                transition: transform 0.15s ease !important;
            }
        `;