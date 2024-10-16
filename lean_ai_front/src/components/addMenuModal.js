import { useState, useEffect } from 'react';
import { Plus, Edit3 as EditIcon, Check, X as CancelIcon, Image as ImageIcon } from 'lucide-react';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ModalMSG from './modalMSG.js'; // 메시지 모달 컴포넌트
import ModalErrorMSG from './modalErrorMSG'; // 에러 메시지 모달 컴포넌트
import config from '../../config';

export default function AddMenuModal({ isOpen, onClose, onSave, slug, menuTitle }) {
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [message, setMessage] = useState('');
    const [menuItems, setMenuItems] = useState([]);
    const [newItem, setNewItem] = useState({
        image: '',
        name: '',
        price: '',
        category: '',
        store: '',
    });
    const [editItemId, setEditItemId] = useState(null);
    const [editItem, setEditItem] = useState(null);

    // isMobile 상태 추가
    const [isMobile, setIsMobile] = useState(false);

    // 화면 크기에 따라 isMobile 설정
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // 768px 이하일 때 모바일로 설정
        };

        handleResize(); // 컴포넌트가 마운트될 때 크기 체크
        window.addEventListener('resize', handleResize); // 리사이즈 이벤트 추가

        return () => {
            window.removeEventListener('resize', handleResize); // 언마운트 시 이벤트 제거
        };
    }, []);

    const handleClose = () => {
        setNewItem({
            image: '',
            name: '',
            price: '',
            category: '',
            store: '',
        });
        setMenuItems([]);
        setEditItemId(null);
        setEditItem(null);
        setErrorMessage('');
        setMessage('');
        onClose();
    };

    if (!isOpen) return null;

    const handleImageChange = (e, isEditing = false) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (isEditing) {
                setEditItem(prev => ({ ...prev, image: file }));
            } else {
                setNewItem(prev => ({ ...prev, image: file }));
            }
        }
    };

    const handleInputChange = (e, isEditing = false) => {
        const { name, value } = e.target;
        let updatedValue = value;

        if (name === 'price') {
            updatedValue = value ? parseInt(value, 10) : ''; // 입력된 값을 정수로 변환
        }

        if (isEditing) {
            setEditItem(prev => ({ ...prev, [name]: updatedValue }));
        } else {
            setNewItem(prev => ({ ...prev, [name]: updatedValue }));
        }
    };

    const handleAddItem = () => {
        if (newItem.name && newItem.price && newItem.category) {
            setMenuItems(prev => [...prev, { ...newItem, menu_number: Date.now() }]);
            setNewItem({ image: '', name: '', price: '', category: '', store: '' });
        }
    };

    const handleEdit = (item) => {
        setEditItemId(item.menu_number);
        setEditItem(item);
    };

    const handleSaveEdit = () => {
        setMenuItems(prev =>
            prev.map(item => (item.menu_number === editItemId ? editItem : item))
        );
        setEditItemId(null);
        setEditItem(null);
    };

    const handleCancelEdit = () => {
        setEditItemId(null);
        setEditItem(null);
    };

    const groupedMenuItems = menuItems.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {});

    const getImagePreview = (image) => {
        if (image instanceof File) {
            return URL.createObjectURL(image);
        }
        return '/menu_default_image.png'; // 기본 이미지 경로
    };

    const handleComplete = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const formData = new FormData();
            const storeSlug = encodeURIComponent(slug);
    
            // 디버깅용 
            //console.log('전송할 메뉴 아이템:', menuItems);
    
            for (const [index, item] of menuItems.entries()) {
                formData.append(`menus[${index}][slug]`, storeSlug);
                formData.append(`menus[${index}][name]`, item.name || '');
                formData.append(`menus[${index}][price]`, item.price || 0);
                formData.append(`menus[${index}][category]`, item.category || '');
                formData.append(`menus[${index}][menu_number]`, item.menu_number || '');
    
                // 이미지가 없는 경우 기본 이미지 추가
                if (item.image instanceof File) {
                    formData.append(`menus[${index}][image]`, item.image);
                } else {
                    const defaultImageResponse = await fetch('/menu_default_image.png');
                    const defaultImageBlob = await defaultImageResponse.blob();
                    formData.append(`menus[${index}][image]`, defaultImageBlob, 'menu_default_image.png');
                }
            }
    
             // 디버깅용 : FormData의 내용을 확인
            /*
             for (let pair of formData.entries()) {
                console.log(pair[0] + ', ' + pair[1]);
            }
            */
            
            formData.append('action', editItemId ? 'update' : 'create');
    
            const response = await fetch(`${config.apiDomain}/api/menu-details/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '서버 전송에 실패했습니다.');
            }
    
            const result = await response.json();
            onSave(result);
    
            setMessage(`${menuTitle}이(가) 성공적으로 저장되었습니다.`);
            setShowMessageModal(true);
    
            setNewItem({ image: '', name: '', price: '', category: '', store: '' });
            setMenuItems([]);
            setEditItemId(null);
            setEditItem(null);
        } catch (error) {
            console.error('전송 중 오류 발생:', error);
            setErrorMessage('저장에 실패했습니다.');
            setShowErrorMessageModal(true);
        }
    };
    
    return (
        <div className="modalOverlay z-50 ">
            <div className="modalContent relative m-4 max-h-screen overflow-y-auto scroll-auto ">
                <p className="text-2xl font-bold text-gray-800 text-center w-full mt-4">{menuTitle} 추가</p>

                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-600 z-50"
                    style={{ padding: '10px', cursor: 'pointer' }}
                    aria-label="Close"
                >
                    X
                </button>

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <div className="space-y-4">
                        <div className="flex items-center justify-center w-full h-auto">
                            <label
                                htmlFor="image-upload"
                                className="flex flex-col items-center justify-center w-full h-auto border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                            >
                                {newItem.image ? (
                                    <img
                                        src={getImagePreview(newItem.image)}
                                        alt="Preview"
                                        className="w-full max-h-64 object-contain rounded-lg"
                                        style={{ objectFit: 'contain' }}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">클릭하여 업로드</span> 또는 드래그 앤 드롭
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG (MAX. 800x400px)</p>
                                    </div>
                                )}

                                <input
                                    id="image-upload"
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => handleImageChange(e)}
                                    accept="image/*"
                                />
                            </label>
                        </div>

                        <input
                            type="text"
                            name="name"
                            placeholder={`${menuTitle} 이름`}
                            value={newItem.name}
                            onChange={(e) => handleInputChange(e)}
                            className="w-full p-2 border rounded"
                        />

                        <input
                            type="number"  // 가격 입력을 숫자로 한정
                            name="price"
                            placeholder="가격"
                            value={newItem.price}
                            onChange={(e) => handleInputChange(e)}
                            className="w-full p-2 border rounded"
                        />

                        <input
                            type="text"
                            name="category"
                            placeholder="분류"
                            value={newItem.category}
                            onChange={(e) => handleInputChange(e)}
                            className="w-full p-2 border rounded"
                        />

                        <button
                            onClick={handleAddItem}
                            className="w-full flex items-center justify-center bg-indigo-500 text-white p-2 rounded"
                        >
                            <Plus className="mr-2" /> 메뉴 추가
                        </button>
                    </div>

                    <div className="flex flex-col">
                        {isMobile ? (
                            // Mobile UI
                            <div className="bg-gray-100 p-3 rounded-lg h-full block md:hidden">
                                <h3 className="text-lg font-semibold mb-2 text-gray-700">현재 {menuTitle} 목록</h3>
                                <div className="bg-white px-2 rounded-md shadow overflow-x-auto">
                                    {Object.keys(groupedMenuItems).map((category) => (
                                        groupedMenuItems[category].map((item) => (
                                            <div key={item.menu_number} className="flex items-center justify-between ">
                                                {editItemId === item.menu_number ? (
                                                    <div className="w-full">
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            value={editItem.name}
                                                            onChange={(e) => handleInputChange(e, true)}
                                                            className="w-full p-2 border rounded mb-2 whitespace-nowrap mt-2"
                                                        />
                                                        <input
                                                            type="text"
                                                            name="price"
                                                            value={editItem.price}
                                                            onChange={(e) => handleInputChange(e, true)}
                                                            className="w-full p-2 border rounded mb-2"
                                                        />
                                                        <input
                                                            type="text"
                                                            name="category"
                                                            value={editItem.category}
                                                            onChange={(e) => handleInputChange(e, true)}
                                                            className="w-full p-2 border rounded mb-2"
                                                        />
                                                        <div className="flex justify-end space-x-2">
                                                            <button
                                                                onClick={handleSaveEdit}
                                                                className="px-4 py-2 text-blue-500 rounded"
                                                            >
                                                                <Check />
                                                            </button>
                                                            <button
                                                                onClick={handleCancelEdit}
                                                                className="px-4 py-2 text-red-500 rounded"
                                                            >
                                                                <CancelIcon />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-between w-full ">
                                                        <div className="flex items-center space-x-2">
                                                            <p className="font-semibold text-gray-800 whitespace-nowrap" style={{ lineHeight: '1.25rem' }}>
                                                                {item.name}
                                                            </p>
                                                            <p className="text-gray-600 whitespace-nowrap" style={{ lineHeight: '1.25rem' }}>
                                                                {item.price}원
                                                            </p>
                                                            <p className="text-gray-600 whitespace-nowrap" style={{ lineHeight: '1.25rem' }}>
                                                                {item.category}
                                                            </p>
                                                        </div>
                                                        <button onClick={() => handleEdit(item)} className="flex items-center">
                                                            <EditIcon className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // PC UI
                            <div className="bg-gray-100 p-4 rounded-lg h-full hidden md:block">
                                <h3 className="text-xl font-semibold mb-4 text-gray-700">현재 {menuTitle} 목록</h3>
                                {Object.keys(groupedMenuItems).map((category) => (
                                    <div key={category}>
                                        <h4 className="text-lg font-semibold text-gray-600 mb-2">{category}</h4>
                                        {groupedMenuItems[category].map((item) => (
                                            <div key={item.menu_number} className="flex items-center mb-4 bg-white p-3 rounded-md shadow">
                                                {editItemId === item.menu_number ? (
                                                    <div className="w-full">
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            value={editItem.name}
                                                            onChange={(e) => handleInputChange(e, true)}
                                                            className="w-full p-2 border rounded mb-2 whitespace-nowrap"
                                                        />
                                                        <input
                                                            type="text"
                                                            name="price"
                                                            value={editItem.price}
                                                            onChange={(e) => handleInputChange(e, true)}
                                                            className="w-full p-2 border rounded mb-2"
                                                        />
                                                        <input
                                                            type="text"
                                                            name="category"
                                                            value={editItem.category}
                                                            onChange={(e) => handleInputChange(e, true)}
                                                            className="w-full p-2 border rounded mb-2"
                                                        />
                                                        <div className="flex justify-end space-x-2">
                                                            <button
                                                                onClick={handleSaveEdit}
                                                                className="px-4 py-2 text-blue-500 rounded"
                                                            >
                                                                <Check />
                                                            </button>
                                                            <button
                                                                onClick={handleCancelEdit}
                                                                className="px-4 py-2 text-red-500 rounded"
                                                            >
                                                                <CancelIcon />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <img
                                                            src={getImagePreview(item.image)}
                                                            alt={item.name}
                                                            className="w-16 h-16 object-cover rounded"
                                                        />

                                                        <div className="flex-grow ml-4">
                                                            <p className="font-semibold text-gray-800 whitespace-nowrap">{item.name}</p>
                                                            <p className="text-gray-600">{item.price}원</p>
                                                            <p className="text-gray-600 text-sm">{item.category}</p>
                                                        </div>
                                                        <button onClick={() => handleEdit(item)} className="px-4 py-2 ml-auto rounded">
                                                            <EditIcon />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div>
                            <button
                                onClick={handleComplete}
                                className="w-full flex items-center justify-center bg-indigo-500 text-white p-2 rounded whitespace-nowrap"
                            >
                                <SaveAltIcon className="mr-2" /> 현재 상태 저장
                            </button>
                        </div>
                    </div>
                </div>

                <ModalMSG
                    show={showMessageModal}
                    onClose={() => setShowMessageModal(false)}
                    title="Success"
                >
                    <p style={{ whiteSpace: 'pre-line' }}>{message}</p>
                </ModalMSG>

                <ModalErrorMSG
                    show={showErrorMessageModal}
                    onClose={() => setShowErrorMessageModal(false)}
                    title="Error"
                >
                    <p style={{ whiteSpace: 'pre-line' }}>{errorMessage}</p>
                </ModalErrorMSG>
            </div>

            <style jsx>{`
                .modalOverlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .modalContent {
                    background-color: white;
                    padding: 30px;
                    border-radius: 12px;
                    width: 700px;
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
                    font-family: 'Arial', sans-serif;
                }

                input {
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    width: 100%;
                    box-sizing: border-box;
                }

                button {
                    padding: 12px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-top: 10px;
                }
            `}</style>
        </div>
    );
}
