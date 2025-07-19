import React from "react";

import "./Tooltip.css";

const Tooltip = ({ position, title }) => <div className="tooltip" data-balloon={title} data-balloon-pos={position} />;

Tooltip.defaultProps = {
    position: "up",
};

export default Tooltip;
