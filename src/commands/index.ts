import * as vscode from 'vscode';
import { TabGroupService } from '../services/tabGroupService';
import { TabGroupTreeDataProvider, TabGroupTreeItem } from '../views/tabGroupTreeView';
import { StorageService } from '../services/storageService';
import { TabGroupSettings } from '../models/tabGroup';

/**
 * Register all commands for the extension
 */
export function registerCommands(
    context: vscode.ExtensionContext,
    tabGroupService: TabGroupService,
    treeDataProvider: TabGroupTreeDataProvider
): void {
    // Save current tabs as a group
    context.subscriptions.push(
        vscode.commands.registerCommand('tab-group-saver.saveTabGroup', async () => {
            const groupName = await vscode.window.showInputBox({
                prompt: 'Enter a name for the tab group',
                placeHolder: 'My Tab Group'
            });
            
            if (!groupName) {
                return; // User cancelled
            }
            
            try {
                await tabGroupService.saveCurrentTabs(groupName);
                treeDataProvider.refresh();
                vscode.window.showInformationMessage(`Tab group '${groupName}' saved successfully`);
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to save tab group: ${error}`);
            }
        })
    );
    
    // Load a tab group
    context.subscriptions.push(
        vscode.commands.registerCommand('tab-group-saver.loadTabGroup', async (item?: TabGroupTreeItem) => {
            try {
                let groupName: string | undefined;
                
                if (item) {
                    // Called from tree view context menu
                    groupName = item.tabGroup.groupName;
                } else {
                    // Called from command palette
                    const tabGroups = await tabGroupService.getTabGroups();
                    
                    if (tabGroups.length === 0) {
                        vscode.window.showInformationMessage('No tab groups saved yet');
                        return;
                    }
                    
                    groupName = await vscode.window.showQuickPick(
                        tabGroups.map(group => group.groupName),
                        { placeHolder: 'Select a tab group to load' }
                    );
                }
                
                if (!groupName) {
                    return; // User cancelled
                }
                
                await tabGroupService.loadTabGroup(groupName);
                vscode.window.showInformationMessage(`Tab group '${groupName}' loaded successfully`);
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to load tab group: ${error}`);
            }
        })
    );
    
    // Delete a tab group
    context.subscriptions.push(
        vscode.commands.registerCommand('tab-group-saver.deleteTabGroup', async (item?: TabGroupTreeItem) => {
            try {
                let groupName: string | undefined;
                
                if (item) {
                    // Called from tree view context menu
                    groupName = item.tabGroup.groupName;
                } else {
                    // Called from command palette
                    const tabGroups = await tabGroupService.getTabGroups();
                    
                    if (tabGroups.length === 0) {
                        vscode.window.showInformationMessage('No tab groups saved yet');
                        return;
                    }
                    
                    groupName = await vscode.window.showQuickPick(
                        tabGroups.map(group => group.groupName),
                        { placeHolder: 'Select a tab group to delete' }
                    );
                }
                
                if (!groupName) {
                    return; // User cancelled
                }
                
                // Confirm deletion
                const confirmed = await vscode.window.showWarningMessage(
                    `Are you sure you want to delete tab group '${groupName}'?`,
                    { modal: true },
                    'Delete'
                );
                
                if (confirmed !== 'Delete') {
                    return; // User cancelled
                }
                
                await tabGroupService.deleteTabGroup(groupName);
                treeDataProvider.refresh();
                vscode.window.showInformationMessage(`Tab group '${groupName}' deleted successfully`);
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to delete tab group: ${error}`);
            }
        })
    );
    
    // Rename a tab group
    context.subscriptions.push(
        vscode.commands.registerCommand('tab-group-saver.renameTabGroup', async (item?: TabGroupTreeItem) => {
            try {
                let oldName: string | undefined;
                
                if (item) {
                    // Called from tree view context menu
                    oldName = item.tabGroup.groupName;
                } else {
                    // Called from command palette
                    const tabGroups = await tabGroupService.getTabGroups();
                    
                    if (tabGroups.length === 0) {
                        vscode.window.showInformationMessage('No tab groups saved yet');
                        return;
                    }
                    
                    oldName = await vscode.window.showQuickPick(
                        tabGroups.map(group => group.groupName),
                        { placeHolder: 'Select a tab group to rename' }
                    );
                }
                
                if (!oldName) {
                    return; // User cancelled
                }
                
                const newName = await vscode.window.showInputBox({
                    prompt: `Enter a new name for tab group '${oldName}'`,
                    placeHolder: 'New Tab Group Name',
                    value: oldName
                });
                
                if (!newName || newName === oldName) {
                    return; // User cancelled or name unchanged
                }
                
                await tabGroupService.renameTabGroup(oldName, newName);
                treeDataProvider.refresh();
                vscode.window.showInformationMessage(`Tab group renamed from '${oldName}' to '${newName}'`);
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to rename tab group: ${error}`);
            }
        })
    );
    
    // Set as default tab group
    context.subscriptions.push(
        vscode.commands.registerCommand('tab-group-saver.setDefaultTabGroup', async (item?: TabGroupTreeItem) => {
            try {
                let groupName: string | undefined;
                
                if (item) {
                    // Called from tree view context menu
                    groupName = item.tabGroup.groupName;
                } else {
                    // Called from command palette
                    const tabGroups = await tabGroupService.getTabGroups();
                    
                    if (tabGroups.length === 0) {
                        vscode.window.showInformationMessage('No tab groups saved yet');
                        return;
                    }
                    
                    groupName = await vscode.window.showQuickPick(
                        tabGroups.map(group => group.groupName),
                        { placeHolder: 'Select a tab group to set as default' }
                    );
                }
                
                if (!groupName) {
                    return; // User cancelled
                }
                
                await tabGroupService.setDefaultTabGroup(groupName);
                treeDataProvider.refresh();
                vscode.window.showInformationMessage(`Tab group '${groupName}' set as default`);
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to set default tab group: ${error}`);
            }
        })
    );
    
    // Open settings
    context.subscriptions.push(
        vscode.commands.registerCommand('tab-group-saver.openSettings', async () => {
            try {
                const storageService = new StorageService(context);
                const currentSettings = storageService.getSettings();
                
                // Create quick pick items for settings
                const autoSaveItem = {
                    label: `Auto-save on close: ${currentSettings.autoSaveOnClose ? 'Enabled' : 'Disabled'}`,
                    description: 'Automatically save open tabs when VS Code is closed',
                    setting: 'autoSaveOnClose',
                    value: currentSettings.autoSaveOnClose
                };
                
                const autoRestoreItem = {
                    label: `Auto-restore default: ${currentSettings.autoRestoreDefault ? 'Enabled' : 'Disabled'}`,
                    description: 'Automatically restore default tab group on startup',
                    setting: 'autoRestoreDefault',
                    value: currentSettings.autoRestoreDefault
                };
                
                const storageLocationItem = {
                    label: `Storage location: ${currentSettings.storageLocation}`,
                    description: 'Where to store tab groups (global, workspace, or file)',
                    setting: 'storageLocation',
                    value: currentSettings.storageLocation
                };
                
                const selectedItem = await vscode.window.showQuickPick(
                    [autoSaveItem, autoRestoreItem, storageLocationItem],
                    { placeHolder: 'Select a setting to change' }
                );
                
                if (!selectedItem) {
                    return; // User cancelled
                }
                
                // Handle setting change based on which setting was selected
                if (selectedItem.setting === 'autoSaveOnClose' || selectedItem.setting === 'autoRestoreDefault') {
                    // Toggle boolean setting
                    const newValue = !selectedItem.value;
                    const newSettings: TabGroupSettings = {
                        ...currentSettings,
                        [selectedItem.setting]: newValue
                    };
                    
                    await storageService.saveSettings(newSettings);
                    vscode.window.showInformationMessage(`${selectedItem.label.split(':')[0]} ${newValue ? 'enabled' : 'disabled'}`);
                } else if (selectedItem.setting === 'storageLocation') {
                    // Select storage location
                    const newLocation = await vscode.window.showQuickPick(
                        ['global', 'workspace', 'file'],
                        { placeHolder: 'Select storage location' }
                    ) as 'global' | 'workspace' | 'file' | undefined;
                    
                    if (!newLocation) {
                        return; // User cancelled
                    }
                    
                    const newSettings: TabGroupSettings = {
                        ...currentSettings,
                        storageLocation: newLocation
                    };
                    
                    await storageService.saveSettings(newSettings);
                    vscode.window.showInformationMessage(`Storage location set to ${newLocation}`);
                }
            } catch (error) {
                vscode.window.showErrorMessage(`Failed to update settings: ${error}`);
            }
        })
    );
}
