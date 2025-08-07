import exampleImg from '../assets/img/home.jpg';
export const Home = () => {
  return (
    <div className="overflow-hidden flex flex-col items-center justify-center relative">
      {/* 嵌入YouTube影片 */}
      <div className='mt-24 mb-10'>
        <iframe 
          width="560" 
          height="315" 
          src="https://www.youtube.com/embed/XSdQmemvTyE" 
          title="YouTube video player" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowFullScreen
        ></iframe>
      </div>
      <div>
        {/* 背景圖 */}
        <img
          src={exampleImg} // ← 替換成你的圖片路徑
          alt="TMGM早安籃球俱樂部"
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  );
};