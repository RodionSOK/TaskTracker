import React, { useState, useEffect } from 'react';
import './ProjectCard.css';

import Button from "../../components/Button/Button";


const ProjectCard = ({ project, onFavoriteToggle, onSettingsClick }) => {
    const completed = project.tasks_completed || 0;
    const total = project.tasks_total || 0;
    const percent = Math.round((completed / total) * 100) || 0;
    const [isFavorite, setIsFavorite] = useState(project.is_favorite || false);

    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

   useEffect(() => {
        setIsFavorite(project.is_favorite || false);
    }, [project.is_favorite]);

    const handleFavoriteToggle = async (e) => {
        if (e) e.preventDefault(); 
        e.stopPropagation();
        const newValue = !isFavorite;
        setIsFavorite(newValue);
        if (onFavoriteToggle) {
            await onFavoriteToggle(project.id, newValue);
        }
    };

    return (
        <div className="startpage-project-card">
            <div className="project-card-header">
                <label className="project-favorite-star">
                    <input
                        type="checkbox"
                        checked={isFavorite}
                        onChange={handleFavoriteToggle}
                        aria-label="Добавить в избранное"
                        style={{ display: 'none' }} 
                    />
                    <svg
                        className="star-icon"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill={isFavorite ? "var(--accent, #FFD600)" : "none"}
                        stroke="var(--accent, #FFD600)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        onClick={handleFavoriteToggle}
                    >
                        <polygon points="12 2 15 9 22 9.3 17 14 18.5 21 12 17.5 5.5 21 7 14 2 9.3 9 9" />
                    </svg>
                </label>
                <button
                    className="project-menu-button"
                    onClick={onSettingsClick}
                    aria-label="Открыть меню проекта"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="6" r="1.5" fill="currentColor"/>
                        <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                        <circle cx="12" cy="18" r="1.5" fill="currentColor"/>
                    </svg>
                </button>
            </div>
            <div className="startpage-project-title">{project.name}</div>
            <div className="startpage-project-progress">
                <div className="startpage-project-progress-bar">
                    <div
                        className="startpage-project-progress-bar-fill"
                        style={{ width: `${percent}%` }}
                    ></div>
                </div>
            </div>
            <div className="startpage-project-progress-text">
                {completed} из {total} задач выполнено ({percent}%)
            </div>
        </div>
    );
};

export default ProjectCard;