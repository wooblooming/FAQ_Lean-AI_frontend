import React from 'react';

const ImageList = ({ images }) => {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL; // 환경 변수에서 MEDIA_URL 가져오기

  if (!images || images.length === 0) {
    return <p>이미지가 없습니다.</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-1 p-2">
      {images.map((image, index) => {
        const fullImageUrl = `${mediaUrl}/media/${image.path}`; // 전체 이미지 URL 생성
        const fileName = image.name; // 이미지 경로에서 파일 이름 추출

        return (
          <div key={index} className="relative group">
            <img
              src={fullImageUrl} // 완성된 이미지 URL
              alt={fileName}
              className="w-full h-full object-cover"
            />
            {/* Overlay 효과 */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
              <p className="text-white text-sm">{fileName}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ImageList;
