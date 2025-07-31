import React from "react";
import "./TaskCard.css";

const TaskCard = ({ task, onClick }) => {
    if (!task) return null;

    return (
        <div className="task-card">
            <div className="task-card-header">
                <span className="task-card-title">{task.title}</span>
                {task.category && (
                    <span
                        className="task-card-category"
                        style={{
                            background: task.category.color,
                            color: task.category.text_color || "#fff"
                        }}
                    >
                        {typeof task.category === "object" ? task.category.name : task.category}
                    </span>
                )}
            </div>
            <div className="task-card-info">
                <span>Статус: {task.status}</span>
                <span>Срок: {task.due_date}</span>
            </div>
            <div className="task-card-description">
                {task.description}
            </div>
        </div>
    );
};

export default TaskCard;