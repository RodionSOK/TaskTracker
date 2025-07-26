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
            </label>
            <label>
                Пригласить пользователя (email)
                <div style={{ display: 'flex', gap: 8 }}>
                    <Input
                        type="email"
                        value={inviteEmail}
                        onChange={e => setInviteEmail(e.target.value)}
                        nativePlaceholder="Введите email"
                        name="inviteEmail"
                        theme="white-with-border"
                        wide={true}
                    />
                    {/* <Button type="button" theme="gray" size="small" onClick={handleAddInvite}>+</Button> */}
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