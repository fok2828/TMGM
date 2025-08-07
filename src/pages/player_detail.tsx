import { useParams } from 'react-router-dom';
import { useState } from 'react';
import allPlayersData from '../json/players.json';
import allScoresData from '../json/scores.json';
import roundsData from '../json/rounds.json';
//import allGamesData from '../json/games.json';

export const PlayerDetail = () => {
  interface Player {
      player_id: string;
      teamColor: string;
      points: number;
      twoMade: number;
      twoAttempt: number;
      threeMade: number;
      threeAttempt: number;
      oReb: number;
      dReb: number;
      ast: number;
      stl: number;
      blk: number;
      tov: number;
  }

  interface Score {
      id: string;
      date: string;
      teamA: Player[];
      teamB: Player[];
  }

  interface Round {
    id: string;
    date: string;
    round: string;
    type: string;
    timeDuration: string;
  }

  interface PlayerStat {
    points: number;
    twoMade: number;
    twoAttempt: number;
    threeMade: number;
    threeAttempt: number;
    oReb: number;
    dReb: number;
    ast: number;
    stl: number;
    blk: number;
    tov: number;
  }

  interface GameData {
    date: string;
    games: Score[];
  }

  interface SeasonData {
    season: string;
    dateGroups: GameData[];
  }
  
  const { player_id } = useParams<{ player_id: string }>();
  const players = Object.values(allPlayersData);
  const rounds: Round[] = Object.values(roundsData);
  const [collapsedSeasons, setCollapsedSeasons] = useState<{ [key: string]: boolean }>({});
  const [collapsedDates, setCollapsedDates] = useState<{ [key: string]: boolean }>({});
  const [isAvgStatsCollapsed, setIsAvgStatsCollapsed] = useState(true);
  //const games = Object.values(allGamesData);
  const scores:Score[] = Object.values(allScoresData).map((score) => ({
      id: score.id,
      date: score.date,
      teamA: Object.values(score.teamA).map((player) => ({
          player_id: player.player_id,
          teamColor: player.teamColor,
          points: Number(player.twoMade)*2 + Number(player.threeMade)*3, 
          twoMade: Number(player.twoMade),
          twoAttempt: Number(player.twoAttempt),
          threeMade: Number(player.threeMade),
          threeAttempt: Number(player.threeAttempt),
          oReb: Number(player.oReb),
          dReb: Number(player.dReb),
          ast: Number(player.ast),
          stl: Number(player.stl),
          blk: Number(player.blk),
          tov: Number(player.tov),
      })),
      teamB: Object.values(score.teamB).map((player) => ({
          player_id: player.player_id,
          teamColor: player.teamColor,
          points: Number(player.twoMade)*2 + Number(player.threeMade)*3,
          twoMade: Number(player.twoMade),
          twoAttempt: Number(player.twoAttempt),
          threeMade: Number(player.threeMade),
          threeAttempt: Number(player.threeAttempt),
          oReb: Number(player.oReb),
          dReb: Number(player.dReb),
          ast: Number(player.ast),
          stl: Number(player.stl),
          blk: Number(player.blk),
          tov: Number(player.tov),
      })),
  }));
  const player = players.find((player) => player.id === player_id);
  
  if (player_id === undefined || player === undefined) {
    return <div>沒有資料</div>;
  }

  const playerScores = scores.filter((score) => score.teamA.filter((player:Player)=>player.player_id === player_id).length > 0 
                                             || score.teamB.filter((player:Player)=>player.player_id === player_id).length > 0 );

  // 根據日期獲取賽季
  const getSeasonFromDate = (date: string): string => {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    
    // 定義季分類：1-3月為Q1，4-6月為Q2，7-9月為Q3，10-12月為Q4
    let quarter = '';
    if (month >= 1 && month <= 3) quarter = 'Q1';
    else if (month >= 4 && month <= 6) quarter = 'Q2';
    else if (month >= 7 && month <= 9) quarter = 'Q3';
    else quarter = 'Q4';
    
    return `${year}-${quarter}`;
  };

  // 按賽季和日期分組比賽數據
  const groupGamesBySeason = (): SeasonData[] => {
    const seasonGroups: { [key: string]: { [key: string]: Score[] } } = {};
    
    playerScores.forEach(score => {
      const season = getSeasonFromDate(score.date);
      
      if (!seasonGroups[season]) {
        seasonGroups[season] = {};
      }
      
      if (!seasonGroups[season][score.date]) {
        seasonGroups[season][score.date] = [];
      }
      
      seasonGroups[season][score.date].push(score);
    });
    
    return Object.keys(seasonGroups)
      .sort((a, b) => b.localeCompare(a)) // 按賽季降序排列
      .map(season => ({
        season,
        dateGroups: Object.keys(seasonGroups[season])
          .sort((a, b) => b.localeCompare(a)) // 按日期降序排列
          .map(date => ({
            date,
            games: seasonGroups[season][date]
          }))
      }));
  };

  // 根據score.id獲取對應的round值
  const getRoundValue = (scoreId: string): string => {
    const roundInfo = rounds.find(round => round.id === scoreId);
    return roundInfo ? roundInfo.round : scoreId;
  };

  const keyMapping = {
    points: '得分',
    twoMade: '2分命中',
    twoAttempt: '2分出手',
    threeMade: '3分命中',
    threeAttempt: '3分出手',
    oReb: '進攻籃板',
    dReb: '防守籃板',
    ast: '助攻',
    stl: '抄截',
    blk: '火鍋',
    tov: '失誤'  
  }

  const getTeam = (scoreInfo:Score) => {
    const teamAInfo = scoreInfo.teamA.find((player) => player.player_id === player_id);
    if (teamAInfo === undefined) {
      return scoreInfo.teamB.find((player) => player.player_id === player_id);
    }
    return teamAInfo
  }

  const totalStats: PlayerStat = {
    points: 0,
    twoMade: 0,
    twoAttempt: 0,
    threeMade: 0,
    threeAttempt: 0,
    oReb: 0,
    dReb: 0,
    ast: 0,
    stl: 0,
    blk: 0,
    tov: 0,
  };
  
  let gamesPlayed = 0;
  
  playerScores.forEach(score => {
    const player =
      score.teamA.find(p => p.player_id === player_id) ||
      score.teamB.find(p => p.player_id === player_id);
  
    if (player) {
      totalStats.points += player.points;
      totalStats.twoMade += player.twoMade;
      totalStats.twoAttempt += player.twoAttempt;
      totalStats.threeMade += player.threeMade;
      totalStats.threeAttempt += player.threeAttempt;
      totalStats.oReb += player.oReb;
      totalStats.dReb += player.dReb;
      totalStats.ast += player.ast;
      totalStats.stl += player.stl;
      totalStats.blk += player.blk;
      totalStats.tov += player.tov;
      gamesPlayed++;
    }
  });
  
  // 計算平均
  const avgStats = Object.fromEntries(
    Object.entries(totalStats).map(([key, value]) => [key, (value / gamesPlayed).toFixed(1)])
  );

  // 切換賽季收合狀態
  const toggleSeasonCollapse = (season: string) => {
    setCollapsedSeasons(prev => ({
      ...prev,
      [season]: !prev[season]
    }));
  };

  // 切換日期收合狀態
  const toggleDateCollapse = (date: string) => {
    setCollapsedDates(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  // 切換平均數據收合狀態
  const toggleAvgStatsCollapse = () => {
    setIsAvgStatsCollapsed(prev => !prev);
  };

  const seasonGroups = groupGamesBySeason();

  // 初始化所有賽季和日期為收合狀態
  const initializeCollapsedStates = () => {
    const seasons = seasonGroups.map(group => group.season);
    const dates = seasonGroups.flatMap(group => group.dateGroups.map(dateGroup => dateGroup.date));
    
    const seasonStates = seasons.reduce((acc, season) => {
      acc[season] = true; // 預設收合
      return acc;
    }, {} as { [key: string]: boolean });
    
    const dateStates = dates.reduce((acc, date) => {
      acc[date] = true; // 預設收合
      return acc;
    }, {} as { [key: string]: boolean });
    
    return { seasonStates, dateStates };
  };

  // 如果狀態為空，則初始化
  if (Object.keys(collapsedSeasons).length === 0) {
    const { seasonStates, dateStates } = initializeCollapsedStates();
    setCollapsedSeasons(seasonStates);
    setCollapsedDates(dateStates);
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{player.name} 數據總覽</h1>

      { <div className="mb-6">
        {/* 平均數據標題 - 可點擊收合 */}
        <div 
          className="bg-base-200 text-base-content p-3 rounded-lg mb-3 cursor-pointer hover:bg-base-300 transition-colors"
          onClick={toggleAvgStatsCollapse}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">平均數據</h2>
            <span className="text-xl">
              {isAvgStatsCollapsed ? '▼' : '▲'}
            </span>
          </div>
        </div>
        
        {/* 平均數據內容 - 只在展開時顯示 */}
        {!isAvgStatsCollapsed && (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>統計項目</th>
                  <th>平均數值</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(avgStats).map(([key, value]) => (
                  <tr key={key}>
                    <td className="font-semibold">{keyMapping[key as keyof typeof keyMapping]}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div> }

      {seasonGroups.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">每場比賽</h2>
          {seasonGroups.map((seasonGroup) => {
            const isSeasonCollapsed = collapsedSeasons[seasonGroup.season];
            
            return (
              <div key={seasonGroup.season} className="mb-8">
                {/* 賽季標題 - 可點擊收合 */}
                <div 
                  className="bg-base-200 text-base-content p-4 rounded-lg mb-4 cursor-pointer hover:bg-base-300 transition-colors"
                  onClick={() => toggleSeasonCollapse(seasonGroup.season)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{seasonGroup.season} 賽季</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">({seasonGroup.dateGroups.length} 次)</span>
                      <span className="text-2xl">
                        {isSeasonCollapsed ? '▼' : '▲'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* 該賽季的日期分組 - 只在展開時顯示 */}
                {!isSeasonCollapsed && (
                  <div className="ml-4">
                    {seasonGroup.dateGroups.map((dateGroup) => {
                      const isDateCollapsed = collapsedDates[dateGroup.date];
                      
                      return (
                        <div key={dateGroup.date} className="mb-4">
                          {/* 日期標題 - 可點擊收合 */}
                          <div 
                            className="bg-orange-200 text-orange-800 p-3 rounded-lg mb-3 cursor-pointer hover:bg-orange-300 transition-colors"
                            onClick={() => toggleDateCollapse(dateGroup.date)}
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="text-lg font-semibold">{dateGroup.date}</h4>
                              <div className="flex items-center gap-2">
                                <span className="text-sm">({dateGroup.games.length} 場)</span>
                                <span className="text-xl">
                                  {isDateCollapsed ? '▼' : '▲'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* 該日期的比賽數據 - 只在展開時顯示 */}
                          {!isDateCollapsed && (
                            <div className="overflow-x-auto">
                              <div className="overflow-y-auto max-h-[400px] border border-gray-200 rounded-md">
                                <table className="table w-full">
                                  <thead className="sticky top-0 bg-white z-10">
                                    <tr>
                                      <th>回合</th>
                                      <th>得分</th>
                                      <th>2分(命中/出手)</th>
                                      <th>3分(命中/出手)</th>
                                      <th>進攻籃板</th>
                                      <th>防守籃板</th>
                                      <th>助攻</th>
                                      <th>抄截</th>
                                      <th>火鍋</th>
                                      <th>失誤</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {dateGroup.games.map((game, i) => (
                                      <tr key={i}>
                                        <td>{getRoundValue(game.id)}</td>
                                        <td>{getTeam(game)?.points}</td>
                                        <td>{getTeam(game)?.twoMade} / {getTeam(game)?.twoAttempt}</td>
                                        <td>{getTeam(game)?.threeMade} / {getTeam(game)?.threeAttempt}</td>
                                        <td>{getTeam(game)?.oReb}</td>
                                        <td>{getTeam(game)?.dReb}</td>
                                        <td>{getTeam(game)?.ast}</td>
                                        <td>{getTeam(game)?.stl}</td>
                                        <td>{getTeam(game)?.blk}</td>
                                        <td>{getTeam(game)?.tov}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div>沒有資料</div>
      )}
    </div>
  );
};