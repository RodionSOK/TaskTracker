import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../store/authslice";
import { useNavigate } from "react-router-dom";

import Button from "../../components/Button/Button";
import Link from "../../components/Link/Link";
import Input from "../../components/Input/Input";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import Icon from "../../components/Icon/Icon";
import LoadSpinner from "../../shared/preload/LoadSpinner/LoadSpinner";
import "./RegisterPage.css";

const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const isLoading = useSelector(state => state.auth.isLoading);
    const [formData, setFormData] = useState({
        email: '',
        password1: '',
        password2: '',
        first_name: '',
        last_name: '',
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/tasks");
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
        dispatch(registerUser({
            email: formData.email,
            password1: formData.password1,
            password2: formData.password2,
            first_name: formData.first_name,
            last_name: formData.last_name,
        }));
    };

    return (
        <div className="registerpage-root">
            <div className="registerpage-container">
                <div className="registerpage-brand">Task Tracker</div>
                <form className="registerpage-form" onSubmit={handleSubmit}>
                    <div className="registerpage-input-wrapper">
                        <Input
                            name="first_name"
                            type="text"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                            nativePlaceholder="Имя"
                            theme="white-with-border"
                        />
                    </div>
                    <div className="registerpage-input-wrapper">                    
                        <Input
                            name="last_name"
                            type="text"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                            nativePlaceholder="Фамилия"
                            theme="white-with-border"
                        />
                    </div>
                    <div className="registerpage-input-wrapper">
                        <Icon type="mail" width="20" height="20" className="registerpage-input-icon" />
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
                    <div className="registerpage-passwords-group">
                        <div className="registerpage-input-wrapper">
                            <Icon type="lock" width="20" height="20" className="registerpage-input-icon" />
                            <PasswordInput
                                name="password1"
                                value={formData.password1}
                                onChange={handleChange}
                                required
                                nativePlaceholder="Пароль"
                                autoComplete="new-password"
                                showToggle={false}
                                type="password"
                                theme="white-with-border"
                            />
                        </div>
                        <div className="registerpage-input-wrapper">
                            <Icon type="lock" width="20" height="20" className="registerpage-input-icon" />
                            <PasswordInput
                                name="password2"
                                value={formData.password2}
                                onChange={handleChange}
                                required
                                nativePlaceholder="Повторите пароль"
                                autoComplete="new-password"
                                showToggle={false}
                                type="password"
                                theme="white-with-border"
                            />
                        </div>
                    </div>
                    <Button type="submit" size="medium" wide theme="gray" disabled={isLoading}>
                        {isLoading ? <LoadSpinner /> : "Зарегистрироваться"}
                    </Button>
                </form>
                <div className="registerpage-links-row">
                    <span>Уже есть аккаунт?</span>
                    <Link href="/login" theme="simple" className="registerpage-link-right">
                        Войти
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;