import React, { useState } from "react";
import "./Avatar.css";

function getInitials(user) {
    const first = user.first_name?.[0] || '';
    const last = user.last_name?.[0] || '';
    return (first + last).toUpperCase() || user.email?.[0].toUpperCase() || '?';
}

const Avatar = ({ user, selected = false, className = "" }) => {
    const [hovered, setHovered] = useState(false);

    // Стили для затемнения и увеличения
    const avatarStyle = (selected || hovered)
        ? { filter: "brightness(0.85)", transform: "scale(1.25)" }
        : {};

    return (
        <div
            className={`avatar-border${selected ? " selected" : ""} ${className}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {user.avatar ? (
                <img
                    src={user.avatar}
                    alt={user.first_name || user.email}
                    className="project-member-avatar"
                    style={avatarStyle}
                />
            ) : (
                <div
                    className="project-member-avatar initials"
                    style={avatarStyle}
                >
                    {getInitials(user)}
                </div>
            )}
        </div>
    );
};

export default Avatar;