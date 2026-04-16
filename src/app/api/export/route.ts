import { NextRequest, NextResponse } from 'next/server';
import { 
  generatePDF, 
  generateExcel, 
  generateJSON,
  exportMemories,
  exportProposals,
  exportCompanyReport,
} from '@/lib/exportEngine';
import { listMemories } from '@/lib/memoryEngine';
import { listProposals } from '@/lib/governanceEngine';
import { getDefaultCompany } from '@/lib/companyOnboarding';
import { safeString, senseEdge } from '@/lib/organismEdgeModel';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      dataType: 'memory' | 'governance' | 'company' | 'custom';
      format: 'pdf' | 'excel' | 'json';
      title?: string;
      data?: unknown;
    };

    const { dataType, format, title, data } = body;

    if (!dataType || !format) {
      return NextResponse.json(
        { error: 'dataType and format are required' },
        { status: 400 }
      );
    }

    let result;

    switch (dataType) {
      case 'memory': {
        const memories = listMemories(100);
        result = await exportMemories(memories, format);
        break;
      }

      case 'governance': {
        const proposals = listProposals();
        result = await exportProposals(proposals, format);
        break;
      }

      case 'company': {
        const company = getDefaultCompany();
        if (!company) {
          return NextResponse.json(
            { error: 'No company found' },
            { status: 404 }
          );
        }
        result = await exportCompanyReport(company, format);
        break;
      }

      case 'custom': {
        if (!data) {
          return NextResponse.json(
            { error: 'Data required for custom export' },
            { status: 400 }
          );
        }
        const exportTitle = safeString(title, 'Export', 'export.title');
        switch (format) {
          case 'pdf':
            result = await generatePDF(exportTitle, data as Record<string, unknown>);
            break;
          case 'excel':
            result = await generateExcel(exportTitle, data as Record<string, unknown>[]);
            break;
          case 'json':
            result = await generateJSON(exportTitle, data);
            break;
          default:
            return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
        }
        break;
      }

      default:
        return NextResponse.json(
          { error: `Unknown dataType: ${dataType}` },
          { status: 400 }
        );
    }

    if (!result.success) {
      senseEdge('api-error', 'export', result.error || 'Export failed', 'warning');
      return NextResponse.json(
        { error: result.error || 'Export failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      filename: result.filename,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    senseEdge('api-error', 'export', String(error), 'warning');
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoints: {
      POST: {
        description: 'Export data in various formats',
        body: {
          dataType: 'memory | governance | company | custom',
          format: 'pdf | excel | json',
          title: 'optional - title for custom exports',
          data: 'optional - data for custom exports',
        },
      },
    },
    supportedFormats: ['pdf', 'excel', 'json'],
    supportedDataTypes: ['memory', 'governance', 'company', 'custom'],
  });
}
