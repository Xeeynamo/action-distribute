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
function checkCommonErrors(log) {
    return log.indexOf('fail:') >= 0 ||
        log.indexOf('Aborting') >= 0 ||
        log.indexOf('error:') >= 0 ||
        log.indexOf('fatal:') >= 0;
}
function call(command, callback) {
    return new Promise((resolve, _) => child_process_1.exec(command, (err, stdout, stderr) => {
        const result = callback(stdout);
        if (!result)
            core.error(`Command ${command} failed with the following output:\n${stdout}`);
        resolve(result);
    }));
}
function createBranch(name) {
    return call(`git checkout -B ${name}`, stdout => {
        if (stdout.indexOf("Switched to a new branch") == 0)
            return true;
        if (stdout.indexOf("Reset branch") == 0)
            return true;
        if (stdout.indexOf("error:") == 0)
            return false;
        if (stdout.indexOf("fatal:") == 0)
            return false;
        return false;
    });
}
exports.createBranch = createBranch;
function commit(message) {
    return call(`git commit -m "${message}"`, stdout => {
        if (stdout.indexOf("create mode") >= 0)
            return true;
        if (stdout.indexOf("Aborting") == 0 ||
            stdout.indexOf("error") == 0 ||
            stdout.indexOf("fatal") == 0)
            return false;
        return false;
    });
}
exports.commit = commit;
function push(branchName) {
    return call(`git push --set-upstream origin ${branchName}`, stdout => {
        return checkCommonErrors(stdout);
    });
}
exports.push = push;
function removeOrigin() {
    return call(`git remote rm origin`, stdout => {
        return checkCommonErrors(stdout);
    });
}
exports.removeOrigin = removeOrigin;
function addOrigin(url) {
    return call(`git remote add origin ${url}`, stdout => {
        return checkCommonErrors(stdout);
    });
}
exports.addOrigin = addOrigin;
function setAuthorName(name) {
    return call(`git config --global user.name "${name}"`, stdout => {
        return checkCommonErrors(stdout);
    });
}
exports.setAuthorName = setAuthorName;
function setAuthorEmail(email) {
    return call(`git config --global user.email "${email}"`, stdout => {
        return checkCommonErrors(stdout);
    });
}
exports.setAuthorEmail = setAuthorEmail;
function npmInstall() {
    return call(`npm install`, stdout => {
        return checkCommonErrors(stdout);
    });
}
exports.npmInstall = npmInstall;
function tsc() {
    return call(`./node_modules/.bin/tsc`, stdout => {
        return true;
    });
}
exports.tsc = tsc;
function installNcc() {
    return call(`npm i -g npx zeit/ncc`, (stdout) => {
        return checkCommonErrors(stdout);
    });
}
exports.installNcc = installNcc;
function ncc(path) {
    return call(`npx ncc ${path}`, (stdout) => {
        return checkCommonErrors(stdout);
    });
}
exports.ncc = ncc;
