"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const utils = __importStar(require("./gitutils"));
function getLastAuthor() {
    return github.context.payload.head_commit.author;
}
function getRepositorySsh() {
    return github.context.payload.repository.ssh_url;
}
function getGithubToken() {
    return process.env.GITHUB_TOKEN;
}
function getRepositorySshWithToken() {
    const repoUri = getRepositorySsh();
    const token = getGithubToken();
    return repoUri
        .replace('git@', `https://x-access-token:${token}@`)
        .replace('github.com:', 'github.com/');
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            core.exportVariable('CI', "true");
            const distributionBranch = core.getInput("distribution-branch");
            const isTypescript = core.getInput("is-typescript") == 'true';
            const author = getLastAuthor() || {
                email: "actions@github.com",
                name: "Actions",
                username: "actions"
            };
            const result = (yield utils.setAuthorName(author.name)) &&
                (yield utils.setAuthorEmail(author.email)) &&
                (yield utils.removeOrigin()) &&
                (yield utils.addOrigin(getRepositorySshWithToken())) &&
                (yield utils.createOrphanBranch(distributionBranch)) &&
                (yield utils.npmInstall()) &&
                (isTypescript == false || (isTypescript && (yield utils.tsc()))) &&
                (yield utils.installNpmDevPackage('@zeit/ncc')) &&
                (yield utils.nccBuild('./dist')) &&
                (yield utils.gitReset(".")) &&
                (yield utils.gitAdd("action.yml")) &&
                (yield utils.gitAdd("./dist")) &&
                (yield utils.commit("Distribute")) &&
                (yield utils.pushToRepository(getRepositorySshWithToken(), distributionBranch));
            if (result == false)
                core.setFailed("One of the operations has failed.");
        }
        catch (error) {
            core.setFailed(`Failed for the following reason: ${error.message}`);
        }
    });
}
run();
