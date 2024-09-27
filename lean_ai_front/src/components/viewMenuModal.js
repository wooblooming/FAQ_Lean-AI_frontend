import React, { useState, useEffect } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ModalMSG from './modalMSG.js';
import ModalErrorMSG from './modalErrorMSG';
import config from '../../config';

const ViewMenuModal = ({ show, onClose, title, slug, menuTitle }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (show) {
      const fetchMenuItems = async () => {
        try {
          const token = sessionStorage.getItem('token');
          const storeSlug = encodeURIComponent(slug);

          const response = await fetch(`${config.apiDomain}/api/menu-details/`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'view',
              slug: storeSlug,
            }),
          });

          const data = await response.json();

          if (Array.isArray(data) && data.length > 0) {
            setMenuItems(data);
            // Initialize all categories as expanded
            const categories = [...new Set(data.map(item => item.category))];
            setExpandedCategories(categories.reduce((acc, category) => ({...acc, [category]: false}), {}));
            setLoading(false);
          } else {
            setError("메뉴 데이터가 비어있거나 올바르지 않습니다.");
            setLoading(false);
          }
        } catch (error) {
          console.error("Error fetching menu data:", error);
          setError("메뉴 데이터를 불러오는 데 실패했습니다: " + error.message);
          setLoading(false);
        }
      };

      fetchMenuItems();
    }
  }, [show, slug]);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({...prev, [category]: !prev[category]}));
  };

  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  if (!show) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <button className="closeButton" onClick={onClose}>&times;</button>
        <div className="modalHeader">메뉴 목록</div>
        <div className="modalBody">
          {loading ? (
            <p>메뉴 데이터를 불러오는 중...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : Object.keys(groupedMenuItems).length === 0 ? (
            <p>등록된 메뉴가 없습니다.</p>
          ) : (
            Object.entries(groupedMenuItems).map(([category, items]) => (
              <div key={category} className="categoryGroup">
                <h3 onClick={() => toggleCategory(category)} className="categoryHeader">
                  {category} {expandedCategories[category] ? < KeyboardArrowUpIcon />  : < KeyboardArrowDownIcon />  }
                </h3>
                {expandedCategories[category] && (
                  <ul>
                    {items.map((menu, index) => (
                      <li key={index} className="menuItem">
                        <img
                          src={menu.image ? 
                            (menu.image.startsWith('http')
                              ? menu.image
                              : `${process.env.NEXT_PUBLIC_MEDIA_URL}${menu.image}`)
                          : '/menu_default_image.png'}
                          alt={menu.name}
                          className="menuImage"
                        />
                        <div className="menuDetails">
                          <p className="menuName">{menu.name}</p>
                          <p className="menuPrice">{Number(menu.price).toFixed(0)}원</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <ModalErrorMSG
        show={showErrorMessageModal}
        onClose={() => setShowErrorMessageModal(false)}
        title="Error"
      >
        <p style={{ whiteSpace: 'pre-line' }}>
          {errorMessage}
        </p>
      </ModalErrorMSG>

      <style jsx>{`

      ..modalHeader {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          color: #333;
        }
        .categoryGroup {
          margin-bottom: 10px;
        }
        .categoryHeader {
          cursor: pointer;
          background-color: #4f46e5;
          color : #fff; 
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 5px;
        }

        .modalOverlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.6); /* 어두운 배경 */
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999;
        }

        .modalContent {
          background-color: white;
          padding: 30px;
          border-radius: 12px;
          width: 90%;
          max-width: 450px; /* 모달의 최대 크기 설정 */
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* 그림자 추가 */
          font-family: 'Arial', sans-serif;
          position: relative;
          text-align: center;
        }

        .modalHeader {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .menuItem {
          display: flex;
          margin-bottom: 10px;
          align-items: center;
        }

        .menuImage {
          width: 60px;
          height: 60px;
          object-fit: cover;
          margin-right: 10px;
        }

        .menuDetails {
          flex-grow: 1;
          text-align: left;
        }

        .menuName {
          font-weight: bold;
        }

        .menuPrice {
          color: green;
        }

        .menuCategory {
          color: gray;
        }

        .modalFooter {
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .modalButton {
          background-color: #4F46E5; /* 보라색 버튼 배경 */
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
        }

        .modalButton:hover {
          background-color: #4338CA; /* 호버 상태의 배경 색상 */
        }

        .closeButton {
          position: absolute;
          top: 10px;
          right: 10px;
          font-size: 24px;
          color: #aaa;
          background: none;
          border: none;
          cursor: pointer;
        }

        .closeButton:hover {
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default ViewMenuModal;
