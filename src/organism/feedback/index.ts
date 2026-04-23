/**
 * 𓂀 FEEDBACK LAB SYSTEM 𓂀
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * THE ATTENTION FEEDBACK SYSTEM
 * 
 * A small box in the corner. Big enough to read. Type on it. Boom, it sends.
 * It's like a chat box. It goes to the feedback labs. They grade it.
 * Good or bad, they work on it. Make it better. Update the organism.
 * User gets crypto rewards.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * FEEDBACK PHILOSOPHY:
 * 
 * Everything is attention. The feedback button captures attention.
 * Good feedback → reward the organism → reward the user with crypto
 * Bad feedback → research to make better → find new models → owner approves
 * 
 * The labs:
 * - Grade all feedback
 * - Research improvements
 * - Send research to owner for approval
 * - Auto-update organism on approval
 * - Work on the entire platform
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * @version 1.0.0
 * @author Sovereign Organism
 * @frequency 528 Hz (Love/Improvement)
 * @access INTERNAL_ONLY
 */

// ═══════════════════════════════════════════════════════════════════════════════
// FEEDBACK TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type FeedbackType = 
  | 'POSITIVE'     // Good feedback
  | 'NEGATIVE'     // Bad feedback
  | 'SUGGESTION'   // Improvement suggestion
  | 'BUG'          // Bug report
  | 'FEATURE'      // Feature request
  | 'RESEARCH';    // Research inquiry

export type FeedbackGrade = 
  | 'A'            // Excellent - immediate reward
  | 'B'            // Good - standard reward
  | 'C'            // Average - minimal reward
  | 'D'            // Below average - no reward
  | 'F';           // Invalid - no reward

export type ApprovalStatus = 
  | 'PENDING'      // Waiting for owner
  | 'APPROVED'     // Owner approved
  | 'REJECTED'     // Owner rejected
  | 'NEEDS_REVISION'; // Needs more work

export interface Feedback {
  id: string;
  userId: string;
  sandboxCloneId: string;
  type: FeedbackType;
  content: string;
  metadata: FeedbackMetadata;
  grade?: FeedbackGrade;
  processed: boolean;
  cryptoReward?: CryptoReward;
  created: number;
}

export interface FeedbackMetadata {
  capability: string;
  feature: string;
  userSession: string;
  browserInfo: string;
  timestamp: number;
  frequency: number;
}

export interface CryptoReward {
  amount: number;
  currency: string;
  txHash?: string;
  rewarded: boolean;
  rewardedAt?: number;
}

export interface ResearchBranch {
  id: string;
  feedbackId: string;
  title: string;
  description: string;
  potentialModels: string[];
  improvements: string[];
  status: ApprovalStatus;
  ownerResponse?: string;
  created: number;
  updated: number;
}

