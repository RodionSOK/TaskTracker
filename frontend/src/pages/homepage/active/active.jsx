// InProgress.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import FilterField from "../../../components/FilterField/FilterField";
import TaskCardActive from "../../../components/TaskComponents/TaskCardActive/TaskCardActive";
import "./active.css";

const InProgress = ({ projectId, onClick, onStart, onDelete, onFavoriteToggle, projectName }) => {
    const [searchValue, setSearchValue] = useState("");
    const [showOnlyFavorite, setShowOnlyFavorite] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    const tasks = useSelector(state => state.tasks);
    const categories = useSelector(state => state.categories);

    const taskList = Array.isArray(tasks.tasks) ? tasks.tasks : [];
    const activeTasks = taskList.filter(task => task.is_started === true && task.project === projectId);
    const sortedTasks = [...activeTasks].sort((a, b) => a.id - b.id);
    const filteredTasks = sortedTasks
        .filter(task =>
            task.title.toLowerCase().includes(searchValue.toLowerCase())
        )
        .filter(task =>
            !showOnlyFavorite || task.is_favorite
        )
        .filter(task =>
            !selectedCategoryId || task.category.id === selectedCategoryId
        );

    const categoryList = Array.isArray(categories.categories) ? categories.categories : [];
    const myCategories = categoryList.filter(cat => cat.project === projectName);

    // console.log(filteredTasks);


    return (
        <div className="inprogress-main">
            <div className="inprogress-list">
                {filteredTasks.length === 0 ? (
                    <div className="inprogress-empty">Нет задач в работе</div>
                ) : (
                    <div className="inprogress-taskcard-list">
                        {filteredTasks.map(task => (
                            <div className="inprogress-taskcard-wrapper" key={task.id}>
                                <TaskCardActive
                                    task={task}
                                    onClick={() => onClick(task)}
                                    onStart={onStart}
                                    onDelete={onDelete}
                                    onFavoriteToggle={onFavoriteToggle}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <FilterField
                categories={myCategories} 
                onSearch={setSearchValue} 
                onFavorite={() => {setShowOnlyFavorite(fav => !fav)}}
                onCategorySelect={setSelectedCategoryId} 
                selectedCategoryId={selectedCategoryId}
                searchValue={searchValue}
                showOnlyFavorite={showOnlyFavorite}
            />
        </div>
    );
};

export default InProgress;