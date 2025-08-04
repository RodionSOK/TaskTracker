import React, { use, useEffect, useState } from "react";
import { fetchCategories } from "../../../store/categoryslice";
import { fetchTasks } from "../../../store/taskslice";
import { fetchProjects } from "../../../store/projectslice";
import { logout } from "../../../store/authslice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import CategoryForm from "../../../components/CategoryComponents/CategoryForm/CategoryForm";
import CategorySettings from "../../../components/CategoryComponents/CategorySettings/CategorySettings";

import TaskQuickAdd from "../../../components/TaskComponents/TaskQuickAdd/TaskQuickAdd";
import TaskCard from "../../../components/TaskComponents/TaskCard/TaskCard";
import TaskSettings from "../../../components/TaskComponents/TaskSettings/TaskSettings";
import TaskForm from "../../../components/TaskComponents/TaskForm/TaskForm";

import IsDone from "../is_done/isDone";
import Sidebar from "../../../components/Sidebar/Sidebar";
import Button from "../../../components/Button/Button";
import LoadSpinner from "../../../shared/preload/LoadSpinner/LoadSpinner";
import "./HomePage.css";

const sidebarMenu = [
    {
        label: "Личные данные",
        icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="7" r="4" stroke="#555" strokeWidth="2" />
                <path d="M4 18c0-3 5-3 7-3s7 0 7 3" stroke="#555" strokeWidth="2" fill="none" />
            </svg>
        ),
    },
    {
        label: "Задачи",
        icon: (
            <svg width="20" height="20" fill="none">
                <rect x="3" y="4" width="14" height="12" rx="2" stroke="#555" strokeWidth="2" />
                <path d="M7 8h6M7 12h4" stroke="#555" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        label: "Календарь",
        icon: (
            <svg width="20" height="20" fill="none">
                <rect x="3" y="5" width="14" height="12" rx="2" stroke="#555" strokeWidth="2" />
                <path d="M3 9h14" stroke="#555" strokeWidth="2" />
                <rect x="7" y="11" width="2" height="2" rx="1" fill="#555" />
                <rect x="11" y="11" width="2" height="2" rx="1" fill="#555" />
            </svg>
        ),
    },
    {
        label: "Проекты",
        icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="3" y="7" width="16" height="10" rx="2" stroke="#555" strokeWidth="2" />
                <path d="M3 7l3-4h10l3 4" stroke="#555" strokeWidth="2" fill="none" />
            </svg>
        ),
    },
    {
        label: "О приложении",
        icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="10" stroke="#555" strokeWidth="2" />
                <rect x="10" y="10" width="2" height="6" rx="1" fill="#555" />
                <rect x="10" y="6" width="2" height="2" rx="1" fill="#555" />
            </svg>
        ),
    },
    {
        label: "Выход",
        icon: (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M7 11h8" stroke="#555" strokeWidth="2" />
                <path d="M13 7l4 4-4 4" stroke="#555" strokeWidth="2" fill="none" />
                <rect x="3" y="5" width="6" height="12" rx="2" stroke="#555" strokeWidth="2" />
            </svg>
        ),
    },
];

const columns = [
    "Просроченные",
    "Сегодня",
    "Неделя",
    "Две",
    "Больше двух",
];

