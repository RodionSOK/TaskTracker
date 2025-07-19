F1.50 Поле ввода. Белое. Отключённое

```jsx
<div className="styleguide styleguide_bg styleguide_bg-gray">
    <div className="styleguide__forms">
        <Input id="basic_input_disabled" type="text" placeholder="Поле ввода" disabled />
    </div>
</div>
```

F1.50 Поле ввода. Белое. Текстовое

```jsx
const initialState = { value: "" };

<div className="styleguide styleguide_bg styleguide_bg-gray">
    <div className="styleguide__forms">
        <Input
            type="text"
            placeholder="Поле ввода"
            value={state.value || ""}
            onChange={(e) => setState({ value: e.target.value })}
            required
        />
    </div>
</div>;
```

F1.50 Поле ввода. Белое. Текстовое. С браузерыным placeholder.

```jsx
const initialState = { value: "" };

<div className="styleguide styleguide_bg styleguide_bg-gray">
    <div className="styleguide__forms">
        <Input
            type="text"
            placeholder="Дата рождения"
            nativePlaceholder="ДД.ММ.ГГГГ"
            value={state.value || ""}
            onChange={(e) => setState({ value: e.target.value })}
            required
        />
    </div>
</div>;
```

F1.50 Поле ввода. Белое. Заполненное

```jsx
const initialState = { value: "Скоробогатько" };

<div className="styleguide styleguide_bg styleguide_bg-gray">
    <div className="styleguide__forms">
        <Input
            type="text"
            placeholder="Фамилия"
            value={state.value || ""}
            onChange={(e) => setState({ value: e.target.value })}
            required
        />
    </div>
</div>;
```

F1.50 Поле ввода. Белое. Подсказка

```jsx
const initialState = { value: "", status: "" };

<div className="styleguide styleguide_bg styleguide_bg-gray">
    <div className="styleguide__forms">
        <Input
            type="text"
            placeholder="Фамилия"
            value={state.value || ""}
            status={state.status}
            hint="Фамилия может состоять только из букв латинского алфавита или кириллицы"
            onFocus={(e) => setState({ status: "hint" })}
            onBlur={(e) => setState({ status: "" })}
            onChange={(e) => setState({ value: e.target.value })}
            required
        />
    </div>
</div>;
```

F1.50 Поле ввода. Белое. Ошибка

```jsx
const initialState = { value: "skorobogatkonn@gmail.com" };

<div className="styleguide styleguide_bg styleguide_bg-gray">
    <div className="styleguide__forms">
        <Input
            type="email"
            placeholder="Электронная почта"
            status="error"
            error="Адрес электронной почты не подтвержден"
            value={state.value || ""}
            onChange={(e) => setState({ value: e.target.value })}
            required
        />
    </div>
</div>;
```

F1.50 Поле ввода. Белое. Валидация не пройдена

```jsx
const initialState = { value: "skorobogatkonn@gmail.com" };

<div className="styleguide styleguide_bg styleguide_bg-gray">
    <div className="styleguide__forms">
        <Input
            type="email"
            placeholder="Электронная почта"
            status="error"
            value={state.value || ""}
            onChange={(e) => setState({ value: e.target.value })}
            required
        />
    </div>
</div>;
```

F1.50 Поле ввода. Белое. Валидация пройдена

```jsx
const initialState = { value: "skorobogatkonn@gmail.com" };

<div className="styleguide styleguide_bg styleguide_bg-gray">
    <div className="styleguide__forms">
        <Input
            type="email"
            placeholder="Электронная почта"
            status="success"
            value={state.value || ""}
            onChange={(e) => setState({ value: e.target.value })}
            required
        />
    </div>
</div>;
```

F1.50 Поле ввода. Серое. Текстовое

```jsx
const initialState = { value: "skorobogatkonn@gmail.com" };

<div className="styleguide styleguide_bg">
    <div className="styleguide__forms">
        <Input
            type="text"
            placeholder="Поле ввода"
            theme="gray"
            value={state.value || ""}
            onChange={(e) => setState({ value: e.target.value })}
            required
        />
    </div>
</div>;
```

F3.50 Поле ввода. Поле ввода пароля и повтора пароля

```jsx
const initialState = { value: "" };

<div className="styleguide styleguide_bg styleguide_bg-gray">
    <div className="styleguide__forms">
        <Input
            type="password"
            placeholder="Пароль"
            value={state.value || ""}
            onChange={(e) => setState({ value: e.target.value })}
            required
        />
    </div>
</div>;
```

Поле ввода для телефона

```jsx
initialState = { value: "" };

<div className="styleguide styleguide_bg styleguide_bg-gray">
    <div className="styleguide__forms">
        <Input
            placeholder="Мобильный телефон"
            type="tel"
            value={state.value}
            onChange={(e) => setState({ value: e.target.value })}
        />
    </div>
</div>;
```

FF5.1.40 Поле белое с бордером. Фильтр.

```jsx
const initialState = { value: "" };

<div className="styleguide styleguide_bg styleguide_bg-gray">
    <div className="styleguide__forms">
        <Input type="text" nativePlaceholder="Поиск" theme="white-with-border" />
    </div>
</div>;
```
