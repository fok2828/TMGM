import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import playersData from '../json/players.json';

interface Player {
  id: string;
  name: string;
  name_line: string;
  position: string;
  pay_way: string;
}

export const PlayerList = () => {
  const navigate = useNavigate();
  const players: Player[] = Object.values(playersData);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  const getPayWayText = (way: string) => {
    return way === 'all' ? '季繳' : '單次';
  };

  const filteredPlayers = players.filter((p) => {
    const matchesSearch =
      p.name.includes(search) || p.name_line?.includes(search);
    const matchesPayWay = filter === '' || p.pay_way === filter;
    return matchesSearch && matchesPayWay;
  });

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">球員清單列表</h1>

      {/* 搜尋與篩選 */}
      <div className="flex flex-wrap gap-4 mb-6 w-full max-w-4xl justify-between">
        <input
          type="text"
          placeholder="搜尋球員名稱 / Line 名稱"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered w-full sm:w-2/3"
        />
        <select
          className="select select-bordered w-full sm:w-1/3"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">全部</option>
          <option value="all">季繳</option>
          <option value="once">單次</option>
        </select>
      </div>

      {/* 表格 */}
      <div className="overflow-x-auto w-full max-w-4xl">
        <table className="table table-zebra w-full text-sm">
          <thead>
            <tr>
              <th>名稱</th>
              <th>Line 名稱</th>
              <th>職稱</th>
              <th>付費方式</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map((player, i) => (
              <tr
                key={i}
                className="cursor-pointer hover:bg-base-200"
                onClick={() => navigate(`/players/${player.id}`)}
              >
                <td>{player.name}</td>
                <td>{player.name_line || '-'}</td>
                <td>{player.position}</td>
                <td>{getPayWayText(player.pay_way)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPlayers.length === 0 && (
          <div className="text-center mt-4 text-gray-500">找不到符合條件的球員</div>
        )}
      </div>
    </div>
  );
};
