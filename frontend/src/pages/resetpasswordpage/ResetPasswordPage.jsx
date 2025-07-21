import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { completePasswordReset, clearError } from "../../store/authslice";
import { useNavigate, useSearchParams } from "react-router-dom";

import Icon from "../../components/Icon/Icon";
import PasswordInput from "../../components/PasswordInput/PasswordInput";
import Button from "../../components/Button/Button";
import LoadSpinner from "../../shared/preload/LoadSpinner/LoadSpinner";
import Link from "../../components/Link/Link";
import "./ResetPasswordPage.css";

const ResetPasswordPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoading = useSelector(state => state.auth.isLoading);
    const error = useSelector(state => state.auth.error);

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const uid = searchParams.get("uid");

    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password1 !== password2) {
            dispatch(clearError());
            alert("Пароли не совпадают!");
            return;
        }
        const result = await dispatch(completePasswordReset({ uid, token, newPassword: password1 }));
        if (result.meta.requestStatus === "fulfilled") {
            setSuccess(true);
            setTimeout(() => navigate("/login"), 2000);
        }
    };

    return (
    <div className="reset-root">
        <div className="reset-container">
            <div className="reset-brand">Task Tracker</div>
                <form className="reset-form" onSubmit={handleSubmit}>
                    <div className="reset-input-wrapper">
                        <Icon type="lock" width="20" height="20" className="reset-input-icon" />
                        <PasswordInput
                            name="password1"
                            value={password1}
                            onChange={e => setPassword1(e.target.value)}
                            required
                            nativePlaceholder="Новый пароль"
                            autoComplete="new-password"
                            showToggle={false}
                            type="password"
                            theme="white-with-border"
                        />
                    </div>
                    <div className="reset-input-wrapper">
                        <Icon type="lock" width="20" height="20" className="reset-input-icon" />
                        <PasswordInput
                            name="password2"
                            value={password2}
                            onChange={e => setPassword2(e.target.value)}
                            required
                            nativePlaceholder="Повторите новый пароль"
                            autoComplete="new-password"
                            showToggle={false}
                            type="password"
                            theme="white-with-border"
                        />
                    </div>
                    <Button className="loginpage-submit-btn" type="submit" size="medium" wide theme="gray" disabled={isLoading}>
                        {isLoading ? <LoadSpinner /> : "Сменить пароль"}
                    </Button>
                </form>
                {success && <div className="reset-success">Пароль успешно изменён! Перенаправление...</div>}
                {error && (
                <div className="reset-error">
                    {typeof error === "string"
                    ? error
                    : error.error
                        ? error.error
                        : JSON.stringify(error)}
                </div>
                )}
            <div className="reset-links-row">
                <Link href="/login" theme="simple" className="reset-link-right">
                Войти
                </Link>
            </div>
        </div>
    </div>
    );
};
    
export default ResetPasswordPage;