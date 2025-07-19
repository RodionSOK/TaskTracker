import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Icon from "../Icon/Icon.jsx";

import "./PasswordInput.pcss";

const PasswordInput = ({
    id,
    className,
    placeholder,
    nativePlaceholder,
    autoFocus,
    value,
    type,
    theme,
    status,
    error,
    hint,
    disabled,
    required,
    maxLength,
    onChange,
    onKeyPress,
    onKeyUp,
    onKeyDown,
    onBlur,
    onFocus,
    name,
    autoComplete,
    max,
    min,
    currency,
    header,
}) => {
    const [inputType, setInputType] = useState(type);

    const togglePassInput = (e) => {
        if (inputType === "password") {
            setInputType("text");
            // setToggleIcon('💀');
            // setRipple('ripple-active');
            // setPassInputClasses('pass-input-active');
            // setToggleIconClasses('toggle-icon-active');
        } else {
            setInputType("password");
            // setToggleIcon('☠️');
            // setRipple('ripple-passive');
            // setPassInputClasses('pass-input-passive');
            // setToggleIconClasses('toggle-icon-passive');
        }
    };

    return (
        <div className={classNames("input", className)}>
            <div
                className={classNames("input__wrapp", {
                    input__wrapp_success: status === "success",
                    input__wrapp_required: required,
                    input__wrapp_currency: currency,
                })}
            >
                <input
                    className={classNames("input__input", {
                        input__input_header: header === "true",
                        input__input_gray: theme === "gray",
                        "input__input_small-gray": theme === "small-gray",
                        "input__input_white-with-border": theme === "white-with-border",
                        input__input_error: status === "error",
                        "input__input_not-empty": value,
                    })}
                    id={id || null}
                    autoFocus={autoFocus}
                    type={inputType}
                    value={value}
                    placeholder={nativePlaceholder}
                    disabled={disabled}
                    required={required}
                    maxLength={maxLength}
                    max={max}
                    min={min}
                    onChange={onChange}
                    onBlur={onBlur}
                    onKeyPress={onKeyPress}
                    onKeyUp={onKeyUp}
                    onKeyDown={onKeyDown}
                    onFocus={onFocus}
                    name={name}
                    autoComplete={autoComplete}
                />

                {placeholder && (
                    <span
                        className={classNames("input__placeholder", { input__placeholder_header: header === "true" })}
                    >
                        {placeholder}
                    </span>
                )}
                {hint && status !== "success" && (
                    <div className="input__hint" dangerouslySetInnerHTML={{ __html: hint }} />
                )}
                {currency && <div className="input__currency">{currency}</div>}

                {status === "success" && (
                    <Icon className="input__icon input__icon_success" type="mail-check" width="14" height="14" />
                )}
                <span
                    className="input__icon_success"
                    onClick={togglePassInput}
                    // className={`toggle ${toggleIconClasses}`}
                >
                    <Icon type={"eye"} width="24" height="24" />
                </span>
            </div>
            {error && <div className="input__error error" dangerouslySetInnerHTML={{ __html: error }} />}
        </div>
    );
};

PasswordInput.defaultProps = {
    value: "",
    autoComplete: "on",
};

PasswordInput.propTypes = {
    /** Id */
    id: PropTypes.string,

    /** Дополнительный класс */
    className: PropTypes.string,

    /** Тип */
    type: PropTypes.string,

    /** Value */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** Статус */
    status: PropTypes.oneOf(["", "default", "error", "success"]),

    /** Текст ошибки */
    error: PropTypes.string,

    /** Текст подсказки */
    hint: PropTypes.string,

    /** Кастомный placeholder  */
    placeholder: PropTypes.string,

    /** Нативный placeholder  */
    nativePlaceholder: PropTypes.string,

    /** Тема */
    theme: PropTypes.oneOf(["gray", "small-gray", "white-with-border", "white"]),

    /** Заблокированное состояние */
    disabled: PropTypes.bool,

    /** Обязательное поле */
    required: PropTypes.bool,

    /** Автоматический фокус */
    autoFocus: PropTypes.bool,

    /** maxLength */
    maxLength: PropTypes.number,

    /** max (number) */
    max: PropTypes.number,

    /** min (number) */
    min: PropTypes.number,

    /** Управление autoComplete */
    autoComplete: PropTypes.string,

    /** Значек валюты */
    currency: PropTypes.string,

    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onKeyPress: PropTypes.func,
    onKeyUp: PropTypes.func,
    onKeyDown: PropTypes.func,
    onFocus: PropTypes.func,
};

export default PasswordInput;
