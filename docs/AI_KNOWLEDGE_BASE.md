# AI Knowledge Base & Global Rules

## 1. Date Formatting (CRITICAL)
- **Strict Rule**: ALL dates in the system MUST be formatted as `DD/MM/YYYY`.
- **Buddhist Era (พ.ศ.)**: The `YYYY` component MUST always represent the Buddhist Era (พุทธศักราช).
  - Example: For the year 2026, the format must be `2569`.
  - Example output: `15/02/2569`
- Do not use YYYY-MM-DD or standard Gregorian years in user-facing UI unless explicitly storing data to the backend in a standard format (and even then, the UI must show DD/MM/YYYY พ.ศ.).

## 2. UX/UI & Modals
- Never show empty Modals or Dialogs. Always ensure the state is populated before opening a Dialog.
- If a user clicks "Add New Request", provide a selection list first if the exact type is not known.

## 3. Context-Aware Dialogs
- **Strict Rule**: When opening an Add/Edit Dialog from a Detail View (where the parent context is already tied to a specific entity, e.g., a specific Scholar), DO NOT render a `<Select>` dropdown asking the user to choose the entity again.
- Instead, render a static Label/Card showing the selected entity's information (e.g., `SCH-001 • น.ส.พรพิมล สุขใจ`). Redundant data entry is strictly prohibited for a premium UX.

## 4. Full-screen Dialogs (Data Grids)
- **Strict Rule**: When designing a Dialog that displays a large Data Grid or Table (e.g., Excel Import Previews), it MUST be a true edge-to-edge full-screen Dialog.
- Do not use `max-w-[95vw] h-[95vh]`. You MUST use `className="max-w-[100vw] sm:max-w-none sm:w-screen sm:h-screen w-screen h-screen max-h-[100vh] m-0 p-0 sm:p-0 rounded-none border-0"` for the `DialogContent`. This explicitly overrides `shadcn/ui`'s default `sm:max-w-lg` constraints, ensuring maximum screen real estate for horizontal scrolling and a premium UX.
