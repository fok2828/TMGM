import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import gameData from '../json/games.json';
import playerData from '../json/players.json';
import scoreData from '../json/scores.json';

export const GameList = () => {
    
    interface Game {
      id: string;
      date: string;
      time: string;
      location: string;
      participants: string;
    }

    interface Player {
      id: string;
      name: string;
      name_line: string;
      pay_way: string;
      position: string;
    }

    interface PlayerStat {
      player_id: string;
      teamColor: string;
      team_id: string | number;
      twoMade: string | number;
      twoAttempt: string | number;
      threeMade: string | number;
      threeAttempt: string | number;
      oReb: string | number;
      dReb: string | number;
      ast: string | number;
      stl: string | number;
      blk: string | number;
      tov: string | number;
    }

    interface ScoreData {
      id: string;
      date: string;
      teamA?: PlayerStat[];
      teamB?: PlayerStat[];
    }

    interface SeasonStats {
      playerId: string;
      playerName: string;
      roundsPlayed: number;
      gamesPlayed: number;
      avgPoints: number;
      avgRebounds: number;
      avgAssists: number;
      avgSteals: number;
      avgBlocks: number;
      avgOffensiveRebounds: number;
      avgDefensiveRebounds: number;
      avgTurnovers: number;
    }

    const navigate = useNavigate();
    const gameList: Game[] = Object.values(gameData);
    const players: Player[] = Object.values(playerData);
    const scores = Object.values(scoreData) as ScoreData[];
    const [collapsedSeasons, setCollapsedSeasons] = useState<{ [key: string]: boolean }>({});
    const [collapsedStats, setCollapsedStats] = useState<{ [key: string]: boolean }>({});

    // 按年季歸類比賽
    const groupGamesBySeason = () => {
      const seasons: { [key: string]: Game[] } = {};
      
      gameList.forEach(game => {
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

    // 安全地解析數值
    const safeParseInt = (value: string | number): number => {
      if (typeof value === 'number') return value;
      if (typeof value === 'string') return parseInt(value) || 0;
      return 0;
    };

    // 計算球員在特定季的統計數據
    const calculateSeasonStats = (seasonKey: string): SeasonStats[] => {
      const seasonGames = groupGamesBySeason()[seasonKey] || [];
      const playerStats: { [key: string]: PlayerStat[] } = {};
      const playerGameCount: { [key: string]: number } = {};
      const playerRoundCount: { [key: string]: number } = {};
      
      // 計算每個球員在該季參與的比賽場次（基於games.json的participants）
      seasonGames.forEach(game => {
        const participants = game.participants.split(",").map(p => p.trim());
        participants.forEach(playerId => {
          if (!playerGameCount[playerId]) {
            playerGameCount[playerId] = 0;
          }
          playerGameCount[playerId]++;
        });
      });
      
      // 收集該季所有球員的數據
      seasonGames.forEach(game => {
        const gameScores = scores.filter((score: ScoreData) => score.date === game.date);
        
        gameScores.forEach((score: ScoreData) => {
          // 忽略id為105的數據
          // if (score.id === "105") {
          //   return;
          // }
          
          const allPlayers: PlayerStat[] = [...(score.teamA || []), ...(score.teamB || [])];
          allPlayers.forEach((player: PlayerStat) => {
            if (!playerStats[player.player_id]) {
              playerStats[player.player_id] = [];
            }
            
            // 計算球員參與的回合數
            if (!playerRoundCount[player.player_id]) {
              playerRoundCount[player.player_id] = 0;
            }
            playerRoundCount[player.player_id]++;
            
            playerStats[player.player_id].push(player);
          });
        });
      });
      
      // 計算平均數據
      const seasonStats: SeasonStats[] = Object.keys(playerStats).map(playerId => {
        const stats = playerStats[playerId];
        const player = players.find(p => p.id === playerId);
        
        // 使用games.json中participants的場次數作為參與度篩選
        const totalGames = playerGameCount[playerId] || 0;
        // 使用實際參與的回合數計算平均數據
        const totalRounds = playerRoundCount[playerId] || 0;
        
        const totalPoints = stats.reduce((sum: number, stat: PlayerStat) => 
          sum + (safeParseInt(stat.twoMade) * 2) + (safeParseInt(stat.threeMade) * 3), 0);
        const totalRebounds = stats.reduce((sum: number, stat: PlayerStat) => 
          sum + safeParseInt(stat.oReb) + safeParseInt(stat.dReb), 0);
        const totalAssists = stats.reduce((sum: number, stat: PlayerStat) => 
          sum + safeParseInt(stat.ast), 0);
        const totalSteals = stats.reduce((sum: number, stat: PlayerStat) => 
          sum + safeParseInt(stat.stl), 0);
        const totalBlocks = stats.reduce((sum: number, stat: PlayerStat) => 
          sum + safeParseInt(stat.blk), 0);
        const totalOffensiveRebounds = stats.reduce((sum: number, stat: PlayerStat) => 
          sum + safeParseInt(stat.oReb), 0);
        const totalDefensiveRebounds = stats.reduce((sum: number, stat: PlayerStat) => 
          sum + safeParseInt(stat.dReb), 0);
        const totalTurnovers = stats.reduce((sum: number, stat: PlayerStat) => 
          sum + safeParseInt(stat.tov), 0);
        
        return {
          playerId,
          playerName: player?.name || '未知球員',
          roundsPlayed: totalRounds,
          gamesPlayed: totalGames,
          avgPoints: totalRounds > 0 ? Math.round((totalPoints / totalRounds) * 10) / 10 : 0,
          avgRebounds: totalRounds > 0 ? Math.round((totalRebounds / totalRounds) * 10) / 10 : 0,
          avgAssists: totalRounds > 0 ? Math.round((totalAssists / totalRounds) * 10) / 10 : 0,
          avgSteals: totalRounds > 0 ? Math.round((totalSteals / totalRounds) * 10) / 10 : 0,
          avgBlocks: totalRounds > 0 ? Math.round((totalBlocks / totalRounds) * 10) / 10 : 0,
          avgOffensiveRebounds: totalRounds > 0 ? Math.round((totalOffensiveRebounds / totalRounds) * 10) / 10 : 0,
          avgDefensiveRebounds: totalRounds > 0 ? Math.round((totalDefensiveRebounds / totalRounds) * 10) / 10 : 0,
          avgTurnovers: totalRounds > 0 ? Math.round((totalTurnovers / totalRounds) * 10) / 10 : 0
        };
      });
      
      return seasonStats.filter(stat => stat.gamesPlayed > 0);
    };

    // 獲取各項統計的前三名
    const getTopThreeByCategory = (stats: SeasonStats[], category: keyof SeasonStats, totalGamesInSeason: number) => {
      // 計算該季總場次的一半
      const halfSeasonGames = Math.ceil(totalGamesInSeason / 2);
      
      // 篩選出參加超過一半場次的球員
      const eligiblePlayers = stats.filter(stat => stat.gamesPlayed >= halfSeasonGames);
      
      return eligiblePlayers
        .sort((a, b) => {
          const aValue = a[category] as number;
          const bValue = b[category] as number;
          
          // 如果數據相同，則按參與場次排序（場次多的排名前面）
          if (aValue === bValue) {
            return b.gamesPlayed - a.gamesPlayed;
          }
          
          // 否則按數據排序（數據高的排名前面）
          return bValue - aValue;
        })
        .slice(0, 3);
    };

    // 切換收合狀態
    const toggleCollapse = (seasonKey: string) => {
      setCollapsedSeasons(prev => ({
        ...prev,
        [seasonKey]: !prev[seasonKey]
      }));
    };

    // 切換統計數據收合狀態
    const toggleStatsCollapse = (seasonKey: string) => {
      setCollapsedStats(prev => ({
        ...prev,
        [seasonKey]: !prev[seasonKey]
      }));
    };

    const seasons = groupGamesBySeason();
    const sortedSeasons = Object.keys(seasons).sort((a, b) => b.localeCompare(a));
    
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">比賽列表</h1>
        
        {sortedSeasons.map(seasonKey => {
          const seasonGames = seasons[seasonKey];
          const allStats = calculateSeasonStats(seasonKey);
          const isCollapsed = collapsedSeasons[seasonKey];
          const isStatsCollapsed = collapsedStats[seasonKey];
          // 使用games.json中該季的比賽場次作為基準
          const totalGamesInSeason = seasonGames.length;
          const halfSeasonGames = Math.ceil(totalGamesInSeason / 2);
          
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
              
              {/* 前三名球員統計 - 只在展開時顯示 */}
              {!isCollapsed && allStats.length > 0 && (
                <div className="bg-base-200 p-4 rounded-lg mb-4">
                  {/* 統計數據標題 - 可點擊收合 */}
                  <div 
                    className="flex items-center justify-between mb-3 cursor-pointer hover:bg-base-300 p-2 rounded transition-colors"
                    onClick={() => toggleStatsCollapse(seasonKey)}
                  >
                    <h3 className="text-lg font-semibold">🏆 該季各項統計前三名球員</h3>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-600">
                        篩選條件：參加 ≥ {halfSeasonGames} 次 ( 本季 {totalGamesInSeason} 次中的一半)
                      </div>
                      <span className="text-lg">
                        {isStatsCollapsed ? '▼' : '▲'}
                      </span>
                    </div>
                  </div>
                  
                  {/* 統計數據內容 - 只在展開時顯示 */}
                  {!isStatsCollapsed && (
                    <>
                      {/* 得分前三名 */}
                      <div className="mb-4">
                        <h4 className="font-semibold text-primary mb-2">🥇 平均得分前三名</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {getTopThreeByCategory(allStats, 'avgPoints', totalGamesInSeason).map((player, index) => (
                            <div key={`points-${player.playerId}`} className="bg-base-100 p-3 rounded-lg">
                              <div className="flex items-center mb-2">
                                <span className="text-xl mr-2">
                                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                </span>
                                <span className="font-semibold">{player.playerName}</span>
                              </div>
                              <p className="text-sm">平均得分: {player.avgPoints} 分</p>
                              <p className="text-sm">出賽場次: {player.roundsPlayed} 場</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 助攻前三名 */}
                      <div className="mb-4">
                        <h4 className="font-semibold text-primary mb-2">🏀 平均助攻前三名</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {getTopThreeByCategory(allStats, 'avgAssists', totalGamesInSeason).map((player, index) => (
                            <div key={`assists-${player.playerId}`} className="bg-base-100 p-3 rounded-lg">
                              <div className="flex items-center mb-2">
                                <span className="text-xl mr-2">
                                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                </span>
                                <span className="font-semibold">{player.playerName}</span>
                              </div>
                              <p className="text-sm">平均助攻: {player.avgAssists} 次</p>
                              <p className="text-sm">出賽場次: {player.roundsPlayed} 場</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 進攻籃板前三名 */}
                      <div className="mb-4">
                        <h4 className="font-semibold text-primary mb-2">📈 平均進攻籃板前三名</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {getTopThreeByCategory(allStats, 'avgOffensiveRebounds', totalGamesInSeason).map((player, index) => (
                            <div key={`oreb-${player.playerId}`} className="bg-base-100 p-3 rounded-lg">
                              <div className="flex items-center mb-2">
                                <span className="text-xl mr-2">
                                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                </span>
                                <span className="font-semibold">{player.playerName}</span>
                              </div>
                              <p className="text-sm">平均進攻籃板: {player.avgOffensiveRebounds} 個</p>
                              <p className="text-sm">出賽場次: {player.roundsPlayed} 場</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 防守籃板前三名 */}
                      <div className="mb-4">
                        <h4 className="font-semibold text-primary mb-2">🛡️ 平均防守籃板前三名</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {getTopThreeByCategory(allStats, 'avgDefensiveRebounds', totalGamesInSeason).map((player, index) => (
                            <div key={`dreb-${player.playerId}`} className="bg-base-100 p-3 rounded-lg">
                              <div className="flex items-center mb-2">
                                <span className="text-xl mr-2">
                                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                </span>
                                <span className="font-semibold">{player.playerName}</span>
                              </div>
                              <p className="text-sm">平均防守籃板: {player.avgDefensiveRebounds} 個</p>
                              <p className="text-sm">出賽場次: {player.roundsPlayed} 場</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 抄截前三名 */}
                      <div className="mb-4">
                        <h4 className="font-semibold text-primary mb-2">⚡ 平均抄截前三名</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {getTopThreeByCategory(allStats, 'avgSteals', totalGamesInSeason).map((player, index) => (
                            <div key={`steals-${player.playerId}`} className="bg-base-100 p-3 rounded-lg">
                              <div className="flex items-center mb-2">
                                <span className="text-xl mr-2">
                                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                </span>
                                <span className="font-semibold">{player.playerName}</span>
                              </div>
                              <p className="text-sm">平均抄截: {player.avgSteals} 次</p>
                              <p className="text-sm">出賽場次: {player.roundsPlayed} 場</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 火鍋前三名 */}
                      <div className="mb-4">
                        <h4 className="font-semibold text-primary mb-2">🔥 平均火鍋前三名</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {getTopThreeByCategory(allStats, 'avgBlocks', totalGamesInSeason).map((player, index) => (
                            <div key={`blocks-${player.playerId}`} className="bg-base-100 p-3 rounded-lg">
                              <div className="flex items-center mb-2">
                                <span className="text-xl mr-2">
                                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                </span>
                                <span className="font-semibold">{player.playerName}</span>
                              </div>
                              <p className="text-sm">平均火鍋: {player.avgBlocks} 次</p>
                              <p className="text-sm">出賽場次: {player.roundsPlayed} 場</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 失誤前三名 */}
                      <div className="mb-4">
                        <h4 className="font-semibold text-primary mb-2">⚠️ 平均失誤前三名</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {getTopThreeByCategory(allStats, 'avgTurnovers', totalGamesInSeason).map((player, index) => (
                            <div key={`turnovers-${player.playerId}`} className="bg-base-100 p-3 rounded-lg">
                              <div className="flex items-center mb-2">
                                <span className="text-xl mr-2">
                                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                </span>
                                <span className="font-semibold">{player.playerName}</span>
                              </div>
                              <p className="text-sm">平均失誤: {player.avgTurnovers} 次</p>
                              <p className="text-sm">出賽場次: {player.roundsPlayed} 場</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
              
              {/* 該季比賽列表 - 只在展開時顯示 */}
              {!isCollapsed && (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {seasonGames
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((game) => (
                    <div key={game.id} className="card bg-base-100 shadow-md p-4">
                      <h2 className="text-xl font-semibold">{game.date}</h2>
                      <p className="text-sm mb-3">{game.time}</p>
                      <p className="text-sm mb-3">{game.location}</p>
                      <p className="text-sm mb-3">參與人數: {game.participants.split(",").length} 人</p>
                      <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/games/${game.id}`)}
                      >
                        查看詳情
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
}