import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // FontAwesomeIcon 가져오기
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'; // 필요한 아이콘 가져오기

const EditIcon = () => {
    return (
        <FontAwesomeIcon icon={faPenToSquare} style={{ width: '20px', height: '20px', color: '#c4b5fd', marginLeft: '5px' }} />
    );
};

export default EditIcon;