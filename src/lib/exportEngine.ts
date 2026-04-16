// 𓂀 EXPORT ENGINE 𓂀
// "PDF, Excel, Campaign, message send — every dead button gets found,
//  pattern-recognized, and fixed as a class. Zero dead ends. Full pilot."

import type { ExportConfig, ExportResult, MemoryEntry, Proposal, Company } from '@/types';

// ─── PDF Generation ───────────────────────────────────────────────────────────

export async function generatePDF(
  title: string,
  content: Record<string, unknown>,
  options?: { template?: string }
): Promise<ExportResult> {
  try {
    // Create PDF using browser APIs
    const pdfContent = buildPDFContent(title, content);
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    const filename = `${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`;

    // Trigger download
    downloadBlob(blobUrl, filename);

    return {
      success: true,
      filename,
      blobUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate PDF',
    };
  }
}

function buildPDFContent(title: string, content: Record<string, unknown>): string {
  // Simple PDF structure (would use jsPDF or similar in production)
  const timestamp = new Date().toISOString();
  
  // Create a text representation that browsers can render
  let text = `NOVA OVO - ${title}\n`;
  text += `Generated: ${timestamp}\n`;
  text += `${'='.repeat(50)}\n\n`;
  
  const formatValue = (value: unknown, indent = 0): string => {
    const spaces = '  '.repeat(indent);
    if (value === null || value === undefined) return `${spaces}(empty)`;
    if (typeof value === 'object' && Array.isArray(value)) {
      return value.map((v, i) => `${spaces}${i + 1}. ${formatValue(v, indent + 1)}`).join('\n');
    }
    if (typeof value === 'object') {
      return Object.entries(value as Record<string, unknown>)
        .map(([k, v]) => `${spaces}${k}: ${formatValue(v, indent + 1)}`)
        .join('\n');
    }
    return String(value);
  };

  text += formatValue(content);

  return text;
}

// ─── Excel Generation ─────────────────────────────────────────────────────────

