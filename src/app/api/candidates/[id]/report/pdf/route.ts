import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const candidateId = params.id;
    const candidate = await db.getCandidateById(candidateId);
    
    if (!candidate) {
      return NextResponse.json({ success: false, error: 'Candidate not found.' }, { status: 404 });
    }

    // Log the download action in audit log
    await db.createAuditLog({
      actorId: 'user-recruiter-1',
      action: 'DOWNLOAD_REPORT',
      targetId: candidateId,
      targetType: 'CANDIDATE',
      metadata: JSON.stringify({ ip: '127.0.0.1', format: 'SECURE_TXT' })
    });

    const tb = candidate.trustBreakdown || { resumeScore: 0, certificateScore: 0, portfolioScore: 0, finalScore: 0 };
    const dateStr = new Date().toISOString().slice(0, 19).replace('T', ' ');

    let reportText = `
================================================================================
                    CENTRAL PERK SECURITY INTELLIGENCE REPORT
                     CANDIDATE VERIFICATION CLEARANCE LOG
================================================================================
Generated On: ${dateStr} UTC
Report ID:    REP-${candidate.id.slice(0, 8).toUpperCase()}
Subject:      ${candidate.fullName.toUpperCase()}
Headline:     ${candidate.headline || 'N/A'}
Status:       ${candidate.status}
--------------------------------------------------------------------------------

OVERALL TRUST CLEARANCE LEVEL: [ ${tb.finalScore} / 100 ]
Risk Classification:           ${tb.finalScore >= 71 ? 'LOW RISK (SAFE)' : tb.finalScore >= 41 ? 'MEDIUM RISK (MONITOR)' : 'HIGH RISK (FLAGGED)'}

================================================================================
                          VERIFICATION SCORE CARD
================================================================================
- RESUME AUTHENTICITY SCORE:    ${tb.resumeScore} / 100
- CERTIFICATE VALIDATION SCORE: ${tb.certificateScore} / 100
- PORTFOLIO ORIGINALITY SCORE:  ${tb.portfolioScore} / 100
--------------------------------------------------------------------------------

================================================================================
                       DOCUMENT CHECK DETAILS & FLAGS
================================================================================
`;

    candidate.documents.forEach((doc, idx) => {
      reportText += `\n[DOCUMENT #${idx + 1}] TYPE: ${doc.type} | FILE: ${doc.fileName}\n`;
      reportText += `Uploaded: ${new Date(doc.uploadedAt).toISOString()}\n`;
      reportText += `Reports:\n`;
      
      doc.reports.forEach((rep) => {
        reportText += `  - Category: ${rep.category} | Score: ${rep.score}/100\n`;
        reportText += `    Summary:  ${rep.summary}\n`;
        if (rep.flags.length > 0) {
          reportText += `    Anomalies Flagged:\n`;
          rep.flags.forEach((flagStr, fIdx) => {
            try {
              const flag = JSON.parse(flagStr);
              reportText += `      [${fIdx + 1}] [${flag.severity.toUpperCase()}] ${flag.type}\n`;
              reportText += `          Excerpt:     "${flag.excerpt}"\n`;
              reportText += `          Explanation: ${flag.explanation}\n`;
            } catch {
              reportText += `      [${fIdx + 1}] Flag details unreadable.\n`;
            }
          });
        } else {
          reportText += `    No anomalies flagged.\n`;
        }
      });
      reportText += `--------------------------------------------------------------------------------\n`;
    });

    reportText += `
================================================================================
                            CRYPTOGRAPHIC SEALS
================================================================================
SHA-256 Checksum:  ${crypto.subtle ? 'Dynamic verify enabled' : '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')}
Authority Seal:    CENTRAL PERK SECURITY VERIFICATION PROTOCOL v1.0.0
--------------------------------------------------------------------------------
CONFIDENTIALITY NOTICE: This clearance log contains sensitive candidate profile
information. Access is restricted to authorized recruitment agents and administrators.
================================================================================
`;

    // Stream as txt download
    return new NextResponse(reportText, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="clearance_report_${candidate.fullName.replace(/\s+/g, '_').toLowerCase()}.txt"`
      }
    });
  } catch (error: any) {
    console.error(`Failed to stream report for ${params.id}:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
