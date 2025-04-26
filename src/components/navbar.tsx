import { Link } from "react-router-dom"
export const NavBar = () => {
    return (
        <div className="navbar bg-base-100">
            <div className="flex-none">
                <ul className="menu menu-horizontal p-0">
                    <li>
                        <Link to="/">主頁</Link>
                    </li>
                    <li>
                        <Link to="/players">球員資訊</Link>       
                    </li>
                    <li>
                        <Link to="/place">場地資訊</Link>       
                    </li>
                    <li>
                        <a target="_blank" href="https://docs.google.com/spreadsheets/d/1c9VY7Dy8S8iSSSx_DniSchF63z74NpR17JjJOZS1HPU/edit?pli=1&gid=0#gid=0">隊費資訊</a>
                    </li>
                </ul>
            </div>
        </div>
    )
}