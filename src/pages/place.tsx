
import { useNavigate } from 'react-router-dom';

export const Place = () => {
  const navigate = useNavigate();
  const place_info = {
    data: {
      place_id: 1,
      place_name: "長安國小",
      place_address: "新北市新莊區長安路一段1號 (體育館位於長安國小停車場旁）。",
      place_time: "週日 08:00 AM ~ 10:00 AM",
      place_traffic_mrt: "松江南京站（2或3號出口）。",
      place_traffic_bus: "多條路線可達，詳情可參考臺北市公共運輸資訊。",
      place_traffic_carpool: "長安國小地下停車場",
      place_gmap_link: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57832.571565717815!2d121.46427623125004!3d25.049825400000007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a9641726d737%3A0x9844661b477a423b!2z6Ie65YyX5biC5Lit5bGx5Y2A6ZW35a6J5ZyL5rCR5bCP5a24!5e0!3m2!1szh-TW!2stw!4v1745040611541!5m2!1szh-TW!2stw",
      place_fees: "32500",
      place_range: "季",
      place_period: "2025-04 ~ 2025-06"
    },
  };

  return (
    <div>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse gap-10">
          {/* ✅ Google Map Iframe */}
          <div className="w-full lg:w-1/2">
            <div className="aspect-w-4 aspect-h-3 w-full">
              <iframe
                src={place_info.data.place_gmap_link}
                className="w-full h-96 rounded-lg shadow-2xl border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* 📌 場地資訊 */}
          <div className="w-full lg:w-1/2">
            <h1 className="text-5xl font-bold">場地資訊</h1>
            <div className="py-6 space-y-3">
              <div>
                <span className="font-bold">場地:</span> {place_info.data.place_name}
              </div>
              <div>
                <span className="font-bold">地址:</span> {place_info.data.place_address}
              </div>
              <div>
                <span className="font-bold">使用時間:</span> {place_info.data.place_time}
              </div>
              <div>
                <span className="font-bold">交通方式:</span>
                <ul className="ml-6 list-disc">
                  <li>捷運: {place_info.data.place_traffic_mrt}</li>
                  <li>公車: {place_info.data.place_traffic_bus}</li>
                  <li>停車場: {place_info.data.place_traffic_carpool}</li>
                </ul>
              </div>
              <div>
                <span className="font-bold">費用:</span> {place_info.data.place_fees} / {place_info.data.place_range}
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
                      <span className="font-bold">起始時間:</span> {place_info.data.place_period}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button className="btn btn-info mt-4" onClick={() => navigate('/home')}>
              比賽資訊
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
