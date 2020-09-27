/**
 * App imports
 */
import {PromptInput, PromptItem, PromptResult} from '../src/prompter';

/**
 * Test data
 */
export const inp01: PromptInput = {
  id: 'inp01',
  defaultValue: '',
  endIfEmpty: true,
  prompt: 'inp01',
  valueToEndPrompt: '',
  allowEmptyValue: false
};

export const res01: PromptResult = {
  ...inp01,
  enteredValue: ''
};

export const inp02: PromptInput = {
  id: 'inp02',
  defaultValue: '',
  endIfEmpty: false,
  prompt: 'inp02',
  valueToEndPrompt: '',
  allowEmptyValue: true
};

export const res02: PromptResult = {
  ...inp02,
  enteredValue: ''
};

export const inp03: PromptInput = {
  id: 'inp03',
  defaultValue: 'A',
  endIfEmpty: false,
  prompt: 'inp03',
  valueToEndPrompt: '',
  allowEmptyValue: true
};

export const res03: PromptResult = {
  ...inp03,
  enteredValue: ''
};

export const inp04: PromptInput = {
  id: 'inp04',
  defaultValue: 'A',
  endIfEmpty: false,
  prompt: 'inp04',
  valueToEndPrompt: '',
  allowEmptyValue: false
};

export const res04: PromptResult = {
  ...inp04,
  enteredValue: ''
};

const promptList: PromptItem[] = [
  {id: 1, key: 'X', text: 'Item 1'},
  {id: 2, key: 'Y', text: 'Item 2'},
  {id: 3, key: 'AA', text: 'Item 2'},
  {id: 4, key: 'Z', text: 'Item 3'}
];

export const inp05: PromptInput = {
  id: 'inp05',
  defaultValue: '',
  endIfEmpty: true,
  prompt: 'inp05',
  valueToEndPrompt: '',
  allowEmptyValue: false,
  promptList: promptList
};

export const res05: PromptResult = {
  ...inp05,
  enteredValue: ''
};

export const inp06: PromptInput = {
  id: 'inp06',
  defaultValue: 'Y',
  endIfEmpty: false,
  prompt: 'inp06',
  valueToEndPrompt: '',
  allowEmptyValue: false,
  promptList: promptList
};

export const res06: PromptResult = {
  ...inp06,
  enteredValue: ''
};

export const inp07: PromptInput = {
  id: 'inp07',
  defaultValue: 'Y',
  endIfEmpty: false,
  prompt: 'inp07',
  valueToEndPrompt: '',
  allowEmptyValue: false,
  promptList: []
};

export const res07: PromptResult = {
  ...inp07,
  enteredValue: ''
};

const promptList02: PromptItem[] = [
  {id: 1, key: 'XXXXXX', text: 'Item 1'},
  {id: 2, key: 'YY', text: 'Item 2'},
];

export const inp08: PromptInput = {
  id: 'inp08',
  defaultValue: 'YY',
  endIfEmpty: false,
  prompt: 'inp08',
  valueToEndPrompt: '',
  allowEmptyValue: false,
  promptListTitle: 'Prompt Options',
  promptList: promptList02
};

export const res08: PromptResult = {
  ...inp08,
  enteredValue: ''
};
