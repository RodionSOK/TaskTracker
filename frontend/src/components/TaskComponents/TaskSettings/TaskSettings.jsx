import React, { useState } from "react";
import Button from "../../Button/Button";
import "./TaskSettings.css";
import "../TaskCard/TaskCard.css"; // для стилей кнопки и таймбара

const getTimePercent = (date_deadline, date_start) => {
    if (!date_deadline || !date_start) return 0;
    const now = new Date();
    const start = new Date(date_start);
    const end = new Date(date_deadline);
    if (isNaN(start) || isNaN(end)) return 0;
    if (now >= end) return 100;
    if (now <= start) return 0;
    const total = end - start;
    const passed = now - start;
    return Math.max(0, Math.min(100, Math.round((passed / total) * 100)));
};

const TaskSettings = ({ task, categories, onSave, onClose, onDelete, onStart }) => {
    const [title, setTitle] = useState(task.title || "");
    const [description, setDescription] = useState(task.description || "");
    const [category, setCategory] = useState(task.category?.id || "");
    const [date_deadline, setDateDeadline] = useState(task.date_deadline || "");
    const started = task.is_started;
    const dateStart = task.date_start;
    const continued = task.is_continued;

    const timePercent = getTimePercent(date_deadline, dateStart);

    const handleSave = () => {
        onSave({
            ...task,
            title,
            description,
            category: categories.find(cat => cat.id === category),
            date_deadline,
            is_started: task.is_started,
            is_done: task.is_done,
            is_continued: task.is_continued,
            date_start: task.date_start,
        });
        onClose();
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(task);
        }
        onClose();
    };

    const handleStartClick = () => {
        const now = new Date().toISOString();
        if (onStart) {
            onStart({
                ...task,
                date_start: now,
                is_started: true,
            });
        }
        onClose();
    };

    const handleCompleteClick = () => {
        if (onStart) {
            onStart({
                ...task,
                is_done: true,
            });
        }
        onClose();
    };

    const handlePauseClick = () => {
        if (onStart) {
            onStart({
                ...task,
                is_continued: false,
            });
        }
        onClose();
};

    const handleResumeClick = () => {
        if (onStart) {
            onStart({
                ...task,
                is_continued: true,
            });
        }
        onClose();
    };

    return (
        <div className="task-settings-modal">
            <h2>Настройки задачи</h2>
            <label>
                Название:
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
            </label>
            <label>
                Описание:
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
            </label>
            <label>
                Категория:
                <select
                    value={category}
                    onChange={e => setCategory(Number(e.target.value))}
                >
                    <option value="">Без категории</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Дедлайн:
                <input
                    type="datetime-local"
                    value={date_deadline ? date_deadline.slice(0, 16) : ""}
                    onChange={e => setDateDeadline(e.target.value)}
                />
            </label>
            <div className="task-card-timebar" style={{marginTop: -5, marginBottom: 0}}>
                <div
                    className="task-card-timebar-fill"
                    style={{
                        width: `${timePercent}%`,
                        background: "#808080",
                    }}
                />
            </div>
            <Button
                size="small"
                className={`task-card-action-btn ${started ? "started" : ""}`}
                onClick={started ? handleCompleteClick : handleStartClick}
                style={{marginTop: -5, marginBottom: 0}}
            >
                {started ? "Завершить" : "Начать"}
            </Button>
            {started && (
                continued ? (
                    <Button
                        size="small"
                        className="task-card-action-btn pause"
                        onClick={handlePauseClick}
                        style={{marginTop: -5, marginBottom: 22}}
                    >
                        Остановить
                    </Button>
                ) : (
                    <Button
                        size="small"
                        className="task-card-action-btn resume"
                        onClick={handleResumeClick}
                        style={{marginTop: -5, marginBottom: 22}}
                    >
                        Продолжить
                    </Button>
                )
            )}
            <div className="task-settings-actions-vertical">
                <Button onClick={handleSave} theme="black" size="small">Сохранить</Button>
                <Button onClick={handleDelete} theme="red" size="small">Удалить</Button>
                <Button onClick={onClose} theme="gray" size="small">Отмена</Button>
            </div>
        </div>
    );
};

export default TaskSettings;