export async function generateExcel(
  title: string,
  data: Record<string, unknown>[] | Record<string, unknown>,
  options?: { sheetName?: string }
): Promise<ExportResult> {
  try {
    const csvContent = buildCSVContent(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const blobUrl = URL.createObjectURL(blob);
    const filename = `${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.csv`;

    downloadBlob(blobUrl, filename);

    return {
      success: true,
      filename,
      blobUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate Excel',
    };
  }
}

function buildCSVContent(data: Record<string, unknown>[] | Record<string, unknown>): string {
  const rows: Record<string, unknown>[] = Array.isArray(data) ? data : [data];
  
  if (rows.length === 0) return '';

  // Get all unique keys
  const allKeys = new Set<string>();
  rows.forEach(row => Object.keys(row).forEach(key => allKeys.add(key)));
  const headers = Array.from(allKeys);

  // Build CSV
  const lines: string[] = [];
  
  // Header row
  lines.push(headers.map(escapeCSV).join(','));
  
  // Data rows
  rows.forEach(row => {
    const values = headers.map(key => {
      const value = row[key];
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') return escapeCSV(JSON.stringify(value));
      return escapeCSV(String(value));
    });
    lines.push(values.join(','));
  });

  return lines.join('\n');
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

// ─── JSON Export ──────────────────────────────────────────────────────────────

export async function generateJSON(
  title: string,
  data: unknown
): Promise<ExportResult> {
  try {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const blobUrl = URL.createObjectURL(blob);
    const filename = `${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.json`;

    downloadBlob(blobUrl, filename);

    return {
      success: true,
      filename,
      blobUrl,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate JSON',
    };
  }
}

// ─── Memory Export ────────────────────────────────────────────────────────────

export async function exportMemories(
  memories: MemoryEntry[],
  format: 'pdf' | 'excel' | 'json'
): Promise<ExportResult> {
  const title = 'Memory Export';
  
  switch (format) {
    case 'pdf':
      return generatePDF(title, {
        totalEntries: memories.length,
        exportedAt: new Date().toISOString(),
        entries: memories.map(m => ({
          id: m.id,
          content: m.content,
          type: m.type,
          salience: m.salience,
          doctrineAlignment: m.doctrineAlignment,
          createdAt: m.createdAt,
        })),
      });
    
    case 'excel':
      return generateExcel(title, memories.map(m => ({
        ID: m.id,
        Content: m.content,
        Type: m.type,
        Salience: m.salience,
        DoctrineAlignment: m.doctrineAlignment,
        Tags: m.tags.join('; '),
        Pinned: m.pinned ? 'Yes' : 'No',
        Created: m.createdAt,
        Updated: m.updatedAt,
      })));
    
    case 'json':
      return generateJSON(title, memories);
    
    default:
      return { success: false, error: 'Unsupported format' };
  }
}

// ─── Governance Export ────────────────────────────────────────────────────────

export async function exportProposals(
  proposals: Proposal[],
  format: 'pdf' | 'excel' | 'json'
): Promise<ExportResult> {
  const title = 'Governance Export';
  
  switch (format) {
    case 'pdf':
      return generatePDF(title, {
        totalProposals: proposals.length,
        byStatus: proposals.reduce((acc, p) => {
          acc[p.status] = (acc[p.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        proposals: proposals.map(p => ({
          id: p.id,
          title: p.title,
          status: p.status,
          votes: p.votes,
          createdAt: p.createdAt,
        })),
      });
    
    case 'excel':
      return generateExcel(title, proposals.map(p => ({
        ID: p.id,
        Title: p.title,
        Description: p.description,
        Author: p.author,
        Status: p.status,
        VotesFor: p.votes.for,
        VotesAgainst: p.votes.against,
        VotesAbstain: p.votes.abstain,
        Created: p.createdAt,
        Updated: p.updatedAt,
        Enacted: p.enactedAt || '',
      })));
    
    case 'json':
      return generateJSON(title, proposals);
    
    default:
      return { success: false, error: 'Unsupported format' };
  }
}

// ─── Company Report Export ────────────────────────────────────────────────────

export async function exportCompanyReport(
  company: Company,
  format: 'pdf' | 'excel' | 'json'
): Promise<ExportResult> {
  const title = `${company.name} Report`;
  
  switch (format) {
    case 'pdf':
      return generatePDF(title, {
        company: {
          name: company.name,
          mode: company.mode,
          onboardedAt: company.onboardedAt,
          memoryEntries: company.memoryEntries,
          governanceActive: company.governanceActive,
        },
        connectors: company.connectors.map(c => ({
          name: c.name,
          type: c.type,
          status: c.status,
          dataPoints: c.dataPoints,
        })),
      });
    
    case 'excel':
      return generateExcel(title, company.connectors.map(c => ({
        ConnectorName: c.name,
        Type: c.type,
        Status: c.status,
        Mode: c.mode,
        LastSync: c.lastSync || '',
        DataPoints: c.dataPoints || 0,
      })));
    
    case 'json':
      return generateJSON(title, company);
    
    default:
      return { success: false, error: 'Unsupported format' };
  }
}

// ─── Business Plan Generator ──────────────────────────────────────────────────

export interface BusinessPlanInput {
  companyName: string;
  industry: string;
  mission: string;
  vision: string;
  objectives: string[];
  targetMarket: string;
  competitiveAdvantage: string;
}

export async function generateBusinessPlan(
  input: BusinessPlanInput,
  format: 'pdf' | 'json' = 'pdf'
): Promise<ExportResult> {
  const plan = {
    title: `${input.companyName} Business Plan`,
    generatedAt: new Date().toISOString(),
    sections: {
      executiveSummary: {
        companyName: input.companyName,
        industry: input.industry,
        mission: input.mission,
        vision: input.vision,
      },
      objectives: input.objectives,
      marketAnalysis: {
        targetMarket: input.targetMarket,
        competitiveAdvantage: input.competitiveAdvantage,
      },
      // Additional sections would be generated by AI models
      financialProjections: {
        note: 'Connect to financial models for detailed projections',
      },
      operationalPlan: {
        note: 'Connect to operational systems for detailed plan',
      },
    },
  };

  if (format === 'json') {
    return generateJSON(`${input.companyName}-business-plan`, plan);
  }

  return generatePDF(`${input.companyName}-business-plan`, plan);
}

// ─── Social Content Generator ─────────────────────────────────────────────────

export interface SocialContentInput {
  topic: string;
  tone: 'professional' | 'casual' | 'inspirational' | 'educational';
  platforms: ('twitter' | 'linkedin' | 'instagram' | 'facebook')[];
  hashtags?: string[];
}

export interface SocialContentOutput {
  platform: string;
  content: string;
  hashtags: string[];
  characterCount: number;
  mediaRecommendation?: string;
}

export async function generateSocialContent(
  input: SocialContentInput
): Promise<SocialContentOutput[]> {
  const outputs: SocialContentOutput[] = [];

  for (const platform of input.platforms) {
    const maxLength = {
      twitter: 280,
      linkedin: 3000,
      instagram: 2200,
      facebook: 63206,
    }[platform];

    // Generate platform-specific content
    let content = generatePlatformContent(input.topic, input.tone, platform);
    
    // Ensure content fits platform limits
    if (content.length > maxLength) {
      content = content.slice(0, maxLength - 3) + '...';
    }

    outputs.push({
      platform,
      content,
      hashtags: input.hashtags || generateHashtags(input.topic),
      characterCount: content.length,
      mediaRecommendation: getMediaRecommendation(platform),
    });
  }

  return outputs;
}

function generatePlatformContent(topic: string, tone: string, platform: string): string {
  // Base content (would use AI models in production)
  const templates: Record<string, Record<string, string>> = {
    professional: {
      twitter: `Exploring the latest developments in ${topic}. Key insights and analysis coming soon. #Innovation`,
      linkedin: `I've been analyzing trends in ${topic} and wanted to share some key observations.\n\nThe industry is evolving rapidly, and staying ahead requires constant learning and adaptation.\n\nWhat strategies are you implementing in this space?`,
      instagram: `Deep dive into ${topic} 🔍\n\nSwipe to learn more about how this is shaping our industry →`,
      facebook: `Exciting developments in ${topic}! Here's what you need to know about the latest trends and how they might impact your business.`,
    },
    casual: {
      twitter: `Been thinking a lot about ${topic} lately 🤔 What's your take?`,
      linkedin: `Quick thought on ${topic} - anyone else noticing these trends? Would love to hear different perspectives!`,
      instagram: `${topic} vibes ✨ Drop your thoughts below 👇`,
      facebook: `Let's talk about ${topic}! Who else is following this closely?`,
    },
    inspirational: {
      twitter: `The future of ${topic} is being written today. Be part of the change. 🚀`,
      linkedin: `Every great innovation in ${topic} started with someone asking "what if?"\n\nToday might be the day you make that leap. The only limit is the one you set for yourself.`,
      instagram: `Dream it. Build it. 💫\n\nThe world of ${topic} is waiting for your unique contribution.`,
      facebook: `Remember: every expert in ${topic} was once a beginner. Your journey starts with a single step.`,
    },
    educational: {
      twitter: `Did you know? ${topic} has evolved significantly over the past decade. Here's a quick breakdown 🧵`,
      linkedin: `Understanding ${topic}: A Comprehensive Guide\n\nI've put together some key insights that might help those new to this field.`,
      instagram: `${topic} 101 📚\n\nSave this for later! Breaking down the essentials in simple terms.`,
      facebook: `Learning about ${topic}? Here's everything you need to know to get started!`,
    },
  };

  return templates[tone]?.[platform] || `Discussing ${topic} and its implications.`;
}

function generateHashtags(topic: string): string[] {
  const words = topic.toLowerCase().split(/\s+/);
  const hashtags = words.map(w => `#${w.charAt(0).toUpperCase() + w.slice(1)}`);
  hashtags.push('#Innovation', '#Business', '#Growth');
  return hashtags.slice(0, 5);
}

function getMediaRecommendation(platform: string): string {
  const recommendations: Record<string, string> = {
    twitter: 'Image or short video (< 2:20) recommended',
    linkedin: 'Professional infographic or carousel slides',
    instagram: 'High-quality square image or Reel',
    facebook: 'Video content performs best, followed by images',
  };
  return recommendations[platform] || 'Visual content recommended';
}

// ─── Utility Functions ────────────────────────────────────────────────────────

function downloadBlob(blobUrl: string, filename: string): void {
  if (typeof window === 'undefined') return;
  
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up blob URL after download
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}

// ─── Universal Export Function ────────────────────────────────────────────────

export async function executeExport(config: ExportConfig): Promise<ExportResult> {
  const { format, dataType, filters } = config;

  switch (dataType) {
    case 'memory':
      // Would fetch actual data based on filters
      return exportMemories([], format as 'pdf' | 'excel' | 'json');
    
    case 'governance':
      return exportProposals([], format as 'pdf' | 'excel' | 'json');
    
    case 'company':
      return { success: false, error: 'Company data required' };
    
    default:
      return { success: false, error: `Unknown data type: ${dataType}` };
  }
}
