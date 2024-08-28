import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import config from '../../config';


const MyPage = () => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(''); 
  const [name, setName] = useState(''); 

  const toggleImageModal = () => {
    setIsImageModalOpen(!isImageModalOpen);
  };

  const chooseImage = async (event) => {
    const file = event.target.files[0];
    if (file) {
        const imageUrl = URL.createObjectURL(file);
        setProfileImage(imageUrl);


        const formData = new FormData();
        formData.append('profile_photo', file);

        try {
            const token = localStorage.getItem('token'); 
            const response = await fetch(`${config.localhosts}/api/update-profile-photo/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    // 'Content-Type': 'application/json' 헤더 제거
                },
                body: formData,  // FormData 객체를 바디에 전송
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const data = await response.json();
            console.log('Server Response:', data.message);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    }
    toggleImageModal(); 
};

  const applyDefaultImage = async () => {
    const defaultImageUrl = `${config.localhosts}/media/profile_photos/user_img.jpg`;
    setProfileImage(defaultImageUrl); 

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.localhosts}/api/update-profile-photo/'`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ profile_photo: `profile_photos/user_img.jpg` }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile image');
      }

      const data = await response.json();
      console.log('Server Response:', data.message);
    } catch (error) {
      console.error('Error updating profile image:', error);
    }

    toggleImageModal();
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch( `${config.localhosts}/api/user-profile/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setName(data.name || '');
        setProfileImage(data.profile_photo); 
      } else {
        console.error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center relative font-sans">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center relative">
        {/* 뒤로가기 버튼 */}
        <Link href="/mainPageForPresident" className="absolute top-4 left-4 text-gray-500 focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>

        {/* 프로필 이미지 */}
        <div className="mb-4">
          <img
            src={profileImage}
            alt="프로필 이미지"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-bold">{name}</h2> {/* 사용자 이름 표시 */}
          <button
            onClick={toggleImageModal}
            className="bg-blue-500 text-white text-sm px-4 py-2 rounded-lg mt-2"
          >
            프로필 변경
          </button>
        </div>
        <div className="space-y-4 mt-6">
          <Link href="/editData" className="w-full">
            <button className="bg-gray-200 w-full text-lg py-4 rounded-lg">
              데이터 수정하기
            </button>
          </Link>
          <Link href="/changeInfo">
            <button className="bg-gray-200 w-full text-lg py-4 rounded-lg mt-4">
              업종 정보 수정하기
            </button>
          </Link>
        </div>
      </div>

      {isImageModalOpen && (
        <div
          id="imageModal"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 "
        >
          <div className="modal-content bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">프로필 사진 설정</h2>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="fileInput"
              onChange={chooseImage}
            />
            <button
              onClick={() => document.getElementById('fileInput').click()}
              className="block w-full mb-2 py-2 text-black"
            >
              앨범에서 사진/동영상 선택
            </button>
            <button
              onClick={applyDefaultImage}
              className="block w-full py-2 text-black"
            >
              기본 이미지 적용
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
