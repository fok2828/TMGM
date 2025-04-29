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
  console.log(playerScores)
  const sortedGames = [...playerScores].sort((a, b) =>
    b.date.localeCompare(a.date)
  );

  const getTeam = (scoreInfo:Score) => {
    const teamAInfo = scoreInfo.teamA.find((player) => player.player_id === player_id);
    if (teamAInfo === undefined) {
      return scoreInfo.teamB.find((player) => player.player_id === player_id);
    }
    return teamAInfo
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{player.name} 數據總覽</h1>

      {/* <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">平均數據</h2>
        <ul className="grid grid-cols-2 gap-2">
          {Object.entries(player.stats.average).map(([key, value]) => (
            <li key={key}>
              <span className="font-bold">{key}：</span>
              {value}
            </li>
          ))}
        </ul>
      </div> */}
      {sortedGames.length > 0 ? (
        <div className='overflow-x-auto'>
          <h2 className="text-xl font-semibold mb-2">每場比賽</h2>
          <table className="table w-full ">
            <thead>
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
      ) : (
        <div>沒有資料</div>
      )
    }
    </div>
  );
};