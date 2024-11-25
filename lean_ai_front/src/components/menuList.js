import React, { useState } from 'react';
import { motion } from "framer-motion";
import { TriangleAlert } from 'lucide-react';
import AllergyModal from './allergyModal';
import config from '../../config';

// MenuList 컴포넌트: 메뉴 항목을 카테고리별로 보여주고 알레르기 모달을 관리합니다.
const MenuList = ({ menuPrice, storeCategory, menuTitle }) => {
    const [openCategories, setOpenCategories] = useState({}); // 각 카테고리의 열림/닫힘 상태 관리
    const [showAllergyModal, setShowAllergyModal] = useState(false); // 알레르기 모달 상태 관리
    const groupedMenu = groupMenuByCategory(menuPrice); // 메뉴를 카테고리별로 그룹화

    // 카테고리의 열림/닫힘 상태를 토글하는 함수
    const toggleCategory = (category) => {
        setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
    };

    // 알레르기 모달의 열림/닫힘 상태를 토글하는 함수
    const toggleAllergyModal = () => {
        setShowAllergyModal((prev) => !prev);
    };

    return (
        <div className="space-y-2">
            {/* 메뉴 탭 제목과 알레르기 모달 버튼 */}
            <div className='flex flex-row space-x-3 items-center'>
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl font-bold "
                    style={{ fontFamily: 'NanumSquareExtraBold' }}
                >
                    {menuTitle} {/* 상단 탭 메뉴 제목 */}
                </motion.h2>

                {/* 매장이 FOOD 카테고리일 때만 알레르기 모달 버튼 표시 */}
                {storeCategory === 'FOOD' && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className='flex flex-row text-indigo-600 space-x-1 cursor-pointer'
                        onClick={(e) => {
                            e.stopPropagation(); // 카테고리 토글과 혼동 방지
                            toggleAllergyModal(); // 알레르기 모달 열기
                        }}
                    >
                        <TriangleAlert /> <p>알레르기</p>
                    </motion.div>
                )}
            </div>
            {/* groupedMenu가 있을 경우, 각 카테고리를 렌더링, 없으면 '메뉴 정보 없음' 메시지 출력 */}
            {groupedMenu && Object.keys(groupedMenu).length > 0 ? (
                Object.entries(groupedMenu).map(([category, menus]) => (
                    <Category
                        key={category}
                        category={category}
                        menus={menus}
                        open={openCategories[category]}
                        onClick={() => toggleCategory(category)}
                        menuTitle={menuTitle}  // 상단 탭의 메뉴 제목 전달
                        storeCategory={storeCategory}  // 매장 카테고리 전달 (FOOD, RETAIL 등)
                        toggleAllergyModal={toggleAllergyModal}  // 알레르기 모달 토글 함수 전달
                    />
                ))
            ) : (
                <p>메뉴 정보가 없습니다.</p>
            )}

            {/* AllergyModal 컴포넌트: 알레르기 정보 모달을 렌더링 */}
            <AllergyModal
                show={showAllergyModal} // 모달 열림 상태에 따라 렌더링
                onClose={toggleAllergyModal} // 닫기 함수
                menuDetails={menuPrice} // 메뉴 상세 데이터를 모달로 전달
            />
        </div>
    );
};

// Category 컴포넌트: 개별 카테고리를 렌더링하고 클릭 시 카테고리 항목을 열거나 닫을 수 있도록 함
const Category = ({ category, menus, open, onClick }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onClick={onClick} // 카테고리를 클릭하여 열림/닫힘 상태를 토글
        className={`cursor-pointer bg-indigo-300 p-3 ${open ? 'rounded-md' : 'rounded-md'}`}
        whileTap={{ scale: 0.98 }}
    >

        {/* 카테고리 제목과 메뉴 항목 목록 */}
        <h3 className="text-lg font-semibold text-white">{category}</h3>
        {open && menus.map((menu, index) => {
            return <MenuItem key={`${menu.name}-${index}`} menu={menu} />;
        })}

    </motion.div>
);

// MenuItem 컴포넌트: 개별 메뉴 항목을 렌더링 (이미지, 이름, 가격 포함)
const MenuItem = ({ menu }) => (
    <div className="flex items-center p-3">
        <img src={menu.image ? `${config.apiDomain}${menu.image}` : '/menu_default_image.png'} alt={menu.name} className="w-16 h-16 object-cover" />
        <div className="flex-1 ml-3">
            <p className="font-semibold">{menu.name}</p>
            <p>{menu.price.toLocaleString()} 원</p>
        </div>
    </div>
);

// groupMenuByCategory 함수: 메뉴를 카테고리별로 그룹화하여 반환
const groupMenuByCategory = (menuList) => {
    if (!menuList || !Array.isArray(menuList)) {
        return null; // menuList가 유효하지 않으면 null 반환
    }
    return menuList.reduce((acc, menu) => {
        if (!acc[menu.category]) acc[menu.category] = [];
        acc[menu.category].push(menu);
        return acc;
    }, {});
};

export default MenuList;