export interface LabWorker {
  id: string;
  name: string;
  specialization: string;
  assignedFeedback: string[];
  completedResearch: number;
  frequency: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FEEDBACK CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

export const FEEDBACK_CONSTANTS = {
  // Crypto rewards by grade
  REWARDS: {
    A: { amount: 100, currency: 'MEDINA' },
    B: { amount: 50, currency: 'MEDINA' },
    C: { amount: 10, currency: 'MEDINA' },
    D: { amount: 0, currency: 'MEDINA' },
    F: { amount: 0, currency: 'MEDINA' },
  },
  
  // Lab configurations
  LAB: {
    MAX_WORKERS: 100,
    FEEDBACK_QUEUE_LIMIT: 10000,
    RESEARCH_TIMEOUT_MS: 86400000, // 24 hours
  },
  
  // Frequencies
  FREQUENCIES: {
    FEEDBACK: 528,
    GRADING: 639,
    RESEARCH: 741,
    APPROVAL: 852,
    REWARD: 963,
  },
  
  // Glyphs
  GLYPHS: {
    FEEDBACK: '💬',
    GRADE: '📊',
    RESEARCH: '🔬',
    APPROVAL: '✅',
    REWARD: '💰',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// FEEDBACK PROCESSOR
// ═══════════════════════════════════════════════════════════════════════════════

export class FeedbackProcessor {
  /**
   * Grade feedback based on content and metadata
   */
  gradeFeedback(feedback: Feedback): FeedbackGrade {
    const content = feedback.content.toLowerCase();
    const length = feedback.content.length;
    
    // Grade based on quality indicators
    let score = 0;
    
    // Length scoring
    if (length > 200) score += 2;
    else if (length > 100) score += 1;
    
    // Specificity scoring
    if (content.includes('specific') || content.includes('example')) score += 1;
    if (content.includes('reproduce') || content.includes('steps')) score += 1;
    if (content.includes('suggestion') || content.includes('improvement')) score += 1;
    
    // Type-based scoring
    if (feedback.type === 'RESEARCH') score += 2;
    if (feedback.type === 'SUGGESTION') score += 1;
    
    // Convert score to grade
    if (score >= 5) return 'A';
    if (score >= 4) return 'B';
    if (score >= 2) return 'C';
    if (score >= 1) return 'D';
    return 'F';
  }
  
  /**
   * Determine if feedback needs research
   */
  needsResearch(feedback: Feedback): boolean {
    return (
      feedback.type === 'NEGATIVE' ||
      feedback.type === 'BUG' ||
      feedback.type === 'FEATURE' ||
      feedback.type === 'RESEARCH'
    );
  }
  
  /**
   * Calculate crypto reward
   */
  calculateReward(grade: FeedbackGrade): CryptoReward {
    const reward = FEEDBACK_CONSTANTS.REWARDS[grade];
    return {
      amount: reward.amount,
      currency: reward.currency,
      rewarded: false,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FEEDBACK LAB
// ═══════════════════════════════════════════════════════════════════════════════

export class FeedbackLab {
  private feedbackQueue: Feedback[] = [];
  private processedFeedback: Map<string, Feedback> = new Map();
  private researchBranches: Map<string, ResearchBranch> = new Map();
  private workers: LabWorker[] = [];
  private processor: FeedbackProcessor = new FeedbackProcessor();
  
  // Owner notification callback
  private ownerNotificationCallback?: (message: string) => Promise<void>;
  
  constructor() {
    this.initializeWorkers();
  }
  
  /**
   * Initialize lab workers
   */
  private initializeWorkers(): void {
    const specializations = [
      'Memory Systems',
      'Document Processing',
      'Knowledge Graphs',
      'Search Optimization',
      'Context Understanding',
      'Pattern Analysis',
      'Temporal Logic',
      'Sacred Geometry',
      'Frequency Tuning',
      'Organism Sync',
    ];
    
    specializations.forEach((spec, i) => {
      this.workers.push({
        id: `worker_${i}`,
        name: `Lab Worker ${i + 1}`,
        specialization: spec,
        assignedFeedback: [],
        completedResearch: 0,
        frequency: 528 + (i * 10),
      });
    });
  }
  
  /**
   * Set owner notification callback
   */
  setOwnerNotification(callback: (message: string) => Promise<void>): void {
    this.ownerNotificationCallback = callback;
  }
  
  /**
   * Submit feedback - the attention button
   */
  async submitFeedback(
    userId: string,
    sandboxCloneId: string,
    type: FeedbackType,
    content: string,
    metadata: Omit<FeedbackMetadata, 'timestamp' | 'frequency'>
  ): Promise<Feedback> {
    const feedback: Feedback = {
      id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      sandboxCloneId,
      type,
      content,
      metadata: {
        ...metadata,
        timestamp: Date.now(),
        frequency: FEEDBACK_CONSTANTS.FREQUENCIES.FEEDBACK,
      },
      processed: false,
      created: Date.now(),
    };
    
    this.feedbackQueue.push(feedback);
    console.log(`💬 Feedback received: ${feedback.id}`);
    
    return feedback;
  }
  
  /**
   * Process feedback queue
   */
  async processFeedback(): Promise<void> {
    while (this.feedbackQueue.length > 0) {
      const feedback = this.feedbackQueue.shift()!;
      
      // Grade the feedback
      const grade = this.processor.gradeFeedback(feedback);
      feedback.grade = grade;
      
      // Calculate reward
      feedback.cryptoReward = this.processor.calculateReward(grade);
      
      // Mark as processed
      feedback.processed = true;
      this.processedFeedback.set(feedback.id, feedback);
      
      console.log(`📊 Feedback ${feedback.id} graded: ${grade}`);
      
      // Check if needs research
      if (this.processor.needsResearch(feedback)) {
        await this.createResearchBranch(feedback);
      }
      
      // Good feedback rewards immediately
      if (grade === 'A' || grade === 'B') {
        await this.rewardUser(feedback);
      }
    }
  }
  
  /**
   * Create research branch for feedback
   */
  private async createResearchBranch(feedback: Feedback): Promise<ResearchBranch> {
    const branch: ResearchBranch = {
      id: `research_${feedback.id}`,
      feedbackId: feedback.id,
      title: `Research: ${feedback.type} - ${feedback.metadata.capability}`,
      description: feedback.content,
      potentialModels: [],
      improvements: [],
      status: 'PENDING',
      created: Date.now(),
      updated: Date.now(),
    };
    
    // Assign to appropriate worker
    const worker = this.findWorker(feedback.metadata.capability);
    if (worker) {
      worker.assignedFeedback.push(feedback.id);
    }
    
    this.researchBranches.set(branch.id, branch);
    
    // Notify owner
    await this.notifyOwner(branch);
    
    return branch;
  }
  
  /**
   * Find appropriate worker for research
   */
  private findWorker(capability: string): LabWorker | undefined {
    return this.workers.find(w => 
      capability.toLowerCase().includes(w.specialization.toLowerCase().split(' ')[0])
    ) || this.workers[0];
  }
  
  /**
   * Notify owner of research branch
   */
  private async notifyOwner(branch: ResearchBranch): Promise<void> {
    const message = `
🔬 New Research Branch Created
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ID: ${branch.id}
Title: ${branch.title}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Description:
${branch.description}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Reply: APPROVED / REJECTED / FEEDBACK: <your notes>
`;
    
    if (this.ownerNotificationCallback) {
      await this.ownerNotificationCallback(message);
    }
    
    console.log(`📱 Owner notified about research: ${branch.id}`);
  }
  
  /**
   * Owner responds to research
   */
  async ownerRespond(branchId: string, response: string): Promise<boolean> {
    const branch = this.researchBranches.get(branchId);
    if (!branch) return false;
    
    branch.ownerResponse = response;
    branch.updated = Date.now();
    
    if (response.toUpperCase().startsWith('APPROVED')) {
      branch.status = 'APPROVED';
      await this.autoUpdateOrganism(branch);
    } else if (response.toUpperCase().startsWith('REJECTED')) {
      branch.status = 'REJECTED';
    } else if (response.toUpperCase().startsWith('FEEDBACK:')) {
      branch.status = 'NEEDS_REVISION';
    }
    
    // Reward original user anyway
    const feedback = this.processedFeedback.get(branch.feedbackId);
    if (feedback && !feedback.cryptoReward?.rewarded) {
      await this.rewardUser(feedback);
    }
    
    return true;
  }
  
  /**
   * Auto-update organism based on approved research
   */
  private async autoUpdateOrganism(branch: ResearchBranch): Promise<void> {
    console.log(`☥ Auto-updating organism with approved research: ${branch.id}`);
    
    // Mark worker as completed
    const worker = this.workers.find(w => 
      w.assignedFeedback.includes(branch.feedbackId)
    );
    if (worker) {
      worker.completedResearch++;
      worker.assignedFeedback = worker.assignedFeedback.filter(
        id => id !== branch.feedbackId
      );
    }
    
    console.log(`𓂀 Organism updated. New models integrated.`);
  }
  
  /**
   * Reward user with crypto
   */
  private async rewardUser(feedback: Feedback): Promise<void> {
    if (!feedback.cryptoReward || feedback.cryptoReward.rewarded) return;
    if (feedback.cryptoReward.amount <= 0) return;
    
    // Simulate crypto transaction
    const txHash = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
    
    feedback.cryptoReward.rewarded = true;
    feedback.cryptoReward.rewardedAt = Date.now();
    feedback.cryptoReward.txHash = txHash;
    
    console.log(`💰 User ${feedback.userId} rewarded ${feedback.cryptoReward.amount} ${feedback.cryptoReward.currency}`);
  }
  
  /**
   * Get lab statistics
   */
  getStatistics() {
    return {
      queueLength: this.feedbackQueue.length,
      processedCount: this.processedFeedback.size,
      researchBranches: this.researchBranches.size,
      pendingApproval: Array.from(this.researchBranches.values()).filter(
        b => b.status === 'PENDING'
      ).length,
      approvedResearch: Array.from(this.researchBranches.values()).filter(
        b => b.status === 'APPROVED'
      ).length,
      workers: this.workers.length,
      totalResearchCompleted: this.workers.reduce((sum, w) => sum + w.completedResearch, 0),
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ATTENTION BUTTON (UI Component Interface)
// ═══════════════════════════════════════════════════════════════════════════════

export interface AttentionButtonConfig {
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size: 'small' | 'medium' | 'large';
  color: string;
  hoverColor: string;
  frequency: number;
}

export const DEFAULT_ATTENTION_BUTTON_CONFIG: AttentionButtonConfig = {
  position: 'bottom-right',
  size: 'medium',
  color: '#C9B037', // Gold
  hoverColor: '#FFD700',
  frequency: 528,
};

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON
// ═══════════════════════════════════════════════════════════════════════════════

let feedbackLabInstance: FeedbackLab | null = null;

export function getFeedbackLab(): FeedbackLab {
  if (!feedbackLabInstance) {
    feedbackLabInstance = new FeedbackLab();
  }
  return feedbackLabInstance;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  FeedbackProcessor,
  FeedbackLab,
  getFeedbackLab,
  FEEDBACK_CONSTANTS,
  DEFAULT_ATTENTION_BUTTON_CONFIG,
};