function toLocalDatetimeString(date) {
    const pad = n => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getNearestDeadline(column) {
    const now = new Date();

    switch (column) {
        case "Сегодня": {
            const endOfDay = new Date(now);
            endOfDay.setHours(23, 59, 0, 0);
            return toLocalDatetimeString(endOfDay);
        }
        case "Неделя": {
            const week = new Date(now);
            week.setDate(week.getDate() + 7);
            week.setHours(18, 0, 0, 0);
            return toLocalDatetimeString(week);
        }
        case "Две": {
            const twoWeeks = new Date(now);
            twoWeeks.setDate(twoWeeks.getDate() + 14);
            twoWeeks.setHours(18, 0, 0, 0);
            return toLocalDatetimeString(twoWeeks);
        }
        case "Больше двух": {
            const month = new Date(now);
            month.setDate(month.getDate() + 30);
            month.setHours(18, 0, 0, 0);
            return toLocalDatetimeString(month);
        }
        default:
            return "";
    }
}

function getColumnTasks(tasks) {
    const now = new Date();
    // Универсальная инициализация
    const columnObj = Object.fromEntries(columns.map(col => [col, []]));

    tasks.forEach(task => {
        if (!task.date_deadline) {
            columnObj["Больше двух"].push(task);
            return;
        }
        const date = new Date(task.date_deadline);
        const diff = (date - now) / (1000 * 60 * 60 * 24);
        const daysDiff = Math.floor(diff);

        if (date < now) {
            columnObj["Просроченные"].push(task);
        } else if (date.toDateString() === now.toDateString() && date > now) {
            columnObj["Сегодня"].push(task);
        } else if (daysDiff >= 1 && daysDiff <= 7) {
            columnObj["Неделя"].push(task);
        } else if (daysDiff > 7 && daysDiff <= 14) {
            columnObj["Две"].push(task);
        } else if (daysDiff > 14) {
            columnObj["Больше двух"].push(task);
        }
    });
    Object.keys(columnObj).forEach(col => {
        columnObj[col].sort((a, b) => a.id - b.id);
    });

    return columnObj;
}

const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchTasks());
        dispatch(fetchProjects());
    }, [dispatch]);

    const user = useSelector((state) => state.auth.user);
    const projectName = useParams().projectName;
    const projects = useSelector((state) => state.projects.projects?.projects || []);
    const myProject = projects.find(project => project.name === projectName) || {};

    // console.log("Projects:", projects);
    const categories = useSelector((state) => state.categories);
    const filteredCategories = Array.isArray(categories.categories) ? categories.categories.filter(cat => cat.project === projectName) : [];
    const tasks = useSelector((state) => state.tasks.tasks);
    // console.log("Tasks:", );

    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
    const [activeTab, setActiveTab] = useState("Задачи");
    const [activeCategory, setActiveCategory] = useState("Все");
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [showCategorySettings, setShowCategorySettings] = useState(false);
    const [showTaskSettings, setShowTaskSettings] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [draggedTask, setDraggedTask] = useState(null);

    const filteredTasks = tasks
        .filter(task => !task.is_done) 
        .filter(task => {
            if (activeCategory === "Все") return task.project === myProject.id;
            return task.project === myProject.id && task.category && task.category.name === activeCategory;
        });
    const columnTasks = getColumnTasks(filteredTasks);
    // console.log("Cqlumn Tasks:", columnTasks, activeCategory);
    // // console.log(tasks, categories, )
    // const tasksLoading = useSelector(state => state.tasks.isLoading);
    // const categoriesLoading = useSelector(state => state.categories.isLoading);
    // const projectsLoading = useSelector(state => state.projects.isLoading);

    const handleMenuClick = (label) => {
        switch (label) {
            case "Проекты":
                navigate("/start");
                break;
            case "О приложении":
                navigate("/about");
                break;
            case "Личные данные":
                navigate("/settings");
                break;
            case "Выход":
                dispatch(logout());
                navigate("/login");
                break;
            case "Задачи":
                navigate("/tasks");
                break;
            case "Календарь":
                navigate("/calendar");
                break;
            default:
                break;
        }
        setSidebarCollapsed(false);
    };

    const handleSaveCategory = async (id, data) => {
        const token = localStorage.getItem("accessToken");
        await fetch(`http://192.168.1.65:8000/api/v1/categories/${id}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
        }, 
            body: JSON.stringify(data),
        });
        dispatch(fetchCategories());
        dispatch(fetchTasks());
    };

    const handleDeleteCategory = async (id) => { 
        const token = localStorage.getItem("accessToken");
        await fetch(`http://192.168.1.65:8000/api/v1/categories/${id}/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        dispatch(fetchCategories());
    }

    const handleTask = async (task) => {
        const token = localStorage.getItem("accessToken");
        await fetch(`http://192.168.1.65:8000/api/v1/tasks/${task.id}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                is_started: task.is_started,
                date_start: task.date_start,
                is_done: task.is_done,
                is_continued: task.is_continued,
                date_deadline: task.date_deadline,
            }),
        });
        dispatch(fetchTasks());
    }

    const handleEditTaskSave = async (task) => {
        const token = localStorage.getItem("accessToken");
        await fetch(`http://192.168.1.65:8000/api/v1/tasks/${task.id}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                title: task.title,
                description: task.description,
                category_id: task.category.id,
                date_deadline: task.date_deadline,
                is_started: task.is_started,
                is_done: task.is_done,
                is_continued: task.is_continued,
            }),
        });
        dispatch(fetchTasks());
    }

    const handleDeleteTask = async (task) => {
        const token = localStorage.getItem("accessToken");
        await fetch(`http://192.168.1.65:8000/api/v1/tasks/${task.id}/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        dispatch(fetchTasks());
    };

    const handleCreateTask = async (taskData) => {
        const token = localStorage.getItem("accessToken");
        await fetch(`http://192.168.1.65:8000/api/v1/tasks/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                title: taskData.title,
                description: taskData.description,
                category_id: taskData.category?.id || null,
                date_deadline: taskData.date_deadline,
                project: myProject.id,
                by_who: user.email,
                is_done: false,
                is_started: false,
                is_continued: true,
                date_start: null,
            }),
        });
        setShowTaskForm(false);
        dispatch(fetchTasks());
    };

    const handleEditTask = (task) => {
        setSelectedTask(task);
        setShowTaskSettings(true);
    };

    const handleTaskDragStart = (e, task) => {
        setDraggedTask(task);
        // Можно добавить визуальный эффект
        e.dataTransfer.effectAllowed = "move";
    };

    const handleTaskDrop = async (col) => {
    if (!draggedTask) return;
    const newDeadline = getNearestDeadline(col);

    // PATCH запрос для обновления дедлайна
    const token = localStorage.getItem("accessToken");
        await fetch(`http://192.168.1.65:8000/api/v1/tasks/${draggedTask.id}/`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                date_deadline: newDeadline,
            }),
        });
        setDraggedTask(null);
        dispatch(fetchTasks());
    };
    // console.log("Filtered Categories:", tasks);

    return (
        <div className="homepage-root">
            <Sidebar
                user={user}
                menu={sidebarMenu}
                onMenuClick={handleMenuClick}
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
                className={sidebarCollapsed ? "homepage-sidebar collapsed" : "homepage-sidebar"}
            />
       
            <main className={`homepage-main${sidebarCollapsed ? " collapsed" : ""}`}>
                <header className="homepage-header">
                    <h1 className="homepage-title">Мои задачи</h1>
                </header>
                <div className="homepage-tabs">
                    <span
                        className={`homepage-tab${activeTab === "Задачи" ? " active" : ""}`}
                        onClick={() => setActiveTab("Задачи")}
                    >
                        Задачи
                    </span>
                    <span
                        className={`homepage-tab${activeTab === "В работе" ? " active" : ""}`}
                        onClick={() => setActiveTab("В работе")}
                    >
                        В работе
                    </span>
                    <span
                        className={`homepage-tab${activeTab === "Завершённые" ? " active" : ""}`}
                        onClick={() => setActiveTab("Завершённые")}
                    >
                        Завершённые
                    </span>
                </div>
                <div className="homepage-divider"></div>
                {activeTab === "Завершённые" ? (
                    <IsDone 
                        projectId={myProject.id}
                        onClick={handleEditTask}
                        onStart={handleTask}
                        onDelete={handleDeleteTask}
                    />
                ) : (
                    <>
                        <div className="homepage-toolbar">
                            <Button 
                                className="homepage-create-task" 
                                theme="black" 
                                size="medium"
                                onClick={() => setShowTaskForm(true)}
                            >
                                Создать задачу
                            </Button>
                            <div className="homepage-categories-list">
                                <button
                                    className="category-menu-button"
                                    onClick={() => setShowCategorySettings(true)}
                                    aria-label="Открыть меню категорий"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="6" r="1.5" fill="currentColor"/>
                                        <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                                        <circle cx="12" cy="18" r="1.5" fill="currentColor"/>
                                    </svg>
                                </button>
                                <button 
                                    className="homepage-category-add" 
                                    title="Создать категорию"
                                    onClick={() => setShowCategoryForm(true)}
                                >
                                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                                        <circle cx="11" cy="11" r="10" fill="var(--gray_50, #808080)" />
                                        <path d="M11 7v8M7 11h8" stroke="#d9d9d9" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                </button>
                                <span
                                    className={`homepage-category-chip${activeCategory === "Все" ? " active" : ""}`}
                                    onClick={() => setActiveCategory("Все")}
                                >
                                    Все
                                </span>
                                {filteredCategories.map(cat => (
                                    <span
                                        key={cat.id}
                                        className={`homepage-category-chip${activeCategory === cat.name ? " active" : ""}`}
                                        style={{ background: cat.color, color: cat.text_color }}
                                        onClick={() => setActiveCategory(cat.name)}
                                    >
                                        {cat.name}
                                    </span>
                                ))}
                            </div>
                            {showCategoryForm && (
                                <CategoryForm
                                    projectName={projectName}
                                    onClose={() => setShowCategoryForm(false)}
                                />
                            )}
                            {showCategorySettings && (
                                <CategorySettings
                                    categories={filteredCategories}
                                    onSave={handleSaveCategory}
                                    onDeleteCategory={handleDeleteCategory}
                                    onClose={() => setShowCategorySettings(false)}
                                />
                            )}
                        </div>
                        <section className="homepage-tasks-table">
                            <table className="homepage-table">
                                <thead>
                                    <tr>
                                        {columns.map((col) => (
                                            <th key={col}>{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        {columns.map(col => (
                                            <td
                                                key={col}
                                                onDragOver={e => e.preventDefault()}
                                                onDrop={() => handleTaskDrop(col)}
                                                style={{ minWidth: 250, verticalAlign: "top" }}
                                            >
                                                {columnTasks[col].map(task => (
                                                    <TaskCard
                                                        key={task.id}
                                                        task={task}
                                                        onStart={handleTask}
                                                        onClick={() => handleEditTask(task)}
                                                        onDragStart={handleTaskDragStart}
                                                    />
                                                ))}
                                                {col !== "Просроченные" && (
                                                    <TaskQuickAdd
                                                        defaultDeadline={getNearestDeadline(col)}
                                                        onCreate={taskData => {
                                                            handleCreateTask({
                                                                ...taskData,
                                                                // category: ... если нужно
                                                            });
                                                        }}
                                                    />
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </section>
                    </>
                )}
                {showTaskSettings && selectedTask && (
                    <div className="task-settings-backdrop">
                        <TaskSettings
                            task={selectedTask}
                            categories={filteredCategories}
                            onSave={handleEditTaskSave}
                            onDelete={handleDeleteTask}
                            onStart={handleTask}
                            onClose={() => setShowTaskSettings(false)}
                        />
                    </div>
                )}
                {showTaskForm && (
                    <div className="task-settings-backdrop">
                        <TaskForm
                            categories={filteredCategories}
                            onSave={handleCreateTask}
                            onClose={() => setShowTaskForm(false)}
                        />
                    </div>
                )}
            </main>
            {!sidebarCollapsed && (
                <div
                    className="homepage-sidebar-overlay"
                    onClick={() => setSidebarCollapsed(true)}
                />
            )}
        </div>
    );
};

export default HomePage;