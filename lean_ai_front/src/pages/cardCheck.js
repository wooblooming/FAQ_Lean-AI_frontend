import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../contexts/authContext";
import { useStore } from "../contexts/storeContext";
import { fetchCardInfo } from "../fetch/fetchCardInfo";
import { fetchStoreUser } from "../fetch/fetchStoreUser";
import config from "../../config";

const CardCheck = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const router = useRouter();
  const { token } = useAuth();
  const { storeID } = useStore();
  const [userData, setUserData] = useState(null);
  const [cardInfo, setCardInfo] = useState(null);
  const [time, setTime] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const totalPages = Math.ceil(paymentHistory.length / itemsPerPage);
  const currentItems = paymentHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (token) {
      fetchPaymentHistory();
      fetchStoreUser(storeID, token, setUserData, setErrorMessage);
    }
  }, [token]);

  // 카드 정보 가져오기
  useEffect(() => {
    if (userData?.billing_key && token) {
      fetchCardInfo(token, setCardInfo, setErrorMessage);
    }
  }, [userData, token]);

  const formatCardName = (cardInfo) => {
    if (!cardInfo) return "카드 정보 없음"; // cardInfo가 없는 경우 기본 메시지 반환
    const { card_name, card_number } = cardInfo;
    const formattedNumber = card_number ? card_number.slice(0, 4) : "번호 없음"; // 카드 번호의 앞 4자리
    return `${card_name}_${formattedNumber}`; // 카드 이름과 번호 결합
  };

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
      console.log("Payment History:", response.data);
      setPaymentHistory(response.data);
    } catch (error) {
      console.error("Failed to fetch payment history:", error);
    }
  };

  useEffect(() => {
    if (paymentHistory.length > 0) {
      const firstPayment = paymentHistory[0];  
      // `created_at` 또는 `paid_at` 값 확인
      const timestamp = firstPayment.created_at || firstPayment.paid_at;

      if (timestamp) {
        setTime(new Date(timestamp * 1000).toLocaleString());
      } else {
        console.warn("Neither created_at nor paid_at is available in the payment data.");
      }
    }
  }, [paymentHistory]);
  
  return (
    <div className="min-h-screen p-6 font-sans bg-violet-50">
      <div className="flex flex-col space-y-6 w-full py-12 px-6 shadow-md rounded-lg bg-white">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <ChevronLeft
              className="h-6 w-6 md:h-8 md:w-8 text-indigo-700 cursor-pointer mr-2"
              onClick={() => router.push("/myPage")}
            />

            <h1
              className="text-xl md:text-3xl font-bold text-center text-indigo-600"
              style={{ fontFamily: "NanumSquareExtraBold" }}
            >
              정기 결제 조회
            </h1>
          </div>
          <p
            className="text-gray-600 mx-8 md:mx-10 text-sm md:text-lg whitespace-nowrap"
            style={{ fontFamily: "NanumSquare" }}
          >
            지금까지 결제하신 내역을 확인해보세요
          </p>
        </div>

        <div className="rounded-t-lg border-b border-gray-200 overflow-x-auto">
          {paymentHistory.length === 0 ? (
            <p className="text-gray-600 text-center p-6">
              결제 내역이 없습니다.
            </p>
          ) : (
            <>
              <table className="w-full min-w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-indigo-50">
                  <tr className="text-indigo-500 font-medium text-center">
                    <th
                      scope="col"
                      className="w-[20%] px-2 md:px-6 py-3 uppercase tracking-wider"
                    >
                      결제일시
                    </th>
                    <th
                      scope="col"
                      className="w-[20%] px-2 md:px-6 py-3 uppercase tracking-wider"
                    >
                      결제금액
                    </th>
                    <th
                      scope="col"
                      className="w-[10%] px-2 md:px-6 py-3 uppercase tracking-wider"
                    >
                      상태
                    </th>
                    <th
                      scope="col"
                      className="w-[35%] px-2 md:px-6 py-3 uppercase tracking-wider"
                    >
                      주문번호
                    </th>
                    <th
                      scope="col"
                      className="w-[20%] px-2 md:px-6 py-3 uppercase tracking-wider"
                    >
                      카드정보
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-center">
                  {currentItems.map((history) => (
                    <tr key={history.merchant_uid}>
                      <td className="w-[20%] px-2 md:px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {time}
                      </td>
                      <td className="w-[20%] px-2 md:px-6 py-34 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {history.amount.toLocaleString()}원
                      </td>
                      <td className="w-[10%] px-2 md:px-6 py-3 whitespace-nowrap align-middle">
                        <div className="flex justify-center">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${
                              history.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : history.status === "failed"
                                ? "bg-red-100 text-red-800"
                                : history.status === "scheduled"
                                ? "bg-blue-100 text-blue-800"
                                : history.status === "canceled"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {history.status === "paid"
                              ? "결제완료"
                              : history.status === "failed"
                              ? "결제실패"
                              : history.status === "scheduled"
                              ? "결제예정"
                              : history.status === "canceled"
                              ? "결제취소"
                              : "결제중"}
                          </span>
                        </div>
                      </td>
                      <td className="w-[35%] px-2 md:px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {history.merchant_uid}
                      </td>
                      <td className="w-[20%] px-2 md:px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {formatCardName(cardInfo)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div
                  className="flex justify-center space-x-2 py-4"
                  style={{ fontFamily: "NanumSquare" }}
                >
                  <button
                    className="text-indigo-500 font-bold"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft />
                  </button>

                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`p-2 rounded-md ${
                        currentPage === index + 1
                          ? "text-indigo-500 font-bold" // 현재 페이지
                          : "text-gray-400 " // 다른 페이지
                      }`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    className="text-indigo-500 font-bold"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardCheck;
