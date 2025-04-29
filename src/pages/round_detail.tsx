import { useParams} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
  } from 'recharts';
import allRoundData from "../json/rounds.json";
import allScoreData from "../json/scores.json";
import allPlayerData from "../json/players.json";
  
export const RoundDetail = () => {
    const {round_id} = useParams<{ round_id: string }>();
    const navigate = useNavigate();
    if (round_id === undefined) {
        return <div>No Data</div>;
    }
    interface Round {
        id: string,
        date: string;
        type: string;
    }
    interface Player {
        player_id: string;
        teamColor: string;
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

    const rounds:Round[] = Object.values(allRoundData);
    const scores:Score[] = Object.values(allScoreData).map((score) => ({
        id: score.id,
        date: score.date,
        teamA: Object.values(score.teamA).map((player) => ({
            player_id: player.player_id,
            teamColor: player.teamColor,// Convert score to a number
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
            teamColor: player.teamColor, // Convert score to a number
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
    const playerData = Object.values(allPlayerData);
    const round = rounds.filter((round:Round) => round.id===round_id)[0]
    const score = scores.filter((score:Score) => score.id===round_id && round.date)
    const resultCompareData = ["得分", "籃板", "助攻", "抄截", "阻攻", "失誤"];

    if (score.length === 0) {
        return <div>No Data</div>;
    }
    const teamA = score[0].teamA;
    const teamB = score[0].teamB;
    // 計算總得分
    const teamAName = teamA[0].teamColor
    const teamBName = teamB[0].teamColor
    
    const calcTeamSummary = (players: Player[]) => {
        const playersArray = Object.values(players);
        return playersArray.reduce((sum, p) => ({
            points: sum.points + (p.twoMade*2 + p.threeMade*3),
            twoMade: sum.twoMade + p.twoMade,
            twoAttempt: sum.twoAttempt + p.twoAttempt,
            threeMade: sum.threeMade + p.threeMade,
            threeAttempt: sum.threeAttempt + p.threeAttempt,
            oReb: sum.oReb + p.oReb,
            dReb: sum.dReb + p.dReb,
            ast: sum.ast + p.ast,
            stl: sum.stl + p.stl,
            blk: sum.blk + p.blk,
            tov: sum.tov + p.tov,
        }), {
            points: 0, twoMade: 0, twoAttempt: 0, threeMade: 0, threeAttempt: 0,
            oReb: 0, dReb: 0, ast: 0, stl: 0, blk: 0, tov: 0
        });
    };
    const teamASummary = calcTeamSummary(teamA)
    const teamBSummary = calcTeamSummary(teamB)
    
    // Chart Data
    const chartData = resultCompareData.map((barName) => {
        if (barName==="得分") {
            return {
                name: barName,
                teamA: teamASummary.points,
                teamB: teamBSummary.points
            }
        }else if (barName==="籃板") {
            return {
                name: barName,
                teamA: teamASummary.dReb + teamASummary.oReb,
                teamB: teamBSummary.dReb + teamBSummary.oReb
            }
        }else if (barName==="助攻") {
            return {
                name: barName,
                teamA: teamASummary.ast,
                teamB: teamBSummary.ast
            }
        }else if (barName==="抄截") {
            return {
                name: barName,
                teamA: teamASummary.stl,
                teamB: teamBSummary.stl
            }
        }else if (barName==="阻攻") {
            return {
                name: barName,
                teamA: teamASummary.blk,
                teamB: teamASummary.blk
            }
        }else if (barName==="失誤") {
            return {
                name: barName,
                teamA: teamASummary.tov,
                teamB: teamBSummary.tov
            }
        } 
    })

    // 比分排序
    const teamsSorted = [{ ...teamA, score: teamASummary.points, name:teamAName, players:teamA}, { ...teamB, score: teamBSummary.points, name:teamBName, players:teamB }];

    const getPlayerName = (player_id:string)=>{
        const playerInfo = playerData.filter((player) => player.id===player_id)
        if (playerInfo.length > 0) {
            return playerInfo[0].name
        }
        return ""
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">比賽數據統計</h1>

            {/* 📊 總數據比較圖表 */}
            <div className="card bg-base-100 shadow-md p-4">
                <h3 className="text-xl font-bold mb-4">兩隊總數據比較</h3>

                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={chartData}
                        layout="horizontal"
                        margin={{ top: 10, right: 30, left: 50, bottom: 5 }}
                    >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis/>
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="teamA" name="黑隊" fill={teamA[0].teamColor} />
                    <Bar dataKey="teamB" name="白隊" fill="#f5f3e5" />
                    </BarChart>
                </ResponsiveContainer>
            </div>


            {teamsSorted.map((team, idx) => {
                const summary = calcTeamSummary(team.players)
                return (
                    <div key={idx} className="mb-10 mt-10">
                        <h2 className="text-xl font-semibold mb-2">
                            {team.name}（{team.score} 分）
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="table w-full text-sm">
                            <thead>
                                <tr>
                                <th>球員</th>
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
                                {team.players.map((p, i) => (
                                <tr key={i}
                                    className="cursor-pointer hover:bg-base-200"
                                    onClick={() => navigate(`/players/${p.player_id}`)}>
                                    <td>{getPlayerName(p.player_id)}</td>
                                    <td>{p.twoMade*2 + p.threeMade*3}</td>
                                    <td>{p.twoMade} / {p.twoAttempt}</td>
                                    <td>{p.threeMade} / {p.threeAttempt}</td>
                                    <td>{p.oReb}</td>
                                    <td>{p.dReb}</td>
                                    <td>{p.ast}</td>
                                    <td>{p.stl}</td>
                                    <td>{p.blk}</td>
                                    <td>{p.tov}</td>
                                </tr>
                                ))}
                            </tbody>
                            <tfoot className="font-bold bg-base-200">
                                <tr>
                                <td>總計</td>
                                <td>{summary.points}</td>
                                <td>{summary.twoMade} / {summary.twoAttempt}</td>
                                <td>{summary.threeMade} / {summary.threeAttempt}</td>
                                <td>{summary.oReb}</td>
                                <td>{summary.dReb}</td>
                                <td>{summary.ast}</td>
                                <td>{summary.stl}</td>
                                <td>{summary.blk}</td>
                                <td>{summary.tov}</td>
                                </tr>
                            </tfoot>
                            </table>
                        </div>
                    </div>
                )
            })}
        </div>
    );
  };