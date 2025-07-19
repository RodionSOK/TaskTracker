import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError, setAuthentificated } from "../store/authslice";

import Button from "../components/Button/Button";
import Checkbox from "../components/Checkbox/Checkbox";
import Icon from "../components/Icon/Icon";
import Link from "../components/Link/Link";
import Tooltip from "../components/Tooltip/Tooltip";
import PasswordInput from "../components/PasswordInput/PasswordInput";
import Input from "../components/Input/Input";

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
        showPassword: false,
    });

    const { isLoading, error, isAuthenticated } = useSelector(state => state.auth);

    useEffect(() => {
        console.log("Auth status:", isAuthenticated);
        if (isAuthenticated) {
            console.log('Redirecting to home page...');
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleClickShowPassword = () => {
        setFormData(prev => ({ ...prev, showPassword: !prev.showPassword }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev, 
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    console.log('Rendering LoginPage', { isLoading, error, isAuthenticated });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submit triggered', formData);
        console.log("Форма отправлена");
        dispatch(setAuthentificated());
        dispatch(clearError());
        console.log('Dispatching loginUser');
        dispatch(loginUser({
            email: formData.email,
            password: formData.password,
            rememberMe: formData.rememberMe
        }))
        .unwrap()
        .then(data => {
            console.log('Login successful', data);
        })
        .catch(error => {
            console.error('Login failed', error);
        });
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">
                    <Icon name="lock" size="lg" />
                    Вход в систему
                </h1>
                
                <form onSubmit={handleSubmit} className="login-form">
                    {/* Поле для email */}
                    <div className="form-group">
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Введите ваш email"
                            icon="email"
                        />
                    </div>
                    
                    {/* Поле для пароля с тултипом */}
                    <div className="form-group">
                        <PasswordInput
                            label={
                                <span>
                                    Пароль 
                                    <Tooltip content="Пароль должен содержать минимум 8 символов">
                                        <Icon name="info" size="sm" className="info-icon" />
                                    </Tooltip>
                                </span>
                            }
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            showPassword={formData.showPassword}
                            onToggleShow={handleClickShowPassword}
                            required
                            placeholder="Введите пароль"
                        />
                    </div>
                    
                    {/* Чекбокс "Запомнить меня" */}
                    <div className="remember-group">
                        <Checkbox
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            label="Запомнить меня"
                        />
                    </div>
                    
                    {/* Кнопка входа */}
                    <Button 
                        type="submit" 
                        size="medium"
                        wide
                        disabled={isLoading}
                    >
                        {isLoading ? "Вход..." : "Войти"}
                    </Button>
                    
                    {/* Обработка ошибок */}
                    {error && (
                        <div className="error-message">
                            <Icon name="error" color="error" />
                            {error}
                        </div>
                    )}
                    
                    {/* Ссылки */}
                    <div className="login-links">
                        <Link to="/register" variant="secondary">
                            <Icon name="person_add" />
                            Создать аккаунт
                        </Link>
                        
                        <Link to="/forgot-password" variant="secondary">
                            <Icon name="lock_reset" />
                            Забыли пароль?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;