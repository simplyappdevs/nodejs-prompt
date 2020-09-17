/**
 * Mocks
 */
jest.mock('readline');

import readline from 'readline';

/**
 * App imports
 */
import {default as prompter, PromptInput, PromptResult} from '../src/prompter';

/**
 * Testing prompter
 */
describe('Testing prompter', () => {
  const inp: PromptInput = {
    id: 'TestID',
    defaultValue: '',
    endIfEmpty: false,
    prompt: 'Enter your selection',
    valueToEndPrompt: 'exit'
  };

  it('returns value when prompted', () => {
    readline.createInterface = jest.fn().mockImplementation(() => {
      return {test: () => {}};
    });

    return prompter.prompt(inp).then((res: PromptResult) => {
      return expect(res.enteredValue).toBe('Azmizar');
    });
  });
});