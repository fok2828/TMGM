import exampleImg from '../assets/img/home.jpg';
export const Home = () => {
  return (
    <div className="overflow-hidden flex items-center justify-center relative">
      {/* 背景圖 */}
      <img
        src={exampleImg} // ← 替換成你的圖片路徑
        alt="TMGM早安籃球俱樂部"
        className="max-w-full max-h-full object-contain"
      />

      </div>
  );
};

