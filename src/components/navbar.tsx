import { Link } from "react-router-dom"
export const NavBar = () => {
    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost normal-case text-xl">主頁</Link>
            </div>
            <div className="flex-none">
                <div className="dropdown dropdown-end">
                <button tabIndex={0} className="btn btn-ghost lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                    <li><Link to="/teams">隊伍資訊</Link></li>
                    <li><Link to="/games">比賽資訊</Link></li>
                    <li><Link to="/players">球員資訊</Link></li>
                    <li><Link to="/place">場地資訊</Link></li>
                    <li><a target="_blank" href="https://docs.google.com/spreadsheets/d/1c9VY7Dy8S8iSSSx_DniSchF63z74NpR17JjJOZS1HPU/edit?pli=1&gid=0#gid=0">隊費資訊</a></li>
                </ul>
                </div>
                <ul className="menu menu-horizontal px-1 hidden lg:flex">
                <li><Link to="/teams">隊伍資訊</Link></li>
                <li><Link to="/games">比賽資訊</Link></li>
                <li><Link to="/players">球員資訊</Link></li>
                <li><Link to="/place">場地資訊</Link></li>
                <li><a target="_blank" href="https://docs.google.com/spreadsheets/d/1c9VY7Dy8S8iSSSx_DniSchF63z74NpR17JjJOZS1HPU/edit?pli=1&gid=0#gid=0">隊費資訊</a></li>
                </ul>
            </div>
            
            
        </div>
    )
}