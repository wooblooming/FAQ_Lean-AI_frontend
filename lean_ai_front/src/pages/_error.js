import Image from 'next/image';
import Link from 'next/link';

const CacheBustedImage = ({ src, alt, ...props }) => {
  const cacheBustSrc = `${src}?v=${Date.now()}`;

  const imageLoader = ({ src, width, quality }) => {
    return `${src}?w=${width}&q=${quality || 75}&v=${Date.now()}`;
  };

  return (
    <Image
      src={cacheBustSrc}
      alt={alt}
      loader={imageLoader}
      {...props}
    />
  );
};

export default function Custom404() {
  return (
    <div className="relative w-screen h-screen"> {/* 부모 div에 relative와 height 지정 */}
      <CacheBustedImage
        src="/images/error_desktop.png"
        alt="error"
        fill
        style={{ objectFit: 'cover' }}
        className="z-10 hidden md:block"
      />

    <CacheBustedImage
        src="/images/error_mobile.png"
        alt="error"
        fill
        style={{ objectFit: 'cover' }}
        className="z-10 block md:hidden"
      />

      <Link href="/">
        <p
          className="bg-indigo-600 text-white px-16 py-3 rounded-full text-xl font-semibold text-center absolute z-20 hidden md:block"
          style={{ bottom: '15%', left: '20%'}}
        >
          홈으로 돌아가기
        </p>

        <p
          className="bg-indigo-600 text-white px-6 py-3 rounded-full text-xl font-semibold text-center absolute z-20 block md:hidden"
          style={{ bottom: '20%', left: '30%'}}
        >
          홈으로 돌아가기
        </p>
      </Link>
    </div>
  );
}
