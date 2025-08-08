import React, { useState, useRef, useEffect } from "react";
import DeadlineField from "../../DeadlineField/DeadlineField";
import "./TaskCardActive.css";

const TaskCardActive = ({
    task,
    onClick,
    onDelete,
    onStart,
    onFavoriteToggle,
}) => {
    const [expanded, setExpanded] = useState(false);
    const cardRef = useRef(null);
    const lastPercentRef = useRef(0);

    const getTimePercent = (date_deadline, date_start, is_continued) => {
        if (!date_deadline || !date_start) return 0;
        const now = new Date();
        const start = new Date(date_start);
        const end = new Date(date_deadline);
        if (isNaN(start) || isNaN(end)) return 0;
        if (now >= end) return 100;
        if (now <= start) return 0;
        const total = end - start;
        const passed = now - start;
        const percent = Math.max(0, Math.min(100, Math.round((passed / total) * 100)));

        if (is_continued === false) {
            // Если процент ещё не сохранён, возвращаем вычисленный
            if (!lastPercentRef.current) {
                lastPercentRef.current = percent;
            }
            return lastPercentRef.current;
        }
        lastPercentRef.current = percent;
        return percent;
    };

    useEffect(() => {
        if (task && task.date_deadline && task.date_start && task.is_continued === false) {
            const now = new Date();
            const start = new Date(task.date_start);
            const end = new Date(task.date_deadline);
            if (!isNaN(start) && !isNaN(end) && now > start && now < end) {
                const total = end - start;
                const passed = now - start;
                lastPercentRef.current = Math.max(0, Math.min(100, Math.round((passed / total) * 100)));
            }
        }
    }, [task]);

    useEffect(() => {
        if (!expanded) return;
        const handleClickOutside = (event) => {
            if (cardRef.current && !cardRef.current.contains(event.target)) {
                setExpanded(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [expanded]);

    if (!task) return null;

    const timePercent = getTimePercent(task.date_deadline, task.date_start, task.is_continued);

    return (
        <div
            ref={cardRef}
            className={`task-card-active${expanded ? " expanded" : ""}`}
            onClick={() => setExpanded(exp => !exp)}
            tabIndex={0}
            status={task.is_continued ? "true" : "false"}
        >
            <div className="task-card-active-header">
                <div className="task-card-active-category" style={{ background: task.category?.color }} />
                <span className="task-card-active-title" style={{ color: task.category?.text_color }}>{task.title}</span>
                <button
                    className="task-card-active-fav"
                    onClick={e => {
                        e.stopPropagation();
                        onFavoriteToggle && onFavoriteToggle(task);
                    }}
                    title="В избранное"
                >
                    <svg width="22" height="22" viewBox="0 0 20 20" fill={task.is_favorite ? "#FFD700" : "none"} stroke="#FFD700" strokeWidth="2">
                        <path d="M10 15l-5.09 2.67 1-5.82L2 7.97l5.91-.86L10 2.5l2.09 4.61 5.91.86-4.27 4.88 1 5.82z" />
                    </svg>
                </button>
                <button
                    className="task-card-active-menu"
                    onClick={e => {
                        e.stopPropagation();
                        onClick && onClick(task);
                    }}
                    aria-label="Меню задачи"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="6" r="1.5" fill="currentColor"/>
                        <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                        <circle cx="12" cy="18" r="1.5" fill="currentColor"/>
                    </svg>
                </button>
                <button
                    className="task-card-active-delete"
                    onClick={e => {
                        e.stopPropagation();
                        onDelete && onDelete(task);
                    }}
                    aria-label="Удалить задачу"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#e74c3c">
                        <line x1="5" y1="5" x2="15" y2="15" strokeWidth="2"/>
                        <line x1="15" y1="5" x2="5" y2="15" strokeWidth="2"/>
                    </svg>
                </button>
            </div>
            {!expanded && (
                <div className="task-card-active-row">
                    <div className="task-card-active-deadline" status={expanded ? "true" : "false"}>
                        {/* {console.log(task)} */}
                        <DeadlineField
                            date_deadline={task.date_deadline}
                            onChange={date => onStart({ ...task, date_deadline: date })}
                        />
                    </div>
                    <div
                        className="task-card-active-rect-timebar"
                        data-label={`${timePercent}%`}
                        data-filled={timePercent > 50 ? "true" : "false"}
                    >
                        <div
                            className="task-card-active-rect-timebar-fill"
                            style={{
                                width: `${timePercent}%`
                            }}
                        />
                    </div>
                </div>
            )}
            {expanded && (
                <div className="task-card-active-details-grid">
                    <div className="task-card-active-details-left">
                        <div className="task-card-active-description">{task.description}</div>
                        <span className="task-card-active-status">
                            Статус: {task.is_done ? "Выполнено" : "Не выполнено"}
                        </span>
                        <div className="task-card-active-deadline" status={expanded ? "true" : "false"}>
                            <DeadlineField
                                date_deadline={task.date_deadline}
                                onChange={date => onStart({ ...task, date_deadline: date })}
                            />
                        </div>
                    </div>
                    <div className="task-card-active-details-right">
                        <div className="task-card-active-circle-timebar" style={{ position: "relative" }}>
                            <svg width="160" height="160">
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="#eee"
                                    strokeWidth="12"
                                    fill="none"
                                />
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="#808080"
                                    strokeWidth="20"
                                    fill="none"
                                    strokeDasharray={2 * Math.PI * 70}
                                    strokeDashoffset={2 * Math.PI * 70 * (1 - timePercent / 100)}
                                    transform="rotate(-90 80 80)"
                                />
                                {/* <text
                                    x="80"
                                    y="90"
                                    textAnchor="middle"
                                    fontSize="1.6em"
                                    fill="#555"
                                    fontWeight="bold"
                                >
                                    {timePercent}%
                                </text> */}
                            </svg>
                            <button
                                className="task-card-active-timebar-btn"
                                style={{
                                    position: "absolute",
                                    left: "50%",
                                    top: "50%",
                                    transform: "translate(-50%, -50%)",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: 0,
                                    width: "48px",
                                    height: "48px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                                onClick={e => {
                                    e.stopPropagation();
                                    // Здесь вызывай функцию паузы/старта задачи
                                    if (task.is_continued) {
                                        // Поставить на паузу
                                        onStart && onStart({...task, is_continued: false});
                                    } else {
                                        // Возобновить
                                        onStart && onStart({...task, is_continued: true});
                                    }
                                }}
                                aria-label={task.is_continued ? "Пауза" : "Старт"}
                            >
                                {task.is_continued ? (
                                    // Иконка паузы
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                        <rect x="8" y="8" width="5" height="16" rx="2" fill="#808080"/>
                                        <rect x="19" y="8" width="5" height="16" rx="2" fill="#808080"/>
                                    </svg>
                                ) : (
                                    // Иконка старта (треугольник)
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                        <polygon points="10,8 24,16 10,24" fill="#808080"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskCardActive;