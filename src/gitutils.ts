import { exec } from 'child_process'
import * as core from '@actions/core'

function isError(log: string): boolean {
    return log.indexOf('fail:') >= 0 ||
        log.indexOf('Aborting') >= 0 ||
        log.indexOf('error:') >= 0 ||
        log.indexOf('fatal:') >= 0 ||
        log.indexOf('npm ERR!') >= 0 ||
        log.indexOf('command not found:') >= 0
}

function call(command: string, callback?: (stdout: string) => boolean): Promise<boolean> {
    return new Promise((resolve, _) =>
        exec(command, (err, stdout, stderr) => {
            core.startGroup(command)

            const result = callback ? callback(stderr) : !isError(stderr)
            if (!result)
                core.error(`Command ${command} failed with the following output:\n${stderr}`)

            core.endGroup()
            resolve(result)
        }))
}

export function createBranch(name: string): Promise<boolean> {
    return call(`git checkout -B ${name}`)
}

export function commit(message: string): Promise<boolean> {
    return call(`git commit -m "${message}"`)
}

export function push(branchName: string): Promise<boolean> {
    return call(`git push --set-upstream origin ${branchName}`)
}

export function removeOrigin(): Promise<boolean> {
    return call(`git remote rm origin`)
}

export function addOrigin(url: string): Promise<boolean> {
    return call(`git remote add origin ${url}`)
}

export function setAuthorName(name: string): Promise<boolean> {
    return call(`git config user.name "${name}"`)
}

export function setAuthorEmail(email: string): Promise<boolean> {
    return call(`git config user.email "${email}"`)
}

export function npmInstall(): Promise<boolean> {
    return call(`npm install`)
}

export function tsc(): Promise<boolean> {
    return call(`./node_modules/.bin/tsc`)
}

export function installNcc(): Promise<boolean> {
    return call(`npm i -g npx zeit/ncc`)
}

export function ncc(path: string): Promise<boolean> {
    return call(`npx ncc ${path}`)
}