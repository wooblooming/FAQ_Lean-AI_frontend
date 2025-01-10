const Loading = () => {

  return (
    <div className="bg-white flex justify-center items-center min-h-screen">         
      <div className="bg-white rounded-lg p-8 w-full max-w-md text-center flex flex-col items-center justify-center" style={{ transform: 'translateY(-20%)' }}>
        {/* 로딩 이미지 출력 */}
        <img src="/images/loading.png" className="w-3/5 object-fill mb-6 " alt="Loading" />         
        
        {/* 로딩 중 멘트 출력 */}
        <p className="font-bold text-2xl mt-20"> 잠시만 기다려주세요. <br />해당 페이지로 이동 중입니다.</p>
      </div>
    </div>
  );
};

export default Loading;