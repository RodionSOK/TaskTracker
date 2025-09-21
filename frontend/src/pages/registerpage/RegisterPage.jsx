import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../store/authslice";
import { useNavigate, useLocation } from "react-router-dom";
import { clearError } from "../../store/authslice";

import { loginUser } from "../../store/authslice";

import Button from "../../components/Button/Button";
import Link from "../../components/Link/Link";
import Input from "../../components/Input/Input";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import Icon from "../../components/Icon/Icon";
import LoadSpinner from "../../shared/preload/LoadSpinner/LoadSpinner";
import "./RegisterPage.css";

const RegisterPage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        return() => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const navigate = useNavigate();

    const authData = useSelector(state => state.auth);
    console.log(authData);

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const isLoading = useSelector(state => state.auth.isLoading);
    const error = useSelector(state => state.auth.error);
    const [formData, setFormData] = useState({
        email: '',
        password1: '',
        password2: '',
        first_name: '',
        last_name: '',
    });

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const projectId = params.get("project_id");


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev, 
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resultAction = await dispatch(registerUser({
            email: formData.email,
            password1: formData.password1,
            password2: formData.password2,
            first_name: formData.first_name,
            last_name: formData.last_name,
            project_id: projectId,
        }));
        console.log(resultAction);
        if (registerUser.fulfilled.match(resultAction)) {
            await dispatch(loginUser({
                email: formData.email,
                password: formData.password1
            }));
            navigate("/start");
        }
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
                            {error && (
                            <div className="registerpage-error">
                                {typeof error === "string"
                                ? error
                                : error.password2
                                    ? error.password2
                                    : JSON.stringify(error)}
                            </div>
                            )}
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