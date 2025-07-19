import React from "react";
import "./Preloader.pcss";

const Preloader = ({ width, height }) => {
    const style = {
        width: width ? width : undefined,
        height: height ? height : undefined,
    };

    return <div className="preloader" style={style} key={0} />;
};

export default Preloader;
