import React, { useRef, useState, useEffect } from "react";
import Input from "../../Input/Input";
import Button from "../../Button/Button";
import './CategorySettings.css';

const CategorySettings = ({
    categories,
    onSave,
    onDeleteCategory,
    onClose,
}) => {
    const [editedCategories, setEditedCategories] = useState(
        categories.map((cat) => ({
            ...cat,
            isEditing: false,
            newName: cat.name,
            newColor: cat.color,
        }))
    );

    const editingId = editedCategories.find(cat => cat.isEditing)?.id;
    const inputRefs = useRef({});
    const colorRefs = useRef({});  

    useEffect(() => {
        if (!editingId) return;

        const handleClickOutside = (event) => {
            const input = inputRefs.current[editingId];
            const colorInput = colorRefs.current[editingId];

            // Если оба рефа существуют
            if (input && colorInput) {
                if (
                    !input.contains(event.target) &&
                    !colorInput.contains(event.target)
                ) {
                    setEditedCategories(editedCategories.map(cat =>
                        cat.id === editingId
                            ? { ...cat, isEditing: false }
                            : cat
                    ));
                }
            }
            // Если существует только один реф
            else if (input) {
                if (!input.contains(event.target)) {
                    setEditedCategories(editedCategories.map(cat =>
                        cat.id === editingId
                            ? { ...cat, isEditing: false }
                            : cat
                    ));
                }
            }
            else if (colorInput) {
                if (!colorInput.contains(event.target)) {
                    setEditedCategories(editedCategories.map(cat =>
                        cat.id === editingId
                            ? { ...cat, isEditing: false }
                            : cat
                    ));
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [editingId, editedCategories]);

    const handleEdit = (id) => {
        setEditedCategories(editedCategories.map(cat =>
            cat.id === id ? { ...cat, isEditing: true } : cat
        ));
        setTimeout(() => {
            if (inputRefs.current[id]) {
                inputRefs.current[id].select();
            }
        }, 0);
    };

    const handleNameChange = (id, value) => {
        setEditedCategories(editedCategories.map(cat =>
            cat.id === id ? { ...cat, newName: value } : cat
        ));
    };

    const handleColorChange = (id, value) => {
        setEditedCategories(editedCategories.map(cat =>
            cat.id === id ? { ...cat, newColor: value } : cat
        ));
    };

    const handleSave = () => {
        editedCategories.forEach(cat => {
            if (cat.newName !== cat.name || cat.newColor !== cat.color) {
                onSave(cat.id, { name: cat.newName, color: cat.newColor });
            }
        });
        onClose();
    };

    const handleDelete = (id) => {
        onDeleteCategory(id);
        setEditedCategories(editedCategories.filter(cat => cat.id !== id));
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <div className="category-settings-backdrop">
            <div className="category-settings-modal">
                <h2>Настройки категорий</h2>
                <div className="category-settings-list">
                    {editedCategories.map((cat, index) => (
                        <React.Fragment key={cat.id}>
                            <div className="category-settings-item">
                                {cat.isEditing ? (
                                    <>
                                        <Input
                                            type="text"
                                            value={cat.newName}
                                            onChange={e => handleNameChange(cat.id, e.target.value)}
                                            nativePlaceholder="Название категории"
                                            theme="white-with-border"
                                            wide={true}
                                            ref={el => inputRefs.current[cat.id] = el}
                                        />
                                        <input
                                            type="color"
                                            value={cat.newColor}
                                            onChange={e => handleColorChange(cat.id, e.target.value)}
                                            className="category-color-inline-modal"
                                            style={{ background: cat.newColor }}
                                            ref={el => colorRefs.current[cat.id] = el}
                                        />
                                        {/* <button
                                            className="category-settings-cancel"
                                            onClick={() => setEditedCategories(editedCategories.map(c =>
                                                c.id === cat.id ? { ...c, isEditing: false, newName: cat.name, newColor: cat.color } : c
                                            ))}
                                            title="Отменить"
                                            type="button"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                <line x1="5" y1="5" x2="13" y2="13" stroke="#888" strokeWidth="2"/>
                                                <line x1="13" y1="5" x2="5" y2="13" stroke="#888" strokeWidth="2"/>
                                            </svg>
                                        </button> */}
                                    </>
                                ) : (
                                    <>
                                        <span
                                            className="category-settings-name"
                                            onClick={() => handleEdit(cat.id)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {cat.newName}
                                        </span>
                                        <div
                                            className="category-color-preview"
                                            style={{ background: cat.newColor }}
                                            title="Изменить цвет"
                                            onClick={() => handleEdit(cat.id)}
                                        />
                                        <button
                                            className="category-settings-delete"
                                            onClick={() => handleDelete(cat.id)}
                                            title="Удалить категорию"
                                            type="button"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                <line x1="5" y1="5" x2="13" y2="13" stroke="#d32f2f" strokeWidth="2"/>
                                                <line x1="13" y1="5" x2="5" y2="13" stroke="#d32f2f" strokeWidth="2"/>
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>
                            <div className="category-settings-divider"></div>
                        </React.Fragment>
                    ))}
                </div>
                <div className="category-settings-actions">
                    <Button theme="black" onClick={handleSave}>Сохранить</Button>
                    <Button theme="gray" onClick={handleCancel}>Отмена</Button>
                </div>
            </div>
        </div>
    );
};

export default CategorySettings;