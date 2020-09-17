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

    console.log(`${JSON.stringify(this.rl)}`);

    // trap events
    this.rl.on('line', (input: string) => {
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
  private defOnLineCB(inp: string) {};

  /**
   * Default close event handler
   */
  private defOnCloseCB() {};

  /**
   * Default pause/resume event handlers
   * @param isPaused True if paused, false if resumed
   */
  private defOnPauseResumeCB(isPaused: boolean) {};

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
    this.onPauseResumeCB = this.defOnPauseResumeCB;
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

      console.log('');

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
          console.log(`${item.key.padEnd(maxKeyLen, ' ')}${item.text}`);
        });
      }

      // build prompt
      let prompt: string = '';

      if (inp.defaultValue !== '') {
        prompt = `${inp.prompt} [default: ${inp.defaultValue}] > `;
      } else {
        prompt = `${inp.prompt} > `;
      }

      this.rl.setPrompt(prompt);
      this.rl.prompt();
    });
  }

  /**
   * Get input and then check if input in valid or invalid
   * @param inp PromptInput
   */
  private async getInputCheck(inp: PromptInput): Promise<PromptResult> {
    let stayLoop: boolean = true;
    let res: PromptResult;
    let errMsg: string = '';

    while (stayLoop) {
      // reset CBs
      this.setDefaultCBs();

      // get input
      res = await this.getInput(inp);

      // determine if there is a prompt list
      const hasPromptList: boolean = inp.promptList ? inp.promptList.length > 0 ? true : false : false;

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
        const inputVal: string = res.enteredValue.toLowerCase();

        // validate the entered value is one of the list
        const found: boolean = inp.promptList!.some((inpItem: PromptItem): boolean => {
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
    } else {
      return res!;
    }
  }

  /**
   * Single prompt
   * @param inp PromptInput
   */
  public async prompt(inp: PromptInput): Promise<PromptResult> {
    return this.prompts([inp]).then((res: PromptResult[]) => {
      return res[0];
    });
  }

  /**
   * Multiple prompts
   * @param inps PromptInput[]
   */
  public async prompts(inps: PromptInput[]): Promise<PromptResult[]> {
    return new Promise((resolve, reject) => {
      // invalid input
      if (!inps || inps.length === 0) {
        reject(new Error(`Invalid parameters`));
        return;
      }

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

          return this.getInputCheck(cur);
        });
      }, Promise.resolve(initRes)).then((inpRes: PromptResult) => {
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
  }
}

// private prompt module
let prompt: PromptImpl; // = new PromptImpl();

/**
 * Prompt module definition
 */
export interface Prompt {
  prompt: (inp: PromptInput) => Promise<PromptResult>;
  prompts: (inps: PromptInput[]) => Promise<PromptResult[]>;
}

/**
 * Implementation of prompt module
 */
const prompter: Prompt = {
  prompt: async (inp: PromptInput): Promise<PromptResult> => {
    if (inp) {
      prompt = new PromptImpl();
      return prompt.prompt(inp);
    } else {
      throw new Error(`Invalid PromptInput`);
    }
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