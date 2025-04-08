import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettier from 'eslint-plugin-prettier'
import importPlugin from 'eslint-plugin-import'
//В объекте (tseslint) есть свойство .plugin — это и есть сам плагин, содержащий: а) правила (например: @typescript-eslint/no-unused-vars) b) настройки c) линтер-функциональность, специфичную для TypeScript
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  { ignores: ['dist', 'node_modules', 'build'] },
  {
    files: ['**/*.{js,jsx,ts,tsx}'], //Определяет, какие файлы должны проверяться ESLint'ом.  В данном случае все файлы с расширением .js и .jsx ПЛЮС ts, tsx в любом каталоге проекта. **/* — проверять все файлы и папки (рекурсивно). {js,jsx} — учитывать только файлы с указанными расширениями.
    ignores: ['eslint.config.js'], // Исключаем eslint.config.js из TypeScript-парсинга. Зачем? ESLint пытается применить правила TypeScript, установленные в parserOptions.project, к самому файлу конфигурации ESLint (то есть к файлу eslint.config.js). Однако этот файл — это JavaScript-файл, а не TypeScript, и его не нужно анализировать через TypeScript-парсер.
    languageOptions: {
      //Этот объект настраивает, какие версии JavaScript поддерживаются и какие глобальные переменные можно использовать.
      ecmaVersion: 2020, //Определяет, какую версию ECMAScript поддерживать. 2020 — это ES11. Однако в parserOptions.ecmaVersion установлено 'latest', что означает самую новую доступную версию (сейчас это ES14 / 2023).
      globals: globals.browser, //globals.browser — это список глобальных переменных, доступных в браузерной среде, например: window document navigator fetch localStorage и другие. Без этой настройки ESLint мог бы выдавать ошибки "window is not defined"
      parser: tsParser, // ✅ Используем парсер от typescript-eslint. Нужен для того, чтобы ESLint мог "понимать" TypeScript-код, а не только обычный JavaScript.
      parserOptions: {
        //Позволяет точнее настроить поддержку синтаксиса в ESLint.
        ecmaVersion: 'latest', //Указывает, что ESLint должен использовать самую новую доступную версию ECMAScript.
        ecmaFeatures: { jsx: true }, //Включает поддержку JSX, который используется в React-компонентах. Без этого ESLint не сможет анализировать JSX, выдавая ошибки.
        sourceType: 'module', //Указывает, что код использует ES-модули (import/export), а не старые require().

        project: './tsconfig.eslint.json', // ✅ Нужен для recommendedTypeChecked, но сам recommendedTypeChecked не хочет рабоать...
      },
    },
    settings: {
      react: { version: '18.3' }, //Указывает, что проект использует React версии 18.3.
      'import/resolver': {
        //Этот блок настройки касается плагина eslint-plugin-import, который помогает ESLint понимать, как разрешать пути к импортируемым модулям в проекте.
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'], //Указывает расширения файлов, которые должны учитываться при разрешении путей для импортов.
          moduleDirectory: ['node_modules', 'src/'], //Определяет каталоги, в которых ESLint будет искать модули для разрешения путей
        },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react, //ESLint по умолчанию не знает о JSX и специфике React, этот плагин исправляет это.
      'react-hooks': reactHooks, //Проверяет, что хуки вызываются только внутри React-компонентов или других хуков.
      'react-refresh': reactRefresh, //Этот плагин нужен для React Fast Refresh – технологии, которая позволяет обновлять код без перезагрузки страницы. Он добавляет правило(я использовал его ниже): react-refresh/only-export-components. Убеждается, что ты экспортируешь только React-компоненты, а не какие-то вспомогательные функции.
      prettier, //Плагин для автоматического форматирования. Дает возможность подключить свои кастомные ныстройки Prettier через пакет eslint-plugin-prettier
      import: importPlugin, //import: importPlugin (ниже я использовал правило import/order)
    },
    rules: {
      //Мы импортируем рекомендуемые наборы правил из пакетов ESLint, React и React Hooks. Это эквивалентно написанию всех этих правил вручную.  ESLint сам включает наиболее разумные дефолтные проверки.
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      // ...tseslint.configs.recommendedTypeChecked.rules, не работают почему-то
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off', //Когда вы используете target="_blank" в <a>-теге, браузер открывает ссылку в новой вкладке. Это удобно, но может создать проблему безопасности, если открываемая ссылка ведёт на внешний сайт. В моем коде ссылки всегда безопасны, и проверка не нужна.
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }], //предупреждает, если экспортируем не только компоненты. { allowConstantExport: true } разрешает экспорт констант (const), но не функций или объектов.
      'prettier/prettier': 'error', //Это правило заставляет ESLint следовать Prettier.
      indent: 'off',
      'linebreak-style': [0, 'unix'], // Отключение проверки перевода строк
      quotes: ['error', 'single'], // Принудительное использование одинарных кавычек
      semi: ['error', 'never'],
      'react/react-in-jsx-scope': 'off', // Отключает правило, требующее import React from 'react' в файлах с JSX
      'react/prop-types': 0, //Отключаем проверку валидации пропсов. 0 == 'off' → отключает правило. 1 == 'warn' → ESLint выдаст предупреждение, но не прервет сборку. 2 == 'error' → ESLint выдаст ошибку, и сборка (если запущена с --max-warnings 0) может упасть
      // 'import/no-unresolved': [2, { caseSensitive: false }], //Запрещает импорт несуществующих файлов или модулей. 2 (или 'error') — ESLint выдаст ошибку, если импорт не найден. caseSensitive: false — отключает проверку регистра в путях.
      'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.tsx'] }], //Разрешает писать JSX в файлах .js и .jsx И TSX, но выдаст предупреждение, если JSX окажется в другом типе файла.
      // ✅ Заменяем стандартное правило no-unused-vars на версию из typescript-eslint
      'no-unused-vars': 'off', //Отключеам старое JS-правило no-unused-vars
      '@typescript-eslint/no-unused-vars': ['error'], //Включаем TS-аналог @typescript-eslint/no-unused-vars. Это позволяет не ругаться на переменные или аргументы, начинающиеся с _, что часто используется как "заглушка".
      'import/order': [
        //Упорядочивает импорты по группам и требует пустую строку между ними. 2 (или 'error') — если порядок нарушен, ESLint выдаст ошибку.
        2,
        {
          //Группы делают код более читаемым и логично упорядоченным. ESLint сам разделит импорты на логичные группы и добавит пустые строки между ними:
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'never', // это устраняет пустые строки внутри группы
        },
      ],
      // Я закоментил выше [2, { caseSensitive: false }] и использовал здесь 'off', потому, что import/no-unresolved не умеет корректно проверять импорты из TypeScript (особенно с paths, alias и @typescript-eslint/parser)
      'import/no-unresolved': 'off',
    },
  },
]
