// ui/Sidebar.tsx
import React from "react";
import { Link } from "react-router-dom";
import './sidebar.css';
import { useSelector } from "react-redux";
import { RootState } from "../../store/store"; 

const Sidebar: React.FC = () => {
    const userRole = useSelector((state: RootState) => state.auth.user?.role);

    return (
        <div className="sidebar">
            <h2>Sideabar</h2>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/settings">Settings</Link></li>
                    <li><Link to="/add-user">Add User</Link></li>
                    <li><Link to="/allocations">Allocations</Link></li>
                    {userRole === 'admin' && <li><Link to="/all-users">All Users</Link></li>}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
