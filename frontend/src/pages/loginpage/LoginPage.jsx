import React, { useEffect, useState } from "react";
import { useDispatch , useSelector } from 'react-redux';
import { loginUser, clearError } from "../../store/authslice";
import { useNavigate } from "react-router-dom";

import Button from "../../components/Button/Button";
import Link from "../../components/Link/Link";
import Input from "../../components/Input/Input";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import Icon from "../../components/Icon/Icon";
import "./LoginPage.css";
import LoadSpinner from "../../shared/preload/LoadSpinner/LoadSpinner";

const LoginPage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        return() => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const navigate = useNavigate();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const isLoading = useSelector(state => state.auth.isLoading);
    const error = useSelector(state => state.auth.error);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/start");
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev, 
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({
            email: formData.email,
            password: formData.password,
        }));
    };

    return (
        <div className="loginpage-root">
            <div className="loginpage-container">
                <div className="loginpage-brand">Task Tracker</div>
                <form className="loginpage-form" onSubmit={handleSubmit}>
                    <div className="loginpage-input-wrapper">
                        <Icon type="mail" width="20" height="20" className="loginpage-input-icon" />
                        <Input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            nativePlaceholder="Email"
                            autoComplete="email"
                            theme="white-with-border"
                        />
                    </div>
                    <div className="loginpage-input-wrapper">
                        <Icon type="lock" width="20" height="20" className="loginpage-input-icon" />
                        <PasswordInput
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            nativePlaceholder="Пароль"
                            autoComplete="current-password"
                            showToggle={false}
                            type="password"
                            theme="white-with-border"
                        />
                        {error && (
                            <div className="loginpage-error">
                            {typeof error === "string"
                                ? error
                                : error.detail
                                ? error.detail
                                : JSON.stringify(error)}
                            </div>
                        )}
                    </div>
                    <Button type="submit" size="medium" wide theme="gray" disabled={isLoading}>
                        {isLoading ? <LoadSpinner className="load-spinner"/> : "Войти"}
                    </Button>
                </form>
                <div className="loginpage-links-row">
                    <Link href="/forgot-password" theme="simple" className="loginpage-link-left">
                        Забыли пароль?
                    </Link>
                    <Link href="/register" theme="simple" className="loginpage-link-right">
                        Создать аккаунт
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;