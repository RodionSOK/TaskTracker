import React, { useState } from "react";
import Button from "../../Button/Button";
import Input from "../../Input/Input";
import DeadlineField from "../../DeadlineField/DeadlineField";
import "./TaskQuickAdd.css";

const TaskQuickAdd = ({ onCreate, defaultDeadline }) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [date_deadline, setDateDeadline] = useState(defaultDeadline || "");

    const handleCreate = () => {
        if (!title.trim() || !date_deadline) return;
        onCreate && onCreate({ title: title.trim(), date_deadline, description: "" });
        setTitle("");
        setDateDeadline(defaultDeadline || "");
        setOpen(false);
    };

    const handleCancel = () => {
        setTitle("");
        setDateDeadline(defaultDeadline || "");
        setOpen(false);
    };

    return (
        <div className={`task-quick-add${open ? " open" : ""}`}>
            {!open ? (
                <Button
                    className="task-quick-add-btn"
                    onClick={() => setOpen(true)}
                    type="button"
                >
                    + Создать быстро
                </Button>
            ) : (
                <>
                    <div className="task-quick-add-input">
                        <Input
                            type="text"
                            nativePlaceholder="Название задачи"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>
                    <DeadlineField
                        date_deadline={date_deadline}
                        onChange={setDateDeadline}
                    />
                    <div className="task-quick-add-actions">
                        <Button
                            size="small"
                            className="task-card-action-btn create-btn"
                            onClick={handleCreate}
                            disabled={!title.trim() || !date_deadline}
                            
                        >
                            Создать
                        </Button>
                        <Button
                            size="small"
                            className="task-card-action-btn cancel-btn"
                            onClick={handleCancel}
                        >
                            Отмена
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default TaskQuickAdd;