import React, { useState } from "react";
import Button from "../../Button/Button";
import "./TaskForm.css";

const TaskForm = ({ categories, onSave, onClose }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [date_deadline, setDateDeadline] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            title,
            description,
            category: categories.find(cat => cat.id === Number(category)),
            date_deadline,
        });
        onClose();
    };

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <h2>Создать задачу</h2>
            <label>
                Название:
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
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
                    onChange={e => setCategory(e.target.value)}
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
                    value={date_deadline}
                    onChange={e => setDateDeadline(e.target.value)}
                />
            </label>
            <div className="task-form-actions">
                <Button type="submit" theme="black" size="small" className="task-form-save">
                    Создать задачу
                </Button>
                <Button type="button" theme="gray" size="small" className="task-form-cancel" onClick={onClose}>
                    Отмена
                </Button>
            </div>
        </form>
    );
};

export default TaskForm;