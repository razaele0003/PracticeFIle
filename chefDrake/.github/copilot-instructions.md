# Copilot Instructions — Chef Drake

## Project Overview

An AI-powered recipe generator built with **React 19 + Vite 7**. Users add ingredients to a list; once they have more than 3, they can request a recipe from an LLM. The response (markdown) is rendered in the UI via `react-markdown`.

## Repository Layout

Standard Vite project — everything runs from the repo root.

```
src/
  index.jsx              ← Entry point (renders App into #root)
  App.jsx                ← Root component: Header + Main
  Main.jsx               ← State owner: ingredients[], recipe, loading
  Header.jsx             ← Static header with logo
  ai.js                  ← LLM integration (Groq API, client-side fetch)
  index.css              ← Global stylesheet
  components/
    IngredientsList.jsx  ← Ingredient list + "Clear all" + "Get a recipe" CTA
    ClaudeRecipe.jsx     ← Renders recipe markdown via react-markdown
  images/
    chef-drake.png
```

## Dev Workflow

```sh
npm install
npm run dev      # Vite dev server with HMR (http://localhost:5173)
npm run build    # Production build → dist/
npm run lint     # ESLint (flat config, eslint.config.js)
```

## Architecture & Data Flow

1. `Main.jsx` owns all state (`ingredients`, `recipe`, `loading`) and passes props down — no context/store.
2. `IngredientsList` receives `ingredients`, `getRecipe`, and `clearIngredients` callbacks; the recipe CTA only appears when `ingredients.length > 3`.
3. `getRecipe()` in `Main.jsx` calls `getRecipeFromChatGPT()` from `ai.js`, receives markdown, and sets `recipe` state.
4. `ClaudeRecipe` renders the markdown string with `<ReactMarkdown>`.

## Patterns & Conventions

- **React 19 form actions**: `Main.jsx` uses `<form action={addIngredient}>` with `formData.get("ingredient")` instead of `onSubmit` + controlled inputs.
- **Function components with `export default`**: Every component is a named function with a default export (no arrow-component convention).
- **Props over destructuring**: Components receive `props` as a single object (e.g., `props.recipe`, `props.ingredients`), not destructured parameters.
- **Plain CSS**: Single global stylesheet at `src/index.css`; class names use kebab-case (e.g., `.add-ingredient-form`, `.suggested-recipe-container`).
- **No TypeScript**: The project uses `.jsx` / `.js` only.

## AI / LLM Integration (`src/ai.js`)

- Uses **Groq API** (Llama 3.3 70B) via direct `fetch` calls — client-side, not production-safe.
- Exports `getRecipeFromChatGPT` (name kept for consistency despite using Groq).
- System prompt returns **markdown-formatted** recipes.
- `Main.jsx` wraps the call with try/catch and a loading indicator.

## Known Issues

| Issue | Location |
|-------|----------|
| API key is hardcoded in source | `src/ai.js` — should use env vars for production |
