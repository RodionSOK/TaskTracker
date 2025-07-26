import React from 'react';
import './ProjectCard.css';

import Button from "../../components/Button/Button";


const ProjectCard = ({ project }) => {
    const completed = project.tasks_completed || 0;
    const total = project.tasks_total || 0;
    const percent = Math.round((completed / total) * 100) || 0;

    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    return (
        <div className="startpage-project-card">
            <div className="startpage-project-title">{project.name}</div>

            {/* <div className='project-menu-container'>
                <button className='project-menu-button' onClick={toggleMenu}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="6" r="1.5" fill="currentColor"/>
                            <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                            <circle cx="12" cy="18" r="1.5" fill="currentColor"/>
                        </svg>
                </button>
            </div> */}

            <div className="startpage-project-progress">
                <div className="startpage-project-progress-bar" style={{ width: `${percent}%` }}></div>
            </div>
            <div className="startpage-project-progress-text">
                {completed} из {total} задач выполнено ({percent}%)
            </div>
        </div>
    );
};

export default ProjectCard;