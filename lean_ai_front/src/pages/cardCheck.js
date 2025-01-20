import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "../contexts/authContext";
import config from "../../config";

const CardCheck = ({}) => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchPaymentHistory();
    }
  }, [token]);

  const fetchPaymentHistory = async () => {
    try {
      const response = await axios.get(
        `${config.apiDomain}/api/payment-history/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //console.log("Payment History:", response.data);
      setPaymentHistory(response.data);
    } catch (error) {
      console.error("Failed to fetch payment history:", error);
    }
  };

  return (
    <div className="min-h-screen p-6 font-sans bg-violet-50">
      <div className="flex flex-col space-y-6 w-full py-12 px-6 shadow-md rounded-lg bg-white">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <ChevronLeft
              className="h-6 w-6 md:h-8 md:w-8 text-indigo-700 cursor-pointer mr-2"
              onClick={() => router.back()}
            />

            <h1
              className="text-xl md:text-3xl font-bold text-center text-indigo-600"
              style={{ fontFamily: "NanumSquareExtraBold" }}
            >
              정기 결제 조회
            </h1>
          </div>
          <p className="text-gray-600 mx-8 md:mx-10 text-sm md:text-lg whitespace-nowrap" style={{ fontFamily: "NanumSquare" }}>
            지금까지 결제하신 내역을 확인해보세요
          </p>
        </div>

        <div className="rounded-xl overflow-x-auto">
          {paymentHistory.length === 0 ? (
            <p className="text-gray-600 text-center p-6">
              결제 내역이 없습니다.
            </p>
          ) : (
            <table className="w-full min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-50">
                <tr className="text-indigo-500 font-medium text-left">
                  <th
                    scope="col"
                    className="px-6 py-3  uppercase tracking-wider"
                  >
                    결제일시
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 uppercase tracking-wider"
                  >
                    결제금액
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 uppercase tracking-wider"
                  >
                    상태
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left uppercase tracking-wider"
                  >
                    주문번호
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentHistory.map((history) => (
                  <tr key={history.merchant_uid}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(history.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {history.amount.toLocaleString()}원
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                ${
                  history.status === "paid"
                    ? "bg-green-100 text-green-800"
                    : history.status === "failed"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
                      >
                        {history.status === "paid"
                          ? "결제완료"
                          : history.status === "failed"
                          ? "결제실패"
                          : "처리중"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {history.merchant_uid}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardCheck;
