/**
 * App imports
 */
import {prompter, PromptInput, PromptItem, PromptResult} from '../src';
import {multiPrompt} from './multi-prompt';
import {
  singlePromptNoDefEndIfEmptyDontAllowEmpty,
  singlePromptHasDefEndIfEmptyDontAllowEmpty,
  singlePromptHasDefNotEndIfEmptyDontAllowEmpty,
  singlePromptHasDefNotEndIfEmptyAllowEmpty
} from './single-prompt';

// demos
const menuItems: PromptItem[] = [
  {id: 1, key: 'A', text: 'Single Prompt, End If Empty, No Default, Don\'t Allow Empty, No List'},
  {id: 2, key: 'B', text: 'Single Prompt, End If Empty, Has Default, Don\'t Allow Empty, No List'},
  {id: 3, key: 'C', text: 'Single Prompt, Not End If Empty, Has Default, Don\'t Allow Empty, No List'},
  {id: 4, key: 'D', text: 'Single Prompt, Not End If Empty, Has Default, Allow Empty, No List'},
  {id: 5, key: 'E', text: 'Multi-prompt'},
  {id: 100, key: 'X', text: 'Exit'}
];

// map
const demos: Map<string, () => Promise<void>> = new Map();

demos.set('A', singlePromptNoDefEndIfEmptyDontAllowEmpty);
demos.set('B', singlePromptHasDefEndIfEmptyDontAllowEmpty);
demos.set('C', singlePromptHasDefNotEndIfEmptyDontAllowEmpty);
demos.set('D', singlePromptHasDefNotEndIfEmptyAllowEmpty);
demos.set('E', multiPrompt);

// prompt input
const inp: PromptInput = {
  id: 'examples',
  allowEmptyValue: false,
  defaultValue: 'X',
  endIfEmpty: false,
  valueToEndPrompt: '',
  promptList: menuItems,
  prompt: 'Select an example to run'
};

// start it up
(async function () {
  const runDemo = async (demoSelection: string | null): Promise<void> => {
    let doNext: boolean = demoSelection !== null? false : true;

    if (demoSelection) {
      // get demo function
      const demoFn = demos.get(demoSelection.toUpperCase());

      if (demoFn) {
        doNext = true;
        await demoFn();
      }
    }

    if (doNext) {
      return prompter.prompt(inp).then((res: PromptResult) => {
        if (res.enteredValue.toUpperCase() === 'X') {
          Promise.resolve();
        } else {
          return runDemo(res.enteredValue);
        }
      });
    } else {
      return Promise.resolve();
    }
  };

  // recursive promise chain
  runDemo(null).then(() => {
    console.log('Demo ended');
  }).catch((err) => {
    console.log(`Exiting due to error: ${err.message}`);
  });
})();
