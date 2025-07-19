import React from "react";
import Checkbox from "./Checkbox.jsx";
import renderer from "react-test-renderer";

it("default checkbox", () => {
    const tree = renderer.create(<Checkbox id="basic-checkbox-default" label="Серый чекбокс" tabIndex="1" />).toJSON();
    expect(tree).toMatchSnapshot();
});

it("checkbox with white theme", () => {
    const tree = renderer
        .create(<Checkbox id="white-checkbox-default" theme="white" label="Белый чекбокс" tabIndex="1" />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

it("checkbox with error", () => {
    const tree = renderer
        .create(<Checkbox id="basic-checkbox-default" label="Серый чекбокс" tabIndex="1" error />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});
