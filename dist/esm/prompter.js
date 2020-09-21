var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Node imports
 */
import readline from 'readline';
/**
 * Module to prompt input fron user. Supports 1-n prompt
 */
class PromptImpl {
    /**
     * Constructor
     */
    constructor() {
        // create interface
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        console.log(`${JSON.stringify(this.rl)}`);
        // trap events
        this.rl.on('line', (input) => {
            if (this.onLineCB) {
                this.onLineCB(input);
            }
        }).on('close', () => {
            if (this.onCloseCB) {
                this.onCloseCB();
            }
        }).on('pause', () => {
            if (this.onPauseResumeCB) {
                this.onPauseResumeCB(true);
            }
        }).on('resume', () => {
            if (this.onPauseResumeCB) {
                this.onPauseResumeCB(false);
            }
        }).on('SIGTSTP', () => {
            if (this.onInterruptedCB) {
                this.onInterruptedCB('SIGTSTP');
            }
        });
        // default cb
        this.setDefaultCBs();
    }
    /**
     * Default line event handler
     * @param inp Input from stdin
     */
    defOnLineCB(inp) { }
    ;
    /**
     * Default close event handler
     */
    defOnCloseCB() { }
    ;
    /**
     * Default pause/resume event handlers
     * @param isPaused True if paused, false if resumed
     */
    defOnPauseResumeCB(isPaused) { }
    ;
    /**
     * Default interrupted event handler
     * @param type Type of interruption SIGTSTP, SIGINT, SIGCONT
     */
    defOnInterruptedCB(type) { }
    ;
    /**
     * Sets default calbacks
     */
    setDefaultCBs() {
        this.onLineCB = this.defOnLineCB;
        this.onCloseCB = this.defOnCloseCB;
        this.onPauseResumeCB = this.defOnPauseResumeCB;
        this.onInterruptedCB = this.defOnInterruptedCB;
    }
    /**
     * Get input
     * @param inp PromptInput
     */
    getInput(inp) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                // return value
                const retVal = Object.assign(Object.assign({}, inp), { enteredValue: '' });
                this.onLineCB = (line) => {
                    retVal.enteredValue = line;
                    resolve(retVal);
                };
                this.onCloseCB = () => {
                    reject(new Error(`Stream closed`));
                };
                this.onInterruptedCB = (type) => {
                    reject(new Error(`Stream interrupted: ${type}`));
                };
                console.log('');
                // display list if any
                if (inp.promptList && inp.promptList.length > 0) {
                    // figure out the longest key
                    const maxKeyItem = inp.promptList.reduce((prvItem, curItem) => {
                        if (curItem.key.length > prvItem.key.length) {
                            return curItem;
                        }
                        else {
                            return prvItem;
                        }
                    }, inp.promptList[0]);
                    // max key length - we'll use it to separate between key and text
                    const maxKeyLen = maxKeyItem.key.length + 3;
                    inp.promptList.forEach((item) => {
                        console.log(`${item.key.padEnd(maxKeyLen, ' ')}${item.text}`);
                    });
                }
                // build prompt
                let prompt = '';
                if (inp.defaultValue !== '') {
                    prompt = `${inp.prompt} [default: ${inp.defaultValue}] > `;
                }
                else {
                    prompt = `${inp.prompt} > `;
                }
                this.rl.setPrompt(prompt);
                this.rl.prompt();
            });
        });
    }
    /**
     * Get input and then check if input in valid or invalid
     * @param inp PromptInput
     */
    getInputCheck(inp) {
        return __awaiter(this, void 0, void 0, function* () {
            let stayLoop = true;
            let res;
            let errMsg = '';
            while (stayLoop) {
                // reset CBs
                this.setDefaultCBs();
                // get input
                res = yield this.getInput(inp);
                // determine if there is a prompt list
                const hasPromptList = inp.promptList ? inp.promptList.length > 0 ? true : false : false;
                // figure out if we need to keep looping (if user entered invalid option for list)
                if (res.endIfEmpty && inp.defaultValue === '' && res.enteredValue === '') {
                    // exit error since user input nothing
                    stayLoop = false;
                    errMsg = `User did not enter value`;
                    break;
                }
                if (inp.defaultValue !== '' && res.enteredValue === '') {
                    // ok to not enter any input since there is default value
                    stayLoop = false;
                    res.enteredValue = inp.defaultValue;
                    break;
                }
                if (!hasPromptList && res.enteredValue !== '') {
                    // got input
                    stayLoop = false;
                    break;
                }
                if (hasPromptList && res.enteredValue !== '') {
                    const inputVal = res.enteredValue.toLowerCase();
                    // validate the entered value is one of the list
                    const found = inp.promptList.some((inpItem) => {
                        return inpItem.key.toLowerCase() === inputVal;
                    });
                    if (found) {
                        // user entered one of the options
                        stayLoop = false;
                        break;
                    }
                }
                // otherwise loop
            }
            if (errMsg !== '') {
                throw new Error(errMsg);
            }
            else {
                return res;
            }
        });
    }
    /**
     * Single prompt
     * @param inp PromptInput
     */
    prompt(inp) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prompts([inp]).then((res) => {
                return res[0];
            });
        });
    }
    /**
     * Multiple prompts
     * @param inps PromptInput[]
     */
    prompts(inps) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                // invalid input
                if (!inps || inps.length === 0) {
                    reject(new Error(`Invalid parameters`));
                    return;
                }
                // result
                const res = [];
                const dummyID = '--INITPROMISE--';
                const initRes = { id: dummyID };
                // Reductive Promise Chain
                inps.reduce((prev, cur) => {
                    return prev.then((inpRes) => {
                        if (inpRes.id !== dummyID) {
                            res.push(inpRes);
                        }
                        return this.getInputCheck(cur);
                    });
                }, Promise.resolve(initRes)).then((inpRes) => {
                    // last item
                    if (inpRes.id !== dummyID) {
                        res.push(inpRes);
                    }
                    // pause stdin
                    this.rl.pause();
                    resolve(res);
                }).catch((err) => {
                    // pause stdin
                    this.rl.pause();
                    reject(err);
                });
            });
        });
    }
}
// private prompt module
let prompt; // = new PromptImpl();
/**
 * Implementation of prompt module
 */
const prompter = {
    prompt: (inp) => __awaiter(void 0, void 0, void 0, function* () {
        if (inp) {
            prompt = new PromptImpl();
            return prompt.prompt(inp);
        }
        else {
            throw new Error(`Invalid PromptInput`);
        }
    }),
    prompts: (inps) => __awaiter(void 0, void 0, void 0, function* () {
        if (inps && inps.length > 0) {
            return prompt.prompts(inps);
        }
        else {
            throw new Error(`Invalid PromptInput[]`);
        }
    })
};
// export
export default prompter;
