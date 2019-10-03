import { exec } from 'child_process'
import * as core from '@actions/core'

function checkCommonErrors(log: string): boolean {
    return true
    // return log.indexOf('fail:') >= 0 ||
    //     log.indexOf('Aborting') >= 0 ||
    //     log.indexOf('error:') >= 0 ||
    //     log.indexOf('fatal:') >= 0
}

function call<T>(command: string, callback: (stdout: string) => T): Promise<T> {
    return new Promise((resolve, _) =>
        exec(command, (err, stdout, stderr) => {
            core.startGroup(command)

            console.log(stdout)
            core.warning(stderr)

            const result = callback(stdout)
            // if (!result)
            //     core.error(`Command ${command} failed with the following output:\nSTDOUT:${stdout}\nSTDERR:${stderr}`)

            core.endGroup()
            resolve(result)
        }))
}

export function printGitVersion(): Promise<void> {
    return call(`git --version`, stdout => {
        console.log(`GIT VERSION:\n${stdout}`)
    })
}

export function createBranch(name: string): Promise<boolean> {
    return call(`git checkout -B ${name}`, stdout => {
        return true

        if (stdout.indexOf("Switched to a new branch") == 0)
            return true
        if (stdout.indexOf("Reset branch") == 0)
            return true
        if (stdout.indexOf("error:") == 0)
            return false
        if (stdout.indexOf("fatal:") == 0)
            return false

        return false
    })
}

export function commit(message: string): Promise<boolean> {
    return call(`git commit -m "${message}"`, stdout => {
        return true

        if (stdout.indexOf("create mode") >= 0)
            return true
        if (stdout.indexOf("Aborting commit") == 0 ||
            stdout.indexOf("error") == 0 ||
            stdout.indexOf("fatal") == 0)
            return false

        return false
    })
}

export function push(branchName: string): Promise<boolean> {
    return call(`git push --set-upstream origin ${branchName}`, stdout => {
        return checkCommonErrors(stdout)
    })
}

export function removeOrigin(): Promise<boolean> {
    return call(`git remote rm origin`, stdout => {
        return checkCommonErrors(stdout)
    })
}

export function addOrigin(url: string): Promise<boolean> {
    return call(`git remote add origin ${url}`, stdout => {
        return checkCommonErrors(stdout)
    })
}

export function setAuthorName(name: string): Promise<boolean> {
    return call(`git config user.name "${name}"`, stdout => {
        return checkCommonErrors(stdout)
    })
}

export function setAuthorEmail(email: string): Promise<boolean> {
    return call(`git config user.email "${email}"`, stdout => {
        return checkCommonErrors(stdout)
    })
}

export function npmInstall(): Promise<boolean> {
    return call(`npm install`, stdout => {
        return checkCommonErrors(stdout)
    })
}

export function tsc(): Promise<boolean> {
    return call(`./node_modules/.bin/tsc`, stdout => {
        return true
    })
}

export function installNcc(): Promise<boolean> {
    return call(`npm i -g npx zeit/ncc`, (stdout: string) => {
        return checkCommonErrors(stdout)
    })
}

export function ncc(path: string): Promise<boolean> {
    return call(`npx ncc ${path}`, (stdout: string) => {
        return checkCommonErrors(stdout)
    })
}