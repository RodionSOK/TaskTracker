import React from "react";
import Avatar from "../Avatar/Avatar";
import "./ProjectMembersBar.css";

const ProjectMembersBar = ({ members = [], selectedUserId, onSelect }) => {
    return (
        <div className="project-members-bar">
            {members.map(user => (
                <div
                    key={user.id || user.user_id}
                    className={`project-member${selectedUserId === (user.id || user.user_id) ? " selected" : ""}`}
                    onClick={() => onSelect && onSelect(user.id || user.user_id)}
                    title={user.first_name || user.email}
                >
                    <Avatar user={user} />
                    {/* <span className="project-member-name">
                        {user.first_name || user.email}
                    </span> */}
                </div>
            ))}
        </div>
    );
};

export default ProjectMembersBar;