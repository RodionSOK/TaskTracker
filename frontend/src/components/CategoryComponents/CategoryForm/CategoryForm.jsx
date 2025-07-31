import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createCategory } from "../../../store/categoryslice";

import Input from "../../Input/Input";
import Button from "../../Button/Button";
import "./CategoryForm.css";

const CategoryForm = ({ projectName, onClose }) => {
    const dispatch = useDispatch();
    const [name, setName] = useState("");
    const [color, setColor] = useState("#cccccc");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Название категории обязательно");
            return;
        }
        dispatch(createCategory({ name, color, project: projectName }));
        setName("");
        setColor("#cccccc");
        setError("");
        onClose && onClose();
    };

    return (
        <div className="create-category-modal">
            <form className="create-category-form" onSubmit={handleSubmit}>
                <h2>Создать категорию</h2>
                    <label>
                        Название категории
                        <div className="category-row">
                            <div className="category-name-input-wrapper">
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                    nativePlaceholder="Введите название"
                                    name="categoryName"
                                    theme="white-with-border"
                                    wide={true}
                                />
                            </div>
                            <input
                                type="color"
                                value={color}
                                onChange={e => setColor(e.target.value)}
                                className="category-color-inline"
                            />
                        </div>
                    </label>
                {error && <div className="form-error">{error}</div>}
                <div className="form-actions">
                    <Button type="submit" theme="black" size="medium">Создать</Button>
                    <Button type="button" theme="gray" size="medium" onClick={onClose}>Отмена</Button>
                </div>
            </form>
        </div>
    );
};  

export default CategoryForm;