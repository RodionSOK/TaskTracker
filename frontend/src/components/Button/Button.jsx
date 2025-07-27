import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Link } from "react-router-dom";
import "./Button.pcss";

const Button = ({
    className,
    children,
    size,
    theme,
    disabled,
    inactive,
    type = "button", // Добавлено значение по умолчанию
    wide,
    href,
    onClick,
    style,
    loading = false,
}) => {
    const componentClassName = classNames("button", className, {
        button_medium: size === "medium",
        button_small: size === "small",
        button_gray: theme === "gray",
        button_black: theme === "black",
        button_red: theme === "red",
        button_wide: wide,
        button_inactive: inactive,
    });

    if (href) {
        return (
            <Link className={componentClassName} to={href}>
                {children}
            </Link>
        );
    }

    const handleClick = (e) => {
        // Для кнопок типа "submit" НЕ вызываем preventDefault()
        if (type !== "submit") {
            e.preventDefault();
        }
        
        if (typeof onClick === "function" && !loading && !disabled) {
            onClick(e);
        }
    };

    return (
        <button
            className={classNames(componentClassName, { "button-loading": loading })}
            disabled={disabled || loading}
            type={type}
            style={style}
            onClick={handleClick} // Исправленный обработчик
        >
            {loading && <div className="loading"></div>}
            <div className={loading ? "children-container" : undefined}>
                {children}
            </div>
        </button>
    );
};

Button.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    size: PropTypes.oneOf(["medium", "small"]),
    theme: PropTypes.oneOf(["gray", "black", "red"]),
    disabled: PropTypes.bool,
    inactive: PropTypes.bool,
    type: PropTypes.oneOf(["button", "submit", "reset"]), // Обновленные типы
    wide: PropTypes.bool,
    href: PropTypes.string,
    onClick: PropTypes.func,
    style: PropTypes.object,
    loading: PropTypes.bool,
};

export default Button;