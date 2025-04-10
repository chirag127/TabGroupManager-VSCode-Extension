# Tab Group Saver

**Tab Group Saver** is a VS Code extension that allows you to save, restore, and manage groups of open tabs (files) in VS Code—like a lightweight session manager.

## Features

-   **Save Tab Groups**: Save your currently open tabs as a named group for later use
-   **Restore Tab Groups**: Quickly restore any saved tab group with a single click
-   **Manage Tab Groups**: View, rename, and delete your saved tab groups
-   **Default Tab Group**: Set a tab group to automatically restore on startup
-   **Auto-Save**: Optionally auto-save your tabs when VS Code closes
-   **Multiple Storage Options**: Store tab groups globally, per workspace, or in a file

## Usage

### Saving a Tab Group

1. Open the files you want to save as a group
2. Press `Ctrl+Shift+S` (Windows/Linux) or `Cmd+Shift+S` (Mac)
3. Enter a name for your tab group
4. Click OK

Alternatively, you can click the "Save Current Tabs as Group" button in the Tab Group Saver view in the activity bar.

### Loading a Tab Group

1. Press `Ctrl+Shift+L` (Windows/Linux) or `Cmd+Shift+L` (Mac)
2. Select the tab group you want to load
3. Click OK

Alternatively, you can click on a tab group in the Tab Group Saver view in the activity bar and click the "Load" button.

### Managing Tab Groups

Open the Tab Group Saver view in the activity bar to:

-   View all your saved tab groups
-   Rename tab groups
-   Delete tab groups
-   Set a default tab group

## Extension Settings

This extension provides the following settings:

-   **Auto-save on close**: Automatically save open tabs when VS Code is closed
-   **Auto-restore default**: Automatically restore the default tab group on startup
-   **Storage location**: Where to store tab groups (global, workspace, or file)

To access these settings, click the "Open Settings" button in the Tab Group Saver view.

## Storage Options

-   **Global**: Tab groups are saved globally and available in all workspaces
-   **Workspace**: Tab groups are saved per workspace
-   **File**: Tab groups are saved in a `.tabgroups.json` file in the workspace root

## Requirements

-   VS Code 1.70.0 or higher

## Release Notes

### 1.0.0

Initial release of Tab Group Saver with the following features:

-   Save tab groups
-   Load tab groups
-   Rename tab groups
-   Delete tab groups
-   Set default tab group
-   Auto-save on close
-   Auto-restore default
-   Multiple storage options

## License

MIT

---

**Enjoy!**
