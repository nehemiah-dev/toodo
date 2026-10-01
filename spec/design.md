# Design Documentation: Toodo Interface

## 1. Introduction

This document provides a detailed description of the user interface (UI) and user experience (UX) for Toodo, a local-first todo application. The design focuses on quick task management, clear information visual hierarchy, and intuitive organization, adhering to the principles outlined in the Product Design Specification.

This design document is specific to the Desktop Web application view.

## 2. Design Principles

The design of Toodo is guided by the following principles:

* **Clarity and Simplicity:** Minimalist interface with no unnecessary elements. The user's focus should be on the tasks.
* **Local-First Accessibility:** The UI should immediately indicate that the data is stored locally and accessible without accounts or an internet connection.
* **Scannability:** Information hierarchy is critical. Overdue tasks and high-priority items must stand out instantly.
* **Accessibility (a11y):** States must not be conveyed by color alone (e.g., overdue tasks have an explicit status label).

## 3. Visual System

### 3.1. Color Palette

The color system is minimal, prioritizing productivity and readability. Emerald green is used strictly for accents and primary action elements to provide visual emphasis and continuity.

| Component / Use | Hex/Description | Swatch |
| --- | --- | --- |
| **Primary Accent & Action** | `#10B981` (Emerald) |  |
| **Background / Canvas** | `#FFFFFF` (White) |  |
| **Sidebar Background** | `#F3F4F6` (Neutral 100) |  |
| **Borders / Separators** | `#E5E7EB` (Neutral 200) |  |
| **Text (Primary)** | `#1F2937` (Neutral 800) |  |
| **Text (Secondary)** | `#6B7280` (Neutral 500) |  |
| **Text (Disabled/Subtle)** | `#9CA3AF` (Neutral 400) |  |
| **Overdue/Urgent Status** | `#EF4444` (Red) / `#FEE2E2` (Light Red Bg) |   |
| **High Priority Icon/Text** | `#DC2626` (Red 600) |  |

*Note: The 'High Priority' and 'Overdue' indicators utilize different reds or different contexts (e.g., 'Overdue' is a specific status tag with an icon, while 'High Priority' is a badge associated with priority logic).*

### 3.2. Typography

The design uses a clean, modern sans-serif typeface optimized for readability across devices.

* **Primary Font:** Inter (or dynamic equivalent: `system-ui, -apple-system, sans-serif`)
* **Scale:**
* `Title`: 24px, Semibold (e.g., "Tasks (4)")
* `Card Title`: 18px, Semibold (e.g., "Review Project Specification")
* `Card Description`: 14px, Regular (e.g., "Discuss missing features...")
* `Interface Label`: 14px, Medium (e.g., "Active (4)")
* `Subtle Labels`: 12px, Regular (e.g., "Household", "Completed on Sep 30")



### 3.3. Layout and Spacing

The layout is structured using a consistent grid to manage whitespace effectively.

* **Grid:** Based on a 4px/8px incremental system.
* **Overall Layout:** A two-column structure (Sidebar | Main Content) on desktop.
* **Whitespace:** Generous padding is used within the main area and inside task cards to reduce cognitive load. The desktop display shows significant whitespace, emphasizing the minimal approach.

## 4. UI Component Specifications

This section breaks down the specific components visible in the primary interface.

### 4.1. Navigation Sidebar

| Component | Visual Description | Behavior |
| --- | --- | --- |
| **Logo/App Title** | Minimalist checkmark icon and "Toodo" in strong typeface. | Navigation Home. |
| **Navigation Filters** | Vertically stacked text labels with task counts: All, Active (count), Completed (count). | Active selection is highlighted with a green border and subtle gray background. Counts are grayed out. |
| **Categories** | Stacked list: Work, Personal, Learning, Household (custom). Includes unique minimalist icons. | Selects a category as the primary filter. Highlights the selection. |

### 4.2. Global Actions Bar

