import { useRef } from 'react';
import styles from '../modules/UserMessage.module.css';

interface UserMessageProps {
  message: string;
  position: number;
}

const UserMessage = ({ message }: UserMessageProps) => {
  const userMessageBoxRef = useRef<HTMLDivElement>(null);

  return (
    <li className={styles.messageItem}>
      <div className={styles.userMessageBox} ref={userMessageBoxRef}>
        <p className={styles.userMessageText}>{message}</p>
      </div>
    </li>
  );
};

export default UserMessage;
