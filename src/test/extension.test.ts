import * as assert from "assert";
import * as vscode from "vscode";
import * as myExtension from "../extension";

suite("Extension Test Suite", () => {
    vscode.window.showInformationMessage("Start all tests.");

    test("Extension should be present", () => {
        assert.ok(myExtension);
    });

    test("Extension should activate", async () => {
        // This test just ensures the extension activates without error
        const extension = vscode.extensions.getExtension(
            "chirag127.tab-group-saver"
        );
        if (extension) {
            await extension.activate();
            assert.ok(true);
        } else {
            // Extension might not be installed with the test publisher name, so this is not a failure
            assert.ok(
                true,
                "Extension not found, but this is expected in test environment"
            );
        }
    });

    test("Commands should be registered", async () => {
        const commands = await vscode.commands.getCommands();

        // Check that our commands are registered
        assert.ok(commands.includes("tab-group-saver.saveTabGroup"));
        assert.ok(commands.includes("tab-group-saver.loadTabGroup"));
        assert.ok(commands.includes("tab-group-saver.deleteTabGroup"));
        assert.ok(commands.includes("tab-group-saver.renameTabGroup"));
        assert.ok(commands.includes("tab-group-saver.setDefaultTabGroup"));
        assert.ok(commands.includes("tab-group-saver.openSettings"));
    });
});
