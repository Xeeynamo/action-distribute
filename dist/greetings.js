"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getGreeting(whoToGreet) {
    if (!whoToGreet || whoToGreet == "")
        whoToGreet = "world";
    return `Hello ${whoToGreet}!`;
}
exports.getGreeting = getGreeting;
