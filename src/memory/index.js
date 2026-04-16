/**
 * Antarious Shared Memory Layer
 *
 * Central memory system for the GTM AI OS. Provides persistent,
 * namespace-based storage with pattern learning, knowledge indexing,
 * and decision audit trailing.
 *
 * Usage:
 *   import memoryLayer from 'src/memory';
 *   import { knowledgeBase, patternStore, decisionLog } from 'src/memory';
 */

export { default as memoryLayer, MemoryLayer, NAMESPACES } from './MemoryLayer';
export { default as knowledgeBase, KnowledgeBase } from './KnowledgeBase';
export { default as patternStore, PatternStore } from './PatternStore';
export { default as decisionLog, DecisionLog } from './DecisionLog';
