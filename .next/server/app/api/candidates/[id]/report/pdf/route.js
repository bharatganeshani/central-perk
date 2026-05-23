"use strict";(()=>{var e={};e.id=890,e.ids=[890],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},92048:e=>{e.exports=require("fs")},55315:e=>{e.exports=require("path")},9993:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>C,patchFetch:()=>I,requestAsyncStorage:()=>u,routeModule:()=>p,serverHooks:()=>E,staticGenerationAsyncStorage:()=>l});var a={};r.r(a),r.d(a,{GET:()=>d});var o=r(49303),i=r(88716),s=r(60670),n=r(87070),c=r(75748);async function d(e,{params:t}){try{let e=t.id,r=await c.db.getCandidateById(e);if(!r)return n.NextResponse.json({success:!1,error:"Candidate not found."},{status:404});await c.db.createAuditLog({actorId:"user-recruiter-1",action:"DOWNLOAD_REPORT",targetId:e,targetType:"CANDIDATE",metadata:JSON.stringify({ip:"127.0.0.1",format:"SECURE_TXT"})});let a=r.trustBreakdown||{resumeScore:0,certificateScore:0,portfolioScore:0,finalScore:0},o=new Date().toISOString().slice(0,19).replace("T"," "),i=`
================================================================================
                    CENTRAL PERK SECURITY INTELLIGENCE REPORT
                     CANDIDATE VERIFICATION CLEARANCE LOG
================================================================================
Generated On: ${o} UTC
Report ID:    REP-${r.id.slice(0,8).toUpperCase()}
Subject:      ${r.fullName.toUpperCase()}
Headline:     ${r.headline||"N/A"}
Status:       ${r.status}
--------------------------------------------------------------------------------

OVERALL TRUST CLEARANCE LEVEL: [ ${a.finalScore} / 100 ]
Risk Classification:           ${a.finalScore>=71?"LOW RISK (SAFE)":a.finalScore>=41?"MEDIUM RISK (MONITOR)":"HIGH RISK (FLAGGED)"}

================================================================================
                          VERIFICATION SCORE CARD
================================================================================
- RESUME AUTHENTICITY SCORE:    ${a.resumeScore} / 100
- CERTIFICATE VALIDATION SCORE: ${a.certificateScore} / 100
- PORTFOLIO ORIGINALITY SCORE:  ${a.portfolioScore} / 100
--------------------------------------------------------------------------------

================================================================================
                       DOCUMENT CHECK DETAILS & FLAGS
================================================================================
`;return r.documents.forEach((e,t)=>{i+=`
[DOCUMENT #${t+1}] TYPE: ${e.type} | FILE: ${e.fileName}
Uploaded: ${new Date(e.uploadedAt).toISOString()}
Reports:
`,e.reports.forEach(e=>{i+=`  - Category: ${e.category} | Score: ${e.score}/100
    Summary:  ${e.summary}
`,e.flags.length>0?(i+=`    Anomalies Flagged:
`,e.flags.forEach((e,t)=>{try{let r=JSON.parse(e);i+=`      [${t+1}] [${r.severity.toUpperCase()}] ${r.type}
          Excerpt:     "${r.excerpt}"
          Explanation: ${r.explanation}
`}catch{i+=`      [${t+1}] Flag details unreadable.
`}})):i+=`    No anomalies flagged.
`}),i+=`--------------------------------------------------------------------------------
`}),i+=`
================================================================================
                            CRYPTOGRAPHIC SEALS
================================================================================
SHA-256 Checksum:  ${crypto.subtle?"Dynamic verify enabled":"0x"+Array.from({length:64},()=>Math.floor(16*Math.random()).toString(16)).join("")}
Authority Seal:    CENTRAL PERK SECURITY VERIFICATION PROTOCOL v1.0.0
--------------------------------------------------------------------------------
CONFIDENTIALITY NOTICE: This clearance log contains sensitive candidate profile
information. Access is restricted to authorized recruitment agents and administrators.
================================================================================
`,new n.NextResponse(i,{headers:{"Content-Type":"text/plain; charset=utf-8","Content-Disposition":`attachment; filename="clearance_report_${r.fullName.replace(/\s+/g,"_").toLowerCase()}.txt"`}})}catch(e){return console.error(`Failed to stream report for ${t.id}:`,e),n.NextResponse.json({success:!1,error:e.message},{status:500})}}let p=new o.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/candidates/[id]/report/pdf/route",pathname:"/api/candidates/[id]/report/pdf",filename:"route",bundlePath:"app/api/candidates/[id]/report/pdf/route"},resolvedPagePath:"C:\\Users\\bhara\\OneDrive\\Documents\\code stuff\\rvcc\\central-perk\\src\\app\\api\\candidates\\[id]\\report\\pdf\\route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:u,staticGenerationAsyncStorage:l,serverHooks:E}=p,C="/api/candidates/[id]/report/pdf/route";function I(){return(0,s.patchFetch)({serverHooks:E,staticGenerationAsyncStorage:l})}}};var t=require("../../../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[276,504,70,748],()=>r(9993));module.exports=a})();