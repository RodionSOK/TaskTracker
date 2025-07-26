import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects } from "../../store/projectslice";
import { logout } from "../../store/authslice";
import { useNavigate } from "react-router-dom";

import ProjectCard from "../../components/ProjectCard/ProjectCard";
import Button from "../../components/Button/Button";
import Icon from "../../components/Icon/Icon";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./StartPage.css";

const sidebarMenu = [
    { label: "Личные данные", icon:
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="7" r="4" stroke="#555" strokeWidth="2"/>
            <path d="M4 18c0-3 5-3 7-3s7 0 7 3" stroke="#555" strokeWidth="2" fill="none"/>
        </svg>    
    },
    { label: "Проекты", icon: 
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="3" y="7" width="16" height="10" rx="2" stroke="#555" strokeWidth="2"/>
            <path d="M3 7l3-4h10l3 4" stroke="#555" strokeWidth="2" fill="none"/>
        </svg>
    },
    { label: "О приложении", icon: 
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="10" stroke="#555" strokeWidth="2"/>
            <rect x="10" y="10" width="2" height="6" rx="1" fill="#555"/>
            <rect x="10" y="6" width="2" height="2" rx="1" fill="#555"/>
        </svg>
    },
    { label: "Выход", icon:
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M7 11h8" stroke="#555" strokeWidth="2"/>
            <path d="M13 7l4 4-4 4" stroke="#555" strokeWidth="2" fill="none"/>
            <rect x="3" y="5" width="6" height="12" rx="2" stroke="#555" strokeWidth="2"/>
        </svg>
    },
];

const StartPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { projects, isLoading, error } = useSelector(state => state.projects);
    const projectList = Array.isArray(projects.projects) ? projects.projects : [];
    const user = useSelector(state => state.auth.user);
    const myProjects = projectList.filter(project => project.user === user.user_id);

    const [activeFilter, setActiveFilter] = useState('all');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

    const handleFilterClick = (filter) => {
        setActiveFilter(filter);
    };

    const handleMenuClick = (label) => {
        switch (label) {
            case "Проекты":
                navigate("/start");
                break;
            case "О приложении":
                navigate("/about");
                break;
            case "Личные данные":
                navigate("/settings");
                break;
            case "Выход":
                dispatch(logout());
                navigate("/login");
                break;
            default:
                break;
        }
        setSidebarCollapsed(false); 
    };

    const handleOverlayClick = () => setSidebarCollapsed(true);

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    return (
        <div className="startpage-root">
            {!sidebarCollapsed && (
                <div
                    className="startpage-sidebar-overlay"
                    onClick={handleOverlayClick}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        background: "rgba(0,0,0,0.15)",
                        zIndex: 99
                    }}
                />
            )}
            <Sidebar
                user={user}
                menu={sidebarMenu}
                onMenuClick={handleMenuClick}
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
            />
            <main className="startpage-main">
                <header className="startpage-header">
                    <h1 className="startpage-title">Мои проекты</h1>
                </header>
                <div className="startpage-filters">
                    <span 
                        className={`startpage-filter ${activeFilter === 'all' ? 'active' : ''}`}
                        onClick={() => handleFilterClick('all')}
                    >
                        Все
                    </span>
                    <span 
                        className={`startpage-filter ${activeFilter === 'favorites' ? 'active' : ''}`}
                        onClick={() => handleFilterClick('favorites')}
                    >
                        Избранные
                    </span>
                </div>
                <div className="startpage-divider"></div>
                <section className="startpage-projects">
                    {isLoading ? (
                        <div className="startpage-loading">Загрузка проектов...</div>
                    ) : error ? (
                        <div className="startpage-error">{typeof error === 'string' ? error : JSON.stringify(error)}</div>
                    ) : projects.length === 0 ? (
                        <div className="startpage-empty">
                            <div>У вас пока нет проектов</div>
                        </div>
                    ) : (
                        <div className="startpage-project-list">
                            {myProjects.map((project) => (
                                <ProjectCard key={project.id || project.name} project={project} />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};
    
export default StartPage;