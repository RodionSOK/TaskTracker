import React from "react";
import Button from "./Button.jsx";
import renderer from "react-test-renderer";

it("Button default", () => {
    const tree = renderer.create(<Button>button</Button>).toJSON();

    expect(tree).toMatchSnapshot();
});

it("Button disabled", () => {
    const tree = renderer.create(<Button disabled>button</Button>).toJSON();

    expect(tree).toMatchSnapshot();
});

it("Button small size ", () => {
    const tree = renderer.create(<Button size="small">button</Button>).toJSON();

    expect(tree).toMatchSnapshot();
});

it("Button with gray theme", () => {
    const tree = renderer.create(<Button theme="gray">button</Button>).toJSON();

    expect(tree).toMatchSnapshot();
});

it("Button with gray theme, small size", () => {
    const tree = renderer
        .create(
            <Button theme="gray" size="small">
                button
            </Button>,
        )
        .toJSON();

    expect(tree).toMatchSnapshot();
});

it("Button inactive", () => {
    const tree = renderer.create(<Button inactive>button</Button>).toJSON();

    expect(tree).toMatchSnapshot();
});

it("Button full width", () => {
    const tree = renderer.create(<Button wide>button</Button>).toJSON();

    expect(tree).toMatchSnapshot();
});
