"use strict";
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
const greetings = __importStar(require("./greetings"));
try {
    const nameToGreet = core.getInput("who-to-greet");
    core.startGroup('getGreeting group...');
    const greeting = greetings.getGreeting(nameToGreet);
    core.endGroup();
    core.exportVariable('CI', "true");
    console.log(greeting);
    core.setOutput('greeting', greeting);
    console.log("I am logging from console");
    console.warn("I am warning from console");
    core.debug("I am logging from core.debug");
    core.info("I am logging from core.info");
    core.warning("I am logging from core.warning");
    const context = JSON.stringify(github.context, undefined, 2);
    console.log(`Context: ${context}`);
}
catch (error) {
    core.setFailed(`Failed for the following reason: ${error.message}`);
}
