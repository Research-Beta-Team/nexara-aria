/**
 * ARIA message and tool type definitions.
 * Used across ARIAEngine, ARIATools, and UI.
 */

/** @typedef {'user'|'assistant'|'system'} MessageRole */

/**
 * @typedef {Object} TextContent
 * @property {'text'} type
 * @property {string} text
 */

/**
 * @typedef {Object} ToolUseContent
 * @property {'tool_use'} type
 * @property {string} id
 * @property {string} name
 * @property {Record<string, unknown>} input
 */

/**
 * @typedef {Object} ToolResultContent
 * @property {'tool_result'} type
 * @property {string} tool_use_id
 * @property {string|object} content
 * @property {boolean} [is_error]
 */

/**
 * @typedef {TextContent|ToolUseContent|ToolResultContent} MessageContentBlock
 */

/**
 * @typedef {Object} ConversationMessage
 * @property {MessageRole} role
 * @property {MessageContentBlock[]} content
 */

/**
 * @typedef {Object} ActionLogEntry
 * @property {string} id
 * @property {string} time - ISO string
 * @property {string} action - human-readable
 * @property {string} [toolName]
 * @property {string} [result]
 * @property {number} [creditsUsed]
 */

export const MESSAGE_ROLE = /** @type {const} */ ({ user: 'user', assistant: 'assistant', system: 'system' });
