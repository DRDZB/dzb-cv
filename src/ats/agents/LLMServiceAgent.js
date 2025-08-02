import { distillContentTool, optimizeContentTool } from './tools/llm-tools.js';
// Debug logging configuration
const DEBUG = process.env.DEBUG === 'true' || process.env.VERBOSE === 'true';
const log = {
    debug: (...args) => DEBUG && console.log('[LLM-Agent DEBUG]', ...args),
    info: (...args) => console.log('[LLM-Agent INFO]', ...args),
    warn: (...args) => console.warn('[LLM-Agent WARN]', ...args),
    error: (...args) => console.error('[LLM-Agent ERROR]', ...args)
};
/**
 * LLMServiceAgent orchestrates CV content processing using LLM tools.
 * Subscribes to message bus topics and handles the complete pipeline:
 * 1. Content distillation (multi-page to single-page)
 * 2. Layout optimization (fitting content to page constraints)
 */
class LLMServiceAgent {
    messageBus;
    logPrefix;
    agentName;
    activeRequests = new Map();
    constructor(options) {
        this.messageBus = options.messageBus;
        this.agentName = options.agentName || 'LLMServiceAgent';
        this.logPrefix = `[${this.agentName}]`;
        console.info(`${this.logPrefix} Initialized.`);
        this.setupSubscriptions();
    }
    setupSubscriptions() {
        // Subscribe to individual tool requests
        this.messageBus.subscribe('cv:distill', this.handleDistillRequest.bind(this));
        this.messageBus.subscribe('cv:optimize', this.handleOptimizeRequest.bind(this));
        // Subscribe to complete pipeline request
        this.messageBus.subscribe('cv:process:single-page', this.handleSinglePageRequest.bind(this));
        // Subscribe to direct agent messages
        this.messageBus.subscribe(`@${this.agentName}`, this.handleDirectMessage.bind(this));
    }
    /**
     * Handle individual distill content requests
     */
    async handleDistillRequest(data) {
        const requestId = data.requestId || this.generateRequestId();
        console.info(`${this.logPrefix} Received distill request: ${requestId}`);
        this.activeRequests.set(requestId, { startTime: Date.now(), stage: 'distill' });
        try {
            const result = await distillContentTool.execute(data);
            this.messageBus.publish('cv:distill:complete', { requestId, result });
            console.info(`${this.logPrefix} Distill completed for request: ${requestId}`);
        }
        catch (error) {
            console.error(`${this.logPrefix} Error processing distill request ${requestId}:`, error);
            this.messageBus.publish('cv:distill:error', { requestId, error: this.formatError(error) });
        }
        finally {
            this.activeRequests.delete(requestId);
        }
    }
    /**
     * Handle individual optimize content requests
     */
    async handleOptimizeRequest(data) {
        const requestId = data.requestId || this.generateRequestId();
        console.info(`${this.logPrefix} Received optimize request: ${requestId}`);
        this.activeRequests.set(requestId, { startTime: Date.now(), stage: 'optimize' });
        try {
            const result = await optimizeContentTool.execute(data);
            this.messageBus.publish('cv:optimize:complete', { requestId, result });
            console.info(`${this.logPrefix} Optimize completed for request: ${requestId}`);
        }
        catch (error) {
            console.error(`${this.logPrefix} Error processing optimize request ${requestId}:`, error);
            this.messageBus.publish('cv:optimize:error', { requestId, error: this.formatError(error) });
        }
        finally {
            this.activeRequests.delete(requestId);
        }
    }
    /**
     * Handle complete single-page CV processing pipeline
     */
    async handleSinglePageRequest(data) {
        const { requestId, cvData, targetStyle = 'professional', layoutConstraints } = data;
        console.info(`${this.logPrefix} Starting single-page CV processing: ${requestId}`);
        const startTime = Date.now();
        this.activeRequests.set(requestId, { startTime, stage: 'pipeline' });
        try {
            // Step 1: Distill content
            console.info(`${this.logPrefix} [${requestId}] Step 1: Distilling content...`);
            this.activeRequests.set(requestId, { startTime, stage: 'distill' });
            const distillResult = await distillContentTool.execute({
                cvData,
                style: targetStyle,
                maxLength: 2000
            });
            // Step 2: Optimize for layout
            console.info(`${this.logPrefix} [${requestId}] Step 2: Optimizing layout...`);
            this.activeRequests.set(requestId, { startTime, stage: 'optimize' });
            const optimizeResult = await optimizeContentTool.execute({
                distilledContent: distillResult.distilledContent,
                layoutConstraints
            });
            // Compile final result
            const processingTime = Date.now() - startTime;
            const result = {
                requestId,
                distilled: distillResult,
                optimized: optimizeResult,
                processingTime,
                success: true
            };
            console.info(`${this.logPrefix} [${requestId}] Pipeline completed in ${processingTime}ms`);
            this.messageBus.publish('cv:process:single-page:complete', result);
        }
        catch (error) {
            const processingTime = Date.now() - startTime;
            const errorResult = {
                requestId,
                distilled: null,
                optimized: null,
                processingTime,
                success: false,
                error: this.formatError(error)
            };
            console.error(`${this.logPrefix} [${requestId}] Pipeline failed after ${processingTime}ms:`, error);
            this.messageBus.publish('cv:process:single-page:error', errorResult);
        }
        finally {
            this.activeRequests.delete(requestId);
        }
    }
    /**
     * Handle direct messages to this agent
     */
    async handleDirectMessage(data) {
        console.info(`${this.logPrefix} Received direct message:`, data);
        if (data.action === 'status') {
            this.publishStatus();
        }
        else if (data.action === 'health') {
            this.publishHealthCheck();
        }
        else {
            console.warn(`${this.logPrefix} Unknown direct message action: ${data.action}`);
        }
    }
    /**
     * Publish current agent status
     */
    publishStatus() {
        const status = {
            agentName: this.agentName,
            activeRequests: this.activeRequests.size,
            requests: Array.from(this.activeRequests.entries()).map(([id, info]) => ({
                requestId: id,
                stage: info.stage,
                elapsedTime: Date.now() - info.startTime
            }))
        };
        this.messageBus.publish('agent:status', status);
    }
    /**
     * Publish health check result
     */
    publishHealthCheck() {
        const health = {
            agentName: this.agentName,
            healthy: true,
            timestamp: new Date().toISOString(),
            capabilities: ['cv:distill', 'cv:optimize', 'cv:process:single-page']
        };
        this.messageBus.publish('agent:health', health);
    }
    /**
     * Generate a unique request ID
     */
    generateRequestId() {
        return `llm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    /**
     * Format error for consistent error handling
     */
    formatError(error) {
        if (error instanceof Error) {
            return error.message;
        }
        return String(error);
    }
    /**
     * Get current active requests count (for monitoring)
     */
    getActiveRequestsCount() {
        return this.activeRequests.size;
    }
    /**
     * Graceful shutdown - wait for active requests to complete
     */
    async shutdown(timeoutMs = 30000) {
        console.info(`${this.logPrefix} Initiating shutdown, waiting for ${this.activeRequests.size} active requests...`);
        const startTime = Date.now();
        while (this.activeRequests.size > 0 && (Date.now() - startTime) < timeoutMs) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        if (this.activeRequests.size > 0) {
            console.warn(`${this.logPrefix} Shutdown timeout reached with ${this.activeRequests.size} active requests remaining`);
        }
        else {
            console.info(`${this.logPrefix} Shutdown completed gracefully`);
        }
    }
}
export default LLMServiceAgent;
//# sourceMappingURL=LLMServiceAgent.js.map