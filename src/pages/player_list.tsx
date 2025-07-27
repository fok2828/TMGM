import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import playersData from '../json/players.json';
import allGamesData from '../json/games.json';

interface Player {
  id: string;
  name: string;
  name_line: string;
  position: string;
  pay_way: string;
}

interface Game {
  id: string;
  date: string;
  time: string;
  location: string;
  participants: string;
}

export const PlayerList = () => {
  const navigate = useNavigate();
  const allGameData: Game[] = Object.values(allGamesData);
  const players: Player[] = Object.values(playersData);
  const [collapsedSeasons, setCollapsedSeasons] = useState<{ [key: string]: boolean }>({});

  // 按年季歸類比賽
  const groupGamesBySeason = () => {
    const seasons: { [key: string]: Game[] } = {};
    
    allGameData.forEach(game => {
      const date = new Date(game.date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      
      // 定義季分類：1-3月為Q1，4-6月為Q2，7-9月為Q3，10-12月為Q4
      let quarter = '';
      if (month >= 1 && month <= 3) quarter = 'Q1';
      else if (month >= 4 && month <= 6) quarter = 'Q2';
      else if (month >= 7 && month <= 9) quarter = 'Q3';
      else quarter = 'Q4';
      
      const seasonKey = `${year}-${quarter}`;
      
      if (!seasons[seasonKey]) {
        seasons[seasonKey] = [];
      }
      seasons[seasonKey].push(game);
    });
    
    return seasons;
  };

  // 獲取該季參與的球員
  const getSeasonPlayers = (seasonKey: string): Player[] => {
    const seasonGames = groupGamesBySeason()[seasonKey] || [];
    const participantIds = new Set<string>();
    
    // 收集該季所有參與者的ID
    seasonGames.forEach(game => {
      const participants = game.participants.split(",").map(p => p.trim());
      participants.forEach(playerId => {
        participantIds.add(playerId);
      });
    });
    
    // 返回有參與該季比賽的球員，並按出席率排序
    const seasonPlayers = players.filter(player => participantIds.has(player.id));
    
    return seasonPlayers.sort((a, b) => {
      // 計算出席率
      const aAttendance = seasonGames.filter(game => 
        game.participants.split(",").map(p => p.trim()).includes(a.id)
      ).length;
      const bAttendance = seasonGames.filter(game => 
        game.participants.split(",").map(p => p.trim()).includes(b.id)
      ).length;
      
      // 如果出席率相同，按player_id排序
      if (aAttendance === bAttendance) {
        return a.id.localeCompare(b.id);
      }
      
      // 否則按出席率排序（出席率高的排名前面）
      return bAttendance - aAttendance;
    });
  };

  // 計算球員在該季的出席率
  const getSeasonAttendance = (playerId: string, seasonKey: string) => {
    const seasonGames = groupGamesBySeason()[seasonKey] || [];
    const attendanceCount = seasonGames.filter(game => 
      game.participants.split(",").map(p => p.trim()).includes(playerId)
    ).length;
    
    return `${attendanceCount} / ${seasonGames.length}`;
  };

  // 切換收合狀態
  const toggleCollapse = (seasonKey: string) => {
    setCollapsedSeasons(prev => ({
      ...prev,
      [seasonKey]: !prev[seasonKey]
    }));
  };

  const seasons = groupGamesBySeason();
  const sortedSeasons = Object.keys(seasons).sort((a, b) => b.localeCompare(a));

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">球員清單列表</h1>
      
      {sortedSeasons.map(seasonKey => {
        const seasonPlayers = getSeasonPlayers(seasonKey);
        const isCollapsed = collapsedSeasons[seasonKey];
        
        return (
          <div key={seasonKey} className="mb-8">
            {/* 季分類標題 - 可點擊收合 */}
            <div 
              className="bg-primary text-primary-content p-4 rounded-lg mb-4 cursor-pointer hover:bg-primary-focus transition-colors"
              onClick={() => toggleCollapse(seasonKey)}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{seasonKey} 賽季</h2>
                <span className="text-2xl">
                  {isCollapsed ? '▼' : '▲'}
                </span>
              </div>
            </div>
            
            {/* 該季球員列表 - 只在展開時顯示 */}
            {!isCollapsed && (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full text-sm">
                  <thead>
                    <tr>
                      <th>名稱</th>
                      <th>Line 名稱</th>
                      <th>職稱</th>
                      <th>出席率</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seasonPlayers.map((player) => (
                      <tr
                        key={player.id}
                        className="cursor-pointer hover:bg-base-200"
                        onClick={() => navigate(`/players/${player.id}`)}
                      >
                        <td>{player.name}</td>
                        <td>{player.name_line || '-'}</td>
                        <td>{player.position}</td>
                        <td>{getSeasonAttendance(player.id, seasonKey)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {seasonPlayers.length === 0 && (
                  <div className="text-center mt-4 text-gray-500">該季沒有參與的球員</div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
