/**
 * App imports
 */
import prompter, {PromptInput, PromptItem, PromptResult} from '../src/prompter';

// prompt inputs
const inp01: PromptInput = {
  id: 'inp01',
  allowEmptyValue: false,
  defaultValue: '',
  endIfEmpty: false,
  valueToEndPrompt: '',
  prompt: 'Enter full name'
};

const inp02: PromptInput = {
  ...inp01,
  prompt: 'Enter last name'
};

const inp03: PromptInput = {
  ...inp02,
  endIfEmpty: true,
  promptList: [
    {id: 1, key: 'M', text: 'Male'},
    {id: 2, key: 'F', text: 'Female'}
  ],
  prompt: 'Enter your gender'
};

const inp04: PromptInput = {
  ...inp02,
  endIfEmpty: false,
  allowEmptyValue: true,
  defaultValue: 'Secret',
  prompt: 'Enter your age'
};

/**
 * Multi prompt, no default, end if empty, not allow empty
 */
export const multiPrompt = async (): Promise<void> => {
  console.log(`Inp01: ${JSON.stringify(inp01)}`);
  console.log(`Inp02: ${JSON.stringify(inp02)}`);
  console.log(`Inp03: ${JSON.stringify(inp03)}`);
  console.log(`Inp04: ${JSON.stringify(inp04)}`);

  const res: PromptResult[] = await prompter.prompts([inp01, inp02, inp03, inp04]);

  console.log(`First name: \'${res[0].enteredValue}\'`);
  console.log(`Last name: \'${res[1].enteredValue}\'`);
  console.log(`Gender: \'${res[2].enteredValue}\'`);
  console.log(`Age: \'${res[3].enteredValue}\'`);
};
