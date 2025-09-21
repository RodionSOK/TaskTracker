// InProgress.jsx
import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";

import FilterField from "../../../components/FilterField/FilterField";
import TaskCardActive from "../../../components/TaskComponents/TaskCardActive/TaskCardActive";
import "./active.css";

const InProgress = ({ projectId, onClick, onStart, onDelete, onFavoriteToggle, projectName, tasks }) => {
    const [searchValue, setSearchValue] = useState("");
    const [showOnlyFavorite, setShowOnlyFavorite] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [visibleCount, setVisibleCount] = useState(20);

    const categories = useSelector(state => state.categories);

    const sortedTasks = [...tasks].sort((a, b) => a.id - b.id);
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
    const visibleTasks = filteredTasks.slice(0, visibleCount);

    const categoryList = Array.isArray(categories.categories) ? categories.categories : [];
    const myCategories = categoryList.filter(cat => cat.project === projectName);

    const listRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!listRef.current) return;
            const { scrollTop, scrollHeight, clientHeight } = listRef.current;
            if (scrollTop + clientHeight >= scrollHeight - 100) {
                if (visibleCount < filteredTasks.length) {
                    setVisibleCount(count => count + 20);
                }
            }
        };
        const ref = listRef.current;
        if (ref) {
            ref.addEventListener("scroll", handleScroll);
        }
        return () => {
            if (ref) {
                ref.removeEventListener("scroll", handleScroll);
            }
        };
    }, [visibleCount, filteredTasks.length]);

    useEffect(() => {
        setVisibleCount(20);
    }, [searchValue, showOnlyFavorite, selectedCategoryId]);

    return (
        <div className="inprogress-main">
            <div className="inprogress-list" ref={listRef} style={{ overflowY: "auto", height: "100vh" }}>
                {filteredTasks.length === 0 ? (
                    <div className="inprogress-empty">Нет задач в работе</div>
                ) : (
                    <div className="inprogress-taskcard-list">
                        {visibleTasks.map(task => (
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