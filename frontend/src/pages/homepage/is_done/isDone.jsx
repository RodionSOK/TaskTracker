import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../../../store/taskslice';

import TaskCard from '../../../components/TaskComponents/TaskCard/TaskCard';
import Button from '../../../components/Button/Button';
import LoadSpinner from '../../../shared/preload/LoadSpinner/LoadSpinner';
import "./isDone.css";

const IsDone = ({ projectId, onClick, onStart, onDelete, tasks = [] }) => {
    const dispatch = useDispatch();
    const { isLoading } = useSelector(state => state.tasks);
    const user = useSelector(state => state.auth.user);


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
            {tasks.length === 0 ? (
                <div className="isdone-empty">Нет завершённых задач</div>
            ) : (
                <div className="isdone-taskcard-list">
                    {tasks.map(task => (
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