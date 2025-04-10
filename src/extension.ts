import * as vscode from "vscode";
import { TabGroupService } from "./services/tabGroupService";
import { registerCommands } from "./commands";
import {
    registerTabGroupTreeView,
    TabGroupTreeDataProvider,
} from "./views/tabGroupTreeView";

/**
 * This method is called when the extension is activated
 */
export function activate(context: vscode.ExtensionContext) {
    console.log("Tab Group Saver extension is now active");

    // Initialize services
    const tabGroupService = new TabGroupService(context);

    // Register tree view
    const treeView = registerTabGroupTreeView(context, tabGroupService);
    const treeDataProvider = treeView.dataProvider as TabGroupTreeDataProvider;

    // Register commands
    registerCommands(context, tabGroupService, treeDataProvider);

    // Auto-restore default tab group if enabled
    tabGroupService.autoRestoreDefaultTabGroup().catch((error) => {
        console.error("Error auto-restoring default tab group:", error);
    });
}

/**
 * This method is called when the extension is deactivated
 */
export function deactivate() {
    // Auto-save current tabs if enabled
    const tabGroupService = new TabGroupService({
        globalState: { get: () => undefined, update: async () => undefined },
        workspaceState: { get: () => undefined, update: async () => undefined },
        subscriptions: [],
    } as vscode.ExtensionContext);

    tabGroupService.autoSaveCurrentTabs().catch((error) => {
        console.error("Error auto-saving current tabs:", error);
    });
}
