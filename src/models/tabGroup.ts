/**
 * Represents a saved group of tabs
 */
export interface TabGroup {
    /**
     * The name of the tab group
     */
    groupName: string;
    
    /**
     * Array of file paths in the tab group
     */
    files: string[];
    
    /**
     * When the tab group was created
     */
    createdAt: string;
    
    /**
     * When the tab group was last used
     */
    lastUsed: string;
    
    /**
     * Whether this is the default group to restore on startup
     */
    isDefault?: boolean;
}

/**
 * Storage keys used by the extension
 */
export enum StorageKeys {
    TAB_GROUPS = 'tabGroups',
    SETTINGS = 'tabGroupSettings'
}

/**
 * Extension settings
 */
export interface TabGroupSettings {
    /**
     * Whether to auto-save tabs on close
     */
    autoSaveOnClose: boolean;
    
    /**
     * Whether to auto-restore the default group on startup
     */
    autoRestoreDefault: boolean;
    
    /**
     * Storage location preference
     */
    storageLocation: 'global' | 'workspace' | 'file';
}
