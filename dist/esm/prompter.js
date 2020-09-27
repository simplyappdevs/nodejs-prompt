var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/**
 * Node imports
 */
import readline from 'readline';
/**
 * Module to prompt input fron user. Supports 1-n prompt
 */
var PromptImpl = /** @class */ (function () {
    /**
     * Constructor
     */
    function PromptImpl() {
        var _this = this;
        // create interface
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        // trap events
        this.rl.on('line', function (input) {
            _this.onLineCB(input);
        }).on('close', function () {
            _this.onCloseCB();
        }).on('SIGTSTP', function () {
            _this.onInterruptedCB('SIGTSTP');
        });
        // default cb
        this.setDefaultCBs();
    }
    /**
     * Default line event handler
     * @param inp Input from stdin
     */
    PromptImpl.prototype.defOnLineCB = function (inp) { };
    ;
    /**
     * Default close event handler
     */
    PromptImpl.prototype.defOnCloseCB = function () { };
    ;
    /**
     * Default interrupted event handler
     * @param type Type of interruption SIGTSTP, SIGINT, SIGCONT
     */
    PromptImpl.prototype.defOnInterruptedCB = function (type) { };
    ;
    /**
     * Sets default calbacks
     */
    PromptImpl.prototype.setDefaultCBs = function () {
        this.onLineCB = this.defOnLineCB;
        this.onCloseCB = this.defOnCloseCB;
        this.onInterruptedCB = this.defOnInterruptedCB;
    };
    /**
     * Get input
     * @param inp PromptInput
     */
    PromptImpl.prototype.getInput = function (inp) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        // return value
                        var retVal = __assign(__assign({}, inp), { enteredValue: '' });
                        _this.onLineCB = function (line) {
                            retVal.enteredValue = line;
                            resolve(retVal);
                        };
                        _this.onCloseCB = function () {
                            reject(new Error("Stream closed"));
                        };
                        _this.onInterruptedCB = function (type) {
                            reject(new Error("Stream interrupted: " + type));
                        };
                        // spacing
                        var promptText = '\n';
                        // display list if any
                        if (inp.promptList && inp.promptList.length > 0) {
                            // figure out the longest key
                            var maxKeyItem = inp.promptList.reduce(function (prvItem, curItem) {
                                if (curItem.key.length > prvItem.key.length) {
                                    return curItem;
                                }
                                else {
                                    return prvItem;
                                }
                            }, inp.promptList[0]);
                            // max key length - we'll use it to separate between key and text
                            var maxKeyLen_1 = maxKeyItem.key.length + 3;
                            // reduce to build options
                            promptText = inp.promptList.reduce(function (prev, cur) {
                                return "" + prev + cur.key.padEnd(maxKeyLen_1, ' ') + cur.text + "\n";
                            }, inp.promptListTitle ? "\n" + inp.promptListTitle + "\n" : '\n');
                            // append \n
                            promptText += '\n';
                        }
                        // build prompt
                        var prompt = '';
                        if (inp.defaultValue !== '') {
                            prompt = inp.prompt + " [default: " + inp.defaultValue + "] > ";
                        }
                        else {
                            prompt = inp.prompt + " > ";
                        }
                        promptText += prompt;
                        _this.rl.setPrompt(promptText);
                        _this.rl.prompt();
                    })];
            });
        });
    };
    /**
     * Get input and then check if input in valid or invalid
     * @param inp PromptInput
     */
    PromptImpl.prototype.getInputCheck = function (inp) {
        return __awaiter(this, void 0, void 0, function () {
            var res, errMsg;
            var _this = this;
            return __generator(this, function (_a) {
                errMsg = '';
                // reset CBs
                this.setDefaultCBs();
                // get input
                return [2 /*return*/, this.getInput(inp).then(function (res) {
                        // determine if there is a prompt list
                        var hasPromptList = inp.promptList ? inp.promptList.length > 0 ? true : false : false;
                        // figure out if we need to keep looping (if user entered invalid option for list)
                        if (inp.endIfEmpty && res.enteredValue === '') {
                            // exit error since user input nothing
                            throw new Error("User did not enter value");
                        }
                        if (inp.defaultValue !== '' && res.enteredValue === '' && inp.allowEmptyValue) {
                            // ok to not enter any input since there is default value
                            res.enteredValue = inp.defaultValue;
                            return res;
                        }
                        // non-list prompt
                        if (!hasPromptList) {
                            // has input
                            if (res.enteredValue !== '') {
                                return res;
                            }
                            if (inp.allowEmptyValue && res.enteredValue === '') {
                                // no input but empty string allowed
                                return res;
                            }
                        }
                        if (hasPromptList) {
                            // determine "enteredValue"
                            if (res.enteredValue === '' && inp.defaultValue !== '') {
                                // use default value
                                res.enteredValue = inp.defaultValue;
                            }
                            // lowercase for comparison
                            var inputVal_1 = res.enteredValue.toLowerCase();
                            // validate the entered value is one of the list
                            var found = inp.promptList.some(function (inpItem) {
                                return inpItem.key.toLowerCase() === inputVal_1;
                            });
                            if (found) {
                                // user entered one of the options
                                return res;
                            }
                        }
                        // falls here means value is not valid - just recurse
                        return _this.getInputCheck(inp);
                    })];
            });
        });
    };
    /**
     * Multiple prompts
     * @param inps PromptInput[]
     */
    PromptImpl.prototype.prompts = function (inps) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        // result
                        var res = [];
                        var dummyID = '--INITPROMISE--';
                        var initRes = { id: dummyID };
                        // Reductive Promise Chain
                        inps.reduce(function (prev, cur) {
                            return prev.then(function (inpRes) {
                                if (inpRes.id !== dummyID) {
                                    res.push(inpRes);
                                }
                                //console.log(`${Date.now().toString()}::prompts(): input: ${JSON.stringify(cur)}`);
                                return _this.getInputCheck(cur);
                            });
                        }, Promise.resolve(initRes)).then(function (inpRes) {
                            // last item (not checking for initRes since prompter.prompts() and .prompt() check for valid parameter)
                            res.push(inpRes);
                            // pause stdin
                            _this.rl.pause();
                            resolve(res);
                        }).catch(function (err) {
                            // pause stdin
                            _this.rl.pause();
                            reject(err);
                        });
                    })];
            });
        });
    };
    return PromptImpl;
}());
// private prompt module
var prompt = new PromptImpl();
/**
 * Implementation of prompt module
 */
export var prompter = {
    init: function () { },
    prompt: function (inp) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // no null/undefined check as we are forcing null check with tsconfig.json
            return [2 /*return*/, prompt.prompts([inp]).then(function (res) {
                    return res[0];
                })];
        });
    }); },
    prompts: function (inps) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (inps && inps.length > 0) {
                return [2 /*return*/, prompt.prompts(inps)];
            }
            else {
                throw new Error("Invalid PromptInput[]");
            }
            return [2 /*return*/];
        });
    }); }
};
// export
export default prompter;
