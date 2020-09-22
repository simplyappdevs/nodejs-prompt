/**
 * App imports
 */
import prompter, {PromptInput, PromptResult} from '../src/prompter';

// prompt inputs
const inp01: PromptInput = {
  id: 'inp01',
  allowEmptyValue: false,
  defaultValue: '',
  endIfEmpty: true,
  valueToEndPrompt: '',
  prompt: 'Enter your name'
};

/**
 * Single prompt, no default, end if empty, not allow empty
 */
export const singlePromptNoDefEndIfEmptyDontAllowEmpty = async (): Promise<void> => {
  const res: PromptResult = await prompter.prompt(inp01);

  console.log(`Config: ${JSON.stringify(inp01)}`);
  console.log(`User entered: \'${res.enteredValue}\'`);
};

const inp02: PromptInput = {
  ...inp01,
  defaultValue: 'John Doe'
};

/**
 * Single prompt, has default, end if empty, not allow empty
 */
export const singlePromptHasDefEndIfEmptyDontAllowEmpty = async (): Promise<void> => {
  const res: PromptResult = await prompter.prompt(inp02);

  console.log(`Config: ${JSON.stringify(inp02)}`);
  console.log(`User entered: \'${res.enteredValue}\'`);
};

const inp03: PromptInput = {
  ...inp02,
  endIfEmpty: false,
  defaultValue: 'John Doe'
};

/**
 * Single prompt, has default, not end if empty, not allow empty
 */
export const singlePromptHasDefNotEndIfEmptyDontAllowEmpty = async (): Promise<void> => {
  const res: PromptResult = await prompter.prompt(inp03);

  console.log(`Config: ${JSON.stringify(inp03)}`);
  console.log(`User entered: \'${res.enteredValue}\'`);
};

const inp04: PromptInput = {
  ...inp03,
  endIfEmpty: false,
  allowEmptyValue: true,
  defaultValue: 'John Doe'
};

/**
 * Single prompt, has default, not end if empty, allow empty
 */
export const singlePromptHasDefNotEndIfEmptyAllowEmpty = async (): Promise<void> => {
  const res: PromptResult = await prompter.prompt(inp04);

  console.log(`Config: ${JSON.stringify(inp04)}`);
  console.log(`User entered: \'${res.enteredValue}\'`);
};
