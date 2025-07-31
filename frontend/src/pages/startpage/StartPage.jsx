import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects } from "../../store/projectslice";
import { logout } from "../../store/authslice";
import { useNavigate } from "react-router-dom";

import ProjectSettings from "../../components/ProjectComponents/ProjectSettings/ProjectSettings";
import ProjectCard from "../../components/ProjectComponents/ProjectCard/ProjectCard";
import ProjectForm from "../../components/ProjectComponents/ProjectForm/ProjectForm";
import Button from "../../components/Button/Button";
import Icon from "../../components/Icon/Icon";
import LoadSpinner from "../../shared/preload/LoadSpinner/LoadSpinner";

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


    
    const [activeFilter, setActiveFilter] = useState('all');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const myProjects = projectList.filter(project => project.user === user.user_id);
    const filteredProjects = activeFilter === 'favorites'
        ? myProjects.filter(project => project.is_favorite)
        : myProjects;

    const sortedProjects = [...filteredProjects].sort((a, b) => a.id - b.id);

    const selectedProjectTasks = selectedProject ? (Array.isArray(selectedProject.tasks) ? selectedProject.tasks : []) : [];

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

    const handleCreateProjectClick = () => {
        setShowProjectForm(true);
    };
    const handleCloseProjectForm = () => {
        setShowProjectForm(false);
    };
    const handleCreateProject = async ({ name, invites }) => {
        try {
            const token = localStorage.getItem("accessToken");
            const userId = user.user_id;

            const response = await fetch("http://192.168.1.66:8000/api/v1/projects/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name,
                    user: userId,
                    is_favorite: false,
                    invites,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Ошибка создания проекта");
            }

            dispatch(fetchProjects());
            setShowProjectForm(false);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleFavoriteToggle = async (projectId, isFavorite) => {
        const token = localStorage.getItem("accessToken");
        await fetch(`http://192.168.1.66:8000/api/v1/projects/${projectId}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ is_favorite: isFavorite }),
        });
        dispatch(fetchProjects());
    };

    const handleOpenSettings = (project) => {
        setSelectedProject(project);
        setShowSettings(true);
    }

    const handleSaveSettings = async (projectId, data) => {
        const token = localStorage.getItem("accessToken");
        await fetch(`http://192.168.1.66:8000/api/v1/projects/${projectId}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        dispatch(fetchProjects());
    };

    // const handleAddParticipant = async (projectId, email) => {
    //     const token = localStorage.getItem("accessToken");
    //     await fetch(`http://192.168.1.66:8000/api/v1/projects/${projectId}/`, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": `Bearer ${token}`,
    //         },
    //         body: JSON.stringify({ email }),
    //     });
    //     dispatch(fetchProjects());
    // };

    const handleDeleteTask = async (projectId, taskId) => {
        const token = localStorage.getItem("accessToken");
        await fetch(`http://192.168.1.66:8000/api/v1/tasks/${taskId}/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        dispatch(fetchProjects());
        if (selectedProject && selectedProject.id === projectId) {
            setSelectedProject({
                ...selectedProject,
                tasks: selectedProject.tasks.filter(task => task.id !== taskId)
            });
        }
    };

    const handleDeleteProject = async (projectId) => {
        const token = localStorage.getItem("accessToken");
        await fetch(`http://192.168.1.66:8000/api/v1/projects/${projectId}/`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        dispatch(fetchProjects());
        setShowSettings(false);
    };
    
    const handleCloseSettings = () => setShowSettings(false);

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
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: "60vh",
                            width: "100%",
                        }}>
                            <LoadSpinner />
                        </div>
                    ) : error ? (
                        <div className="startpage-error">{typeof error === 'string' ? error : JSON.stringify(error)}</div>
                    ) : projects.length === 0 ? (
                        <div className="startpage-empty">
                            <div>У вас пока нет проектов</div>
                        </div>
                    ) : (
                        <>
                            <div className="startpage-project-list">
                                {sortedProjects.map((project) => (
                                    <ProjectCard 
                                        key={project.id || project.name} 
                                        project={project} 
                                        onFavoriteToggle={handleFavoriteToggle}    
                                        onSettingsClick={() => handleOpenSettings(project)}
                                    />
                                ))}
                                <div
                                    className="startpage-project-card startpage-project-card--new"
                                    onClick={handleCreateProjectClick}
                                    tabIndex={0}
                                    role="button"
                                    aria-label="Создать новый проект"
                                >
                                    <div className="new-project-icon">
                                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                            <circle cx="20" cy="20" r="20" fill="var(--gray_90)" />
                                            <rect x="18" y="10" width="4" height="20" rx="2" fill="var(--gray_50)" />
                                            <rect x="10" y="18" width="20" height="4" rx="2" fill="var(--gray_50)" />
                                        </svg>
                                    </div>
                                    <div className="new-project-text">Создать проект</div>
                                </div>
                            </div>
                            {showProjectForm && (
                                <ProjectForm
                                    onCreate={handleCreateProject} 
                                    onClose={handleCloseProjectForm}
                                />
                            )}
                            {showSettings && selectedProject && (
                                <ProjectSettings
                                    project={selectedProject}
                                    tasks={selectedProjectTasks}
                                    onSave={handleSaveSettings}
                                    onDeleteTask={handleDeleteTask}
                                    onDeleteProject={handleDeleteProject}
                                    onClose={handleCloseSettings}
                                />
                            )}
                        </>
                    )}
                </section>
            </main>
        </div>
    );
};
    
export default StartPage;