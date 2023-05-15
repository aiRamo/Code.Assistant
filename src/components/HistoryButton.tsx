import chatIcon from '../assets/chatIcon.svg';
import trashIcon from '../assets/trashIcon.svg';
import styles from '../modules/HistoryButton.module.css';

interface HistoryButtonProps {
    description: string;
    onChatSwitchButtonClick: any;
    onDeleteChatClick: any;
    isSelected: boolean;
}

const HistoryButton = (props: HistoryButtonProps) => {

    const historyOptionClass = props.isSelected ? `${styles.historyOption} ${styles.selected}` : styles.historyOption;

    return (
        <div className={historyOptionClass} onClick={props.onChatSwitchButtonClick}>
            <img src={chatIcon} className={styles.historyIcon}/>
            <p className={styles.description}>{props.description}</p>
            {!props.isSelected && <div className={styles.textCutoff} />}
            {props.isSelected && (
                <div className={styles.deleteDiv}>
                    <img src={trashIcon} className={styles.trashIcon} onClick={props.onDeleteChatClick}/>
                </div>
            )}
        </div>

    );
};

export default HistoryButton;