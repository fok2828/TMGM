
import { useNavigate } from 'react-router-dom';
import placesData from '../json/places.json';

interface Place {
  id: string;
  place_id: number;
  place_name: string;
  place_address: string;
  place_time: string;
  place_traffic_mrt: string;
  place_traffic_bus: string;
  place_traffic_carpool: string;
  place_gmap_link: string;
  place_fees: string;
  place_range: string;
  place_period: string;
  season: string[];
}

export const Place = () => {
  const navigate = useNavigate();
  const places: Place[] = Object.values(placesData);

  // 根據當前日期獲取當前賽季
  const getCurrentSeason = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    
    // 定義季分類：1-3月為Q1，4-6月為Q2，7-9月為Q3，10-12月為Q4
    let quarter = '';
    if (month >= 1 && month <= 3) quarter = 'Q1';
    else if (month >= 4 && month <= 6) quarter = 'Q2';
    else if (month >= 7 && month <= 9) quarter = 'Q3';
    else quarter = 'Q4';
    
    return `${year}-${quarter}`;
  };

  // 獲取當前賽季的場地資訊
  const getCurrentPlaceInfo = (): Place | null => {
    const currentSeason = getCurrentSeason();
    const currentPlace = places.find(place => place.season.includes(currentSeason));
    
    if (!currentPlace) {
      // 如果找不到當前賽季的場地，顯示最近的場地資訊
      const sortedPlaces = places.sort((a, b) => {
        const seasonA = a.season.slice().sort().reverse()[0];
        const seasonB = b.season.slice().sort().reverse()[0];
        return seasonB.localeCompare(seasonA);
      });
      return sortedPlaces[0] || null;
    }
    
    return currentPlace;
  };

  const currentPlaceInfo = getCurrentPlaceInfo();
  const currentSeason = getCurrentSeason();

  if (!currentPlaceInfo) {
    return (
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">場地資訊</h1>
            <p className="py-6">目前沒有可用的場地資訊</p>
            <button className="btn btn-info" onClick={() => navigate('/games')}>
              比賽資訊
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse gap-10">
          {/* ✅ Google Map Iframe */}
          <div className="w-full lg:w-1/2">
            <div className="aspect-w-4 aspect-h-3 w-full">
              <iframe
                src={currentPlaceInfo.place_gmap_link}
                className="w-full h-96 rounded-lg shadow-2xl border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* 📌 場地資訊 */}
          <div className="w-full lg:w-1/2">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-4xl font-bold">場地資訊</h1>
              <div className="badge badge-primary badge-md">{currentSeason}</div>
            </div>
            <div className="py-6 space-y-3">
              <div>
                <span className="font-bold">場地:</span> {currentPlaceInfo.place_name}
              </div>
              <div>
                <span className="font-bold">地址:</span> {currentPlaceInfo.place_address}
              </div>
              <div>
                <span className="font-bold">使用時間:</span> {currentPlaceInfo.place_time}
              </div>
              <div>
                <span className="font-bold">交通方式:</span>
                <ul className="ml-6 list-disc">
                  <li>捷運: {currentPlaceInfo.place_traffic_mrt}</li>
                  <li>公車: {currentPlaceInfo.place_traffic_bus}</li>
                  <li>停車場: {currentPlaceInfo.place_traffic_carpool}</li>
                </ul>
              </div>
              <div>
                <span className="font-bold">費用:</span> {currentPlaceInfo.place_fees} / {currentPlaceInfo.place_range}
                <div className="dropdown dropdown-right inline-block ml-2">
                  <div tabIndex={0} role="button" className="btn btn-circle btn-ghost btn-xs text-info">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="h-4 w-4 stroke-current"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div tabIndex={0} className="card card-sm dropdown-content bg-base-100 rounded-box z-10 w-64 shadow-sm">
                    <div className="card-body">
                      <span className="font-bold">起始時間:</span> {currentPlaceInfo.place_period}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button className="btn btn-info mt-4" onClick={() => navigate('/games')}>
              比賽資訊
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
