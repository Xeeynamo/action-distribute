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
            core.debug(stdout)
            if (!result)
                core.error(`Command ${command} failed with the following output:\n${stderr}`)
            else
                core.info(stderr)

            core.endGroup()
            resolve(result)
        }))
}

export function createBranch(name: string): Promise<boolean> {
    return call(`git checkout -B ${name}`)
}

export function createOrphanBranch(name: string): Promise<boolean> {
    return call(`git checkout --orphan ${name}`)
}

export function gitAdd(content: string): Promise<boolean> {
    return call(`git add ${content}`)
}

export function gitReset(content: string): Promise<boolean> {
    return call(`git reset ${content}`)
}

export function commit(message: string): Promise<boolean> {
    return call(`git commit -m "${message}"`)
}

export function push(branchName: string): Promise<boolean> {
    return call(`git push --set-upstream origin ${branchName}`)
}

export function pushToRepository(repositoryUri: string, branchName: string): Promise<boolean> {
    return call(`git push ${repositoryUri} ${branchName}`)
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

export function installNpmDevPackage(packageName: string): Promise<boolean> {
    return call(`npm install ${packageName} --save-dev`)
}

export function nccBuild(path: string): Promise<boolean> {
    return call(`./node_modules/.bin/ncc build ${path}`)
}