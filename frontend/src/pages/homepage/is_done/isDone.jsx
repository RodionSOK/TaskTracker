import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../../../store/taskslice';

import TaskCard from '../../../components/TaskComponents/TaskCard/TaskCard';
import Button from '../../../components/Button/Button';
import LoadSpinner from '../../../shared/preload/LoadSpinner/LoadSpinner';
import "./isDone.css";

const IsDone = ({ projectId, onClick, onStart, onDelete }) => {
    const dispatch = useDispatch();
    const { tasks, isLoading } = useSelector(state => state.tasks);
    const user = useSelector(state => state.auth.user);

    const doneTasks = Array.isArray(tasks) 
        ? tasks.filter(task => task.is_done && task.project === projectId && task.by_who === user.email)
        : [];  

    // const handleResume = async (task) => {
    //     const token = localStorage.getItem('accessToken');
    //     await fetch(`http://192.168.1.65:8000/api/v1/tasks/${task.id}/`, {
    //         method: 'PATCH',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${token}`
    //         },
    //         body: JSON.stringify({ is_done: false })
    //     });
    //     dispatch(fetchTasks());
    // };

    // const handleDelete = async (task) => {
    //     const token = localStorage.getItem('accessToken');
    //     await fetch(`http://192.168.1.65:8000/api/v1/tasks/${task.id}/`, {
    //         method: 'DELETE',
    //         headers: {
    //             'Content-Type': 'application/json', 
    //             'Authorization': `Bearer ${token}`
    //         }
    //     });
    //     dispatch(fetchTasks());
    // };

    if (isLoading) {
        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "60vh",
                width: "100%",
            }}>
                <LoadSpinner />
            </div>
        );
    }

    return (
        <div className="isdone-list">
            {doneTasks.length === 0 ? (
                <div className="isdone-empty">Нет завершённых задач</div>
            ) : (
                <div className="isdone-taskcard-list">
                    {doneTasks.map(task => (
                        <div className="isdone-taskcard-wrapper" key={task.id}>
                            <TaskCard 
                                key={task.id}
                                task={task}
                                onStart={onStart}
                                onClick={() => onClick(task)}
                                onDelete={() => onDelete(task)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default IsDone;