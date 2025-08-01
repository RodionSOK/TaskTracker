import React,  { useState } from "react";

import Button from "../../Button/Button";
import "./TaskCard.css";

const formatDeadline = (dateStr) => {
    if (!dateStr) return "Без срока";
    const date = new Date(dateStr);
    if (isNaN(date)) return "Без срока";
    return date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    }) + " " + date.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit"
    });
};

const getTimePercent = (date_deadline, date_start, is_continued) => {
    if (!date_deadline || !date_start) return 0;
    if (is_continued === false) {
        return getTimePercent._lastPercent || 0;
    }
    const now = new Date();
    const start = new Date(date_start);
    const end = new Date(date_deadline);
    if (isNaN(start) || isNaN(end)) return 0;
    if (now >= end) return 100;
    if (now <= start) return 0;
    const total = end - start;
    const passed = now - start;
    const percent = Math.max(0, Math.min(100, Math.round((passed / total) * 100)));
    getTimePercent._lastPercent = percent;
    return percent;
};

const TaskCard = ({ task, onClick, onStart }) => {
    if (!task) return null;

    const started = task.is_started;
    const continued = task.is_continued;

    const titleColor =
        task.category && task.category.text_color
            ? task.category.text_color
            : "var(--black)";

    const taskStatus = task.is_done ? "Выполнено" : "Не выполнено";
    const taskDeadline = formatDeadline(task.date_deadline);
    const timePercent = getTimePercent(task.date_deadline, task.date_start, task.is_continued);

    const handleStartClick = () => {
        const now = new Date().toISOString();
        // setStarted(true);
        // setContinued(true);
        if (onStart) {
            onStart({
                ...task, 
                date_start: now,
                is_started: true,
                is_continued: true,
            });
        }
    };

    const handleCompleteClick = () => { 
        if (onStart) {
            onStart({
                ...task,
                is_done: true,
            });
        }
        // setStarted(false);
    }

    const handlePauseClick = () => {
        // setContinued(false);
        if (onStart) {
            onStart({
                ...task,
                is_continued: false,
            });
        }
    }

    const handleResumeClick = () => {
        // setContinued(true);
        if (onStart) {
            onStart({
                ...task,
                is_continued: true,
            });
        }
    };

    return (
        <div className={`task-card ${!continued ? "paused" : ""}`} onClick={onClick}>
            {task.category && (
                <div
                    className="task-card-category-circle"
                    style={{
                        background: task.category.color,
                        // color: task.category.text_color || "#fff",
                        // borderColor: "var(--gray_85)"
                    }}
                    title={typeof task.category === "object" ? task.category.name : task.category}
                />
            )}
            <div className="task-card-header">
                <span className="task-card-title" style={{color: titleColor}}>{task.title}</span>
            </div>
             <div className="task-card-description">
                {task.description}
            </div>
            <div className="task-card-info">
                <span>Статус: {taskStatus}</span>
                <span>Срок: {taskDeadline}</span>
                <div className="task-card-timebar">
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
                    onClick={e => {
                        e.stopPropagation();
                        started ? handleCompleteClick() : handleStartClick();
                    }}
                >
                    {started ? "Завершить" : "Начать"}
                </Button>
                {started && (
                    continued ? (
                        <Button
                            size="small"
                            className="task-card-action-btn pause"
                            onClick={e => {
                                e.stopPropagation();
                                handlePauseClick();
                            }}
                        >
                            Остановить
                        </Button>
                    ) : (
                        <Button
                            size="small"
                            className="task-card-action-btn resume"
                            onClick={e => {
                                e.stopPropagation();
                                handleResumeClick();
                            }}
                        >
                            Продолжить
                        </Button>
                    )
                )}
            </div>
        </div>
    );
};

export default TaskCard;