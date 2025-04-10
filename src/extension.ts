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

    // Create tree data provider
    const treeDataProvider = new TabGroupTreeDataProvider(tabGroupService);

    // Register tree view
    const treeView = registerTabGroupTreeView(context, tabGroupService);

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
    // We can't create a full extension context here, so we'll just log a message
    console.log("Tab Group Saver extension is being deactivated");

    // Note: Auto-save functionality is handled in the extension.ts activate method
    // by registering a workspace.onDidCloseTextDocument event listener
}
