import Link from 'next/link';

const storeIntroduce = () => {
  return (
    <div className="bg-white flex flex-col items-center min-h-screen overflow-y-auto relative w-full">
      <div className="border-blue-300 border p-5 rounded-lg shadow-lg flex flex-col items-center text-center mt-2 mb-4 py-1.5 w-1/3">
        <div className=" rounded-lg p-8 w-full max-w-md text-center mb-2">
          {/* 매장 로고 이미지 또는 상표 이미지 */}
          <img src="/banner_1.png" alt="Store" className="mx-auto mb-4 w-64 h-52 object-contain" />

          {/* 매장 이름 출력 */}
          <p className="font-bold text-2xl">무물떡볶이</p>
        </div>

        {/* 매장 기본정보 출력 */}
        <div className="bg-sky-100 flex flex-col rounded-lg items-center text-center mb-4 w-64 pt-3 px-2">
          <p className="mb-4 text-xl">영업 시간 : 9:00 ~ 18:00 </p>
        </div>

        {/* 음식점일 경우 가격 출력 */}
        <div className="bg-sky-100 flex flex-col rounded-lg items-center text-center w-64 mb-4 pt-3 px-2">
          <p className="mt-2 mb-4 text-xl">메뉴 및 가격 <br />
            매운 떡볶이 : 3000원 <br />
            로제 떡볶이 : 5000원 <br />
            마라 떡볶이 : 5000원 <br />
            날치알 주먹밥 : 2500원 <br />
            각 종 튀김 : 700원 <br />
          </p>
        </div>

        {/* Link : 이벤트 없을 시 페이지 이동 */}
        <Link href="/chatBot" >
          <img src="/chatbot.png" alt="Chatbot" className="fixed bottom-4 right-4 w-24 h-24 object-cover" />
        </Link>
      </div>
    </div>
  );
};

export default storeIntroduce;
