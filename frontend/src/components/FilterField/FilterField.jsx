import React from "react";

import Input from "../Input/Input";

import './FilterField.css';

const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="8" cy="8" r="7" stroke="#808080" strokeWidth="2"/>
        <line x1="13" y1="13" x2="17" y2="17" stroke="#808080" strokeWidth="2"/>
    </svg>
);

const StarIcon = ({ active }) => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill={!active ? "#FFD700" : "#808080"} stroke={!active ? "#FFD700" : "#808080"} strokeWidth="2">
        <path d="M10 15l-5.09 2.67 1-5.82L2 7.97l5.91-.86L10 2.5l2.09 4.61 5.91.86-4.27 4.88 1 5.82z" />
    </svg>
);

const CategoryCircle = ({ color, selected }) => (
    <svg width="18" height="18" viewBox="0 0 18 18">
        <circle cx="9" cy="9" r="8" fill={!selected ? color : "#808080"} />
    </svg>
);

const FilterField = ({
    categories = [],
    onSearch,
    onFavorite,
    onCategorySelect,
    selectedCategoryId,
    searchValue,
    showOnlyFavorite,
}) => {
    // conso
    // );

    return (
        <div className="filter-field">
            {/* Поиск */}
            <div className="filter-field-search-row">
                <span className="filter-field-search-icon">
                    <SearchIcon />
                </span>
                <Input
                    type="text"
                    className="filter-field-search"
                    nativePlaceholder="Поиск задач..."
                    value={searchValue}
                    onChange={e => onSearch(e.target.value)}
                    theme="white-with-border"
                    wide={true}
                />
            </div> 

            {/* Избранное */}
            <button
                className={`filter-field-favorite${showOnlyFavorite ? " active" : ""}`}
                onClick={onFavorite}
                title="Показать только избранные"
            >
                <StarIcon active={showOnlyFavorite} />
                <span>Избранное</span>
            </button>

            {/* Категории */}
            <div className="filter-field-categories">
                <button
                    className={`filter-field-category${!selectedCategoryId ? " selected" : ""}`}
                    onClick={() => onCategorySelect(null)}
                >
                    <CategoryCircle color="#e0e0e0" selected={!selectedCategoryId} />
                    <span>Все</span>
                </button>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        className={`filter-field-category${selectedCategoryId === cat.id ? " selected" : ""}`}
                        onClick={() => onCategorySelect(cat.id)}
                    >
                        <CategoryCircle color={cat.color} selected={selectedCategoryId === cat.id} />
                        <span>{cat.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FilterField;