import styles from '../modules/SideBar.module.css';
import additionIcon from '../assets/additionIcon.svg';
import HistoryButton from './HistoryButton';

interface HistoryObject {
    description: string;
    key: string;
}


interface SideBarProps {
    isOpen: Boolean;
    historyObjects: HistoryObject[];
    onNewChatButtonClick: any;
    onChatSwitchButtonClick: any;
    onDeleteChatClick: any;
    selectedChatKey: any;
}

const SideBar = (props: SideBarProps) => {
    const sidebarClass = props.isOpen ? `${styles.sidebar} ${styles.open}` : styles.sidebar;
    const buttonClass = props.isOpen ? `${styles.newChatButton} ${styles.open}` : styles.newChatButton;
    const titleClass = props.isOpen ? `${styles.sidebarTitle} ${styles.open}` : styles.sidebarTitle;
    const historyWindowClass = props.isOpen ? `${styles.historyOptions} ${styles.open}` : styles.historyOptions;

    const reversedHistoryObjects = props.historyObjects.slice().reverse();

    return (
        <div className={sidebarClass}>
            <h1 className={titleClass}>History</h1>
            <div className={historyWindowClass}>
                <ul className={styles.historyList}>
                    {reversedHistoryObjects.map((HistoryObject) => (
                        <HistoryButton 
                            key={HistoryObject.key} // Add a unique key prop
                            description={HistoryObject.key} 
                            onChatSwitchButtonClick={() => props.onChatSwitchButtonClick(HistoryObject.key)} 
                            isSelected={HistoryObject.key === props.selectedChatKey}
                            onDeleteChatClick={() => props.onDeleteChatClick(HistoryObject.key)} 
                        />
                    ))}
                </ul>
                
            </div>
            <button className={buttonClass} onClick={props.onNewChatButtonClick}>
                <img src={additionIcon} className={styles.newChatIcon}/>
            </button>
        </div>
    );
};

export default SideBar;
