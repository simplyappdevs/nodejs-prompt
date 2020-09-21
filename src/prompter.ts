/**
 * Node imports
 */
import readline from 'readline';

/**
 * Prompt item definition
 */
export interface PromptItem {
  id: number;                 // ID for this prompt item
  key: string;                // key for this prompt item (what user is expected to enter to select this item)
  text: string;               // display text for the item
}

/**
 * Prompt input information
 */
export interface PromptInput {
  id: string;                 // ID for this prompt (caller can correlate the result)
  prompt: string;             // prompt text to display for user - default to "Enter your selection: "
  promptList?: PromptItem[];  // (optional) array of prompt items
  endIfEmpty: boolean;        // end prompt if user does not select from selection or enter empty response (otherwise prompt will just loop)
  allowEmptyValue: boolean;   // true to accept empty string as valid input when endIfEmpty=false, false will keep looping until value is entered (non list prompt only)
  defaultValue: string;       // default value to return if user does not select from selection or enter empty response
  valueToEndPrompt: string;   // value that user can enter to end the prompt
}

/**
 * Prompt result information
 */
export interface PromptResult extends PromptInput {
  enteredValue: string;      // value entered
}

/**
 * Module to prompt input fron user. Supports 1-n prompt
 */
class PromptImpl {
  // privates
  private rl: readline.Interface;
  private onLineCB!: (line: string) => void;
  private onCloseCB!: () => void;
  private onPauseResumeCB!: (isPaused: boolean) => void;
  private onInterruptedCB!: (type: string) => void;

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
    this.rl.on('line', (input: string) => {
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
  private defOnLineCB(inp: string) {};

  /**
   * Default close event handler
   */
  private defOnCloseCB() {};

  /**
   * Default interrupted event handler
   * @param type Type of interruption SIGTSTP, SIGINT, SIGCONT
   */
  private defOnInterruptedCB(type: string) {};

  /**
   * Sets default calbacks
   */
  private setDefaultCBs() {
    this.onLineCB = this.defOnLineCB;
    this.onCloseCB = this.defOnCloseCB;
    this.onInterruptedCB = this.defOnInterruptedCB;
  }

  /**
   * Get input
   * @param inp PromptInput
   */
  private async getInput(inp: PromptInput): Promise<PromptResult> {
    return new Promise((resolve, reject) => {
      // return value
      const retVal: PromptResult = {...inp, enteredValue: ''};

      this.onLineCB = (line: string) => {
        retVal.enteredValue = line;
        resolve(retVal);
      };

      this.onCloseCB = () => {
        reject(new Error(`Stream closed`));
      };

      this.onInterruptedCB = (type: string) => {
        reject(new Error(`Stream interrupted: ${type}`));
      };

      // spacing
      let promptText: string = `\n`;

      // display list if any
      if (inp.promptList && inp.promptList.length > 0) {
        // figure out the longest key
        const maxKeyItem: PromptItem = inp.promptList.reduce((prvItem: PromptItem, curItem: PromptItem): PromptItem => {
          if (curItem.key.length > prvItem.key.length) {
            return curItem;
          } else {
            return prvItem;
          }
        }, inp.promptList[0]);

        // max key length - we'll use it to separate between key and text
        const maxKeyLen: number = maxKeyItem.key.length + 3;

        inp.promptList.forEach((item: PromptItem) => {
          // prompt list
          promptText += `${item.key.padEnd(maxKeyLen, ' ')}${item.text}\n`;
        });
      }

      // build prompt
      let prompt: string = '';

      if (inp.defaultValue !== '') {
        prompt = `${inp.prompt} [default: ${inp.defaultValue}] > `;
      } else {
        prompt = `${inp.prompt} > `;
      }

      promptText += prompt;

      this.rl.setPrompt(promptText);
      this.rl.prompt();
    });
  }

  /**
   * Get input and then check if input in valid or invalid
   * @param inp PromptInput
   */
  private async getInputCheck(inp: PromptInput): Promise<PromptResult> {
    let res: PromptResult;
    let errMsg: string = '';

    // ingoring JEST coverage warning here
    while (true) {
      // reset CBs
      this.setDefaultCBs();

      // get input
      //console.log(`${Date.now().toString()}::getInput(): input: ${JSON.stringify(inp)}`);
      res = await this.getInput(inp);

      // determine if there is a prompt list
      const hasPromptList: boolean = inp.promptList ? inp.promptList.length > 0 ? true : false : false;

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
        const inputVal: string = res.enteredValue.toLowerCase();

        // validate the entered value is one of the list
        const found: boolean = inp.promptList!.some((inpItem: PromptItem): boolean => {
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
    } else {
      return res!;
    }
  }

  /**
   * Multiple prompts
   * @param inps PromptInput[]
   */
  public async prompts(inps: PromptInput[]): Promise<PromptResult[]> {
    return new Promise((resolve, reject) => {
      // result
      const res: PromptResult[] = [];

      const dummyID: string = '--INITPROMISE--';
      const initRes: PromptResult = { id: dummyID } as any;

      // Reductive Promise Chain
      inps.reduce((prev: Promise<PromptResult>, cur: PromptInput): Promise<PromptResult> => {
        return prev.then((inpRes: PromptResult) => {
          if (inpRes.id !== dummyID) {
            res.push(inpRes);
          }

          //console.log(`${Date.now().toString()}::prompts(): input: ${JSON.stringify(cur)}`);
          return this.getInputCheck(cur);
        });
      }, Promise.resolve(initRes)).then((inpRes: PromptResult) => {
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
  }
}

// private prompt module
const prompt: PromptImpl = new PromptImpl();

/**
 * Prompt module definition
 */
export interface Prompt {
  init: () => void;                                             // intialization function (if needed later)
  prompt: (inp: PromptInput) => Promise<PromptResult>;          // single prompt
  prompts: (inps: PromptInput[]) => Promise<PromptResult[]>;    // 1-n prompts
}

/**
 * Implementation of prompt module
 */
const prompter: Prompt = {
  init: () => {},
  prompt: async (inp: PromptInput): Promise<PromptResult> => {
    // no null/undefined check as we are forcing null check with tsconfig.json
    return prompt.prompts([inp]).then((res: PromptResult[]): PromptResult => {
      return res[0];
    });
  },
  prompts: async (inps: PromptInput[]): Promise<PromptResult[]> => {
    if (inps && inps.length > 0) {
      return prompt.prompts(inps);
    } else {
      throw new Error(`Invalid PromptInput[]`);
    }
  }
};

// export
export default prompter;