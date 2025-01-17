# SanArte Storefront

A modern and responsive e-commerce platform built with [Shopify Hydrogen](https://shopify.dev/custom-storefronts/hydrogen) and enhanced with powerful UI libraries like [shadcn/ui](https://ui.shadcn.com/). This project leverages cutting-edge technologies and best practices to deliver a seamless shopping experience.

## Table of Contents

- [Features](#features)
- [What's Included](#whats-included)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [License](#license)

## Features

- **Responsive Design:** Ensures optimal viewing across various devices.
- **Headless Commerce:** Powered by Shopify Hydrogen for a customizable storefront experience.
- **Accessible UI Components:** Utilizes [shadcn/ui](https://ui.shadcn.com/).
- **Optimized Formatting:** Tailwind CSS with [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) for efficient styling.
- **TypeScript:** Robust type checking for reliable and maintainable code.

## What's Included

- **Remix**
- **Hydrogen**
- **Oxygen**
- **Vite**
- **Shopify CLI**
- **ESLint**
- **Prettier**
- **Prettier Tailwind Plugin**
- **GraphQL Generator**
- **TypeScript**
- **shadcn/ui**
- **pnpm**

## Available Scripts

In the project directory, you can run the following scripts:

### `pnpm dev`

Runs the app in the development mode with code generation.

```bash
pnpm dev
```

### `pnpm build`

Builds the app for production to the `.hydrogen` folder.

```bash
pnpm build
```

### `pnpm preview`

Serves the build locally for previewing production builds.

```bash
pnpm preview
```

### `pnpm lint`

```bash
pnpm lint
```

### `pnpm codegen`

```bash
pnpm codegen
```

## Project Structure

```
sanarte_storefront/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   ├── graphql/             # GraphQL queries and mutations
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   ├── lib/                 # Various utilities
├── .eslintrc.cjs           # ESLint configuration
├── .prettierrc.js          # Prettier configuration (ESM syntax)
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Project metadata and scripts
└── README.md                # Project documentation
```

## License

This project is **private** and intended for internal use only. Redistribution and reuse of this project or any of its parts are strictly prohibited without explicit permission.
