"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BcryptPasswordHasher = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class BcryptPasswordHasher {
    saltRounds;
    constructor(saltRounds = 10) {
        this.saltRounds = saltRounds;
    }
    async hash(password) {
        return await bcrypt_1.default.hash(password, this.saltRounds);
    }
    async compare(plainText, hash) {
        return await bcrypt_1.default.compare(plainText, hash);
    }
}
exports.BcryptPasswordHasher = BcryptPasswordHasher;