| Component | Visual Description | Behavior |
| --- | --- | --- |
| **Main Content Title** | "Tasks (4)" large bold header. | Updates based on navigation. |
| **Data Actions** | Standard white buttons with icons and text: "Import Data", "Export Data" (with download icon). | `Import`: Opens file selector. `Export`: Triggers JSON file download. |
| **Add Task Button** | Large, prominent green floating action button (FAB) `+ Add Task`. | Opens the Create Task modal. |

### 4.3. Search and Input

| Component | Visual Description | Behavior |
| --- | --- | --- |
| **Search Bar** | Thin bordered input field with placeholder "Search tasks..." and a magnifying glass icon. | Filters the current view based on user input. Asynchronous update on input. |

### 4.4. Task Card Anatomy

Task cards are the primary focus of the UI. Each card must clearly convey state, priority, and metadata without clutter.

| Element | Visual Description | Priority/Context |
| --- | --- | --- |
| **Completion Control** | A large checkbox located on the left border (visible on active cards). | Main completion action. |
| **Task Title** | Large, bold text (e.g., "Review Project Specification"). Strongest visual element. | Primary scannable identifier. |
| **Description** | Regular text (e.g., "Discuss missing features..."). Optional, visible. | Secondary content. |
| **Metadata Row** | Minimalist icons paired with text: Category, Priority Badge (!!! High / ! Medium / Low), Due Date, Status Indicators. | Fast contextual scanning. |
| **Action Icons** | Subtle edit (pencil) and delete (trash can) icons located on the right. | Secondary management actions. |
| **State: Active** | Default card state. | Standard interactive border. |
| **State: Overdue** | Card has an explicit red background and a clear text label `Overdue` with a warning icon. | Requires immediate attention; high visual priority. |
| **State: Completed** | Card title is struck through. The completion control is locked, and a locked 'Completed' status with the completion date is displayed on the bottom right. The left checkbox is disabled. | Historical record. |

## 5. View States and Interaction

### 5.1. Overdue Handling

Overdue tasks are specifically designed to pop out visually. An overdue task is identified by the Red alert icon (`!`) next to the date, which is colored red. The task also features an explicit "Overdue" status tag on the top left, separate from the primary red visual alert, and the task card has a red outline border to differentiate it.

### 2. Task Completion

* When an active task card is clicked (excluding the completion checkbox), it will open the edit task modal.
* When the completion checkbox is clicked, the task visually transitions (e.g., text strike-through, status updates, completion date is added) and is moved from the 'Active' filter to the 'Completed' filter based on sorting rules (overdue active tasks move to completed).

### 5.3. Task Sorting

By default, the task list is sorted logically:

1. Overdue (sorted by due date, oldest first)
2. High Priority (not overdue)
3. Medium Priority
4. Low Priority
5. Completed (sorted by completion date, newest first)

This specific view shows a mix of all categories.

### 5.4. Feedback Toasts

Short-lived, non-invasive feedback is crucial for a local application.

* A toast with simple text (e.g., "Task updated") appears in the bottom right, using a subtle green background and dark text, to confirm user actions (e.g., update, completion, export/import).

## 6. Accessibility (a11y) and Responsiveness

This design document covers the desktop view. The implementation of this design must adhere to the product specifications regarding a11y and responsiveness.

### 6.1. a11y Key Implementation

* **States Not Solely by Color:** Overdue is defined by a border, an icon, and a specific status tag. Completed is defined by strikethrough text and specific completion date text.
* **Semantic HTML and Focus States:** The navigation filters, buttons, and task cards must use semantic elements and maintain clear focus rings (emerald green) when navigated via keyboard.

### 6.2. Responsive Design (Mobile adaptation brief)

This interface must adapt cleanly to tablet and mobile viewports.

* **Mobile Sidebar:** On smaller screens, the navigation sidebar must collapse into a compact vertical stacked navigation (hamburger menu) appropriate for the screen width.
* **Task Card Reflow:** Task metadata (priority, category, date, actions) may wrap or reflow to vertical stacking inside the task card.
* **FAB Placement:** The large green "Add Task" button remains prominently visible at the bottom right.