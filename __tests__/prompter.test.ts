/**
 * Mocks
 */
jest.mock('readline');

/**
 * NodeJS imports
 */
import readline from 'readline';

/**
 * Mock imports
 */
import {MockReadline, MockInterface} from '../__mocks__/readline';
import {
  inp01,
  inp02,
  inp03,
  inp04,
  inp05,
  inp06,
  inp07
} from './prompt.data';

/**
 * App imports
 */
import prompter, {PromptInput, PromptResult, PromptItem} from '../src/prompter';

/**
 * Returns expected prompt
 * @param inp PromptInput
 */
function buildPrompt(inp: PromptInput): string {
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

  return promptText;
}

/**
 * Container for prompter
 */
describe('prompter', () => {
  const mockRL: MockReadline = readline as any;
  let consoleSpy: jest.SpyInstance;
  let mockRlIF: MockInterface;

  // grab spies
  beforeAll(() => {
    consoleSpy = jest.spyOn(console, "log");
    mockRlIF = mockRL.createInterface();
  });

  beforeEach(() => {
    mockRL.clearMock();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Container for general testing
   */
  describe('general', () => {
    test('should initialize', () => {
      // init prompter
      prompter.init();

      // createInterface should have been called twice (internal to prompter and beforeAll())
      expect(mockRL.createInterface).toBeCalledTimes(2);

      // the last call is in promter and it should pass process.stdin and process.stdout
      expect(mockRL.createInterface).toBeCalledWith({
        input: process.stdin,
        output: process.stdout
      });

      // when prompter initialized, it traps 5 on events
      expect(mockRlIF.on).toBeCalledTimes(3);
    });

    test('should throw error when PromptInput[] is empty', async () => {
      return expect(prompter.prompts([])).rejects.toThrow('Invalid PromptInput[]');
    });
  });

  /**
   * Container for single prompt tests
   */
  describe('single prompt', () => {
    const inp01a: PromptInput = {...inp01, allowEmptyValue: true};

    test(`should return error when enteredValue=[\'\']\n\t[${JSON.stringify(inp01)}]`, async () => {
      // set output
      mockRL.addEvent('line', '');

      // expect a rejection (3 expects)
      expect.assertions(3);

      return prompter.prompt(inp01).catch((err) => {
        expect(mockRlIF.setPrompt).toBeCalledTimes(1);
        expect(mockRlIF.setPrompt).toBeCalledWith(buildPrompt(inp01));
        expect(err.message).toEqual('User did not enter value');
      });
    });

    test(`should return error when enteredValue=[\'\']\n\t[${JSON.stringify(inp01a)}]`, async () => {
      // set output
      mockRL.addEvent('line', '');

      // expect a rejection (3 expects)
      expect.assertions(3);

      return prompter.prompt(inp01a).catch((err) => {
        expect(mockRlIF.setPrompt).toBeCalledTimes(1);
        expect(mockRlIF.setPrompt).toBeCalledWith(buildPrompt(inp01a));
        expect(err.message).toEqual('User did not enter value');
      });
    });

    test(`should return A when enteredValue=[A]\n\t[${JSON.stringify(inp01)}]`, async () => {
      // set output
      mockRL.addEvent('line', 'A');

      return prompter.prompt(inp01).then((res: PromptResult) => {
        expect(mockRlIF.setPrompt).toBeCalledTimes(1);
        expect(mockRlIF.setPrompt).toBeCalledWith(buildPrompt(inp01));
        expect(res.enteredValue).toEqual('A');
      });
    });

    test(`should return \'\' when enteredValue=[\'\']\n\t[${JSON.stringify(inp02)}]`, async () => {
      // set output
      mockRL.addEvent('line', '');

      return prompter.prompt(inp02).then((res: PromptResult) => {
        expect(mockRlIF.setPrompt).toBeCalledTimes(1);
        expect(mockRlIF.setPrompt).toBeCalledWith(buildPrompt(inp02));
        expect(res.enteredValue).toEqual('');
      });
    });

    test(`should return ${inp03.defaultValue} when enteredValue=[\'\']\n\t[${JSON.stringify(inp03)}]`, async () => {
      // set output
      mockRL.addEvent('line', '');

      return prompter.prompt(inp03).then((res: PromptResult) => {
        expect(mockRlIF.setPrompt).toBeCalledTimes(1);
        expect(mockRlIF.setPrompt).toBeCalledWith(buildPrompt(inp03));
        expect(res.enteredValue).toEqual(inp03.defaultValue);
      });
    });

    test(`should return B when enteredValue=[\'\', B]\n\t[${JSON.stringify(inp04)}]`, async () => {
      // set output
      mockRL.addEvent('line', '');
      mockRL.addEvent('line', 'B');

      return prompter.prompt(inp04).then((res: PromptResult) => {
        expect(mockRlIF.setPrompt).toBeCalledTimes(2);
        expect(mockRlIF.setPrompt).toBeCalledWith(buildPrompt(inp04));
        expect(res.enteredValue).toEqual('B');
      });
    });
  });

  /**
   * Container for prompt list
   */
  describe('prompt list', () => {
    const inp05a: PromptInput = {...inp05, allowEmptyValue: true};
    const inp06a: PromptInput = {...inp06, defaultValue: ''};

    test(`should return error when enteredValue=[\'\']\n\t[${JSON.stringify(inp05)}]`, async () => {
      // set output
      mockRL.addEvent('line', '');

      // expect a rejection (3 expects)
      expect.assertions(3);

      return prompter.prompt(inp05).catch((err) => {
        expect(mockRlIF.setPrompt).toBeCalledTimes(1);
        expect(mockRlIF.setPrompt).toBeCalledWith(buildPrompt(inp05));
        expect(err.message).toEqual('User did not enter value');
      });
    });

    test(`should return error when enteredValue=[\'\']\n\t[${JSON.stringify(inp05a)}]`, async () => {
      // set output
      mockRL.addEvent('line', '');

      // expect a rejection (3 expects)
      expect.assertions(3);

      return prompter.prompt(inp05a).catch((err) => {
        expect(mockRlIF.setPrompt).toBeCalledTimes(1);
        expect(mockRlIF.setPrompt).toBeCalledWith(buildPrompt(inp05a));
        expect(err.message).toEqual('User did not enter value');
      });
    });

    test(`should return Y when enteredValue=[Y]\n\t[${JSON.stringify(inp05)}]`, async () => {
      // set output
      mockRL.addEvent('line', 'Y');

      return prompter.prompt(inp05).then((res: PromptResult) => {
        expect(mockRlIF.setPrompt).toBeCalledTimes(1);
        expect(mockRlIF.setPrompt).toBeCalledWith(buildPrompt(inp05));
        expect(res.enteredValue).toEqual('Y');
      });
    });

    test(`should return ${inp06.defaultValue} when enteredValue=[\'\']\n\t[${JSON.stringify(inp06)}]`, async () => {
      // set output
      mockRL.addEvent('line', '');

      return prompter.prompt(inp06).then((res: PromptResult) => {
        expect(mockRlIF.setPrompt).toBeCalledTimes(1);
        expect(mockRlIF.setPrompt).toBeCalledWith(buildPrompt(inp06));
        expect(res.enteredValue).toEqual(inp06.defaultValue);
      });
    });

    test(`should return Z when enteredValue=[\'\', Z]\n\t[${JSON.stringify(inp06)}]`, async () => {
      // set output
      mockRL.addEvent('line', '');
      mockRL.addEvent('line', 'Z');

      return prompter.prompt(inp06a).then((res: PromptResult) => {
        expect(mockRlIF.setPrompt).toBeCalledTimes(2);
        expect(mockRlIF.setPrompt).toBeCalledWith(buildPrompt(inp06a));
        expect(res.enteredValue).toEqual('Z');
      });
    });

    test(`should be treated as single prompt when promptlist is empty\n\t[${JSON.stringify(inp07)}]`, async () => {
      // set output
      mockRL.addEvent('line', 'John Doe');

      return prompter.prompt(inp07).then((res: PromptResult) => {
        expect(mockRlIF.setPrompt).toBeCalledTimes(1);
        expect(mockRlIF.setPrompt).toBeCalledWith(buildPrompt(inp07));
        expect(res.enteredValue).toEqual('John Doe');
      });
    });
  });

  /**
   * Container for multi prompt
   */
  describe('multi prompt', () => {
    const mp01: PromptInput[] = [
      inp06,
      inp01,
      inp04,
    ];

    test(`should return error when enteredValue=[AA, \'\', 101]\n\t[${JSON.stringify(inp06)}]\n\t[${JSON.stringify(inp01)}]\n\t[${JSON.stringify(inp04)}]`, async () => {
      // set output
      mockRL.addEvent('line', 'AA');
      mockRL.addEvent('line', '');
      mockRL.addEvent('line', '101');

      // expect a rejection (3 expects)
      expect.assertions(4);

      return prompter.prompts(mp01).catch((err) => {
        expect(mockRlIF.setPrompt).toBeCalledTimes(2);
        expect(mockRlIF.setPrompt).toHaveBeenNthCalledWith(1, buildPrompt(inp06));
        expect(mockRlIF.setPrompt).toHaveBeenNthCalledWith(2, buildPrompt(inp01));
        expect(err.message).toEqual('User did not enter value');
      });
    });

    test(`should return AA, D, 101  when enteredValue=[AA, D, 101]\n\t[${JSON.stringify(inp06)}]\n\t[${JSON.stringify(inp01)}]\n\t[${JSON.stringify(inp04)}]`, async () => {
      // set output
      mockRL.addEvent('line', 'AA');
      mockRL.addEvent('line', 'D');
      mockRL.addEvent('line', '101');

      return prompter.prompts(mp01).then((res: PromptResult[]) => {
        expect(mockRlIF.setPrompt).toBeCalledTimes(3);
        expect(mockRlIF.setPrompt).toHaveBeenNthCalledWith(1, buildPrompt(inp06));
        expect(mockRlIF.setPrompt).toHaveBeenNthCalledWith(2, buildPrompt(inp01));
        expect(mockRlIF.setPrompt).toHaveBeenNthCalledWith(3, buildPrompt(inp04));
        expect(res.length).toEqual(3);
        expect(res[0].enteredValue).toEqual('AA');
        expect(res[1].enteredValue).toEqual('D');
        expect(res[2].enteredValue).toEqual('101');
      });
    });
  });

  /**
   * Container to test other events
   */
  describe('other events', () => {
    test(`should return error for CLOSE event\n\t[${JSON.stringify(inp02)}]`, async () => {
      // set output
      mockRL.addEvent('close', '');

      return expect(prompter.prompt(inp02)).rejects.toThrow('Stream closed');
    });

    test(`should return error for SIGTSTP event\n\t[${JSON.stringify(inp02)}]`, async () => {
      // set output
      mockRL.addEvent('SIGTSTP', '');

      return expect(prompter.prompt(inp02)).rejects.toThrow(`Stream interrupted: SIGTSTP`);
    });
  });
});