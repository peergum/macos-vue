import {extendCommands, terminal} from "@/terminal.js";
import {commandList, dirTree, MacOSDefinitions, systemOptions} from "@/types.js";
import {assert, test, vi} from "vitest";

const echo = (args: string[]): string => {
    return args.join(' ') + "\n";
}

test('extend terminal commands', async () => {
    const testCommands: commandList = {
        "echo": [echo, "[text]", "echoes text"],
    }
    extendCommands(testCommands)
    const system: systemOptions = {
        dir: {},
        user: 'testuser',
        host: 'testhost',
        fullname: 'test full name',
        initials: 'TI',
    }
    const t = new terminal(system, 0)
    assert.containsAllKeys(t.commands, testCommands, "all commands added");
    t.typingBuffer = 'echo Hello world'
    t.buffer = '';
    await t.exec()
    assert.match(t.buffer, /\nHello world\n/, "echo works")
})

test('check base commands work', async() => {
    const system: systemOptions = {
        dir: {
            files: {
                "test_file": {
                    path: "/tests/test_file",
                    mod: 345,
                    owner: 'tester:testlab',
                },
                "test_dir": {
                    files: {
                        "file_1": {path:"/x"},
                        "file_2": {path:"/x"},
                        "file_3": {path:"/x"},
                    },
                    owner: 'root:admin',
                }
            }
        },
        user: 'testuser',
        host: 'testhost',
        fullname: 'test full name',
        initials: 'TI',
    }
    const testCommands: commandList = {
        "echo": [echo, "[text]", "echoes text"],
    }
    extendCommands(testCommands)

    const t = new terminal(system, 0)

    t.typingBuffer = 'ls'
    t.buffer = '';
    await t.exec()
    assert.match(t.buffer, /ls\n<span style="color:[^"]+">test_dir<[/]span> test_file\n\n/, "ls works")

    t.typingBuffer = 'ls test_file'
    t.buffer = '';
    await t.exec()
    assert.match(t.buffer, /ls test_file\ntest_file\n\n/, "ls file works")

    t.typingBuffer = 'ls -l test_file'
    t.buffer = '';
    await t.exec()
    assert.match(t.buffer, /--wxr--r-x 1 tester       testlab  test_file/, "ls -l file works")

    t.typingBuffer = 'ls -l'
    t.buffer = '';
    await t.exec()
    assert.match(t.buffer, /drwxr-x--- 2 root         admin    <span style="color:[^"]+">test_dir<[/]span>/, "ls -l dir shows default permissions")

    t.typingBuffer = 'ls -l test_dir/file_1'
    t.buffer = '';
    await t.exec()
    assert.match(t.buffer, /-rw-r----- 1 testuser     staff    test_dir[/]file_1/, "ls -l file shows default permissions")

    t.typingBuffer = 'cd test_dir'
    t.buffer = '';
    await t.exec()
    assert.match(t.buffer, / test_dir%/, "test cd and prompt change")

    t.typingBuffer = 'cd ../test_dir'
    t.buffer = '';
    await t.exec()
    assert.match(t.buffer, / test_dir%/, "test ..")

    t.typingBuffer = 'cd'
    t.buffer = '';
    await t.exec()
    assert.match(t.buffer, / ~%/, "test cd home and prompt change")

    t.typingBuffer = 'help'
    t.buffer = '';
    await t.exec()
    assert.match(t.buffer, /Available commands: cd, cat, clear, echo, help, history, ls, pwd\n/, "test help command list")

    t.typingBuffer = 'pwd'
    t.buffer = '';
    await t.exec()
    assert.match(t.buffer, /[/]home[/]testuser\n/, "test pwd")

    t.typingBuffer = 'cat test_file'
    t.buffer = '';
    await t.exec()
    assert.match(t.buffer, /This&nbsp;is&nbsp;a&nbsp;test&nbsp;file<br[/]>/, "test cat")

})
