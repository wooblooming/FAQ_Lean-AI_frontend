import React from 'react';
import ModalText from './modalText';

const MarketingModal = ({ show, onClose, onAgree }) => {
    const marketingOfService = `
        ㈜린에이아이는 정보통신망의 이용촉진 및 정보보호 등에 관한 법률 제50조 제1항에 따라 광고성 정보를 전송하기 위해 수신자의 사전 동의를 받고 있으며, 수신 동의여부를 정기적으로 확인합니다.

        광고성 정보 수신에 동의하실 경우, (주)린에이아이가 제공하는 이벤트/혜택 등 다양한 정보 및 기타 유용한 광고성 정보가 휴대전화(카카오톡 알림 또는 문자), 이메일을 통해 발송됩니다.

        본 광고성 정보수신 동의 항목은 선택사항이므로 동의를 거부하는 경우에도 ㈜린에이아이 서비스의 이용에는 영향이 없습니다. 
        
        다만 거부 시 동의를 통해 제공 가능한 각종 혜택 이벤트 안내를 받아 보실 수 없습니다.
        
        단, 결제 정보, 정기 결제 알림 등 광고성 정보 이외 의무적으로 안내되어야 하는 정보성 내용은 수신동의 여부와 무관하게 제공됩니다.

        수신동의의 의사표시 이후에도 마이페이지 접속을 통해 이용자의 의사에 따라 수신동의 상태를 변경(동의/철회)할 수 있습니다.
    `;

    function handleAgree(isAgreed) {
        onAgree(isAgreed); // 동의 여부를 상위 컴포넌트에 전달
        onClose(); // 모달 닫기

    };

    return (
        <ModalText show={show} onClose={onClose} title="마케팅 활용 동의 및 광고 수신 동의 선택">
            <div className=" border rounded-md p-2 whitespace-pre text-wrap">
                <p>{marketingOfService}</p>
            </div>
            <div className='flex flex-row items-center justify-center mt-3 mb-3'>
                <div className='flex space-x-2'>
                    <button
                        onClick={() => handleAgree(true)}
                        className="text-white bg-indigo-300 rounded-md px-4 py-2 border-l border-indigo-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                        동의합니다
                    </button>
                    <button
                        onClick={() => handleAgree(false)}
                        className="text-white bg-indigo-300 rounded-md px-4 py-2 border-l border-indigo-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                        동의하지 않습니다
                    </button>
                </div>
            </div>
        </ModalText>
    );
};

export default MarketingModal;
