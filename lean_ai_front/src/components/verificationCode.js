import React from 'react';
// import api from './api/certify';

const VerificationCode = ({ formData, setFormData }) => {
    const onClickCertify = async () => {
        const left = screen.width / 2 - 500 / 2;
        const top = screen.height / 2 - 800 / 2;
        const option = `status=no, menubar=no, toolbar=no, resizable=no, width=500, height=600, left=${left}, top=${top}`;
        const returnUrl = `${window.location.origin}/api/nice`;  // 본인인증 결과를 전달받을 api url

        try {
            const res = await api.get('/api/token', { params: { returnUrl } });

            if (res.data) {
                const { enc_data, integrity_value, token_version_id } = res.data;
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = 'https://your-nice-url.com'; // NICE 본인인증 요청 URL
                form.target = 'nicePopup';

                // hidden input elements to send the data
                const encDataInput = document.createElement('input');
                encDataInput.type = 'hidden';
                encDataInput.name = 'enc_data';
                encDataInput.value = enc_data;

                const tokenVersionInput = document.createElement('input');
                tokenVersionInput.type = 'hidden';
                tokenVersionInput.name = 'token_version_id';
                tokenVersionInput.value = token_version_id;

                const integrityValueInput = document.createElement('input');
                integrityValueInput.type = 'hidden';
                integrityValueInput.name = 'integrity_value';
                integrityValueInput.value = integrity_value;

                form.appendChild(encDataInput);
                form.appendChild(tokenVersionInput);
                form.appendChild(integrityValueInput);

                document.body.appendChild(form);

                window.open('', 'nicePopup', option);
                form.submit();

                // Clean up the form after submission
                document.body.removeChild(form);
            }
        } catch (error) {
            console.error('Error during certification:', error);
        }
    };


    return (
        <div className="flex space-x-2">
            <label className="flex-grow border rounded-md px-4 py-2">
                <input
                    type="text"
                    name="phone"
                    placeholder="휴대폰 번호"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border-none focus:ring-0 outline-none"
                />
            </label>

            { /* 표준창 호출시 필요한 데이터 전송을 위한 form */}
            <form name="form" id="form" action="https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb">
                <input type="hidden" id="m" name="m" value="service" />
                <input type="hidden" id="token_version_id" name="token_version_id" value="" />
                <input type="hidden" id="enc_data" name="enc_data" />
                <input type="hidden" id="integrity_value" name="integrity_value" />
            </form>

            <button className="text-white bg-purple-400 rounded-md px-4 py-2" onClick={onClickCertify}>인증번호 받기</button>
        </div>
    );
};

export default VerificationCode;