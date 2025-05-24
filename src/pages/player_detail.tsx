import { useParams } from 'react-router-dom';
import allPlayersData from '../json/players.json';
import allScoresData from '../json/scores.json';
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
  
  const { player_id } = useParams<{ player_id: string }>();
  const players = Object.values(allPlayersData);
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

  const sortedGames = [...playerScores].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{player.name} 數據總覽</h1>

      { <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">平均數據</h2>
        <ul className="grid grid-cols-4 gap-2">
          {Object.entries(avgStats).map(([key, value]) => (
            <li key={key}>
              <span className="font-bold">{keyMapping[key as keyof typeof keyMapping]}：</span>
              {value}
            </li>
          ))}
        </ul>
      </div> }
      {sortedGames.length > 0 ? (
        <div className='overflow-x-auto'>
          <h2 className="text-xl font-semibold mb-2">每場比賽</h2>
          <div className='overflow-y-auto max-h-[400px] border border-gray-200 rounded-md'>
            <table className="table w-full ">
              <thead className="sticky top-0 bg-white z-10">
                <tr>
                  <th>日期</th>
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
                {
                  sortedGames.map((game, i) => (
                    <tr key={i}>
                      <td>{game.date}</td>
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
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>沒有資料</div>
      )
    }
    </div>
  );
};