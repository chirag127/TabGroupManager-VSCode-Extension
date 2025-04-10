import * as vscode from 'vscode';
import { TabGroup } from '../models/tabGroup';
import { StorageService } from './storageService';

/**
 * Service for managing tab groups
 */
export class TabGroupService {
    private storageService: StorageService;
    
    constructor(context: vscode.ExtensionContext) {
        this.storageService = new StorageService(context);
    }
    
    /**
     * Get all saved tab groups
     */
    public async getTabGroups(): Promise<TabGroup[]> {
        return this.storageService.getTabGroups();
    }
    
    /**
     * Save current tabs as a new group
     */
    public async saveCurrentTabs(groupName: string): Promise<TabGroup> {
        const tabGroups = await this.getTabGroups();
        
        // Check if group name already exists
        const existingGroupIndex = tabGroups.findIndex(group => group.groupName === groupName);
        
        // Get current open tabs
        const openTabs = await this.getOpenTabs();
        
        // Create new tab group
        const newTabGroup: TabGroup = {
            groupName,
            files: openTabs,
            createdAt: new Date().toISOString(),
            lastUsed: new Date().toISOString()
        };
        
        // Update or add the tab group
        if (existingGroupIndex !== -1) {
            tabGroups[existingGroupIndex] = newTabGroup;
        } else {
            tabGroups.push(newTabGroup);
        }
        
        // Save updated tab groups
        await this.storageService.saveTabGroups(tabGroups);
        
        return newTabGroup;
    }
    
    /**
     * Load a tab group
     */
    public async loadTabGroup(groupName: string): Promise<void> {
        const tabGroups = await this.getTabGroups();
        const tabGroup = tabGroups.find(group => group.groupName === groupName);
        
        if (!tabGroup) {
            throw new Error(`Tab group '${groupName}' not found`);
        }
        
        // Update last used timestamp
        tabGroup.lastUsed = new Date().toISOString();
        await this.storageService.saveTabGroups(tabGroups);
        
        // Open all files in the tab group
        for (const filePath of tabGroup.files) {
            try {
                const document = await vscode.workspace.openTextDocument(filePath);
                await vscode.window.showTextDocument(document, { preview: false });
            } catch (error) {
                console.error(`Error opening file: ${filePath}`, error);
                // Continue opening other files even if one fails
            }
        }
    }
    
    /**
     * Delete a tab group
     */
    public async deleteTabGroup(groupName: string): Promise<void> {
        const tabGroups = await this.getTabGroups();
        const updatedTabGroups = tabGroups.filter(group => group.groupName !== groupName);
        
        if (tabGroups.length === updatedTabGroups.length) {
            throw new Error(`Tab group '${groupName}' not found`);
        }
        
        await this.storageService.saveTabGroups(updatedTabGroups);
    }
    
    /**
     * Rename a tab group
     */
    public async renameTabGroup(oldName: string, newName: string): Promise<void> {
        const tabGroups = await this.getTabGroups();
        const tabGroup = tabGroups.find(group => group.groupName === oldName);
        
        if (!tabGroup) {
            throw new Error(`Tab group '${oldName}' not found`);
        }
        
        // Check if new name already exists
        if (tabGroups.some(group => group.groupName === newName)) {
            throw new Error(`Tab group '${newName}' already exists`);
        }
        
        tabGroup.groupName = newName;
        await this.storageService.saveTabGroups(tabGroups);
    }
    
    /**
     * Set a tab group as the default
     */
    public async setDefaultTabGroup(groupName: string): Promise<void> {
        const tabGroups = await this.getTabGroups();
        
        // Remove default flag from all groups
        tabGroups.forEach(group => {
            group.isDefault = false;
        });
        
        // Set default flag for the specified group
        const tabGroup = tabGroups.find(group => group.groupName === groupName);
        if (!tabGroup) {
            throw new Error(`Tab group '${groupName}' not found`);
        }
        
        tabGroup.isDefault = true;
        await this.storageService.saveTabGroups(tabGroups);
    }
    
    /**
     * Get the default tab group
     */
    public async getDefaultTabGroup(): Promise<TabGroup | undefined> {
        const tabGroups = await this.getTabGroups();
        return tabGroups.find(group => group.isDefault);
    }
    
    /**
     * Auto-save current tabs
     */
    public async autoSaveCurrentTabs(): Promise<void> {
        const settings = this.storageService.getSettings();
        
        if (settings.autoSaveOnClose) {
            await this.saveCurrentTabs('Auto-saved Tabs');
        }
    }
    
    /**
     * Auto-restore default tab group
     */
    public async autoRestoreDefaultTabGroup(): Promise<void> {
        const settings = this.storageService.getSettings();
        
        if (settings.autoRestoreDefault) {
            const defaultGroup = await this.getDefaultTabGroup();
            
            if (defaultGroup) {
                await this.loadTabGroup(defaultGroup.groupName);
            }
        }
    }
    
    /**
     * Get currently open tabs
     */
    private async getOpenTabs(): Promise<string[]> {
        const openTabs: string[] = [];
        
        vscode.window.tabGroups.all.forEach(tabGroup => {
            tabGroup.tabs.forEach(tab => {
                if (tab.input instanceof vscode.TabInputText) {
                    openTabs.push(tab.input.uri.fsPath);
                }
            });
        });
        
        return openTabs;
    }
}
