import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Icon from "../Icon/Icon.jsx";

import "./Checkbox.pcss";

const Checkbox = ({
    className,
    id,
    value,
    checked,
    defaultChecked,
    label,
    labelCount,
    tabIndex,
    theme,
    error,
    disabled,
    onChange,
    onClick,
    onBlur,
}) => {
    const componentClassName = classNames("checkbox", className, {
        checkbox_white: theme === "white",
        "checkbox_white-with-border": theme === "white-with-border",
        checkbox_error: error,
    });

    return (
        <div onClick={onClick} className={componentClassName}>
            <input
                className="checkbox__input"
                id={id}
                type="checkbox"
                disabled={disabled}
                tabIndex={tabIndex}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                checked={checked}
                defaultChecked={defaultChecked}
            />
            <label htmlFor={id} className="checkbox__label">
                <Icon className="checkbox__icon" type="mail-check" width="14" height="14" />
                {label}

                {labelCount && <span className="checkbox__label-count">{labelCount}</span>}
            </label>
        </div>
    );
};

Checkbox.propTypes = {
    /** Id */
    id: PropTypes.string,

    /** Дополнительный класс */
    className: PropTypes.string,

    /** Value */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),

    /** Checked */
    checked: PropTypes.bool,

    /** Значение по умолчанию */
    defaultChecked: PropTypes.bool,

    /** Текст */
    label: PropTypes.string,

    /** Дополнительный текст (например, вывод количества результатов с таким фильтром) */
    labelCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /** Тема */
    theme: PropTypes.oneOf(["white", "white-with-border"]),

    /** Tab index */
    tabIndex: PropTypes.string,

    /** Вид с ошибкой */
    error: PropTypes.bool,

    /** Заблокированное состояние */
    disabled: PropTypes.bool,

    /** Обработчик выбора */
    onChange: PropTypes.func,

    /** Обработчик нажатия */
    onClick: PropTypes.func,

    onBlur: PropTypes.func,
};

export default Checkbox;
