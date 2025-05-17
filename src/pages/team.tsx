import React, { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";
import teamsData from "../json/teams.json";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import allScoresData from "../json/scores.json";

type Team = {
  id: string;
  logo: string;
  name_zh: string;
  name_en: string;
  games: number;
  wins: number;
};

type SortType = "winRate" | "wins";

export const Team: React.FC = () => {
  //const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [sortType, setSortType] = useState<SortType>("winRate");
  const scores = Object.values(allScoresData)
  const logos = import.meta.glob("../assets/img/*.{png,jpg,jpeg,webp}", { eager: true, import: "default" });

  useEffect(() => {
    // 模擬 fetch，實際情況可用 fetch('/data/teams.json')
    setTeams(teamsData);
  }, []);

  const getLogo = (logog_file_name: string) => {
    const logo = logos[`../assets/img/${logog_file_name}`];

    if (typeof logo === 'string'){
        return logo
    }else{
        return ""
    }
  };

  const countTeamsWins = () => {
    let newTeamRecords = [...teams]
    
    scores.forEach((score) => {
      if (score.teamA[0].team_id !== "" ){
        const teamIdList = [score.teamA[0].team_id.toString(), score.teamB[0].team_id.toString()]
        newTeamRecords = newTeamRecords.map((team) => {
          if(teamIdList.includes(team.id.toString())){
            return {...team, games: team.games + 1}
          }else{
            return team
          }
        })
        const teamAScores = score.teamA.reduce((sum, p) => sum + Number(p.twoMade)*2 + Number(p.threeMade)*3, 0)
        const teamBScores = score.teamB.reduce((sum, p) => sum + Number(p.twoMade)*2 + Number(p.threeMade)*3, 0)  
        if (teamAScores > teamBScores){
          newTeamRecords = newTeamRecords.map((team) => {
            if(team.id.toString() === score.teamA[0].team_id.toString()){
              return {...team, wins: team.wins + 1}
            }else{
              return team
            }
          })
        }else{
          newTeamRecords = newTeamRecords.map((team) => {
            if(team.id.toString() === score.teamB[0].team_id.toString()){
              return {...team, wins: team.wins + 1}
            }else{
              return team
            }
          })
        }
      }
    })
  
    return newTeamRecords
  };

  const sortedTeams = [...countTeamsWins()].sort((a, b) => {
    if (sortType === "winRate") {
      return b.wins / b.games - a.wins / a.games;
    } else {
      return b.wins - a.wins;
    } 
  });


  return (
    <div className="p-4 space-y-6">
      <div className="flex                                                          -2 items-center">
        <span className="font-semibold">排序依據：</span>
        <select
          className="select select-sm select-bordered"
          value={sortType}
          onChange={(e) => setSortType(e.target.value as SortType)}
        >
          <option value="winRate">勝率</option>
          <option value="wins">勝場數</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedTeams.map((team) => {
          const winRate = ((team.wins / team.games) * 100).toFixed(1) + "%";
          return (
            <div
              key={team.id}
              className="bg-white rounded-2xl shadow-md p-6 md:p-8 cursor-pointer hover:shadow-xl transition"
              //onClick={() => navigate(`/teams/${team.id}`)}
            >
              <div className="flex justify-center sm:flex-row items-center space-x-0 sm:space-x-4 space-y-4 sm:space-y-0">
                <img
                  src={getLogo(team.logo)}
                  alt={team.name_en}
                  className="w-72 h-72 object-contain"
                />
              </div>
              <div className="mt-4 space-y-1">
                <div className="min-w-0 break-words">
                  <div className="text-4xl font-semibold">{team.name_zh}</div>
                  <div className="text-2xl text-gray-500">{team.name_en}</div>
                </div>
                <div className=" text-gray-700 text-2xl">
                    <div>戰績：{team.games} 戰 {team.wins} 勝</div>
                    <div>勝率：{winRate}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold mb-2">各隊勝率圖表</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sortedTeams.map(t => ({
            name: t.name_zh,
            winRate: Number(((t.wins / t.games) * 100).toFixed(1))
          }))}>
            <XAxis dataKey="name" />
            <YAxis unit="%" />
            <Tooltip />
            <Bar dataKey="winRate" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};