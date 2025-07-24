import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects } from "../../store/projectslice";

import Button from "../../components/Button/Button";
import Icon from "../../components/Icon/Icon";
import "./StartPage.css";

const sidebarMenu = [
  { icon: "category", label: "Проекты" },
  { icon: "info", label: "О приложении" },
  { icon: "settings", label: "Настройки пользователя" },
  { icon: "logout", label: "Выйти" },
];

const StartPage = () => {
    const dispatch = useDispatch();
    const { projects, isLoading, error } = useSelector(state => state.projects);
    const projectList = Array.isArray(projects.projects) ? projects.projects : [];
    const user = useSelector(state => state.auth.user);

    // Получаем инициалы пользователя
    const initials = user ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() : '?';

    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    return (
        <div className="startpage-root">
            <aside className="startpage-sidebar">
                <div className="startpage-profile">
                    <div className="startpage-avatar">{initials}</div>
                    <div className="startpage-username">{user ? `${user.first_name} ${user.last_name}` : 'Имя Фамилия'}</div>
                    <div className="startpage-useremail">{user?.email || 'email@domain.com'}</div>
                </div>
                <nav className="startpage-menu">
                {sidebarMenu.map((item) => (
                    <div className="startpage-menu-item" key={item.label}>
                    <Icon type={item.icon} width="20" height="20" />
                    <span>{item.label}</span>
                    </div>
                ))}
                </nav>
            </aside>
            <main className="startpage-main">
                <header className="startpage-header">
                <h1 className="startpage-title">Мои проекты</h1>
                <div className="startpage-header-actions">
                    <Button theme="gray" size="medium">Создать проект</Button>
                    <div className="startpage-search-wrapper">
                    <input className="startpage-search" placeholder="Поиск проектов..." />
                    <Icon type="search" width="20" height="20" className="startpage-search-icon" />
                    </div>
                </div>
                </header>
                <div className="startpage-filters">
                <Button size="small" theme="gray">Все</Button>
                <Button size="small" theme="gray">Мои</Button>
                <Button size="small" theme="gray">Избранные</Button>
                <Button size="small" theme="gray">Архив</Button>
                </div>
                <section className="startpage-projects">
                {isLoading ? (
                    <div className="startpage-loading">Загрузка проектов...</div>
                ) : error ? (
                    <div className="startpage-error">{typeof error === 'string' ? error : JSON.stringify(error)}</div>
                ) : projects.length === 0 ? (
                    <div className="startpage-empty">
                    <Icon type="category" width="48" height="48" />
                    <div>У вас пока нет проектов</div>
                    <Button theme="gray" size="medium">Создать первый проект</Button>
                    </div>
                ) : (
                    <div className="startpage-project-list">
                    {   console.log('projects:', projects, Array.isArray(projects))}
                    {projectList.map((project) => (
                        <div className="startpage-project-card" key={project.id || project.name}>
                        <div className="startpage-project-title">{project.name}</div>
                        </div>
                    ))}
                    </div>
                )}
                </section>
            </main>
        </div>
    );
};
    
export default StartPage;