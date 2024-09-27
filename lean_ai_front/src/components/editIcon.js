import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // FontAwesomeIcon 가져오기
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'; // 필요한 아이콘 가져오기

const EditIcon = () => {
    return (
        <FontAwesomeIcon className='text-indigo-400' icon={faPenToSquare} style={{ width: '20px', height: '20px', marginLeft: '5px' }} />
    );
};

export default EditIcon;