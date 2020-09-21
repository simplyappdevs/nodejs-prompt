/**
 * Prompt item definition
 */
export interface PromptItem {
    id: number;
    key: string;
    text: string;
}
/**
 * Prompt input information
 */
export interface PromptInput {
    id: string;
    prompt: string;
    promptList?: PromptItem[];
    endIfEmpty: boolean;
    defaultValue: string;
    valueToEndPrompt: string;
}
/**
 * Prompt result information
 */
export interface PromptResult extends PromptInput {
    enteredValue: string;
}
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
declare const prompter: Prompt;
export default prompter;
