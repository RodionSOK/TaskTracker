import React, { useState } from "react";
import "./Sidebar.css";

const Sidebar = ({ user, onMenuClick, menu, collapsed, setCollapsed }) => {
    const initials = user ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() : '?';

    const handleSidebarClick = (e) => {
        e.stopPropagation();
        setCollapsed(false);
    };

      return (
        <aside
            className={`startpage-sidebar${collapsed ? ' collapsed' : ' open'}`}
            onClick={handleSidebarClick}
            style={{cursor: 'pointer'}}
        >
            <div className="startpage-profile">
                <div className="startpage-avatar">{initials}</div>
                {!collapsed && (
                    <>
                        <div className="startpage-username">{user ? `${user.first_name} ${user.last_name}` : 'Имя Фамилия'}</div>
                        <div className="startpage-useremail">{user?.email || 'email@domain.com'}</div>
                    </>
                )}
            </div>
            <nav className="startpage-menu">
                {menu.map((item) => (
                    <div className="startpage-menu-item" key={item.label} onClick={(e) => {e.stopPropagation(); onMenuClick(item.label);}} style={{cursor: 'pointer'}}>
                        {item.icon}
                        {!collapsed && <span>{item.label}</span>}
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;