# vue2-dlg-lib

Vue 2 UI library for modal dialogs, toasts, and popup menus.

## Repository structure

```
npm workspace monorepo
├── packages/vue2-dlg-lib/    # library (published to npm)
│   └── src/
│       ├── index.js           # entry — default export = Vue plugin install fn
│       ├── install.js         # Vue.use() plugin: adds $dialog, $toast, $popupMenu
│       ├── dialog/            # DialogManager + DialogWindow.vue
│       ├── toast/             # ToastManager + Toast.vue
│       └── popup-menu/        # PopupMenuManager + PopupMenu.vue
└── packages/demo/            # demo SPA (private, references lib via workspace "*")
```

## Commands

```bash
npm run build          # builds library then demo (sequentially)
npm run build:lib      # library only (webpack --mode production)
npm run build:demo     # demo only
npm run serve          # webpack-dev-server for demo
npm run lint           # eslint .js,.vue in packages/ (root)
npm run test           # vitest run (uses vitest.config.js at root)
npm run test:watch     # vitest in watch mode
```

Husky pre-commit hook runs `npm run test` and `npm run build:lib`.

## Tech stack

- Vue 2.7 with `vue-template-compiler` + `vue-loader` v15
- Webpack 5 (UMD library target, Vue externalized as peer dep)
- Babel (`@babel/preset-env`, `modules: false`)
- CSS: scoped in SFCs, no preprocessor. Extracted by `mini-css-extract-plugin`.
- ESLint: `plugin:vue/recommended` + `eslint:recommended`, parser is `@babel/eslint-parser`

## Library conventions

- Build output: `dist/vue2-dlg-lib.js` + `dist/vue2-dlg-lib.css`
- Global library name: `Vue2DlgLib`
- CSS class prefix: `vdl-`
- UI strings (button labels, tooltips) are in Russian
- Z-index layers: dialogs 2000+ (step 10), popup menus 2500+, toasts 3000
- Components use PascalCase filenames (`DialogWindow.vue`), managers use camelCase (`DialogManager.js`)
- Single-file components with `<style scoped>`
- **Tests**: Vitest with `@vue/test-utils@1`, `jsdom`, `@vitejs/plugin-vue2`. Tests live in `packages/vue2-dlg-lib/src/__tests__/*.test.js`
- `vue-template-compiler` version must match `vue` exactly (both ^2.7.16)

## Usage (without `Vue.use()`)

```js
import { DialogManager, ToastManager, PopupMenuManager } from 'vue2-dlg-lib';
const dialog = new DialogManager({ Vue });
dialog.open({ title: 'Hello' });
```

## Key constraints

- `vue-template-compiler` version must match `vue` exactly (both ^2.7.16)
- Lockfile is `package-lock.json` (npm, not yarn/pnpm)
