# Vue Dialog Library

Библиотека UI-компонентов для Vue.js 2.x: модальные диалоги с Promise-интерфейсом, информационные сообщения (Toast) и всплывающие меню.

## Установка

### NPM

```bash
npm install vue2-dlg-lib
```

### Подключение через CDN

Собранный бандл доступен в директории `dist/` пакета:

```html
<link rel="stylesheet" href="path/to/vue2-dlg-lib.css">
<script src="path/to/vue2-dlg-lib.js"></script>
```

## Использование

### Установка плагина

```js
import Vue from 'vue';
import VueDialogLibrary from 'vue2-dlg-lib';

Vue.use(VueDialogLibrary);

// Теперь доступны: this.$dialog, this.$toast, this.$popupMenu
```

---

## Modal Dialogs ($dialog)

### Базовый вызов

```js
this.$dialog.open({
  title: 'Заголовок диалога',
  width: '480px',
  height: '360px',
})
  .then((result) => {
    // Вызвано через this.dialogResolve(data) из дочернего компонента
    console.log('Resolved:', result);
  })
  .catch((reason) => {
    // Кнопка закрытия, Escape, клик вне границ
    console.log('Rejected:', reason);
  });
```

### Параметры `open(options)`

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|-------------|----------|
| `title` | `String` | `''` | Текст заголовка |
| `width` | `String \| Number` | `'480px'` | Ширина. Допускаются `px`, `vw`, `vh`, `%` |
| `height` | `String \| Number` | `'360px'` | Высота. Допускаются `px`, `vw`, `vh`, `%` |
| `minWidth` | `String \| Number` | `'280px'` | Минимальная ширина при изменении размера |
| `minHeight` | `String \| Number` | `'180px'` | Минимальная высота при изменении размера |
| `contentComponent` | `Object \| Function` | `null` | SFC-компонент для отображения в теле диалога |
| `contentProps` | `Object` | `{}` | Props, передаваемые в `contentComponent` |
| `closeOnClickOutside` | `Boolean` | `true` | Закрывать диалог при клике вне его границ |
| `resizable` | `Boolean` | `true` | Разрешить изменение размера мышью |
| `draggable` | `Boolean` | `true` | Разрешить перетаскивание за заголовок |

### Диалог с компонентом

```js
import MyForm from './MyForm.vue';

this.$dialog.open({
  title: 'Редактирование',
  contentComponent: MyForm,
  contentProps: {
    recordId: 42,
    mode: 'edit',
  },
  width: '600px',
  height: '400px',
});
```

Дочерний компонент получает через props два метода:

- `dialogResolve(data)` — закрыть диалог с результатом (Promise `then`)
- `dialogReject(reason)` — закрыть диалог с ошибкой (Promise `catch`)

```vue
<!-- MyForm.vue -->
<template>
  <div>
    <p>ID: {{ recordId }}</p>
    <button @click="submit">Сохранить</button>
    <button @click="cancel">Отмена</button>
  </div>
</template>

<script>
export default {
  props: {
    recordId: Number,
    mode: String,
    dialogResolve: Function,
    dialogReject: Function,
  },
  methods: {
    submit() {
      this.dialogResolve({ id: this.recordId, mode: this.mode });
    },
    cancel() {
      this.dialogReject('user cancelled');
    },
  },
};
</script>
```

### Нестандартный размер

```js
// В пикселях
this.$dialog.open({ title: 'Fixed size', width: '800px', height: '600px' });

// В относительных единицах viewport
this.$dialog.open({ title: 'Responsive', width: '80vw', height: '60vh' });
```

### Отключение закрытия по клику вне диалога

```js
this.$dialog.open({
  title: 'Важный вопрос',
  closeOnClickOutside: false,
});
```

### Вложенные (stacked) диалоги

```js
// Первый диалог
this.$dialog.open({ title: 'Первый диалог' })
  .then(...)
  .catch(() => {
    // Второй диалог открывается поверх первого
    this.$dialog.open({
      title: 'Второй диалог',
      contentComponent: SomeComponent,
    });
  });
```

Escape закрывает только верхний диалог в стеке.

### Закрытие всех диалогов

```js
this.$dialog.closeAll();
```

---

## Toast Messages ($toast)

### Показ сообщения

