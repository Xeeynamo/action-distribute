import * as core from '@actions/core'
import * as github from '@actions/github'
import * as utils from './gitutils'

function getLastAuthor(): {
    email: string,
    name: string,
    username: string
} | undefined {
    return (github.context.payload as any).head_commit.author
}

function getRepositorySsh(): string {
    return (github.context.payload.repository as any).ssh_url as string
}

function getGithubToken(): string {
    return (process.env as any).GITHUB_TOKEN as string
}

function getRepositorySshWithToken(): string {
    const repoUri = getRepositorySsh()
    const token = getGithubToken()

    return repoUri
        .replace('git@', `https://x-access-token:${token}@`)
        .replace('github.com:', 'github.com/')
}

async function run() {
    try {
        core.exportVariable('CI', "true")
        const distributionBranch = core.getInput("distribution-branch")
        const isTypescript = core.getInput("is-typescript") == 'true'

        const result =
            await utils.setAuthorName("Test name") &&
            await utils.setAuthorEmail("test@github.com") &&
            await utils.removeOrigin() &&
            await utils.addOrigin(getRepositorySshWithToken()) &&
            await utils.createOrphanBranch(distributionBranch) &&
            await utils.npmInstall() &&
            (isTypescript == false || (isTypescript && await utils.tsc())) &&
            await utils.installNpmDevPackage('@zeit/ncc') &&
            await utils.nccBuild('./dist') &&
            await utils.gitReset(".") &&
            await utils.gitAdd("action.yml") &&
            await utils.gitAdd("./dist") &&
            await utils.commit("Distribute") &&
            await utils.pushToRepository(getRepositorySshWithToken(), distributionBranch)

        if (result == false)
            core.setFailed("One of the operations has failed.")
    } catch (error) {
        core.setFailed(`Failed for the following reason: ${error.message}`)
    }
}

run();