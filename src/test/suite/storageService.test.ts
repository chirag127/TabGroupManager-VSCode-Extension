import * as assert from 'assert';
import * as vscode from 'vscode';
import { StorageService } from '../../services/storageService';
import { TabGroup, TabGroupSettings, StorageKeys } from '../../models/tabGroup';

suite('StorageService Test Suite', () => {
    let storageService: StorageService;
    let mockContext: vscode.ExtensionContext;
    
    // Mock tab groups for testing
    const mockTabGroups: TabGroup[] = [
        {
            groupName: 'Test Group 1',
            files: ['/path/to/file1.ts', '/path/to/file2.ts'],
            createdAt: new Date().toISOString(),
            lastUsed: new Date().toISOString()
        },
        {
            groupName: 'Test Group 2',
            files: ['/path/to/file3.ts', '/path/to/file4.ts'],
            createdAt: new Date().toISOString(),
            lastUsed: new Date().toISOString()
        }
    ];
    
    // Mock settings for testing
    const mockSettings: TabGroupSettings = {
        autoSaveOnClose: true,
        autoRestoreDefault: true,
        storageLocation: 'global'
    };
    
    // Mock storage for testing
    const mockStorage: { [key: string]: any } = {
        [StorageKeys.TAB_GROUPS]: mockTabGroups,
        [StorageKeys.SETTINGS]: mockSettings
    };
    
    setup(() => {
        // Create mock context
        mockContext = {
            globalState: {
                get: (key: string) => mockStorage[key],
                update: async (key: string, value: any) => { mockStorage[key] = value; }
            },
            workspaceState: {
                get: (key: string) => mockStorage[key],
                update: async (key: string, value: any) => { mockStorage[key] = value; }
            },
            subscriptions: []
        } as unknown as vscode.ExtensionContext;
        
        // Create storage service with mock context
        storageService = new StorageService(mockContext);
    });
    
    test('getTabGroups should return all tab groups', async () => {
        const tabGroups = await storageService.getTabGroups();
        assert.strictEqual(tabGroups.length, 2);
        assert.strictEqual(tabGroups[0].groupName, 'Test Group 1');
        assert.strictEqual(tabGroups[1].groupName, 'Test Group 2');
    });
    
    test('saveTabGroups should update tab groups in storage', async () => {
        const newTabGroups: TabGroup[] = [
            {
                groupName: 'New Group',
                files: ['/path/to/new/file.ts'],
                createdAt: new Date().toISOString(),
                lastUsed: new Date().toISOString()
            }
        ];
        
        await storageService.saveTabGroups(newTabGroups);
        const tabGroups = await storageService.getTabGroups();
        assert.strictEqual(tabGroups.length, 1);
        assert.strictEqual(tabGroups[0].groupName, 'New Group');
    });
    
    test('getSettings should return settings', () => {
        const settings = storageService.getSettings();
        assert.strictEqual(settings.autoSaveOnClose, true);
        assert.strictEqual(settings.autoRestoreDefault, true);
        assert.strictEqual(settings.storageLocation, 'global');
    });
    
    test('saveSettings should update settings in storage', async () => {
        const newSettings: TabGroupSettings = {
            autoSaveOnClose: false,
            autoRestoreDefault: false,
            storageLocation: 'workspace'
        };
        
        await storageService.saveSettings(newSettings);
        const settings = storageService.getSettings();
        assert.strictEqual(settings.autoSaveOnClose, false);
        assert.strictEqual(settings.autoRestoreDefault, false);
        assert.strictEqual(settings.storageLocation, 'workspace');
    });
});
