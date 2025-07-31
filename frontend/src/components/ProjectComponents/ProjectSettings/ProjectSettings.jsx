import React, { useState } from 'react';

import Input from '../../Input/Input';
import Button from '../../Button/Button';
import './ProjectSettings.css';

const ProjectSettings = ({
    project, 
    tasks, 
    onSave, 
    onDeleteTask,
    onDeleteProject,
    onClose,
}) => {
    const [name, setName] = useState(project.name);
    const [participantEmail, setParticipantEmail] = useState("");
    const [participants, setParticipants] = useState(project.invites || []);
    console.log(tasks);

    const handleRemoveParticipant = (email) => {
        setParticipants(participants.filter(e => e !== email));
    };

    const handleAddParticipant = () => {
        if (participantEmail.trim() && !participants.includes(participantEmail.trim())) {
            setParticipants([...participants, participantEmail.trim()]);
            setParticipantEmail("");
        }
    };

    const handleSave = () => {
        onSave(project.id, { name, invites: participants});
        onClose();
    }

    const handleDeleteTask = (taskId) => {
        onDeleteTask(project.id, taskId);
    };

    return (
        <div className='project-settings-backdrop'>
            <div className="project-settings-modal">
                <h2>Настройки проекта</h2>
                <label>
                    Имя проекта
                    <div className="project-name-input-wrapper">
                        <span className="project-name-icon">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <rect x="3" y="6" width="14" height="10" rx="2" stroke="#808080" strokeWidth="2"/>
                                <path d="M3 6V4a2 2 0 0 1 2-2h3l2 2h5a2 2 0 0 1 2 2v2" stroke="#808080" strokeWidth="2"/>
                            </svg>
                        </span>
                        <Input
                            className="project-settings-input"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            nativePlaceholder="Введите название"
                            name="projectName"
                            theme="white-with-border"
                            wide={true}
                        />
                    </div>
                </label>
                <label>
                    Добавить участника (email)
                    <div className="invite-email-input-wrapper" style={{ display: "flex", gap: 8 }}>
                        <span
                            className="invite-add-icon"
                            onClick={handleAddParticipant}
                            tabIndex={0}
                            role="button"
                            aria-label="Добавить пользователя"
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <circle cx="10" cy="10" r="9" strokeWidth="2"/>
                                <line x1="10" y1="6" x2="10" y2="14" strokeWidth="2"/>
                                <line x1="6" y1="10" x2="14" y2="10" strokeWidth="2"/>
                            </svg>
                        </span>
                        <Input
                            className="project-settings-input"
                            type="email"
                            value={participantEmail}
                            onChange={e => setParticipantEmail(e.target.value)}
                            nativePlaceholder="Email участника"
                            name="inviteEmail"
                            theme="white-with-border"
                        />
                    </div>
                    {participants.length > 0 && (
                        <div className="participants-list">
                            {participants.map(email => (
                                <span key={email} className="participant-chip">
                                    {email}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveParticipant(email)}
                                        aria-label="Удалить участника"
                                    >
                                        &times;
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </label>
                <div>
                    <h3>Задачи проекта</h3>
                    <ul>
                        {tasks.map(task => (
                            <li key={task.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span>{task.title}</span>
                                <button
                                    className="task-delete-icon"
                                    onClick={() => handleDeleteTask(task.id)}
                                    aria-label="Удалить задачу"
                                    type="button"
                                >
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <line x1="5" y1="5" x2="13" y2="13" stroke="#d32f2f" strokeWidth="2"/>
                                        <line x1="13" y1="5" x2="5" y2="13" stroke="#d32f2f" strokeWidth="2"/>
                                    </svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="project-settings-actions">
                    <Button theme="black" onClick={handleSave}>Сохранить</Button>
                    <Button theme="red" onClick={() => onDeleteProject(project.id)}>Удалить</Button>
                    <Button theme="gray" onClick={onClose}>Отмена</Button>
                </div>
            </div>
        </div>
    );
};

export default ProjectSettings;