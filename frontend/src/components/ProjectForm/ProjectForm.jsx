import React, { useState } from 'react';
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
        onCreate({ name, user });
        setName('');
        setUser('');
        setError('');
        onClose && onClose();
    };

    return (
        <div className="create-project-modal">
        <form className="create-project-form" onSubmit={handleSubmit}>
            <h2>Создать проект</h2>
            <label>
                Название проекта
                <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Введите название"
                />
            </label>
            <label>
                Пригласить пользователей (email)
                <div style={{ display: 'flex', gap: 8 }}>
                    <input
                    type="email"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    placeholder="Введите email"
                    />
                    <button type="button" onClick={handleAddInvite}>Добавить</button>
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
                <button type="submit">Создать</button>
                <button type="button" onClick={onClose}>Отмена</button>
            </div>
        </form>
      </div>
    );
};

export default ProjectForm;