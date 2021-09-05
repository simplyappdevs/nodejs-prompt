# NodeJS Prompt System

> Module to get input from user that supports 1 to n prompt(s) and also prompt with options.

## Why

> There already bunch of similar modules on NPM ... but then why not :)? Kidding aside, we learn better by doing, so made this module to learn/hone working w/ Typescript, Unit Test, Test Coverage, and NPM.

## Notable Features

* Prompt with configuration
* Single or multiple prompts
* Prompt with options
* Default value for prompt
* ...few others

## Notable Stacks

* Typescript
* Node readline, process.stdin, and process.stdout
* Reductive promise chaining
* Jest with ts-jest
* readline mock

## Install

* `npm i @simplyappdevs/nodejs-prompt`

## Manual Build

* Clone repo: `git clone https://github.com/simplyappdevs/nodejs-prompt`
* CWD: `cd nodejs-prompt`
* Install deps: `npm i`
* Clear existing output: `npm run clean`
* Build module: `npm run build`
* Test: `npm test`

## Example

> Examples on how to use this module is available from [https://github.com/simplyappdevs/nodejs-prompt-example](https://github.com/simplyappdevs/nodejs-prompt-example)

## Reminder for ESM Application

### npm exec command option

> You will need to run your application with `--es-module-specifier-resolution=node` option.
>
> Ex: `"exec": "node --es-module-specifier-resolution=node ./dist/index.js"` for your NPM script `npm run exec`.

### Configure package.json

> Set type to module `"type": "module"`

```json
{
  "name": "nodejs-prompt-example",
  "version": "1.0.0",
  "description": "My Awesome App",
  "main": "index.js",
  "type": "module",
  "scripts": {
  }
}
```

### Configure tsconfig.json

> Set module to one of ECMA script `"module": "esnext"` in `compilerOptions` section

```json
{
  "compilerOptions": {
    "module": "esnext",
  }
}
```

> Set module resolution to node `"moduleResolution": "node"` in `compilerOptions` section

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
  }
}
```

## Usage

```typescript
// import
import prompter, {PromptInput, PromptResult, PromptItem} from '@simplyappdevs/nodejs-prompt';

// prompt 1
const inp01: PromptInput = {
  id: 'inp01',
  allowEmptyValue: false,
  defaultValue: '',
  endIfEmpty: false,
  valueToEndPrompt: '',
  prompt: 'Enter first name'
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

// single prompt
prompter.prompt(inp01).then((res: PromptResult) => {
  console.log(`User entered: ${res.enteredValue}`);
}).catch((err)=>{
  console.log(`Error: ${err.message}`);
});

// single prompt with options
prompter.prompt(inp03).then((res: PromptResult) => {
  console.log(`User entered: ${res.enteredValue}`);
}).catch((err)=>{
  console.log(`Error: ${err.message}`);
});

// multi prompts
prompter.prompts([inp01, inp02, inp03, inp04]).then((res: PromptResult[]) => {
  console.log(`User entered: ${res[0].enteredValue}`);
  console.log(`User entered: ${res[1].enteredValue}`);
  console.log(`User entered: ${res[2].enteredValue}`);
  console.log(`User entered: ${res[3].enteredValue}`);
}).catch((err)=>{
  console.log(`Error: ${err.message}`);
});
```

## Objects

> ### PromptInput

Property | Type | Required | Comment
---------|----------|---------|---------
 id | string | Y | Unique id for this prompt (useful in multi-prompt)
 allowEmptyValue | boolean | Y | Accept empty string `''` as a valid input
 defaultValue | string | Y | Value to use if user entered empty string `''`
 endIfEmpty | boolean | Y | True will end prompt session if user enter empty string `''`
 valueToEndPrompt | string | N | Future used?
 prompt | string | Y | Prompt text
 promptListTitle | string | N | Prompt list title
 promptList | PromptItem[] | N | List of prompt options

> ### PromptItem

Property | Type | Required | Comment
---------|----------|---------|---------
 id | number | Y | Unique id for this option
 key | string | Y | Value to select this option
 text | string | Y | Prompt option text

> ### PromptResult (extends PromptInput)

Property | Type |  Comment
---------|----------|---------
 enteredValue | string | Returns what the user entered

## Methods

> Single prompt: `prompter.prompt()` returns `Promise<PromptResult>`
>
> Multi prompts: `prompter.prompts()` returns `Promise<PromptResult[]>`

## Information

* [Home Page](https://github.com/simplyappdevs/nodejs-prompt/blob/master/README.md)
* [Repo](https://github.com/simplyappdevs/nodejs-prompt)
* [Issues](https://github.com/simplyappdevs/nodejs-prompt/issues)
* [Developer](https://www.simplyappdevs.com)

Brought to you by www.simplyappdevs.com (2021)
