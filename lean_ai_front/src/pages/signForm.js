// signForm
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Modal from '../components/modal'; // Modal 컴포넌트를 import

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [phone, setPhone] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [email, setEmail] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [address, setAddress] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [marketingAccepted, setMarketingAccepted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showMarketingModal, setShowMarketingModal] = useState(false);

    const [termsAgreed, setTermsAgreed] = useState(false);
    const [marketingAgreed, setMarketingAgreed] = useState(false);

    const handleTermsAgree = () => {
        setTermsAgreed(true);
        setTermsAccepted(true);
        setShowTermsModal(false);
    };

    const handleMarketingAgree = () => {
        setMarketingAgreed(true);
        setMarketingAccepted(true);
        setShowMarketingModal(false);
    };


    const router = useRouter();
    /*
        const clickTerms = ;
        const clickMarketing ;
    */

    // 이용 약관
    const termsOfService = `
    **제 1조(목적)**

    이 약관은 ㈜린에이아이 가 운영하는 ‘스마트FAQ 챗봇 플랫폼’ (이하 “플랫폼”이라 한다)에서 제공하는 인터넷 관련 서비스(이하 “서비스”라 한다)를 이용함에 있어 사이버플랫폼과 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

    **제 2조(정의)**

    1.“플랫폼”이란 ㈜린에이아이가 재화 또는 용역을 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 재화 또는 용역을 거래할 수 있도록 설정한 가상의 영업장을 말하며, 아울러 사이버플랫폼을 운영하는 사업자의 의미로도 사용합니다.

    2.“이용자”란 “플랫폼”에 접속하여 이 약관에 따라 “플랫폼”이 제공하는 서비스를 받는 회원 및 비회원을 말합니다.

    3.“회원”이라 함은 “플랫폼”에 개인정보를 제공하여 회원등록을 한 자로서, “플랫폼”의 정보를 지속적으로 제공받으며, “플랫폼”이 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.

    4.“비회원”이라 함은 회원에 가입하지 않고 “플랫폼”이 제공하는 서비스를 이용하려는 자를 말합니다.

    **제3조(약관등의 명시와 설명 및 개정)**

    1.“플랫폼”은 이 약관의 내용과 상호 및 대표자 성명, 영업소 소재지 주소(소비자의 불만을 처리할 수 있는 곳의 주소를 포함), 개인정보 보호책임자, 전화번호전자우편주소, 사업자등록번호, 통신판매업신고번호 등을 이용자가 쉽게 알 수 있도록 “플랫폼”의 초기 서비스화면(전면)에 게시합니다. 다만, 약관의 내용은 이용자가 연결화면을 통하여 볼 수 있도록 할 수 있습니다.

    2.“플랫폼”은 전자상거래 등에서의 소비자 보호에 관한 법률, 약관의 규제에 관한 법률, 전자거래기본법, 전자서명법, 정보통신망이용촉진 등에 관한 법률, 방문판매 등에 관한 법률, 소비자보호법 등 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.

    3.“플랫폼”이 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 플랫폼의 초기화면에 그 적용일자 7일이전부터 적용일자 전일까지 공지합니다. 다만, 이용자에게 불리하게 약관내용을 변경하는 경우에는 최소한 30일 이상의 사전 유예기간을 두고 공지합니다. 이 경우 “플랫폼”은 개정 전 내용과 개정 후 내용을 명확하게 비교하여 이용자가 알기 쉽도록 표시합니다.

    4.“플랫폼”이 약관을 개정할 경우에는 그 개정약관은 그 적용일자 이후에 체결되는 계약에만 적용되고 그 이 전에 이미 체결된 계약에 대해서는 개정전의 약관조항이 그대로 적용됩니다. 다만 이미 계약을 체결한 이용자가 개정약관 조항의 적용을 받기를 원하는 뜻은 제3항에 의한 개정약관의 공지기간내에 “플랫폼”에 송신하여 “플랫폼”의 동의를 받은 경우에는 개정약관 조항이 적용됩니다.

    5.이 약관에서 정하지 아니한 사항과 이 약관의 해석에 관하여서는 전자상거래 등에서의 소비자보호에 관한 법률, 약관의 규제 등에 관한 법률, 공정거래위원회가 정하는 전자상거래 등에서의 소비자보호지침 및 관계법령 또는 상관례에 따릅니다.

    **제4조(서비스의 제공 및 변경)**

    1.“플랫폼”은 다음과 같은 업무를 수행합니다.

    재화 또는 용역에 대한 정보 제공 및 구매계약의 체결

    구매계약이 체결된 재화 또는 용역의 배송

    기타 “플랫폼”이 정하는 업무

    2.“플랫폼”은 재화 또는 용역의 품절 또는 기술적 사양의 변경 등의 경우에는 장차 체결되는 계약에 의해 제공할 재화 또는 용역의 내용을 변경할 수 있습니다. 이 경우에는 변경된 재화 또는 용역의 내용 및 제공일자를 명시하여 현재의 재화 또는 용역의 내용을 게시한 곳에 즉시 공지합니다.

    3.“플랫폼”이 제공하기로 회원과 계약을 체결한 서비스의 내용을 재화 등의 품절 또는 기술적 사양의 변경 등의 사유로 변경할 경우에는 그 사유를 이용자에게 통지 가능한 주소로 즉시 통지합니다.

    4.전항의 경우 “플랫폼”은 이로 인하여 회원이 입은 손해를 배상합니다. 다만, “플랫폼”이 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.

    **제5조(서비스의 중단)**

    1.“플랫폼”은 컴퓨터 등 정보통신설비의 보수점검·교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.

    2.“플랫폼”은 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 회원 또는 제3자가 입은 손해에 대하여 배상합니다. 단, “플랫폼”이 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.

    3.사업종목의 전환, 사업의 포기, 업체 간의 통합 등의 이유로 서비스를 제공할 수 없게 되는 경우에는 “플랫폼”은 제8조에 정한 방법으로 회원에게 통지하고 소비자피해보상규정에 따라 그 상당 금액을 현물 또는 현금으로 회원에게 보상한다.

    **제6조(회원가입)**

    1.이용자는 “플랫폼”이 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.

    2.“플랫폼”은 제 1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각호에 해당하지 않는 한 회원으로 등록합니다.

    가입신청자가 이 약관 제7조 제3항에 의하여 이전에 회원자격을 상실한 적이 있는 경우, 다만 제7조 제3항에 의한 회원자격 상실 후 3년이 경과한 자로서 “플랫폼”의 회원재가입 승낙을 얻은 경우에는 예외로 한다.

    등록 내용에 허위, 기재누락, 오기가 있는 경우

    기타 회원으로 등록하는 것이 “플랫폼”의 기술상 현저히 지장이 있다고 판단되는 경우

    3.회원가입계약의 성립시기는 “플랫폼”의 승낙이 회원에게 도달한 시점으로 합니다.

    4.회원은 제15조 제1항에 의한 등록사항에 변경이 있는 경우, 즉시 전자우편 또는 기타 방법으로 “플랫폼”에 대하여 그 변경사항을 알려야 합니다.

    **제7조(회원 탈퇴 및 자격 상실 등)**

    1.회원은 “플랫폼”에 언제든지 탈퇴를 요청할 수 있으며 “플랫폼”은 즉시 회원탈퇴를 처리합니다.

    2.회원이 다음 각호의 사유에 해당하는 경우, “플랫폼”은 회원자격을 제한 및 정지시킬 수 있습니다.

    가입 신청시에 허위 내용을 등록한 경우

    “플랫폼”을 이용하여 구입한 재화 등의 대금, 기타 “플랫폼” 이용에 관련하여 회원이 부담하는 채무를 기일에 지급하지 않는 경우

    다른 사람의 “플랫폼” 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우

    “플랫폼”을 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우

    3.“플랫폼”이 회원 자격을 제한정지 시킨 후, 동일한 행위가 2회이상 반복되거나 30일이내에 그 사유가 시정되지 아니하는 경우 “플랫폼”은 회원자격을 상실 시킬 수 있습니다.

    4.“플랫폼”이 회원자격을 상실시키는 경우에는 회원등록을 말소합니다. 이 경우 회원에게 이를 통지하고, 회원등록 말소전에 최소한 30일 이상의 기간을 정하여 소명할 기회를 부여합니다.

    **제9조(구매신청)**

    “플랫폼”의 회원은 “플랫폼”상에서 다음 또는 이와 유사한 방법에 의하여 구매를 신청하며, “비회원”은 회원가입 이후 구매신청이 가능합니다. “플랫폼”은 회원이 구매신청을 함에 있어서 다음의 각 내용을 제공합니다.

    1.재화 등의 검색 및 선택

    2.성명, 주소, 전화번호, 전자우편주소(또는 이동전화번호) 등의 입력

    3.약관내용, 청약철회권이 제한되는 서비스, 배송료·설치비 등의 비용부담과 관련한 내용에 대한 확인

    4.재화 등의 구매신청 및 이에 관한 확인 또는 “플랫폼”의 확인에 대한 동의

    5.결제방법의 선택.

    **제10조(계약의 성립)**

    1.“플랫폼”은 제9조와 같은 구매신청에 대하여 다음 각호에 해당하면 승낙하지 않을 수 있습니다.

    신청 내용에 허위, 기재누락, 오기가 있는 경우

    기타 구매신청에 승낙하는 것이 “플랫폼” 기술상 현저히 지장이 있다고 판단하는 경우

    2.구매계약신청자가 미성년자인 경우 법정대리인의 동의를 얻지 못한 구매계약은 미성년자 본인 또는 법정대리인이 계약을 취소할 수 있다.

    3.“플랫폼”의 승낙이 제12조 제1항의 수신확인통지형태로 이용자에게 도달한 시점에 계약이 성립한 것으로 봅니다.

    4.“플랫폼”의 승낙의 의사표시에는 회원의 구매 신청에 대한 확인 및 판매가능 여부, 구매신청의 정정 취소등에 관한 정보 등을 포함하여야 합니다.

    **제11조(지급방법)**

    “플랫폼”에서 구매한 재화 또는 용역에 대한 대금지급방법은 다음 각호의 방법 중 가용한 방법으로 할 수 있습니다. 단, “플랫폼”은 회원의 지급방법에 대하여 재화 등의 대금에 어떠한 명목의 수수료도 추가하여 징수할 수 없습니다.

    1.선불카드, 직불카드, 신용카드 등의 각종 카드 결제

    2.기타 전자적 지급 방법에 의한 대금 지급 등

    **제12조(수신확인통지·구매신청 변경 및 취소)**

    1.“플랫폼”은 회원의 구매신청이 있는 경우 회원에게 수신확인통지를 합니다.

    2.수신확인통지를 받은 회원은 의사표시의 불일치 등이 있는 경우에는 수신확인통지를 받은 후 즉시 구매신청 변경 및 취소를 요청할 수 있고 “플랫폼”은 배송전에 회원의 요청이 있는 경우에는 지체없이 그 요청에 따라 처리하여야 합니다. 다만 이미 대금을 지불한 경우에는 제15조의 청약철회 등에 관한 규정에 따릅니다.

    **제13조(재화 등의 공급)**

    1.“플랫폼”은 회원과 재화 등의 공급시기에 관하여 별도의 약정이 없는 이상, 회원이 청약을 한 날부터 7일 이내에 재화 등을 배송할 수 있도록 주문제작, 포장 등 기타의 필요한 조치를 취합니다. 다만, “플랫폼”이 이미 재화 등의 대금의 전부 또는 일부를 받은 경우에는 받은 날부터 2영업일 이내에 조치를 취합니다. 이때 “플랫폼”은 회원이 재화 등의 공급 절차 및 진행 사항을 확인할 수 있도록 적절한 조치를 합니다.

    2.“플랫폼”은 회원이 구매한 재화에 대해 배송수단, 수단별 배송비용 부담자, 수단별 배송기간 등을 명시합니다. 만약 “플랫폼”이 약정 배송기간을 초과한 경우에는 그로 인한 회원의 손해를 배상하여야 합니다. 다만 “플랫폼”이 고의·과실이 없음을 입증한 경우에는 그러하지 아니합니다.

    **제14조(환급)**

    “플랫폼”은 회원이 구매신청한 재화 등의 품절 등의 사유로 인도 또는 제공할 수 없을 때에는 지체없이 그 사유를 이용자에게 통지하고 사전에 재화 등의 대금을 받은 경우에는 대금을 받은 날부터 2영업일 이내에 환급하거나 환급에 필요한 조치를 취합니다.

    **제15조(청약철회 등)**

    “플랫폼”과 재화 등의 구매에 관한 계약을 체결한 회원은 수신확인의 통지를 받은 날부터 7일 이내에는 청약의 철회를 할 수 있습니다.

    회원은 재화 등을 배송 받은 경우 다음 각호에 해당하는 경우에는 반품 및 교환을 할 수 없습니다.

    - 반품요청기간이 지난 경우
    - 회원에게 책임 있는 사유로 재화 등이 멸실 또는 훼손된 경우(다만, 재화 등의 내용을 확인하기 위하여 포장 등을 훼손한 경우에는 청약철회를 할 수 있습니다)
    - 회원의 사용 또는 일부 소비에 의하여 재화 등의 가치가 현저히 감소한 경우
    - 시간의 경과에 의하여 재판매가 곤란할 정도로 재화 등의 가치가 현저히 감소한 경우
    - 같은 성능을 지닌 재화 등으로 복제가 가능한 경우 그 원본인 재화 등의 포장을 훼손한 경우
    - 회원의 요청사항에 맞춰 제작에 들어가는 맞춤제작상품의 경우

    3.제2항 제2호 내지 제4호의 경우에 “플랫폼”이 사전에 청약철회 등이 제한되는 사실을 소비자가 쉽게 알 수 있는 곳에 명기하거나 사용상품을 제공하는 등의 조치를 하지 않았다면 회원의 청약철회 등이 제한되지 않습니다.

    4.회원은 제1항 및 제2항의 규정에 불구하고 재화 등의 내용이 표시·광고 내용과 다르거나 계약내용과 다르게 이행된 때에는 당해 재화 등을 공급받은 날부터 3월 이내, 그 사실을 안 날 또는 알 수 있었던 날부터 30일 이내에 청약철회 등을 할 수 있습니다.

    **제16조(청약철회 등의 효과)**

    1.“플랫폼”은 회원으로부터 재화 등을 반환 받은 경우 3영업일 이내에 이미 지급받은 재화 등의 대금을 환급합니다. 이 경우 “플랫폼”이 회원에게 재화 등의 환급을 지연한 때에는 그 지연기간에 대하여 공정거래위원회가 정하여 고시하는 지연이자율을 곱하여 산정한 지연이자를 지급합니다.

    2.“플랫폼”은 위 대금을 환급함에 있어서 회원이 신용카드 또는 전자화폐 등의 결제수단으로 재화 등의 대금을 지급한 때에는 지체없이 당해 결제수단을 제공한 사업자로 하여금 재화 등의 대금의 청구를 정지 또는 취소하도록 요청합니다.

    3.청약철회 등의 경우 공급받은 재화 등의 반환에 필요한 비용은 회원이 부담합니다. “플랫폼”은 회원에게 청약철회 등을 이유로 위약금 또는 손해배상을 청구하지 않습니다. 다만 재화 등의 내용이 표시·광고 내용과 다르거나 계약내용과 다르게 이행되어 청약철회 등을 하는 경우 재화 등의 반환에 필요한 비용은 “플랫폼”이 부담합니다.

    4.회원이 재화 등을 제공받을 때 발송비를 부담한 경우에 “플랫폼”은 청약철회시 그 비용을 누가 부담하는 지를 이용자가 알기 쉽도록 명확하게 표시합니다.

    **제17조(개인정보보호)**

    1.“플랫폼”은 회원의 정보수집 시 구매계약 이행에 필요한 최소한의 정보를 수집합니다. 다음 사항을 필수사항으로 하며 그 외 사항은 선택사항으로 합니다.

    - 성명, 생년월일, 성별, 지역, 이동전화번호, ID, 비밀번호, 전자우편주소

    2.“플랫폼”이 회원의 개인식별이 가능한 개인정보를 수집하는 때에는 반드시 당해 회원의 동의를 받습니다.

    3.제공된 개인정보는 당해 회원의 동의없이 목적 외의 이용이나 제3자에게 제공할 수 없으며, 이에 대한 모든 책임은 “플랫폼”이 집니다. 다만, 다음의 경우에는 예외로 합니다.

    - 배송업무상 배송업체에게 배송에 필요한 최소한의 회원의 정보(성명,주소,전화번호)를 알려주는 경우
    - 통계작성, 학술연구 또는 시장조사를 위하여 필요한 경우로서 특정 개인을 식별할 수 없는 형태로 제공하는 경우
    - 재화 등의 거래에 따른 대금정산을 위하여 필요한 경우
    - 도용방지를 위하여 본인확인에 필요한 경우
    - 법률의 규정 또는 법률에 의하여 필요한 불가피한 사유가 있는 경우

    4.“플랫폼”이 제2항과 제3항에 의해 회원의 동의를 받아야 하는 경우에는 개인정보 보호책임자의 신원(소속, 성명 및 전화번호, 기타 연락처), 정보의 수집목적 및 이용목적, 제3자에 대한 정보제공 관련사항(제공받은 자, 제공목적 및 제공할 정보의 내용) 등 정보통신망이용촉진 등에 관한 법류 제22조 제2항이 규정한 사항을 미리 명시하거나 고지해야 하며 회원은 언제든지 이 동의를 철회할 수 있습니다.

    5.회원은 언제든지 “플랫폼”이 가지고 있는 자신의 개인정보에 대해 열람 및 오류정정을 요구할 수 있으며 “플랫폼”은 이에 대해 지체없이 필요한 조치를 취할 의무를 집니다. 회원이 오류의 정정을 요구한 경우에는 “플랫폼”은 그 오류를 정정할 때까지 당해 개인정보를 이용하지 않습니다.

    **제18조(“플랫폼”의 의무)**

    1.“플랫폼”은 법령과 이 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며 이 약관이 정하는 바에 따라 지속적이고, 안정적으로 재화·용역을 제공하는데 최선을 다하여야 합니다.

    2.“플랫폼”은 이용자가 안전하게 인터넷 서비스를 이용할 수 있도록 회원의 개인정보(신용정보 포함)보호를 위한 보안 시스템을 갖추어야 합니다.

    3.“플랫폼”이 상품이나 용역에 대하여 『표시·광고의 공정화에 관한 법률』 제3조 소정의 부당한 표시·광고행위를 함으로써 회원이 손해를 입은 때에는 이를 배상할 책임을 집니다.

    4.“플랫폼”은 회원이 원하지 않는 영리목적의 광고성 전자우편을 발송하지 않습니다.

    **제19조(회원의 ID 및 비밀번호에 대한 의무)**

    1.제17조의 경우를 제외한 ID와 비밀번호에 관한 관리 책임은 회원에게 있습니다.

    2.회원은 자신의 ID 및 비밀번호를 제3자에게 이용하게 해서는 안됩니다.

    3.회원이 자신의 ID 및 비밀번호를 도난 당하거나 제3자가 이용하고 있음을 인지한 경우에는 바로 “플랫폼”에 통보하고 “플랫폼”의 안내가 있는 경우에는 그에 따라야 합니다.

    **제20조(이용자의 의무)**

    이용자는 다음 행위를 하여서는 안됩니다.

    1.신청 또는 변경 시 허위 내용의 등록

    2.타인의 정보 도용

    3.“플랫폼”에 게시된 정보의 변경

    4.“플랫폼”이 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시

    5.“플랫폼” 기타 제3자의 저작권 등 지적재산권에 대한 침해

    6.“플랫폼” 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위

    7.외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 플랫폼에 공개 또는 게시하는 행위

    **제21조(저작권의 귀속 및 이용제한)**

    1.“플랫폼”이 작성한 저작물에 대한 저작권 기타 지적재산권은 “플랫폼”에 귀속합니다.

    2.이용자는 “플랫폼”을 이용함으로써 얻은 정보 중 “플랫폼”에게 지적재산권이 귀속된 정보를 “플랫폼”의 사전 승낙없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.

    3.“플랫폼”은 약정에 따라 이용자에게 귀속된 저작권을 사용하는 경우 당해 이용자에게 통보하여야 합니다.

    **제22조(분쟁해결)**

    1.“플랫폼”은 회원이 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 노력합니다.

    2.“플랫폼”은 회원으로부터 제출되는 불만사항 및 의견은 우선적으로 그 사항을 처리합니다. 다만, 신속한 처리가 곤란한 경우에는 회원에게 그 사유와 처리일정을 즉시 통보해 드립니다.

    3.“플랫폼”과 회원 간에 발생한 전자상거래 분쟁과 관련하여 회원의 피해구제신청이 있는 경우에는 공정거래위원회 또는 시·도지사가 의뢰하는 분쟁조정기관의 조정에 따를 수 있습니다.

    **제23조(재판권 및 준거법)**

    1.“플랫폼”과 회원 간에 발생한 전자상거래 분쟁에 관한 소송은 제소 당시의 회원의 주소에 의하고, 주소가 없는 경우에는 거소를 관할하는 지방법원의 전속관할로 합니다. 다만, 제소 당시 회원의 주소 또는 거소가 분명하지 않거나 외국 거주자의 경우에는 민사소송법상의 관할법원에 제기합니다.

    2.“플랫폼”과 회원 간에 제기된 전자상거래 소송에는 한국법을 적용합니다.

    **부칙**

    1.이 약관은 2024년 9월 1일부터 적용됩니다.
   ` ;

    // 개인 정보 동의
    const informationOfService = `
    ㈜린에이아이는 정보통신망 이용촉진 및 정보보호 등에 관한 법률(이하’정보통신망법’)과 개인정보 보호법 등 국내 관련 법령을 준수합니다.

    ㈜린에이아이가 운영하는 ’스마트FAQ 챗봇 플랫폼’ (이하 “플랫폼”이라 한다)의 회원 가입을 신청하시는 이용자에게 개인정보의 수집항목 및 이용목적, 개인정보의 보유 및 이용기간에 대하여 아래와 같이 안내 드립니다.

    1. 수집하는 개인정보 항목 (수정필요) 
    - 회원가입 시 : 이름, 아이디, 비밀번호, 휴대전화번호, 이메일
    - 이름, 생년월일, 성별, 통신사명, 휴대전화번호, 동일인식별정보(CI), 중복가입확인정보(DI), 카드사명, 카드번호, 계좌은행, 계좌번호, 예금주명, 결제 승인번호
    - 수취인정보(이름, 연락처, 주소)
    - 서비스 이용기록, 접속로그, 쿠키, 접속IP정보, 결제기록, 단말기 정보(OS종류 및 버전)
    1. 수집 및 이용 목적
    - 서비스 가입, 개인 식별, 본인 확인, 고객 상담, 서비스 이용 철회 처리 등의 회원 관리
    - 상품 구매에 따른 본인인증, 구매 및 요금 결제, 상품 및 서비스의 배송
    - 서비스 방문 및 이용 기록의 분석과 서비스 이용에 대한 통계 등을 기반으로 맞춤형 서비스제공 및 기존 서비스 개선, 신규 서비스 요소 개발 등 서비스 이용 환경 구축
    - 부정 이용(거래) 등의 법령 및 이용약관을 위배하거나 부정 이용 행위를 포함하여 서비스의 원활한 운영에 지장을 주는 이용자에 대한 제한 조치 및 제재, 계정도용 및 부정거래 방지, 약관 개정 등의 고지사항 전달, 분쟁조정을 위한 기록 보존, 민원처리 등 이용자 보호 및 서비스 운영
    - 특정 금융거래정보의 보고 및 이용 등에 관한 법률상의 고객 확인 의무 및 강화된 고객 확인 수행
    - 광고성 정보 제공 등 마케팅 및 프로모션 소식 전달, 이벤트 정보 및 참여기회 제공
    - 서비스 이용기록과 접속 빈도 분석, 서비스 이용에 대한 통계, 서비스 분석 및 통계에 따른 맞춤 서비스 제공 및 광고 게재
    - 보안, 프라이버시, 안전 측면에서 이용자가 안심하고 이용할 수 있는 서비스 이용환경 구축

    3.보유 및 이용기간, 파기

    - 이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이 달성되거나, 회원 탈퇴 요청 시 5일 이내에 재생이 불가능한 방법으로 파기합니다. 단, 아래의 정보에 대해서는 다음과 같은 이유로 명시한 기간 동안 보관합니다.
    - 부정거래 방지 및 금융사고 조사를 위하여 회사의 내부 방침에 따라 개인정보 수집-이용 동의 철회 시 탈퇴 데이터 베이스에서 6개월간 보관 후 삭제.
    - 전자상거래 등에서의 소비자 보호에 관한 법률, 전자금융거래법, 통신비밀보호법 등 법령에서 일정기간 정보의 보관을 규정하는 경우, 이 기간 동안 법령의 규정에 따라 개인정보를 보관하며, 다른 목적으로는 절대 이용하지 않습니다.
    - 전자상거래 등에서의 소비자 보호에 관한 법률 : 대금결제 및 재화 등의 공급에 관한 기록(5년), 계약 또는 청약철회 등에 관한 기록(5년), 소비자의 불만 또는 분쟁처리에 관한 기록(3년), 표시-광고에 관한 기록(6개월)
    - 전자금융거래법 : 전자금융 거래에 관한 기록(5년)
    - 위치정보의 보호 및 이용 등에 관한 법률 : 위치정보 취급대장(6개월)
    - 통신비밀보호법 : 웹사이트 방문 기록 (3개월)
    - 전자적 파일 형태의 경우 복구 및 재생이 되지 않도록 기술적인 방법을 이용하여 안전하게 삭제하며, 출력물 등은 분쇄하거나 소각하는 방식 등으로 파기합니다.
    - “플랫폼”에서는 ‘개인정보 유효기간제’에 따라 1년간 서비스를 이용하지 않은 회원의 개인정보를 별도로 분리 보관하여 관리하겠습니다.
    - 동의를 거부할 권리 및 거부 경우의 불이익

    귀하께서는 “플랫폼”이 위와 같이 수집하는 개인정보에 대해, 동의하지 않거나 개인정보를 기재하지 않음으로써 거부할 수 있습니다. 다만, 이때 회원에게 제공되는 서비스가 제한될 수 있습니다.
    ` ;

    const marketingOfService = `
    ㈜린에이아이는 정보통신망의 이용촉진 및 정보보호 등에 관한 법률 제50조 제1항에 따라 광고성 정보를 전송하기 위해 수신자의 사전 동의를 받고 있으며, 수신 동의여부를 정기적으로 확인합니다.

    광고성 정보 수신에 동의하실 경우, ㈜린에이아이가 제공하는 이벤트/혜택 등 다양한 정보 및 기타 유용한 광고성 정보가 휴대전화(카카오톡 알림 또는 문자), 이메일을 통해 발송됩니다.

    본 광고성 정보수신 동의 항목은 선택사항이므로 동의를 거부하는 경우에도 ㈜린에이아이 서비스의 이용에는 영향이 없습니다. 다만 거부 시 동의를 통해 제공 가능한 각종 혜택 이벤트 안내를 받아 보실 수 없습니다. 단, 결제 정보, 정기 결제 알림 등 광고성 정보 이외 의무적으로 안내되어야 하는 정보성 내용은 수신동의 여부와 무관하게 제공됩니다.

    수신동의의 의사표시 이후에도 마이페이지 접속을 통해 이용자의 의사에 따라 수신동의 상태를 변경(동의/철회)할 수 있습니다.
    `;


    const handleSignup = async () => {
        if (!username || !password || !confirmPassword || !name || !dob || !phone || !verificationCode || !email || !businessName || !address) {
            setErrorMessage('모든 필드를 입력해 주세요.');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (!termsAccepted) {
            setErrorMessage('이용약관 및 개인정보 수집 동의를 해야 합니다.');
            return;
        }

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    name,
                    dob,
                    phone,
                    verificationCode,
                    email,
                    businessName,
                    address,
                    marketingAccepted,
                }),
            });

            const data = await response.json();
            if (data.success) {
                router.push('/login');
            } else {
                setErrorMessage(data.message || '회원가입에 실패했습니다.');
            }
        } catch (error) {
            console.error('회원가입 오류:', error);
            setErrorMessage('회원가입 요청 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="bg-blue-100 flex flex-col items-center min-h-screen overflow-y-auto relative w-full">
            <div className="bg-white p-5 rounded-lg shadow-lg flex flex-col items-center text-center mt-2 mb-4 py-1.5 w-1/3 text-sm font-bold mb-2">
                <h1 className="text-3xl font-bold text-center mb-8 text-blue-400 mt-12">LEAN AI</h1>

                <div className="space-y-4">
                    <div>
                        <label className="flex items-center block text-gray-700" htmlFor="username">
                            <input
                                type="text"
                                placeholder="아이디"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="flex-grow border rounded-l-md px-4 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                            />
                            <button
                                className="text-white bg-purple-400 rounded-md px-4 py-2 border-l border-purple-400 hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 ml-2"
                            >
                                중복확인
                            </button>
                        </label>
                        <p className="text-red-500 text-sm mt-2">영문 소문자와 숫자만을 사용하여, 영문 소문자로 시작하는 4~12자의 아이디를 입력해주세요.</p>
                    </div>

                    <div>
                        <label className="flex items-center block text-gray-700 border rounded-md px-3 py-2" htmlFor="password">
                            <input
                                type="password"
                                placeholder="비밀번호"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="ml-2 w-full border-none focus:ring-0 outline-none"
                            />
                        </label>
                        <p className="text-red-500 text-sm mt-1">영문 대문자와 소문자, 숫자, 특수문자 중 2가지 이상을 조합하여 8자~20자로 입력해주세요.</p>
                    </div>

                    <div>
                        <label className="flex items-center block text-gray-700 border rounded-md px-3 py-2" htmlFor="confirmPassword">
                            <input
                                type="password"
                                placeholder="비밀번호 확인"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="ml-2 w-full border-none focus:ring-0 outline-none"
                            />
                        </label>
                    </div>

                    <div className="flex space-x-2">
                        <label className="flex-grow border rounded-md px-4 py-2">
                            <input
                                type="text"
                                placeholder="이름"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border-none focus:ring-0 outline-none"
                            />
                        </label>
                        <label className="flex-grow border rounded-md px-4 py-2">
                            <input
                                type="text"
                                placeholder="생년월일(ex.880111)"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                className="w-full border-none focus:ring-0 outline-none"
                            />
                        </label>
                    </div>

                    <div className="flex space-x-2">
                        <label className="flex-grow border rounded-md px-4 py-2">
                            <input
                                type="text"
                                placeholder="휴대폰 번호"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full border-none focus:ring-0 outline-none"
                            />
                        </label>
                        <button className="text-white bg-purple-400 rounded-md px-4 py-2">인증번호 받기</button>
                    </div>

                    <div className="flex items-center space-x-2">
                        <label className="flex-grow border rounded-md px-4 py-2 mb-4">
                            <input
                                type="text"
                                placeholder="인증번호"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                className="w-full border-none focus:ring-0 outline-none"
                            />
                        </label>
                        <p className="text-red-500">03:00</p>
                    </div>

                    <label className="flex items-center border rounded-md px-4 py-2">
                        <input
                            type="email"
                            placeholder="이메일"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border-none focus:ring-0 outline-none"
                        />
                    </label>

                    <label className="flex items-center border rounded-md px-4 py-2">
                        <input
                            type="text"
                            placeholder="업소명"
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            className="w-full border-none focus:ring-0 outline-none"
                        />
                    </label>

                    <label className="flex items-center border rounded-md px-4 py-2">
                        <input
                            type="text"
                            placeholder="주소"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full border-none focus:ring-0 outline-none"
                        />
                    </label>

                    <div className="flex items-center space-x-2 mt-4">
                        <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={() => setTermsAccepted(!termsAccepted)}
                            className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <label className="text-sm underline" onClick={() => setShowTermsModal(true)}>이용약관 및 개인정보 수집 동의(필수)</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={marketingAccepted}
                            onChange={() => setMarketingAccepted(!marketingAccepted)}
                            className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        <label className="text-sm underline" onClick={() => setShowMarketingModal(true)}>마케팅 활용 동의 및 광고 수신 동의(선택)</label>
                    </div>

                    {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}

                    <button
                        className="bg-gradient-to-r from-purple-400 to-blue-400 text-white font-bold py-2 px-4 rounded-md w-full mt-6"
                        onClick={handleSignup}
                    >
                        회원가입
                    </button>
                </div>

                <div className="mt-6 text-center text-gray-500">
                    <p>이미 계정이 있나요?
                        <Link href="/login" className="underline text-blue-500 p-1 m-1">로그인</Link>
                    </p>
                    <p className="mt-2">
                        계정을 잊어버리셨나요?
                        <Link href="/findingId" className="underline text-blue-500 p-1 m-1">계정찾기</Link>
                    </p>
                </div>
            </div>

            {/* 이용약관 모달 */}
            <Modal
                show={showTermsModal}
                onClose={() => setShowTermsModal(false)}
                title="이용약관 및 개인정보 수집 동의"
            >
                <p className='text-l font-semibold'>이용약관</p>
                <pre>{termsOfService}</pre>

                <p className='text-l font-semibold'>개인정보 수집 및 이용 동의</p>
                <pre>{informationOfService}</pre>

                <div className='flex flex-row items-center justify-center mb-3'>
                    <button
                        onClick={handleTermsAgree}
                        className="text-white bg-purple-400 rounded-md px-4 py-2 border-l border-purple-400 hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 ml-2"
                    >
                        동의합니다
                    </button>
                    <button
                        onClick={() => setShowTermsModal(false)}
                        className="text-white bg-purple-400 rounded-md px-4 py-2 border-l border-purple-400 hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 ml-2"
                    >
                        동의하지 않습니다
                    </button>
                </div>

            </Modal>


            {/* 마케팅 활용 동의 모달 */}
            <Modal
                show={showMarketingModal}
                onClose={() => setShowMarketingModal(false)}
                title="마케팅 활용 동의 및 광고 수신 동의"
            >
                <p className='text-l font-semibold'>마케팅 활용 동의 및 광고 수신 동의</p>
                <pre>{marketingOfService}</pre>

                <div className='flex flex-row items-center justify-center mb-3'>
                    <button
                        onClick={handleMarketingAgree}
                        className="text-white bg-purple-400 rounded-md px-4 py-2 border-l border-purple-400 hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 ml-2"
                    >
                        동의합니다
                    </button>
                    <button
                        onClick={() => setShowMarketingModal(false)}
                        className="text-white bg-purple-400 rounded-md px-4 py-2 border-l border-purple-400 hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 ml-2"
                    >
                        동의하지 않습니다
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Signup;