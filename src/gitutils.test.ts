import child_process from 'child_process'
import * as gitutils from './gitutils'

jest.mock("child_process")
jest.mock("@actions/core")

describe('Git utilities', () => {
    const execSpy = jest.spyOn(child_process, 'exec')
    
    beforeEach(() => {
        execSpy.mockReset()
    })

    describe('when creating a new branch', () => {
        [
            { param: "master", expect: "git checkout -B master" },
            { param: "release/v0.01", expect: "git checkout -B release/v0.01" },
            { param: "", expect: "git checkout -B " }
        ].forEach(x => {
            it(`should invoke the correct command when "${x.param}" parameter is passed`, async () => {
                const spy = jest.spyOn(child_process, 'exec')
                spy.mockReset()

                gitutils.createBranch(x.param)

                expect(execSpy).toBeCalledTimes(1)
                expect(spy.mock.calls[0][0]).toBe(x.expect)
            })
        });

        [
            { stderr: "Switched to a new branch 'release/test'", expect: true },
            { stderr: "Switched to a new branch 'something'", expect: true },
            { stderr: "Reset branch 'some-random-branch'", expect: true },
            { stderr: "error: switch `B' requires a value", expect: false },
            { stderr: "fatal: 'invalid name' is not a valid branch name.", expect: false },
            { stderr: "fatal: anything that contains fatal really...", expect: false },
            { stderr: "yep.", expect: true }
        ].forEach(x => {
            it(`should return ${x.expect} if git returns ${x.stderr}`, async () => {
                (child_process.exec as any).mockImplementation((command, callback) =>
                callback(null, "", x.stderr))

                const actual = await gitutils.createBranch("anything")
                expect(actual).toBe(x.expect)
            })
        });
    })
    
    describe('when creating a commit', () => {
        [
            { param: "some text", expect: 'git commit -m "some text"' },
            { param: "char\"", expect: 'git commit -m "char""' },
            { param: "", expect: 'git commit -m ""' }
        ].forEach(x => {
            it(`should invoke the correct command when "${x.param}" parameter is passed`, async () => {
                gitutils.commit(x.param)

                expect(execSpy).toBeCalledTimes(1)
                expect(execSpy.mock.calls[0][0]).toBe(x.expect)
            })
        });

        [
            { stderr: "[master (root-commit) 040f5e2] a\n 1 file changed\n create mode 100644 foo", expect: true },
            { stderr: "Aborting commit due to empty commit message", expect: false },
            { stderr: "yep.", expect: true }
        ].forEach(x => {
            it(`should return ${x.expect} if git returns ${x.stderr}`, async () => {
                (child_process.exec as any).mockImplementation((command, callback) =>
                    callback(null, "", x.stderr))

                const actual = await gitutils.commit("anything")
                expect(actual).toBe(x.expect)
            })
        });
    })
})