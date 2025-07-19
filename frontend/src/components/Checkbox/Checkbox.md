Ch1. Чекбокс. Белый

```jsx
initialState = { value: false };

<div className="styleguide__labeled styleguide_bg styleguide_bg-gray">
    <Checkbox
        id="white-checkbox-default"
        theme="white"
        label="Белый чекбокс"
        tabIndex="1"
        value={state.value}
        onChange={() => setState({ value: !state.value })}
    />
</div>;
```

Ch2. Чекбокс. Серый

```jsx
initialState = { value: false };

<div className="styleguide__labeled">
    <Checkbox
        id="basic-checkbox-default"
        label="Серый чекбокс"
        tabIndex="2"
        value={state.value}
        onChange={() => setState({ value: !state.value })}
    />
</div>;
```

Ch3. Чекбокс. Белый с бордером

```jsx
initialState = { value: false };

<div className="styleguide__labeled">
    <Checkbox
        id="white-with-border-сeckbox-default"
        theme="white-with-border"
        label="Белый чекбокс с бордером"
        tabIndex="3"
        value={state.value}
        onChange={() => setState({ value: !state.value })}
    />
</div>;
```

Ch3. Чекбокс. С дополнительным текстом

```jsx
initialState = { value: false };

<div className="styleguide__labeled">
    <Checkbox
        id="white-with-border-сeckbox-count"
        theme="white-with-border"
        label="Белый чекбокс с дополнитеьный текстом"
        labelCount="12"
        tabIndex="4"
        value={state.value}
        onChange={() => setState({ value: !state.value })}
    />
</div>;
```