```js
this.$toast.show({
  message: 'Операция выполнена!',
  duration: 5000,     // мс, или 0 — не закрывать автоматически
  type: 'success',    // 'default' | 'success' | 'warning' | 'error'
});
```

### Параметры `show(options)`

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|-------------|----------|
| `message` | `String` | `''` | Текст сообщения |
| `duration` | `Number` | `5000` | Время показа в мс. `0` — показывать до ручного закрытия |
| `type` | `String` | `'default'` | Тип: `'default'`, `'success'`, `'warning'`, `'error'` |

### Типы сообщений

Каждый тип имеет свою цветовую индикацию (полоса слева и цвет прогресс-бара):

- `default` — синий
- `success` — зелёный
- `warning` — жёлтый
- `error` — красный

### Закрытие всех сообщений

```js
this.$toast.closeAll();
```

### Поведение при наведении

При наведении курсора на Toast таймер автозакрытия приостанавливается. При уходе — продолжает отсчёт оставшегося времени.

### Закрытие по Escape

Если на экране есть Toast, нажатие Escape закрывает их все.

---

## Popup Menu ($popupMenu)

### Показ меню

```js
this.$popupMenu.show({
  items: [
    { text: 'Открыть', icon: '\u{1F4C2}', value: 'open' },
    { text: 'Сохранить', icon: '\u{1F4BE}', value: 'save' },
    { text: 'Удалить', icon: '\u{1F5D1}', value: 'delete' },
  ],
  x: event.clientX,
  y: event.clientY,
})
  .then((item) => {
    console.log('Выбрано:', item.text, item.value);
  })
  .catch((reason) => {
    console.log('Меню закрыто:', reason);
  });
```

### Параметры `show(options)`

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|-------------|----------|
| `items` | `Array` | `[]` | Массив пунктов меню. Каждый: `{ text, icon?, value? }` |
| `x` | `Number` | `0` | Координата X (от левого края viewport) |
| `y` | `Number` | `0` | Координата Y (от верхнего края viewport) |

### Иконки

#### Unicode-символы

```js
{ text: 'Настройки', icon: '\u2699', value: 'settings' }
```

#### FontAwesome (классы)

```js
{ text: 'Редактировать', icon: 'fa fa-edit', value: 'edit' }
```

Для FontAwesome необходимо подключить шрифт в вашем проекте:

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
```

### Навигация с клавиатуры

- **Стрелки вверх/вниз** — перемещение по пунктам
- **Enter** — выбрать пункт
- **Escape** — закрыть меню без выбора

### Закрытие

Меню закрывается при:
- клике за его пределами
- нажатии Escape
- выборе пункта (resolve)

---

## Использование без Vue.use()

Если вы предпочитете не использовать плагин:

```js
import { DialogManager, ToastManager, PopupMenuManager } from 'vue2-dlg-lib';

const dialog = new DialogManager();
const toast = new ToastManager();
const menu = new PopupMenuManager();

dialog.open({ title: 'Прямой вызов' });
toast.show({ message: 'Прямой вызов Toast' });
menu.show({ items: [...], x: 100, y: 200 });
```

## Компонент DialogWindow

Если нужно встроить диалог в свой шаблон без использования `$dialog`:

```vue
<template>
  <DialogWindow
    title="Мой диалог"
    width="500px"
    height="400px"
    :close-on-click-outside="false"
    @resolve="onResolve"
    @reject="onReject"
  >
    <p>Содержимое диалога</p>
  </DialogWindow>
</template>

<script>
import { DialogWindow } from 'vue2-dlg-lib';

export default {
  components: { DialogWindow },
};
</script>
```

---

## Структура библиотеки

```
src/
├── index.js              # Точка входа, публичные экспорты
├── install.js            # Vue plugin
├── dialog/
│   ├── DialogManager.js  # Менеджер стека диалогов
│   └── DialogWindow.vue  # Компонент диалога
├── toast/
│   ├── ToastManager.js   # Менеджер Toast
│   └── Toast.vue         # Компонент Toast
└── popup-menu/
    ├── popupMenu.js      # Менеджер PopupMenu
    └── PopupMenu.vue     # Компонент меню
```

## Сборка

```bash
npm run build        # Production
npm run build:dev    # Development
```

Результат: `dist/vue2-dlg-lib.js` + `dist/vue2-dlg-lib.css`

## Лицензия

MIT
