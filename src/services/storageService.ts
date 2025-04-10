import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { TabGroup, StorageKeys, TabGroupSettings } from '../models/tabGroup';

/**
 * Service for handling storage of tab groups
 */
export class StorageService {
    private context: vscode.ExtensionContext;
    private settings: TabGroupSettings;
    
    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.settings = this.getSettings();
    }
    
    /**
     * Get all saved tab groups
     */
    public async getTabGroups(): Promise<TabGroup[]> {
        switch (this.settings.storageLocation) {
            case 'global':
                return this.getFromGlobalState();
            case 'workspace':
                return this.getFromWorkspaceState();
            case 'file':
                return this.getFromFile();
            default:
                return this.getFromGlobalState();
        }
    }
    
    /**
     * Save tab groups
     */
    public async saveTabGroups(tabGroups: TabGroup[]): Promise<void> {
        switch (this.settings.storageLocation) {
            case 'global':
                await this.saveToGlobalState(tabGroups);
                break;
            case 'workspace':
                await this.saveToWorkspaceState(tabGroups);
                break;
            case 'file':
                await this.saveToFile(tabGroups);
                break;
            default:
                await this.saveToGlobalState(tabGroups);
        }
    }
    
    /**
     * Get extension settings
     */
    public getSettings(): TabGroupSettings {
        const defaultSettings: TabGroupSettings = {
            autoSaveOnClose: false,
            autoRestoreDefault: false,
            storageLocation: 'global'
        };
        
        const savedSettings = this.context.globalState.get<TabGroupSettings>(StorageKeys.SETTINGS);
        return { ...defaultSettings, ...savedSettings };
    }
    
    /**
     * Save extension settings
     */
    public async saveSettings(settings: TabGroupSettings): Promise<void> {
        this.settings = settings;
        await this.context.globalState.update(StorageKeys.SETTINGS, settings);
    }
    
    /**
     * Get tab groups from global state
     */
    private getFromGlobalState(): TabGroup[] {
        return this.context.globalState.get<TabGroup[]>(StorageKeys.TAB_GROUPS) || [];
    }
    
    /**
     * Save tab groups to global state
     */
    private async saveToGlobalState(tabGroups: TabGroup[]): Promise<void> {
        await this.context.globalState.update(StorageKeys.TAB_GROUPS, tabGroups);
    }
    
    /**
     * Get tab groups from workspace state
     */
    private getFromWorkspaceState(): TabGroup[] {
        return this.context.workspaceState.get<TabGroup[]>(StorageKeys.TAB_GROUPS) || [];
    }
    
    /**
     * Save tab groups to workspace state
     */
    private async saveToWorkspaceState(tabGroups: TabGroup[]): Promise<void> {
        await this.context.workspaceState.update(StorageKeys.TAB_GROUPS, tabGroups);
    }
    
    /**
     * Get tab groups from file
     */
    private getFromFile(): TabGroup[] {
        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                return [];
            }
            
            const rootPath = workspaceFolders[0].uri.fsPath;
            const filePath = path.join(rootPath, '.tabgroups.json');
            
            if (!fs.existsSync(filePath)) {
                return [];
            }
            
            const fileContent = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(fileContent);
        } catch (error) {
            console.error('Error reading tab groups from file:', error);
            return [];
        }
    }
    
    /**
     * Save tab groups to file
     */
    private async saveToFile(tabGroups: TabGroup[]): Promise<void> {
        try {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                throw new Error('No workspace folder open');
            }
            
            const rootPath = workspaceFolders[0].uri.fsPath;
            const filePath = path.join(rootPath, '.tabgroups.json');
            
            const fileContent = JSON.stringify(tabGroups, null, 2);
            fs.writeFileSync(filePath, fileContent, 'utf8');
        } catch (error) {
            console.error('Error saving tab groups to file:', error);
            throw error;
        }
    }
}
