import { useParams, useNavigate } from 'react-router-dom';
import gameData from '../json/games.json';
import roundData from '../json/rounds.json';
import scoreData from '../json/scores.json';

interface Game {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    game_rules:{
        total_time: string;
        total_score: string;
        change_rules: {
            1: string;
            2: string;
        }
    };
    roundIds: string
}

interface Round {
    id: string,
    date: string;
    round: string;
    type: string;
    timeDuration: string;
}

interface Player{
    "twoMade": number,
    "twoAttempt": number,
    "threeMade": number,
    "threeAttempt": number,
    "oReb": number,
    "dReb": number,
    "ast": number,
    "stl": number,
    "blk": number,
    "tov": number
}

interface Score {
    id: string;
    date: string;
    teamA: Player[];
    teamB: Player[];
}

export const GameDetail = () => {
    const { game_id } = useParams<{game_id:string}>();
    const navigate  = useNavigate();
    const allGameData:Game[] = Object.values(gameData)
    const allRoundData:Round[] = Object.values(roundData)
    const allScoreData:Score[] = Object.values(scoreData).map((score) => ({
        id: score.id,
        date: score.date,
        teamA: Object.values(score.teamA).map((player) => ({
          twoMade: Number(player.twoMade),
          twoAttempt: Number(player.twoAttempt),
          threeMade: Number(player.threeMade),
          threeAttempt: Number(player.threeAttempt),
          oReb: Number(player.oReb),
          dReb: Number(player.dReb),
          ast: Number(player.ast),
          stl: Number(player.stl),
          blk: Number(player.blk),
          tov: Number(player.tov)
        })),
        teamB: Object.values(score.teamB).map((player) => ({
            twoMade: Number(player.twoMade),
            twoAttempt: Number(player.twoAttempt),
            threeMade: Number(player.threeMade),
            threeAttempt: Number(player.threeAttempt),
            oReb: Number(player.oReb),
            dReb: Number(player.dReb),
            ast: Number(player.ast),
            stl: Number(player.stl),
            blk: Number(player.blk),
            tov: Number(player.tov)
        })),
      }));

  
    if (!game_id || isNaN(parseInt(game_id))) {
        return <div>No Data</div>;
    }

    const game = allGameData.filter((game:Game) => game.id === game_id)[0];
    if (!game) return <div>找不到比賽資料</div>;

    const rules = Object.values(game.game_rules.change_rules);
    const scores = Object.values(allScoreData)
    const roundsIds = game.roundIds.split(",")
    const rounds = allRoundData.filter((round:Round)=> roundsIds.includes(round.id) && round.date===game.date)

    const getTotalScores = (round_id:string, round_date:string)=>{
        const score =scores.filter((score:Score) => score.id===round_id && score.date===round_date)

        if (score.length > 0){
            const score1 = score[0].teamA.reduce((sum, p) => sum + p.twoMade*2 + p.threeMade*3, 0)
            const score2 = score[0].teamB.reduce((sum, p) => sum + p.twoMade*2 + p.threeMade*3, 0)
            
            return score1 > score2 ? score1 + ":" + score2 : score2 + ":" + score1 

        }else{
            return "沒有數據"
        }
    }

    return (
        <div className="p-6 space-y-6">
            {/* 規則 */}
            <div className="card bg-base-200 shadow-inner p-4">
                <h3 className="text-xl font-bold mb-2">比賽規則</h3>
                <ul className="list-disc list-inside mt-1">
                    {rules.map((rule, index) => {
                        if (index === 5) {
                        return (
                            <li key={index}>
                            {rule}
                            <ul className="list-disc list-inside ml-4">
                                <li>任何一隊先達11分即結束比賽。</li>
                                <li>若雙方都超過7分，兩隊都下場（勝隊優先上場）。</li>
                            </ul>
                            </li>
                        );
                        } else {
                        return <li key={index}>{rule}</li>;
                        }
                    })}
                </ul>
            </div>

            {/* 場次表格 */}
            {
                (game.roundIds == "")?
                <div>沒有比賽數據</div>
                :
            
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                        <th>場次</th>
                        <th>比賽時間長度</th>
                        <th>比賽類型</th>
                        <th>得分結果</th>
                        <th>詳細資訊</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rounds.map((r, i) => (
                            <tr key={i}>
                                <td>{r.round}</td>
                                <td>{r.timeDuration}</td>
                                <td>{r.type}</td>
                                <td>{getTotalScores(r.id, r.date)}</td>
                                <td><button className="btn btn-primary" onClick={() => {navigate(('/rounds/'+ r.id))}}>詳細資訊
                                </button></td>
                            </tr>
                        ))} 
                    </tbody>
                    </table>
                </div>
            }
        </div>
        );
    };