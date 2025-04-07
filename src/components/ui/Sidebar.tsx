// ui/Sidebar.tsx
import './sidebar.css';

import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "../../store/store"; 

const Sidebar: React.FC = () => {
    // @ts-ignore
    const userRole = useSelector((state: RootState) => state.auth.user?.type);

    return (
        <div className="sidebar">
            <h2>Sideabar</h2>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/settings">Settings</Link></li>
                    <li><Link to="/allocations">Allocations</Link></li>
                    {
                        userRole === 'Admin' && 
                        <>
                            <li><Link to="/add-user">Add User</Link></li>
                            <li><Link to="/all-users">All Users</Link></li>
                        </>
                    }
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
