import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Link as ReactRouterLink } from "react-router-dom";

import "./Link.pcss";

const Link = ({ className, href, children, theme, type, nodeType, target, onClick }) => {
    const componentClassName = classNames("link", className, {
        link_opacity: type === "opacity",
        link_line: type === "line",
        link_blue: theme === "blue",
        link_gray: theme === "gray",
        link_white: theme === "white",
    });

    if (nodeType === "button") {
        return (
            <button className={componentClassName} onClick={onClick}>
                {children}
            </button>
        );
    }

    if (nodeType === "span") {
        return (
            <span className={componentClassName} onClick={onClick}>
                {children}
            </span>
        );
    }

    if (nodeType === "a") {
        return target === "_blank" ? (
            <a className={componentClassName} href={href} target={target} rel="noopener noreferrer">
                {children}
            </a>
        ) : (
            <a className={componentClassName} href={href}>
                {children}
            </a>
        );
    }

    return (
        <ReactRouterLink className={componentClassName} to={href} onClick={onClick} target={target}>
            {children}
        </ReactRouterLink>
    );
};

Link.propTypes = {
    href: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
    theme: PropTypes.oneOf(["blue", "gray", "white"]),
    type: PropTypes.oneOf(["opacity", "line"]),
    nodeType: PropTypes.oneOf(["button", "span", "a"]),
    onClick: PropTypes.func,
};

export default Link;
