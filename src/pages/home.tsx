import { useNavigate } from 'react-router-dom';
import gameData from '../json/games.json';

export const Home = () => {
    
    interface Game {
      id: string;
      date: string;
      time: string;
      location: string;
      participants: string;
    }
    const navigate = useNavigate();
    const gameList: Game[] = Object.values(gameData);

    const sortedGameList = gameList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
      return (
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">比賽列表</h1>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {sortedGameList.map((game) => (
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
        </div>
      );
}