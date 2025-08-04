import React from "react";
import DeadlineField from "../../DeadlineField/DeadlineField";
import Button from "../../Button/Button";
import "./TaskCard.css";

// const formatDeadline = (dateStr) => {
//     if (!dateStr) return "Без срока";
//     const date = new Date(dateStr);
//     if (isNaN(date)) return "Без срока";
//     return date.toLocaleDateString("ru-RU", {
//         day: "2-digit",
//         month: "short"
//     }) + " " + date.toLocaleTimeString("ru-RU", {
//         hour: "2-digit",
//         minute: "2-digit"
//     });
// };

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

const TaskCard = ({ task, onClick, onStart, onDragStart, onDelete }) => {
    if (!task) return null;

    const started = task.is_started;
    const continued = task.is_continued;

    const titleColor =
        task.category && task.category.text_color
            ? task.category.text_color
            : "var(--black)";

    const taskStatus = task.is_done ? "Выполнено" : "Не выполнено";
    const timePercent = getTimePercent(task.date_deadline, task.date_start, task.is_continued);

    const handleStartClick = () => {
        const now = new Date().toISOString();
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
                is_continued: false,
            });
        }
    };

    const handlePauseClick = () => {
        if (onStart) {
            onStart({
                ...task,
                is_continued: false,
            });
        }
    };

    const handleResumeClick = () => {
        if (onStart) {
            onStart({
                ...task,
                is_continued: true,
            });
        }
    };

    const handleResumeDoneClick = () => {
        const now = new Date();
        const prevStart = new Date(task.date_start);
        const prevDeadline = new Date(task.date_deadline);

        const duration = prevDeadline - prevStart;
        const newDeadline = new Date(now.getTime() + duration);

        if (onStart) {
            onStart({
                ...task,
                date_start: now.toISOString(),
                date_deadline: newDeadline.toISOString(),
                is_started: true,
                is_done: false,
                is_continued: true,
            });
        }
    };

    return (
        <div 
            className={`task-card ${!continued ? "paused" : ""}`} 
            draggable 
            onDragStart={e => onDragStart && onDragStart(e, task)}
        >
            <div className="task-card-header">
                <div className="task-card-header-left">
                    {task.category && (
                        <div
                            className="task-card-category-circle"
                            style={{
                                background: task.category.color,
                            }}
                            title={typeof task.category === "object" ? task.category.name : task.category}
                        />
                    )}
                    <span className="task-card-title" style={{color: titleColor}}>{task.title}</span>
                </div>
                <button
                    className="task-menu-button"
                    onClick={e => {
                        e.stopPropagation(); // <-- добавьте это!
                        if (onClick) onClick();
                    }}
                    aria-label="Открыть меню проекта"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="6" r="1.5" fill="currentColor"/>
                        <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                        <circle cx="12" cy="18" r="1.5" fill="currentColor"/>
                    </svg>
                </button>
            </div>
            
            <div className="task-card-description">
                {task.description}
            </div>
            <div className="task-card-info">
                <span>Статус: {taskStatus}</span>
                <DeadlineField
                    date_deadline={task.date_deadline}
                    onChange={newDeadline => {
                        // console.log("Updating deadline to:", newDeadline);
                        if (onStart && newDeadline !== task.date_deadline) {
                            onStart({
                                ...task,
                                date_deadline: newDeadline,
                            });
                        }
                    }}
                />
                <div className="task-card-timebar">
                    <div
                        className="task-card-timebar-fill"
                        style={{
                            width: `${timePercent}%`,
                            background: "#808080",
                        }}
                    />
                </div>
                {task.is_done ? (
                    <div className="task-card-actions">
                        <Button
                            size="small"
                            className="task-card-action-btn"
                            // theme="black"
                            onClick={e => {
                                e.stopPropagation();
                                handleResumeDoneClick();
                            }}
                        >
                            Возобновить
                        </Button>
                        <Button
                            size="small"
                            className="task-card-action-btn started"
                            // theme="gray"
                            onClick={e => {
                                e.stopPropagation();
                                onDelete && onDelete(task);
                            }}
                        >
                            Удалить
                        </Button>
                    </div>
                ) : (
                    <>
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
                    </>
                )}
            </div>
        </div>
    );
};

export default TaskCard;