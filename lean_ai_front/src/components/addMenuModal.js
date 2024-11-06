import { useState, useEffect } from 'react';
import { Plus, PencilLine  as EditIcon, Check, X, X as CancelIcon, Image as ImageIcon } from 'lucide-react';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';
import ModalMSG from './modalMSG.js'; // 메시지 모달 컴포넌트
import ModalErrorMSG from './modalErrorMSG'; // 에러 메시지 모달 컴포넌트
import config from '../../config';
import styles from '../styles/viewMenu.module.css';

export default function AddMenuModal({ isOpen, onClose, onSave, slug, menuTitle }) {
    const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 내용
    const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 메시지 모달 표시 여부
    const [showMessageModal, setShowMessageModal] = useState(false); // 성공 메시지 모달 표시 여부
    const [message, setMessage] = useState(''); // 성공 메시지 내용
    const [menuItems, setMenuItems] = useState([]); // 모달에 추가된 메뉴 항목
    const [newItem, setNewItem] = useState({
        image: '',
        name: '',
        price: '',
        category: '',
        store: '',
    }); // 새로운 메뉴 항목 추가 폼 데이터 초기값
    const [categoryOptions, setCategoryOptions] = useState([]); // 메뉴 카테고리 옵션들
    const [editItemId, setEditItemId] = useState(null); // 수정할 항목의 ID
    const [editItem, setEditItem] = useState(null); // 수정할 메뉴 항목 데이터

    const [isMobile, setIsMobile] = useState(false); // 모바일 화면 크기 여부 상태

    // 화면 크기에 따라 모바일 여부를 설정
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

    // 모달이 열렸을 때만 메뉴 데이터 조회
    useEffect(() => {
        if (isOpen && slug) {
            fetchMenuData();
        }
    }, [isOpen, slug]);

    // 서버에서 카테고리 데이터 가져오기
    const fetchMenuData = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(`${config.apiDomain}/api/menu-details/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'view_category',
                    slug: slug,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch menu data');
            }

            const data = await response.json();
            //console.log('Parsed Data:', data);

            // 카테고리 데이터를 설정
            setCategoryOptions(data || []);


        } catch (error) {
            console.error('Error fetching menu data:', error);
        }
    };

    // 모달이 닫혀있으면 컴포넌트를 렌더링하지 않음
    if (!isOpen) return null;

    // 상태값 초기화 및 모달 닫기
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

    // 이미지 변경 핸들러
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

    // 입력 폼 변경 핸들러
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

    // 카테고리 선택 시 카테고리 상태 업데이트
    const handleCategoryChange = (selectedOption) => {
        setNewItem(prev => ({
            ...prev,
            category: selectedOption ? selectedOption.value : '',
        }));
    };

    // 새로운 카테고리 생성 시 처리
    const handleCreateNewCategory = (newValue) => {
        const newCategoryOption = { value: newValue, label: newValue };
        setCategoryOptions(prev => [...prev, newCategoryOption]);
        setNewItem(prev => ({ ...prev, category: newValue }));
    };

    // 새로운 메뉴 항목 추가 처리
    const handleAddItem = () => {
        if (newItem.name && newItem.price && newItem.category) {
            setMenuItems(prev => [...prev, { ...newItem, menu_number: Date.now() }]);
            setNewItem({ image: '', name: '', price: '', category: '', store: '' });
        } else {
            setErrorMessage("이름, 가격 및 카테고리를 모두 입력해주세요.");
            setShowErrorMessageModal(true);
        }
    };

    // 수정할 항목 선택
    const handleEdit = (item) => {
        setEditItemId(item.menu_number);
        setEditItem(item);
    };

    // 수정 사항 저장
    const handleSaveEdit = () => {
        setMenuItems(prev =>
            prev.map(item => (item.menu_number === editItemId ? editItem : item))
        );
        setEditItemId(null);
        setEditItem(null);
    };

    // 수정 취소
    const handleCancelEdit = () => {
        setEditItemId(null);
        setEditItem(null);
    };

    // 메뉴 항목을 카테고리별로 그룹화
    const groupedMenuItems = menuItems.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {});

    // 이미지 미리보기
    const getImagePreview = (image) => {
        if (image instanceof File) {
            return URL.createObjectURL(image);
        }
        return '/menu_default_image.png'; // 기본 이미지 경로
    };

    // 모든 메뉴 항목을 서버에 전송
    const handleComplete = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const formData = new FormData();
            const storeSlug = (slug);

            if (menuItems.length === 0) {
                throw new Error("메뉴 데이터가 없습니다."); // 메뉴 항목이 없을 경우 예외 처리
            }

            // 각 메뉴 항목을 FormData에 추가
            for (const [index, item] of menuItems.entries()) {
                formData.append(`menus[${index}][slug]`, storeSlug);
                formData.append(`menus[${index}][name]`, item.name || '');
                formData.append(`menus[${index}][price]`, item.price || 0);
                formData.append(`menus[${index}][category]`, item.category || '');
                formData.append(`menus[${index}][menu_number]`, item.menu_number || '');

                // 이미지 파일 추가
                if (item.image instanceof File) {
                    formData.append(`menus[${index}][image]`, item.image);
                } else {
                    console.log("기본 이미지 사용");
                    const defaultImageResponse = await fetch('/menu_default_image.png');
                    const defaultImageBlob = await defaultImageResponse.blob();
                    formData.append(`menus[${index}][image]`, defaultImageBlob, 'menu_default_image.png');
                }
            }


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
                console.error("서버 응답 에러 상태:", response.status, response.statusText);
                console.error("서버 응답 데이터:", errorData);
                throw new Error(errorData.error || '서버 전송에 실패했습니다.');
            }


            const result = await response.json();
            onSave(result); // 저장된 결과 전달

            setMessage(`${menuTitle}이(가) 성공적으로 저장되었습니다.`);
            setShowMessageModal(true);

            // 폼 초기화
            setNewItem({ image: '', name: '', price: '', category: '', store: '' });
            setMenuItems([]);
            setEditItemId(null);
            setEditItem(null);
        } catch (error) {
            console.error('전송 중 오류 발생:', error);
            setErrorMessage(error.message || '저장에 실패했습니다.');
            setShowErrorMessageModal(true);
        }
    };

    return (
        <div className={`${styles.modalOverlay} z-30`} >
             <div className={`${styles.modalContent} relative m-4 overflow-y-auto`}>
                <p className="text-2xl font-bold text-gray-800 text-center w-full mt-4">{menuTitle} 추가</p>
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 z-50"
                    style={{ padding: '10px', cursor: 'pointer' }}
                    aria-label="Close"
                >
                   <X className="bg-indigo-500 rounded-full text-white p-1"/>
                </button>

                {/* 좌측 입력 폼 */}
                <div className="grid md:grid-cols-2 gap-6 mt-8 h-4/5">
                    <div className="space-y-4 h-full">
                        {/* 이미지 업로드 영역 */}
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

                        {/* 메뉴 이름 입력 */}
                        <input
                            type="text"
                            name="name"
                            placeholder={`${menuTitle} 이름`}
                            value={newItem.name}
                            onChange={(e) => handleInputChange(e)}
                            className="w-full p-2 border rounded"
                        />

                        {/* 금액 입력 */}
                        <input
                            type="number"
                            name="price"
                            placeholder="금액"
                            value={newItem.price}
                            onChange={(e) => handleInputChange(e)}
                            className="w-full p-2 border rounded"
                        />

                        {/* 카테고리 선택 */}
                        <CreatableSelect
                            components={makeAnimated()}
                            value={categoryOptions.find(option => option.value === newItem.category)}
                            onChange={handleCategoryChange}
                            options={categoryOptions}
                            isClearable
                            placeholder="분류를 선택하세요"
                            onCreateOption={handleCreateNewCategory}
                            formatCreateLabel={(inputValue) => `추가 "${inputValue}"`}  
                        />

                        {/* 메뉴 추가 버튼 */}
                        <button
                            onClick={handleAddItem}
                            className="w-full flex items-center justify-center bg-indigo-500 text-white p-2 rounded"
                        >
                            <Plus className="mr-2" /> {menuTitle} 추가
                        </button>
                    </div>

                    {/* 우측 목록 및 저장 영역 */}
                    <div className="flex flex-col space-y-2 h-full">
                        {isMobile ? (
                            <div className="bg-gray-100 p-3 rounded-lg block md:hidden">
                                <h3 className="text-lg font-semibold mb-2 text-gray-700">현재 {menuTitle} 목록</h3>
                                <div className="bg-white px-2 rounded-md shadow overflow-x-auto">
                                    {/* 모바일 일 때 현재 메뉴 목록 표시 */}                                    
                                    {Object.keys(groupedMenuItems).map((category) =>
                                        groupedMenuItems[category].map((item) => (
                                            <div key={item.menu_number} className="flex items-center justify-between">
                                                {/* 수정 모드와 기본 모드 UI */}
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
                                                    <div className="flex items-center justify-between w-full">
                                                        <div className="flex items-center space-x-2">
                                                            <p
                                                                className="font-semibold text-gray-800 whitespace-nowrap"
                                                                style={{ lineHeight: '1.25rem' }}
                                                            >
                                                                {item.name}
                                                            </p>
                                                            <p
                                                                className="text-gray-600 whitespace-nowrap"
                                                                style={{ lineHeight: '1.25rem' }}
                                                            >
                                                                {item.price}원
                                                            </p>
                                                            <p
                                                                className="text-gray-600 whitespace-nowrap"
                                                                style={{ lineHeight: '1.25rem' }}
                                                            >
                                                                {item.category}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleEdit(item)}
                                                            className="flex items-center"
                                                        >
                                                            <EditIcon className="w-5 h-5 text-indigo-500" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-100 p-4 rounded-lg h-full hidden md:block">
                                <h3 className="text-xl font-semibold mb-4 text-gray-700">현재 {menuTitle} 목록</h3>
                                {/* PC 일 때 현재 메뉴 목록 표시 */}                                     
                                {Object.keys(groupedMenuItems).map((category) =>
                                    groupedMenuItems[category].map((item) => (
                                        <div
                                            key={item.menu_number}
                                            className="flex items-center mb-4 bg-white p-3 rounded-md shadow"
                                        >
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
                                                <div className="flex flex-row items-center justify-between">
                                                    <div className="flex items-center space-x-6">
                                                        <img
                                                            src={getImagePreview(item.image)}
                                                            alt={item.name}
                                                            className="w-12 h-12 object-cover rounded"
                                                        />
                                                        <div className="flex-grow">
                                                            <p className="font-semibold text-gray-800 whitespace-nowrap">
                                                                {item.name}
                                                            </p>
                                                            <p className="text-gray-600">{item.price}원</p>
                                                            <p className="text-gray-600 text-sm">{item.category}</p>
                                                        </div>
                                                    </div>
                                                    <EditIcon className="cursor-pointer ml-10" onClick={() => handleEdit(item)} />
                                                </div>

                                            )}
                                        </div>
                                    ))
                                )}
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

                {/* 성공 메시지 모달 */}
                <ModalMSG
                    show={showMessageModal}
                    onClose={() => setShowMessageModal(false)}
                    title="Success"
                >
                    <p style={{ whiteSpace: 'pre-line' }}>{message}</p>
                </ModalMSG>

                {/* 에러 메시지 모달 */}
                <ModalErrorMSG
                    show={showErrorMessageModal}
                    onClose={() => setShowErrorMessageModal(false)}
                    title="Error"
                >
                    <p style={{ whiteSpace: 'pre-line' }}>{errorMessage}</p>
                </ModalErrorMSG>
            </div>

        </div>
    );
}
