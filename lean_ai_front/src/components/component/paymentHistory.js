import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, ScrollText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "../../contexts/authContext";
import ModalErrorMSG from "../modal/modalErrorMSG";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

const PaymentHistory = () => {
  const [paymentHistory, setPaymentHistory] = useState([]); // 결제 내역 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [itemsPerPage, setItemsPerPage] = useState(8); // 페이지당 항목 수 (기본값 데스크탑)
  const { token } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(paymentHistory.length / itemsPerPage);

  const currentItems = paymentHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    // 화면 크기에 따라 itemsPerPage 설정
    const updateItemsPerPage = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(3); // 모바일
      } else {
        setItemsPerPage(8); // 데스크탑
      }
    };

    // 초기 설정
    updateItemsPerPage();

    // 화면 크기 변화 감지
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  useEffect(() => {
    if (token) {
      fetchPaymentHistory();
    }
  }, [token]);

  const fetchPaymentHistory = async () => {
    try {
      const response = await axios.get(
        `${API_DOMAIN}/api/payment-history/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const formattedData = response.data.payment_data.map((payment) => {
        return {
          ...payment,
          formattedDate:
            payment.status === "scheduled"
              ? new Date(payment.scheduled_at).toLocaleDateString()
              : new Date(payment.created_at || payment.paid_at).toLocaleDateString(),
          formattedAmount: Number(payment.amount).toLocaleString(),

        };
      });
      
      setPaymentHistory(formattedData);
      // console.log(formattedData);
    } catch (error) {
      console.error("Failed to fetch payment history:", error);
      setErrorMessage("결제 내역을 가져오는데 실패했습니다.");
      setShowErrorModal(true);
    }
  };

  return (
    <div>
      <Card className="bg-white">
        {/* 헤더 */}
        <CardContent className="p-3 md:p-6 flex flex-col space-y-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
              <ScrollText className="h-6 w-6" />
              현재 결제 내역
            </h3>
          </div>

          {/* PC: 테이블 형식 */}
          <div className="hidden md:block">
            {paymentHistory.length === 0 ? (
              <p className="text-gray-600 text-center p-6">
                결제 내역이 없습니다.
              </p>
            ) : (
              <table className="w-full min-w-full divide-y divide-gray-200 table-fixed border-b border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-indigo-50 whitespace-nowrap rounded-t-lg">
                  <tr className="text-indigo-500 font-medium text-center">
                    <th className="w-[25%] px-1 md:px-6 py-2 ">결제일시</th>
                    <th className="w-[20%] px-1 md:px-6 py-2 ">결제금액</th>
                    <th className="w-[15%] px-1 md:px-6 py-2 ">상태</th>
                    <th className="w-[40%] px-1 md:px-6 py-2 truncate">
                      주문번호
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-center text-gray-700 rounded-b-lg">
                  {currentItems.map((history) => (
                    <tr key={history.merchant_uid}>
                      <td className="px-1 md:px-6 py-2">
                        {history.formattedDate}
                      </td>
                      <td className="px-1 md:px-6 py-2 font-medium">
                        {history.formattedAmount}원
                      </td>
                      <td className="px-1 md:px-6 py-2">
                        <span
                          className={`px-3 py-1.5 text-sm whitespace-nowrap leading-5 font-semibold rounded-full
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
                      </td>
                      <td className="px-1 md:px-6 py-2 truncate">
                        {history.merchant_uid}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* 모바일: 카드 스타일 */}
          <div className="md:hidden space-y-4">
            {paymentHistory.length === 0 ? (
              <p className="text-gray-600 text-center p-6">
                결제 내역이 없습니다.
              </p>
            ) : (
              currentItems.map((history) => (
                <div
                  key={history.merchant_uid}
                  className="p-4 bg-white rounded-lg shadow-md border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">
                      {history.formattedDate}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium
                    ${
                      history.status === "paid"
                        ? "bg-green-200 text-green-900"
                        : history.status === "failed"
                        ? "bg-red-200 text-red-900"
                        : history.status === "scheduled"
                        ? "bg-blue-200 text-blue-900"
                        : history.status === "canceled"
                        ? "bg-gray-200 text-gray-900"
                        : "bg-yellow-200 text-yellow-900"
                    }`}
                    >
                      {history.status === "paid"
                        ? "완료"
                        : history.status === "failed"
                        ? "실패"
                        : history.status === "scheduled"
                        ? "예정"
                        : history.status === "canceled"
                        ? "취소"
                        : "결제중"}
                    </span>
                  </div>
                  <div className="flex flex-col justify-between items-start">
                    <span className="font-semibold text-gray-700 whitespace-nowrap">
                      {history.formattedAmount}원
                    </span>
                    <span className="text-sm text-gray-500 truncate">
                      {history.merchant_uid}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>

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
                    ? "text-indigo-500 font-bold"
                    : "text-gray-400"
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

        {/* 에러 메시지 모달 */}
        <ModalErrorMSG show={showErrorModal} onClose={closeErrorModal}>
          {errorMessage}
        </ModalErrorMSG>
      </Card>
    </div>
  );
};

export default PaymentHistory;
