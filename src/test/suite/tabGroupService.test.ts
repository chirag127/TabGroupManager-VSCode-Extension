import * as assert from 'assert';
import * as vscode from 'vscode';
import { TabGroupService } from '../../services/tabGroupService';
import { TabGroup } from '../../models/tabGroup';

suite('TabGroupService Test Suite', () => {
    let tabGroupService: TabGroupService;
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
    
    // Mock storage for testing
    const mockStorage: { [key: string]: any } = {
        'tabGroups': mockTabGroups
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
        
        // Create tab group service with mock context
        tabGroupService = new TabGroupService(mockContext);
    });
    
    test('getTabGroups should return all tab groups', async () => {
        const tabGroups = await tabGroupService.getTabGroups();
        assert.strictEqual(tabGroups.length, 2);
        assert.strictEqual(tabGroups[0].groupName, 'Test Group 1');
        assert.strictEqual(tabGroups[1].groupName, 'Test Group 2');
    });
    
    test('deleteTabGroup should remove a tab group', async () => {
        await tabGroupService.deleteTabGroup('Test Group 1');
        const tabGroups = await tabGroupService.getTabGroups();
        assert.strictEqual(tabGroups.length, 1);
        assert.strictEqual(tabGroups[0].groupName, 'Test Group 2');
    });
    
    test('renameTabGroup should rename a tab group', async () => {
        await tabGroupService.renameTabGroup('Test Group 2', 'Renamed Group');
        const tabGroups = await tabGroupService.getTabGroups();
        assert.strictEqual(tabGroups.length, 1);
        assert.strictEqual(tabGroups[0].groupName, 'Renamed Group');
    });
    
    test('setDefaultTabGroup should set a tab group as default', async () => {
        await tabGroupService.setDefaultTabGroup('Renamed Group');
        const tabGroups = await tabGroupService.getTabGroups();
        const defaultGroup = await tabGroupService.getDefaultTabGroup();
        assert.strictEqual(defaultGroup?.groupName, 'Renamed Group');
        assert.strictEqual(defaultGroup?.isDefault, true);
    });
});
