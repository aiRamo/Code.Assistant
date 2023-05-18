import React, { useState, useRef, useEffect } from 'react';
import styles from '../modules/MainPage.module.css';
import UserMessage from './UserMessage';
import submitIcon from '../assets/chevron-right.svg';
import menuIcon from '../assets/menuIcon.svg';
import SideBar from "./SideBar";
import firebase from '../firebase';

interface HistoryObject {
    description: string;
    key: string;
}

const MainPage = () => {
  const [message, setMessage] = useState('');
  const [userMessages, setUserMessages] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [sidebarOpen, setSideBarOpen] = useState(false);
  const [chatKey, setChatKey] = useState<string | null>(null); // Track the chat key
  const [historyObjects, setHistoryObjects] = useState<HistoryObject[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageListRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<HTMLImageElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const chatRef = firebase.database?.().ref('chats');


  const fetchChatData = () => {
    chatRef?.on('value', (snapshot) => {
      const chatData = snapshot.val();
      if (chatData) {
        const chatKeys = Object.keys(chatData);
        const historyObjects: HistoryObject[] = chatKeys.map((key) => ({
          description: '',
          key: key,
        }));
        setHistoryObjects(historyObjects);
      }
    });
  };

  useEffect(() => {
    fetchChatData();
    console.log(historyObjects);
  }, []);

  const handleViewSidebar = () => {
    setSideBarOpen(!sidebarOpen);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    setMessage(textarea.value);
  };

  const handleInputBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    const textarea = event.target as HTMLTextAreaElement;
    if (textarea.value.trim() === '') {
      textarea.style.height = '5vh';
    } else {
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleSubmit = () => {
    if (message !== '' && textareaRef.current?.value.trim() !== '') {
      console.log(message);

      if (chatKey) {
        // If chat already exists, push message under 'messages' directory
        const messagesRef = chatRef?.child(`${chatKey}/messages`);
        messagesRef?.push({
          message: message,
          timestamp: firebase.database?.ServerValue.TIMESTAMP,
        });
        // Optional: You can set additional properties for the message if needed
        // newMessageRef?.update({ ... });

      } else {
        // If chat doesn't exist, create new chat and push message under 'messages' directory
        const newChatRef = chatRef?.push({ timestamp: firebase.database?.ServerValue.TIMESTAMP });
        const messagesRef = newChatRef?.child('messages');
        messagesRef?.push({
          message: message,
          timestamp: firebase.database?.ServerValue.TIMESTAMP,
        });
        // Optional: You can set additional properties for the message if needed
        // newMessageRef?.update({ ... });
        if (newChatRef) {
          setChatKey(newChatRef.key);
        }
      }

      setSubmitted(true);
    }
    setMessage('');
  };

  const handleNewChatClick = () => {
    const newChatRef = chatRef?.push({ timestamp: firebase.database?.ServerValue.TIMESTAMP });
    if (newChatRef) {
      setUserMessages([]);
      setChatKey(newChatRef.key);
      fetchChatData();
    }
  };

  const handleChatSwitch = (key: string) => {
    if (key != chatKey) {
      console.log(`Clicked. New chat key = ${key}`)
      setUserMessages([]);
      setChatKey(key);
    }
  };

  const handleDeleteChat = (key: string) => {
    if (key) {
      // Remove the chat from Firebase
      chatRef?.child(key).remove();
      // Reset the chat key and user messages
      setChatKey(null);
      setUserMessages([]);
      setHistoryObjects([]);
      fetchChatData();
    }
  }

  useEffect(() => {
    if (chatKey) {
      chatRef?.child(`${chatKey}/messages`).on('value', (snapshot) => {
        const messagesData = snapshot.val();
        if (messagesData) {
          const sortedMessages = Object.values(messagesData).sort(
            (a: any, b: any) => a.timestamp - b.timestamp
          );
          const messages = sortedMessages.reverse().map((message: any) => message.message);
          setUserMessages(messages);
        }
      });
    }
  }, [chatKey]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '5vh';
    }
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
    setSubmitted(false);
  }, [submitted]);

  useEffect(() => {
    if (sidebarOpen && rootRef.current) {
      rootRef.current.style.left = '15vw';
    }
  }, [sidebarOpen]);

  useEffect(() => {
    if (textareaRef.current && textareaRef.current.value.trim() == '') {
        if (buttonRef.current && iconRef.current){
            buttonRef.current.style.cursor = 'default';
            document.documentElement.style.setProperty('--hover', 'var(--primary-accent)');
            iconRef.current.style.opacity = '0.2';
        }
    }
    else if (textareaRef.current && textareaRef.current.value.trim() != '') {
        if (buttonRef.current && iconRef.current){
            buttonRef.current.style.cursor = 'pointer';
            document.documentElement.style.setProperty('--hover', 'var(--primary)');
            iconRef.current.style.opacity = '1';
        }
    }
  }, [message]);

  return (
    <>
      <div className={styles.navBar}>
        <button onClick={handleViewSidebar} className={styles.menuButton}>
          <img src={menuIcon} className={styles.menuIcon}/>
        </button>
      </div>
      <span>
        <SideBar 
          isOpen={sidebarOpen} 
          historyObjects={historyObjects} 
          onNewChatButtonClick={handleNewChatClick} 
          onChatSwitchButtonClick={handleChatSwitch} 
          onDeleteChatClick={handleDeleteChat}
          selectedChatKey={chatKey}
        />
      </span>
      <div className={`${styles.backgroundLayer} ${sidebarOpen ? styles.open : ''}`} ref={rootRef}>
        <div className={`${styles.chatWindow} ${sidebarOpen ? styles.open : ''}`}>
          <ul className={styles.messageList} ref={messageListRef}>
            {userMessages.reverse().map((message, index) => (
              <UserMessage key={index} position={index} message={message} />
            ))}
          </ul>
        </div>
        <div className={styles.queryBoxContainer}>
          <textarea
            className={`${styles.queryBox} ${sidebarOpen ? styles.open : ''}`}
            rows={1}
            onInput={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="Send a message."
            value={message}
            ref={textareaRef}
          />
          <button 
          className={`${styles.submitButton} ${sidebarOpen ? styles.open : ''}`}
          onClick={handleSubmit} 
          ref={buttonRef}
          >
            <img src={submitIcon} className={styles.buttonIcon} ref={iconRef}/>
          </button>
        </div>
      </div>
    </>
  );
};

export default MainPage;
