# React Component Scaffold

Quickly create React or React Native components with customizable templates and structure.

## Features

- Create React or React Native components
- Support for TypeScript and JavaScript
- Choose between Functional and Class components
- Customizable style extensions (scss, css, etc.)
- Right-click in explorer to create components in any directory
- Save preferences or choose per component
- Separate type definitions in dedicated files
- Type-safe imports with explicit 'type' keyword

## Usage

1. Right-click in the explorer where you want to create a component
2. Select "Create React Component"
3. Enter the component name in kebab-case
4. Follow the prompts to create your component

Or use the command palette:

1. Press `Ctrl/Cmd + Shift + P`
2. Search for "Create React Component"
3. Follow the prompts

## Configuration

On first use or after reset:

1. Choose language (TypeScript/JavaScript)
2. Choose project type (React/React Native)
3. Set default component type (Functional/Class)
4. Choose whether to prompt for component type each time
5. Set style extension (for React projects)

To reset configuration:

1. Press `Ctrl/Cmd + Shift + P`
2. Search for "Reset React Component Scaffold Configuration"

## Generated Structure

For TypeScript React components:

```
component-name/
├── ComponentName.tsx
├── types.ts
├── index.ts (or .js)
└── ComponentName.module.scss (for React only)

```

For TypeScript React Native components:

```
component-name/
├── ComponentName.tsx
├── types.ts
└── index.ts

```

For JavaScript components, the same structure applies but with `.js` extensions and no `types.ts` file.

## Requirements

- VS Code 1.93.1 or higher

## Extension Settings

This extension contributes the following settings through the configuration wizard:

- `useTypeScript`: Enable/disable TypeScript support
- `styleExtension`: CSS file extension (css, scss, less, etc.)
- `defaultComponentType`: Default component type (Functional/Class)
- `promptForComponentType`: Whether to prompt for component type on each creation
- `projectType`: Project type (React/React Native)

## License

MIT
