B1.50 Синяя (основная) текстовая кнопка

```jsx
<div className="styleguide__buttons">
    <Button>Текстовая кнопка</Button>
    <Button disabled>Текстовая кнопка</Button>
</div>
```

B1.40 Синяя (основная) текстовая кнопка

```jsx
<div className="styleguide__buttons">
    <Button size="small">Далее</Button>
    <Button size="small" disabled>
        Далее
    </Button>
</div>
```

B2.50 Серая (вторичная) текстовая кнопка

```jsx
<div className="styleguide__buttons">
    <Button theme="gray">Текстовая кнопка</Button>
    <Button theme="gray" disabled>
        Текстовая кнопка
    </Button>
</div>
```

B2.40 Серая (вторичная) текстовая кнопка

```jsx
<div className="styleguide__buttons">
    <Button size="small" theme="gray">
        Далее
    </Button>
    <Button size="small" theme="gray" disabled>
        Далее
    </Button>
</div>
```

Неактивная кнопка (имеет стили отключённой), на которую можно повесить событие

```jsx
<div className="styleguide__buttons">
    <Button inactive onClick={() => alert("click work")}>
        Неактивная кнопка
    </Button>
    <Button disabled onClick={() => alert("click doesn't work")}>
        Отключённая кнопка
    </Button>
</div>
```

Кнопка на всю ширину блока

```jsx
<div className="styleguide__buttons">
    <Button wide>Широкая кнопка</Button>
</div>
```
