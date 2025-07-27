import React, { useState } from 'react';

import Input from '../Input/Input';
import Button from '../Button/Button';
import './ProjectForm.css'

const ProjectForm = ({ onCreate, onClose }) => {
    const [name, setName] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [invites, setInvites] = useState([]);
    const [error, setError] = useState('');

    const handleAddInvite = (e) => {
        e.preventDefault();
        if (!inviteEmail.trim()) return;
        if (!/^[^@]+@[^@]+\.[^@]+$/.test(inviteEmail)) {
            setError('Введите корректный email');
            return;
        }
        if (invites.includes(inviteEmail)) {
            setError('Этот пользователь уже добавлен');
            return;
        }
        setInvites([...invites, inviteEmail]);
        setInviteEmail('');
        setError('');
    };

    const handleRemoveInvite = (email) => {
        setInvites(invites.filter(e => e !== email));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Название проекта обязательно');
            return;
        }
        onCreate({ name, invites, });
        setName('');
        setInviteEmail('');
        setInvites([]);
        setError('');
        onClose && onClose();
    };

    return (
        <div className="create-project-modal">
        <form className="create-project-form" onSubmit={handleSubmit}>
            <h2>Создать проект</h2>
            <label>
                Название проекта
                <div className="project-name-input-wrapper">
                    <span className="project-name-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <rect x="3" y="6" width="14" height="10" rx="2" stroke="#808080" strokeWidth="2"/>
                        <path d="M3 6V4a2 2 0 0 1 2-2h3l2 2h5a2 2 0 0 1 2 2v2" stroke="#808080" strokeWidth="2"/>
                    </svg>
                    </span>
                    <Input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        nativePlaceholder="Введите название"
                        name="projectName"
                        theme="white-with-border"
                        wide={true}
                    />
                </div>
            </label>
            <label>
                Пригласить пользователя (email)
                <div className="invite-email-input-wrapper">
                    <span
                        className="invite-add-icon"
                        onClick={handleAddInvite}
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
                        type="email"
                        value={inviteEmail}
                        onChange={e => setInviteEmail(e.target.value)}
                        nativePlaceholder="Введите email"
                        name="inviteEmail"
                        theme="white-with-border"
                    />
                </div>
            </label>
            {invites.length > 0 && (
                <div className="invite-list">
                    {invites.map(email => (
                    <span key={email} className="invite-item">
                        {email}
                        <button type="button" onClick={() => handleRemoveInvite(email)}>&times;</button>
                    </span>
                    ))}
                </div>
            )}
            {error && <div className="form-error">{error}</div>}
            <div className="form-actions">
                <Button type="submit" theme="black" size="medium">Создать</Button>
                <Button type="button" theme="gray" size="medium" onClick={onClose}>Отмена</Button>
            </div>
        </form>
      </div>
    );
};

export default ProjectForm;