"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const core = __importStar(require("@actions/core"));
function isError(log) {
    return log.indexOf('fail:') >= 0 ||
        log.indexOf('Aborting') >= 0 ||
        log.indexOf('error:') >= 0 ||
        log.indexOf('fatal:') >= 0 ||
        log.indexOf('npm ERR!') >= 0 ||
        log.indexOf('command not found:') >= 0;
}
function call(command, callback) {
    return new Promise((resolve, _) => child_process_1.exec(command, (err, stdout, stderr) => {
        core.startGroup(command);
        const result = callback ? callback(stderr) : !isError(stderr);
        core.debug(stdout);
        if (!result)
            core.error(`Command ${command} failed with the following output:\n${stderr}`);
        else
            core.info(stderr);
        core.endGroup();
        resolve(result);
    }));
}
function createBranch(name) {
    return call(`git checkout -B ${name}`);
}
exports.createBranch = createBranch;
function gitAdd(content) {
    return call(`git add ${content}`);
}
exports.gitAdd = gitAdd;
function commit(message) {
    return call(`git commit -m "${message}"`);
}
exports.commit = commit;
function push(branchName) {
    return call(`git push --set-upstream origin ${branchName}`);
}
exports.push = push;
function pushToRepository(repositoryUri, branchName) {
    return call(`git push ${repositoryUri} ${branchName}`);
}
exports.pushToRepository = pushToRepository;
function removeOrigin() {
    return call(`git remote rm origin`);
}
exports.removeOrigin = removeOrigin;
function addOrigin(url) {
    return call(`git remote add origin ${url}`);
}
exports.addOrigin = addOrigin;
function setAuthorName(name) {
    return call(`git config user.name "${name}"`);
}
exports.setAuthorName = setAuthorName;
function setAuthorEmail(email) {
    return call(`git config user.email "${email}"`);
}
exports.setAuthorEmail = setAuthorEmail;
function npmInstall() {
    return call(`npm install`);
}
exports.npmInstall = npmInstall;
function tsc() {
    return call(`./node_modules/.bin/tsc`);
}
exports.tsc = tsc;
function installNpmDevPackage(packageName) {
    return call(`npm install ${packageName} --save-dev`);
}
exports.installNpmDevPackage = installNpmDevPackage;
function nccBuild(path) {
    return call(`./node_modules/.bin/ncc build ${path}`);
}
exports.nccBuild = nccBuild;
