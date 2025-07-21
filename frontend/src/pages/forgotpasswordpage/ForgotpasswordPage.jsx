import React, { useEffect, useState } from "react";
import { useSelector, useDispatch} from 'react-redux';
import { requestPasswordReset, clearError } from '../../store/authslice';

import Input from "../../components/Input/Input";
import Icon from "../../components/Icon/Icon";
import Button from "../../components/Button/Button";
import LoadSpinner from "../../shared/preload/LoadSpinner/LoadSpinner";
import Link from "../../components/Link/Link";
import "./ForgotPasswordPage.css";

const  ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        return() => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const isLoading = useSelector(state => state.auth.isLoading);
    const error = useSelector(state => state.auth.error);
    const emailSentTo = useSelector((state) => state.auth.emailSentTo);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(requestPasswordReset(email));
    };

    const handleChange = (e) => {
        setEmail(e.target.value);
        if (error) dispatch(clearError());
    };

    return (
    <div className="forgot-root">
        <div className="forgot-container">
        <div className="forgot-brand">Task Tracker</div>
        <form className="forgot-form" onSubmit={handleSubmit}>
            <div className="forgot-input-wrapper">
            <Icon type="mail" width="20" height="20" className="forgot-input-icon" />
            <Input
                name="email"
                type="email"
                value={email}
                onChange={handleChange}
                required
                nativePlaceholder="Email"
                autoComplete="email"
                theme="white-with-border"
            />
            </div>
            <Button type="submit" size="medium" wide theme="gray" disabled={isLoading}>
                {isLoading ? <LoadSpinner /> : "Отправить ссылку"}
            </Button>
        </form>
        {emailSentTo && (
            <div className="forgot-success">
                Письмо отправлено на <b>{emailSentTo}</b>
            </div>
        )}
        {error && <div className="forgot-error">{error}</div>}
        <div className="forgot-links-row">
            <span>Вспомнили пароль?</span>
            <Link href="/login" theme="simple" className="forgot-link-right">
                Войти
            </Link>
        </div>
        </div>
    </div>
    );
};

export default ForgotPasswordPage;