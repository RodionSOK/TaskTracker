import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar/Sidebar";
import Button from "../../components/Button/Button";
import Icon from "../../components/Icon/Icon";
import "./HomePage.css";

const sidebarMenu = [
    {
        label: "Личные данные",
        icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="7" r="4" stroke="#555" strokeWidth="2" />
                <path d="M4 18c0-3 5-3 7-3s7 0 7 3" stroke="#555" strokeWidth="2" fill="none" />
            </svg>
        ),
    },
    {
        label: "Задачи",
        icon: (
            <svg width="20" height="20" fill="none">
                <rect x="3" y="4" width="14" height="12" rx="2" stroke="#555" strokeWidth="2" />
                <path d="M7 8h6M7 12h4" stroke="#555" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        label: "Календарь",
        icon: (
            <svg width="20" height="20" fill="none">
                <rect x="3" y="5" width="14" height="12" rx="2" stroke="#555" strokeWidth="2" />
                <path d="M3 9h14" stroke="#555" strokeWidth="2" />
                <rect x="7" y="11" width="2" height="2" rx="1" fill="#555" />
                <rect x="11" y="11" width="2" height="2" rx="1" fill="#555" />
            </svg>
        ),
    },
    {
        label: "Проекты",
        icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="3" y="7" width="16" height="10" rx="2" stroke="#555" strokeWidth="2" />
                <path d="M3 7l3-4h10l3 4" stroke="#555" strokeWidth="2" fill="none" />
            </svg>
        ),
    },
    {
        label: "О приложении",
        icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="10" stroke="#555" strokeWidth="2" />
                <rect x="10" y="10" width="2" height="6" rx="1" fill="#555" />
                <rect x="10" y="6" width="2" height="2" rx="1" fill="#555" />
            </svg>
        ),
    },
    {
        label: "Выход",
        icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M7 11h8" stroke="#555" strokeWidth="2" />
                <path d="M13 7l4 4-4 4" stroke="#555" strokeWidth="2" fill="none" />
                <rect x="3" y="5" width="6" height="12" rx="2" stroke="#555" strokeWidth="2" />
            </svg>
        ),
    },
];

const columns = [
    "Просроченные",
    "Сегодня",
    "Неделя",
    "Две",
    "Больше двух",
    "Завершенные"
];

const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);

    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
    const [activeTab, setActiveTab] = useState("Задачи");

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
            case "Задачи":
                navigate("/tasks");
                break;
            case "Календарь":
                navigate("/calendar");
                break;
            default:
                break;
        }
        setSidebarCollapsed(false);
    };

    return (
        <div className="homepage-root">
            <Sidebar
                user={user}
                menu={sidebarMenu}
                onMenuClick={handleMenuClick}
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
                className={sidebarCollapsed ? "homepage-sidebar collapsed" : "homepage-sidebar"}
            />
       
            <main className={`homepage-main${sidebarCollapsed ? " collapsed" : ""}`}>
                <header className="homepage-header">
                    <h1 className="homepage-title">Мои задачи</h1>
                </header>
                <div className="homepage-tabs">
                    <span
                        className={`homepage-tab${activeTab === "Задачи" ? " active" : ""}`}
                        onClick={() => setActiveTab("Задачи")}
                    >
                        Задачи
                    </span>
                    <span
                        className={`homepage-tab${activeTab === "В работе" ? " active" : ""}`}
                        onClick={() => setActiveTab("В работе")}
                    >
                        В работе
                    </span>
                    <span
                        className={`homepage-tab${activeTab === "Фильтры" ? " active" : ""}`}
                        onClick={() => setActiveTab("Фильтры")}
                    >
                        Фильтры
                    </span>
                </div>
                <div className="homepage-divider"></div>
                <section className="homepage-tasks-table">
                    <table className="homepage-table">
                        <thead>
                            <tr>
                                {columns.map((col) => (
                                    <th key={col}>{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {columns.map((col) => (
                                    <td key={col}></td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </section>
            </main>
            {!sidebarCollapsed && (
                <div
                    className="homepage-sidebar-overlay"
                    onClick={() => setSidebarCollapsed(true)}
                />
            )}
        </div>
    );
};

export default HomePage;