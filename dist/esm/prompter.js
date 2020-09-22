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
        // trap events
        this.rl.on('line', (input) => {
            this.onLineCB(input);
        }).on('close', () => {
            this.onCloseCB();
        }).on('SIGTSTP', () => {
            this.onInterruptedCB('SIGTSTP');
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
                // spacing
                let promptText = `\n`;
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
                        // prompt list
                        promptText += `${item.key.padEnd(maxKeyLen, ' ')}${item.text}\n`;
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
                promptText += prompt;
                this.rl.setPrompt(promptText);
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
            let res;
            let errMsg = '';
            // ingoring JEST coverage warning here
            while (true) {
                // reset CBs
                this.setDefaultCBs();
                // get input
                //console.log(`${Date.now().toString()}::getInput(): input: ${JSON.stringify(inp)}`);
                res = yield this.getInput(inp);
                // determine if there is a prompt list
                const hasPromptList = inp.promptList ? inp.promptList.length > 0 ? true : false : false;
                // figure out if we need to keep looping (if user entered invalid option for list)
                if (inp.endIfEmpty && res.enteredValue === '') {
                    // exit error since user input nothing
                    errMsg = `User did not enter value`;
                    break;
                }
                if (inp.defaultValue !== '' && res.enteredValue === '' && inp.allowEmptyValue) {
                    // ok to not enter any input since there is default value
                    res.enteredValue = inp.defaultValue;
                    break;
                }
                // non-list prompt
                if (!hasPromptList) {
                    // has input
                    if (res.enteredValue !== '') {
                        break;
                    }
                    // no input but empty string allowed
                    if (inp.allowEmptyValue && res.enteredValue === '') {
                        break;
                    }
                }
                if (hasPromptList) {
                    // determine "enteredValue"
                    if (res.enteredValue === '' && inp.defaultValue !== '') {
                        // use default value
                        res.enteredValue = inp.defaultValue;
                    }
                    // lowercase for comparison
                    const inputVal = res.enteredValue.toLowerCase();
                    // validate the entered value is one of the list
                    const found = inp.promptList.some((inpItem) => {
                        return inpItem.key.toLowerCase() === inputVal;
                    });
                    if (found) {
                        // user entered one of the options
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
     * Multiple prompts
     * @param inps PromptInput[]
     */
    prompts(inps) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
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
                        //console.log(`${Date.now().toString()}::prompts(): input: ${JSON.stringify(cur)}`);
                        return this.getInputCheck(cur);
                    });
                }, Promise.resolve(initRes)).then((inpRes) => {
                    // last item (not checking for initRes since prompter.prompts() and .prompt() check for valid parameter)
                    res.push(inpRes);
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
const prompt = new PromptImpl();
/**
 * Implementation of prompt module
 */
const prompter = {
    init: () => { },
    prompt: (inp) => __awaiter(void 0, void 0, void 0, function* () {
        // no null/undefined check as we are forcing null check with tsconfig.json
        return prompt.prompts([inp]).then((res) => {
            return res[0];
        });
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
