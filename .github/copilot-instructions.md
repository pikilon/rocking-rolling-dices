# Copilot Instructions for Rocking Rolling Dices

## Project Overview
- **Rocking Rolling Dices** is a serverless, client-side web app for creating, customizing, and rolling multi-sided dice.
- Built with vanilla JavaScript (ES Modules), Web Components, and modular CSS. No frameworks or backend.
- Main UI and logic are in `index.html`, `js/components/`, and `css/`.

## Architecture & Key Patterns
- **Web Components**: Custom elements like `<game-title>` and `<dice-info>` are defined in `js/components/`. Each component encapsulates its own logic and template.
- **State Management**: Shared state is managed in `js/global-state.js` and accessed by components as needed.
- **Data Flow**: Data (e.g., dice sides, game info) is passed via custom element attributes and updated via JavaScript modules.
- **No Backend**: All data is stored in-memory or in browser storage (see `js/db.js`).
- **CSS**: Modular CSS files in `css/` (e.g., `dice.css`, `index.css`) use custom properties and utility classes for styling.

## Developer Workflows
- **Start/Run**: Use a simple static file server or open`index.html` directly in a browser for static development.
- **No Build Step**: All code is ES Module compatible and runs natively in modern browsers.
- **Debugging**: Use browser dev tools. No source maps or transpilation.
- **Testing**: No automated tests are present; manual testing via the UI is standard.

## Project-Specific Conventions
- **Component Naming**: Custom elements use kebab-case (e.g., `<dice-info>`). JS files use camelCase for functions/variables.
- **Module Imports**: Always use relative paths and `type="module"` in `<script>` tags.
- **Data Attributes**: Pass data to components via HTML attributes (e.g., `sides="1,2,3,4,5,6"`).
- **No Frameworks**: Avoid introducing frameworks or build tools.

## Integration Points

- **url game sets**: the main entry point should have the game sets info in search params: title, dices: with title, sides, and AMOUNT of them in the game. This in the file `js\utilities.js` to centralize the logic.
- **Local Storage**: Persistent data (games, dice) is managed in `js/db.js` all game sets should be stored in the local db.
- **Component Communication**: Use custom events or shared state (`js/global-state.js`) for cross-component updates.

## Key Files & Directories
- `index.html`: App entry point, loads main components.
- `js/components/`: All custom Web Components.
- `js/global-state.js`: Shared state logic.
- `js/db.js`: Local storage/data persistence.
- `css/`: Modular CSS for layout and components.
   - `css/utilities.css`: Utility classes for using in apps and new components. Check this before adding styles.

## Example Patterns
- To add a new dice type, create a new Web Component in `js/components/` and register it with `customElements.define`.
- To update shared state, import and modify `gameState` from `js/global-state.js`.

---

If you add new conventions or workflows, update this file to keep AI agents productive.
