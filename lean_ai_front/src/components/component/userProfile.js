import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';
import ModalMSG from '../modal/modalMSG';
import ModalErrorMSG from '../modal/modalErrorMSG';
import VerificationModal from '../modal/verificationModal';
import { fetchPublicDepartment } from '../../fetch/fetchPublicDepart';
import styles from '../../styles/selectStyles.module.css';
import config from '../../../config';

const UserProfileForm = ({
  userData = {},
  isPublicOn,
  token,
  storeID,
  onUpdateUserData
}) => {

  if (!userData) {
    return <div>사용자 데이터를 불러오는 중입니다...</div>;
  }

  // State 관리
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 내용
  const [message, setMessage] = useState(''); // 일반 메시지 내용
  const [showMessageModal, setShowMessageModal] = useState(false); // 일반 메시지 모달의 열림/닫힘 상태
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 메시지 모달의 열림/닫힘 상태
  const [verificationCode, setVerificationCode] = useState(''); // 입력된 인증번호
  const [showCodeModal, setShowCodeModal] = useState(false); // 인증번호 입력 모달 상태 관리
  const [editing, setEditing] = useState(false); // 수정 상태
  const [depart, setDepart] = useState(); // 초기값을 빈 배열로 설정
  const [departments, setDepartments] = useState([]); // 초기값을 빈 배열로 설정
  const [departOptions, setDepartOptions] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const fetchUrl = isPublicOn ? `${config.apiDomain}/public` : `${config.apiDomain}/api`;

  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setEmail(userData.email || '');
      setPhoneNumber(userData.phone_number || '');

      if (isPublicOn) {
        //console.log("user department: ", userData?.department?.department_name || "부서 정보 없음");
        if (userData.department) {
          setDepart(userData.department.department_name || "부서 정보 없음");
        } else {
          setDepart("부서 정보 없음");
        }
      
      }
    }
  }, [userData]);

  const handleChange = (field, value) => {
    const updatedData = { ...userData, [field]: value };
    if (field === 'name') setName(value);
    if (field === 'email') setEmail(value);
    if (field === 'phone_number') setPhoneNumber(value);

    onUpdateUserData(updatedData); // 변경 사항 상위로 전달
  };


  useEffect(() => {
    if (editing && isPublicOn && storeID && token) {
      fetchPublicDepartment({ storeID }, null, (data) => {
        setDepartments(Array.isArray(data) ? data : []); // 항상 배열로 설정
      });
    }
  }, [editing, isPublicOn, storeID, token]);

  useEffect(() => {
    //console.log("department list : ", departments);
    if (Array.isArray(departments) && departments.length > 0) {
      const formattedOptions = departments.map((dept) => ({
        label: dept,
        value: dept,
      }));
      setDepartOptions(formattedOptions);
    } else {
      setDepartOptions([]); // departments가 배열이 아닐 경우 대비
    }
  }, [departments]);  

  const handleEditToggle = async () => {
    if (editing && selectedDepartment) {
      try {
        const response = await axios.put(
          `${config.apiDomain}/public/departments/update/`,
          {
            department_name: selectedDepartment.value,
            public_id: storeID,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.status === 200 && response.data.message) {
          const newDepartment = selectedDepartment.value;
  
          // 부서 업데이트와 상위 컴포넌트 동기화
          const updatedUserData = {
            ...userData,
            department: { department_name: newDepartment },
          };
          onUpdateUserData(updatedUserData); // 즉시 상위 컴포넌트에 전달
  
          // 로컬 상태 업데이트
          setDepart(newDepartment);
  
          setMessage(response.data.message || "부서가 성공적으로 변경되었습니다.");
          setShowMessageModal(true);
        } else {
          throw new Error("부서 변경 중 문제가 발생했습니다."); // 성공하지 않은 응답 처리
        }
      } catch (error) {
        const errorMsg = error.response?.data?.error || "부서 변경 중 문제가 발생했습니다.";
        setErrorMessage(errorMsg);
        setShowErrorMessageModal(true);
      }
    }
  
    setEditing((prev) => !prev); // 수정 모드 토글
  };
  

  const handleDepartmentChange = (selectedOption) => {
    setSelectedDepartment(selectedOption);

    if (selectedOption) {
      // 상위 컴포넌트에 변경 사항 전달
      const updatedData = {
        ...userData,
        department: { department_name: selectedOption.value },
      };
      onUpdateUserData(updatedData);
    }
  };

  const handleCreateDepartment = async (newDepartment) => {
    try {
      const response = await axios.post(
        `${config.apiDomain}/public/departments/`,
        { department_name: newDepartment, public_id: storeID },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newOption = {
        label: response.data.department_name,
        value: response.data.department_name,
      };
      setDepartOptions((prev) => [...prev, newOption]);
      setSelectedDepartment(newOption);
    } catch (error) {
      console.error('부서 추가 중 오류 발생:', error);
    }
  };

  // 일반 메시지 모달 닫기 & 초기화
  const handleMessageModalClose = () => {
    setShowMessageModal(false);
    setMessage('');
  };


  // 에러 메시지 모달 닫기 & 초기화
  const handleErrorMessageModalClose = () => {
    setShowErrorMessageModal(false);
    setErrorMessage('');
  };

  // 핸드폰 번호로 인증번호 전송 요청
  const handleSendCode = async () => {
    const phoneRegex = /^\d{11}$/; // 핸드폰 번호 형식 검증 (11자리 숫자)
    if (!phoneRegex.test(phoneNumber)) {
      setErrorMessage('핸드폰 번호를 확인해 주세요');
      setShowErrorMessageModal(true);
      return;
    }

    try {
      const response = await fetch(`${fetchUrl}/send-code/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneNumber,
          type: 'mypage',
          user_id: userData.user_id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setVerificationCode(''); // 모달을 열 때 인증번호 초기화
        setShowCodeModal(true); // 인증번호 입력 모달 열기
      } else {
        setErrorMessage(data.message);
        setShowErrorMessageModal(true);
      }
    } catch (error) {
      setErrorMessage('인증 번호 요청 중 오류가 발생했습니다.');
      setShowErrorMessageModal(true);
    }
  };

  // 받은 인증번호가 백엔드에서 보낸 인증번호와 일치하는지 확인
  const handleChangePhoneNumber = async () => {
    if (!verificationCode) {
      setErrorMessage("인증번호를 입력해주세요.");
      setShowErrorMessageModal(true);
      return;
    }

    try {
      const response = await axios.post(
        `${fetchUrl}/verify-code/`, // 서버에서 인증번호 확인 API
        {
          phone: phoneNumber,
          code: verificationCode, // 입력된 인증번호
          type: 'mypage', // 용도 구분 (예: mypage)
          user_id: userData.user_id, // 사용자 ID 전달
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        // 인증 성공 시 핸드폰 번호 업데이트
        const updatedData = { ...userData, phone_number: phoneNumber };
        onUpdateUserData(updatedData); // 상위 컴포넌트로 전달
        setMessage("핸드폰 번호가 성공적으로 변경되었습니다.");
        setShowMessageModal(true);
        setShowCodeModal(false); // 인증번호 입력 모달 닫기
      } else {
        setErrorMessage(response.data.message || "인증 실패");
        setShowErrorMessageModal(true);
      }
    } catch (error) {
      setErrorMessage("핸드폰 번호 인증 중 오류가 발생했습니다.");
      setShowErrorMessageModal(true);
    }
  };


  // 핸드폰 인증번호 입력 모달에서 "확인" 버튼 클릭 시 호출
  const handleVerifyPhoneNumber = async () => {
    handleChangePhoneNumber(); // 핸드폰 번호 변경 처리 함수 호출
  };


  // 인증번호 모달을 닫을 때 에러 메시지 초기화
  const handleCodeModalClose = () => {
    setShowCodeModal(false);
    setVerificationCode(''); // 인증번호 초기화
  };

  // CreatableSelect 디자인
  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderBottom: '1.5px solid #6366f1',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      borderRadius: 0,
      boxShadow: 'none',
      className: styles.selectControl, // CSS 모듈 클래스 추가
    }),
    valueContainer: (provided) => ({
      ...provided,
      className: styles.valueContainer,
    }),
    input: (provided) => ({
      ...provided,
      className: styles.input,
    }),
    indicatorSeparator: () => ({
      display: 'none',
      className: styles.indicatorSeparator,
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      className: styles.dropdownIndicator,
    }),
    menu: (provided) => ({
      ...provided,
      className: styles.menu,
    }),
    option: (provided, state) => ({
      ...provided,
      className: `
        ${state.isSelected ? styles.optionSelected : ''} 
        ${state.isFocused ? styles.optionFocused : styles.option}
      `,
    }),
  };

  return (
    <div className="flex flex-col items-start py-4 font-sans space-y-2">
      <div className='font-semibold text-lg' style={{ fontFamily: "NanumSquareExtraBold" }}>사용자 정보</div>

      {/* 사용자 정보 입력 필드 */}
      <div className='flex flex-col px-2 space-y-4'>
        {/* 이름 입력 필드 */}
        <div className='flex flex-col '>
          <div className='text-sm text-gray-400 mr-1.5 whitespace-nowrap text-left' style={{ fontFamily: "NanumSquare" }}>이름</div>
          <input
            type="text"
            value={name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            style={{
              border: 'none',
              borderBottom: '1.5px solid #6366f1',
              outline: 'none',
              padding: '2px 0',
              width: '100%',
            }}
          />
        </div>

        {/* ID 표시 필드 */}
        <div className='flex flex-col '>
          <div className='text-sm text-gray-400 mr-1.5 text-left' style={{ fontFamily: "NanumSquare" }}> 아이디</div>
          <div
            type="id"
            style={{
              border: 'none',
              borderBottom: '1.5px solid #6366f1',
              outline: 'none',
              padding: '2px 0',
              width: '100%',
            }}
          >
            <div className='text-left'>{userData.user_id}</div> {/* ID는 수정 불가 */}
          </div>
        </div>

        {/* 이메일 입력 필드 */}
        <div className='flex flex-col'>
          <div className='text-sm text-gray-400 text-left' style={{ fontFamily: "NanumSquare" }}>이메일</div>
          <input
            type="email"
            value={email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            style={{
              border: 'none',
              borderBottom: '1.5px solid #6366f1',
              outline: 'none',
              padding: '2px 0',
              width: '100%',
            }}
          />
        </div>

        {/* 전화번호 입력 필드 및 인증번호 받기 버튼 */}
        <div className='flex flex-col'>
          <div className='text-sm text-gray-400 mr-1.5 text-left' style={{ fontFamily: "NanumSquare" }}>전화번호</div>
          <div className='flex flex-row justify-between space-x-4'>
            <input
              type="text"
              value={phoneNumber || ''}
              onChange={(e) => handleChange('phone_number', e.target.value)}
              style={{
                border: 'none',
                borderBottom: '1.5px solid #6366f1',
                outline: 'none',
                padding: '2px 0',
                width: '100%',
              }}
            />
            <button
              className="text-center bg-indigo-500 text-white rounded-lg px-2 py-1.5 whitespace-nowrap"
              onClick={handleSendCode}
              style={{ fontFamily: "NanumSquareBold" }}
            >
              인증번호 받기
            </button>
          </div>
        </div>

        {/* 소속부서 입력 필드 */}
        {isPublicOn &&
          <div className="flex flex-col">
            <div className='text-sm text-gray-400 mr-1.5 text-left' style={{ fontFamily: "NanumSquare" }}>소속 부서</div>
            <div className="flex items-center space-x-2"> {/* 부서 정보와 버튼을 같은 줄에 배치 */}
              {editing ? (
                <CreatableSelect
                  components={makeAnimated()}
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                  options={departOptions}
                  isClearable
                  placeholder="부서를 선택해주세요"
                  onCreateOption={handleCreateDepartment}
                  formatCreateLabel={(inputValue) => `"${inputValue}" 부서 추가`}
                  className="flex-grow"
                  styles={customStyles}
                />
              ) : (
                <div id='department' className='text-left flex-grow' style={{ fontFamily: "NanumSquare" }}>
                  {depart || "부서 정보 없음"}
                </div>
              )}
              {/* 수정 버튼 */}
              <button
                className="text-center bg-indigo-500 text-white rounded-lg px-4 py-1.5"
                onClick={handleEditToggle}
                style={{ fontFamily: "NanumSquareBold" }}
              >
                {editing ? "완료" : "부서 수정"}
              </button>
            </div>
          </div>

        }
      </div>

      {/* 핸드폰 인증번호 입력 모달 */}
      <VerificationModal
        isOpen={showCodeModal}
        onClose={handleCodeModalClose}
        onSubmit={handleVerifyPhoneNumber}
        verificationCode={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        errorMessage={errorMessage}
      />

      {/* 성공 메시지 모달 */}
      <ModalMSG
        show={showMessageModal}
        onClose={handleMessageModalClose}
        title="Success"
      >
        <p style={{ whiteSpace: 'pre-line' }}>
          {message}
        </p>
      </ModalMSG>

      {/* 에러 메시지 모달 */}
      <ModalErrorMSG
        show={showErrorMessageModal}
        onClose={handleErrorMessageModalClose}
        title="Error"
      >
        <p style={{ whiteSpace: 'pre-line' }}>
          {errorMessage}
        </p>
      </ModalErrorMSG>
    </div>
  );
};

export default UserProfileForm;
