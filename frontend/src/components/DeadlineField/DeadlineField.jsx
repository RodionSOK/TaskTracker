import React, { useState, useEffect, useRef } from "react";

import Input from "../Input/Input";
import Button from "../Button/Button";
import "./DeadlineField.css";

const parseDeadline = (dateStr) => {
    if (!dateStr) return {};
    const date = new Date(dateStr);
    if (isNaN(date)) return {};
    return {
        day: date.getDate().toString().padStart(2, "0"),
        month: (date.getMonth() + 1).toString().padStart(2, "0"),
        year: date.getFullYear().toString(),
        hour: date.getHours().toString().padStart(2, "0"),
        minute: date.getMinutes().toString().padStart(2, "0"),
    };
};

const buildDateString = ({ day, month, year, hour, minute }) => {
    // Собираем строку формата YYYY-MM-DDTHH:mm
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
};

const DeadlineField = ({ date_deadline, onChange }) => {
    const [editingCell, setEditingCell] = useState(null); // day, month, year, hour, minute
    const [parts, setParts] = useState(parseDeadline(date_deadline));
    const rowRef = useRef(null);
    const ignoreNextOutsideClick = useRef(false);

    useEffect(() => {
        if (!editingCell) return;

        const handlePointerDown = (e) => {
            if (rowRef.current && !rowRef.current.contains(e.target)) {
                setParts(parseDeadline(date_deadline));
                setEditingCell(null);
            }
        };

        document.addEventListener("pointerdown", handlePointerDown, true);
        return () => document.removeEventListener("pointerdown", handlePointerDown, true);
    }, [editingCell, date_deadline]);

    const handleCellClick = (cell) => {
        setEditingCell(cell);
    };

    const handleInputChange = (e) => {
        setParts({ ...parts, [editingCell]: e.target.value });
    };

    const handleSave = (e) => {
        e.stopPropagation();
        // console.log("Saving deadline:");
        setEditingCell(null);
        if (onChange) {
            onChange(buildDateString(parts));
        }
    };

    // const handleCancel = (e) => {
    //     e.stopPropagation();
    //     setParts(parseDeadline(date_deadline));
    //     setEditingCell(null);
    // };

    return (
        <div
            className="deadlinefield-row"
            ref={rowRef}
            onClick={e => e.stopPropagation()}
            onMouseDown={() => { ignoreNextOutsideClick.current = true; }}
        >
            <div className={`deadlinefield-value${date_deadline ? "" : " empty"}`}>
                <div className="deadlinefield-cells">
                    {["day", "month", "year", "hour", "minute"].map((cell, idx) => (
                        <React.Fragment key={cell}>
                            <div
                                className="deadlinefield-cell"
                                onClick={e => {
                                    e.stopPropagation();
                                    handleCellClick(cell);
                                }}
                                style={{ cursor: "pointer" }}
                            >
                                {editingCell === cell ? (
                                    <Input
                                        type={"text"}
                                        value={parts[cell]}
                                        onChange={handleInputChange}
                                        onClick={e => e.stopPropagation()}
                                    />
                                ) : (
                                    parts[cell]
                                )}
                            </div>
                            {/* Разделители */}
                            {cell === "day" || cell === "month" ? (
                                <span className="deadlinefield-sep">.</span>
                            ) : cell === "year" ? (
                                <span className="deadlinefield-sep space"></span>
                            ) : cell === "hour" ? (
                                <span className="deadlinefield-sep">:</span>
                            ) : null}
                        </React.Fragment>
                    ))}
                </div>
            </div>
            {editingCell && (
                <div className="deadlinefield-actions" onMouseDown={() => { ignoreNextOutsideClick.current = true; }}>
                    <Button
                        size="small"
                        className="deadlinefield-save"
                        onClick={handleSave}
                    >
                        Сохранить
                    </Button>
                </div>
            )}
        </div>
    );
};

export default DeadlineField;