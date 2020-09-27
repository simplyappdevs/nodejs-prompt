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
    promptListTitle?: string;
    promptList?: PromptItem[];
    endIfEmpty: boolean;
    allowEmptyValue: boolean;
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
    init: () => void;
    prompt: (inp: PromptInput) => Promise<PromptResult>;
    prompts: (inps: PromptInput[]) => Promise<PromptResult[]>;
}
/**
 * Implementation of prompt module
 */
export declare const prompter: Prompt;
export default prompter;
