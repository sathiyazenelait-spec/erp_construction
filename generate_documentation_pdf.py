# -*- coding: utf-8 -*-
"""
BuildCon ERP - Complete Enterprise System Documentation Generator
Compiles comprehensive system documentation into an executive publication-grade PDF
via Chrome Headless into buildcon-erp/public/BuildCon_ERP_Complete_System_Documentation.pdf
"""

import os
import subprocess
import sys

OUTPUT_PDF_PATH_1 = r"C:\Users\DELL\Documents\erp_construction_project\erp_construction_project\buildcon-erp\public\BuildCon_ERP_Complete_System_Documentation.pdf"
OUTPUT_PDF_PATH_2 = r"C:\Users\DELL\Documents\erp_construction_project\buildcon-erp\public\BuildCon_ERP_Complete_System_Documentation.pdf"
TEMP_HTML_PATH = r"C:\Users\DELL\Documents\erp_construction_project\erp_construction_project\buildcon-erp\public\documentation_temp.html"

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>BuildCon ERP - Complete Enterprise System Documentation</title>
<style>
  @page {
    size: A4;
    margin: 16mm 14mm 16mm 14mm;
    @bottom-right {
      content: counter(page);
    }
  }

  body {
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    background: #ffffff;
    line-height: 1.5;
    font-size: 10pt;
    margin: 0;
    padding: 0;
  }

  .page-break {
    page-break-before: always;
  }

  /* Cover Page */
  .cover {
    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0369a1 100%);
    color: #ffffff;
    padding: 60px 40px;
    border-radius: 12px;
    min-height: 820px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .cover-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255,255,255,0.2);
    padding-bottom: 20px;
  }

  .cover-badge {
    background: rgba(56, 189, 248, 0.2);
    border: 1px solid #38bdf8;
    color: #38bdf8;
    padding: 6px 14px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 9pt;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .cover-title {
    margin-top: 60px;
  }

  .cover-title h1 {
    font-size: 34pt;
    font-weight: 800;
    line-height: 1.15;
    margin: 0 0 15px 0;
    color: #ffffff;
    letter-spacing: -0.5px;
  }

  .cover-title .subtitle {
    font-size: 14pt;
    color: #94a3b8;
    font-weight: 400;
    max-width: 650px;
    line-height: 1.4;
  }

  .cover-meta {
    background: rgba(15, 23, 42, 0.7);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 10px;
    padding: 24px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 40px;
  }

  .meta-item {
    display: flex;
    flex-direction: column;
  }

  .meta-label {
    font-size: 8pt;
    text-transform: uppercase;
    color: #94a3b8;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .meta-val {
    font-size: 11pt;
    color: #ffffff;
    font-weight: 700;
    margin-top: 4px;
  }

  .cover-footer {
    border-top: 1px solid rgba(255,255,255,0.2);
    padding-top: 20px;
    font-size: 8.5pt;
    color: #94a3b8;
    display: flex;
    justify-content: space-between;
  }

  /* Headings & Sections */
  h2 {
    font-size: 18pt;
    color: #0f172a;
    border-bottom: 2px solid #0284c7;
    padding-bottom: 6px;
    margin-top: 24px;
    margin-bottom: 14px;
    font-weight: 800;
    page-break-after: avoid;
  }

  h3 {
    font-size: 13pt;
    color: #0369a1;
    margin-top: 18px;
    margin-bottom: 8px;
    font-weight: 700;
    page-break-after: avoid;
  }

  h4 {
    font-size: 10.5pt;
    color: #334155;
    margin-top: 14px;
    margin-bottom: 6px;
    font-weight: 700;
    page-break-after: avoid;
  }

  p {
    margin: 0 0 10px 0;
    color: #334155;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0 18px 0;
    font-size: 8.5pt;
    page-break-inside: auto;
  }

  tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }

  th {
    background: #0f172a;
    color: #ffffff;
    text-align: left;
    padding: 7px 10px;
    font-weight: 700;
    border: 1px solid #334155;
    font-size: 8pt;
    letter-spacing: 0.3px;
    text-transform: uppercase;
  }

  td {
    padding: 7px 10px;
    border: 1px solid #cbd5e1;
    color: #334155;
    vertical-align: top;
  }

  tr:nth-child(even) td {
    background: #f8fafc;
  }

  /* Badges & Highlights */
  .badge {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 4px;
    font-size: 7.5pt;
    font-weight: 700;
    font-family: monospace;
  }

  .badge-get { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
  .badge-post { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
  .badge-put { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
  .badge-delete { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }

  .badge-role {
    background: #f1f5f9;
    color: #0f172a;
    border: 1px solid #cbd5e1;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 7.5pt;
    font-weight: 600;
  }

  .callout {
    background: #f0f9ff;
    border-left: 4px solid #0284c7;
    padding: 12px 14px;
    border-radius: 0 6px 6px 0;
    margin: 12px 0 16px 0;
    font-size: 9pt;
  }

  .callout-warn {
    background: #fffbeb;
    border-left: 4px solid #f59e0b;
    padding: 12px 14px;
    border-radius: 0 6px 6px 0;
    margin: 12px 0 16px 0;
    font-size: 9pt;
  }

  .callout-danger {
    background: #fef2f2;
    border-left: 4px solid #ef4444;
    padding: 12px 14px;
    border-radius: 0 6px 6px 0;
    margin: 12px 0 16px 0;
    font-size: 9pt;
  }

  /* Code Block */
  pre, code {
    font-family: 'Consolas', 'Courier New', monospace;
  }

  pre {
    background: #0f172a;
    color: #e2e8f0;
    padding: 12px;
    border-radius: 6px;
    overflow-x: auto;
    font-size: 8pt;
    line-height: 1.45;
    margin: 10px 0 14px 0;
    border: 1px solid #1e293b;
    page-break-inside: avoid;
  }

  code.inline {
    background: #f1f5f9;
    color: #0369a1;
    padding: 1px 4px;
    border-radius: 3px;
    font-size: 8.5pt;
    border: 1px solid #e2e8f0;
  }

  /* Workflow Steps */
  .workflow-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    margin: 14px 0;
  }

  .step-card {
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 12px 14px;
    background: #ffffff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    page-break-inside: avoid;
  }

  .step-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: 6px;
    margin-bottom: 6px;
  }

  .step-num {
    background: #0284c7;
    color: #ffffff;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 8pt;
    font-weight: 700;
    margin-right: 6px;
  }

  .step-title {
    font-weight: 700;
    color: #0f172a;
    font-size: 9.5pt;
  }

  /* Visual Diagrams */
  .diagram-container {
    background: #0b1120;
    border: 1px solid #1e293b;
    border-radius: 8px;
    padding: 16px;
    margin: 14px 0;
    text-align: center;
    page-break-inside: avoid;
  }

  .diagram-caption {
    font-size: 8pt;
    color: #94a3b8;
    margin-top: 8px;
    font-style: italic;
  }

  .header-running {
    display: flex;
    justify-content: space-between;
    font-size: 7.5pt;
    color: #94a3b8;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 4px;
    margin-bottom: 16px;
  }
</style>
</head>
<body>

<!-- ========================================================================= -->
<!-- COVER PAGE -->
<!-- ========================================================================= -->
<div class="cover">
  <div class="cover-header">
    <div style="font-weight: 800; font-size: 14pt; letter-spacing: 0.5px; color: #ffffff;">
      BUILDCON <span style="color: #38bdf8;">ERP</span>
    </div>
    <div class="cover-badge">Enterprise Edition 2.5</div>
  </div>

  <div class="cover-title">
    <h1>Complete Enterprise System Documentation</h1>
    <div class="subtitle">
      Comprehensive Feature Catalog, Role-Based Operational Workflows, Full REST API Specification, and System Architecture with Input/Output Examples.
    </div>
  </div>

  <div class="cover-meta">
    <div class="meta-item">
      <span class="meta-label">System Type</span>
      <span class="meta-val">Construction ERP + AI CAD/BIM</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Architecture</span>
      <span class="meta-val">3-Tier Microservices</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Tech Stack</span>
      <span class="meta-val">Next.js 14 + Spring Boot 3 + FastAPI</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Database Catalog</span>
      <span class="meta-val">42+ Organizations Multi-Tenant</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Security & RBAC</span>
      <span class="meta-val">JWT Bearer + Token Validation</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Publication Date</span>
      <span class="meta-val">November 2026 (Live System)</span>
    </div>
  </div>

  <div class="cover-footer">
    <span>BuildCon ERP Construction Systems Corporation &copy; 2026</span>
    <span>Confidential & Proprietary Enterprise Documentation</span>
  </div>
</div>

<div class="page-break"></div>

<!-- ========================================================================= -->
<!-- TABLE OF CONTENTS -->
<!-- ========================================================================= -->
<div class="header-running">
  <span>BUILDCON ERP ENTERPRISE DOCUMENTATION</span>
  <span>TABLE OF CONTENTS</span>
</div>

<h2>Table of Contents</h2>

<table style="margin-top: 20px;">
  <thead>
    <tr>
      <th style="width: 12%;">Section</th>
      <th style="width: 58%;">Module / Topic Title</th>
      <th style="width: 30%;">Key Functional Scope</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Section 1</strong></td>
      <td><strong>Complete ERP Feature Matrix (All Features)</strong></td>
      <td>16 Integrated Subsystems, 80+ Capabilities</td>
    </tr>
    <tr>
      <td><strong>Section 2</strong></td>
      <td><strong>Role-Based Operational Workflows</strong></td>
      <td>11 Enterprise Roles, Complete Execution Paths</td>
    </tr>
    <tr>
      <td><strong>Section 3</strong></td>
      <td><strong>Complete REST API Reference</strong></td>
      <td>40+ Spring Boot & FastAPI Microservice Endpoints</td>
    </tr>
    <tr>
      <td><strong>Section 4</strong></td>
      <td><strong>System Architecture & Data Flows</strong></td>
      <td>3-Tier Infrastructure, Security & Token Validation</td>
    </tr>
    <tr>
      <td><strong>Section 5</strong></td>
      <td><strong>Visual Diagram Gallery & Input/Output Examples</strong></td>
      <td>Architectural Vectors, Payload Schemas, UI Directives</td>
    </tr>
  </tbody>
</table>

<div class="callout">
  <strong>Documentation Scope:</strong> This document represents the unified system documentation of BuildCon ERP. It catalogs every functional feature, endpoint, data schema, role workflow, and visual artifact implemented in the production application without omission.
</div>

<div class="page-break"></div>

<!-- ========================================================================= -->
<!-- SECTION 1: COMPLETE FEATURE CATALOG -->
<!-- ========================================================================= -->
<div class="header-running">
  <span>SECTION 1: COMPLETE FEATURE CATALOG</span>
  <span>BUILDCON ERP SYSTEM OVERVIEW</span>
</div>

<h2>1. Complete ERP Feature Catalog</h2>
<p>
  BuildCon ERP is an enterprise-grade construction management platform built specifically for real estate developers, EPC contractors, civil infrastructure conglomerates, and multidisciplinary architectural firms. Below is the exhaustive matrix of all platform modules and capabilities.
</p>

<h3>1.1 Multi-Tenant Organization & Governance</h3>
<table>
  <thead>
    <tr>
      <th>Feature</th>
      <th>Module Path</th>
      <th>Description & Technical Specification</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Multi-Tenant Database Catalog</strong></td>
      <td><code class="inline">/api/organizations</code></td>
      <td>Dynamic organization catalog managing 42+ corporate entities with individual tenant IDs, subscription tiers (Enterprise, Pro, Starter), registered email domains, and Chairman executive board channels.</td>
    </tr>
    <tr>
      <td><strong>Tiered Subscription Engine</strong></td>
      <td><code class="inline">/super-admin/subscriptions</code></td>
      <td>Automated tier enforcement controlling maximum active project limits, cloud storage quotas, computational AI limits, and multi-user concurrent seat allocations.</td>
    </tr>
    <tr>
      <td><strong>Executive Board Approvals</strong></td>
      <td><code class="inline">/chairman/approvals</code></td>
      <td>Separated executive decision stream where high-capital requisitions, 3D building structural massing proposals, and IS 1200 BOQs require explicit Chairman signoff.</td>
    </tr>
    <tr>
      <td><strong>Chairman Executive Kill Switch</strong></td>
      <td><code class="inline">/api/drawings/{id}/revoke-access</code></td>
      <td>Emergency moratorium tool enabling the Chairman to immediately terminate access to any 3D model, revoking tokens and presenting a prominent red hazardous lockout screen.</td>
    </tr>
  </tbody>
</table>

<h3>1.2 Generative AI Blueprint Studio & 3D CAD/BIM Engine</h3>
<table>
  <thead>
    <tr>
      <th>Feature</th>
      <th>Technical Component</th>
      <th>Description & Standards Compliance</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Parametric 2D Blueprinting</strong></td>
      <td><code class="inline">AiBlueprintStudio.tsx</code></td>
      <td>Instant AI architectural generation of dimensional floor plans including grid axes, structural RCC columns, wall perimeters, fenestrations, doors, and room partition tags.</td>
    </tr>
    <tr>
      <td><strong>Interactive 3D Iso Massing</strong></td>
      <td><code class="inline">render3DBuilding()</code></td>
      <td>Vector isometric 3D extrusion with real-time horizontal orbit (0-360°) and pitch tilt (15-75°), day/night LED facade illumination, floor level pills, and height markers.</td>
    </tr>
    <tr>
      <td><strong>Geometric Form Synthesis</strong></td>
      <td><code class="inline">massingForm</code></td>
      <td>Full support for T-Shaped, H-Shaped, V-Shaped, U-Shaped, L-Shaped, Spherical Geodesic, Open-Center Square Quadrangle, and Circular Atrium structures.</td>
    </tr>
    <tr>
      <td><strong>Facade Palettes & Balconies</strong></td>
      <td>Curtain Wall Renderer</td>
      <td>Champagne Gold Luxury Glazing, Cyber Obsidian Smoke Black, Emerald Biophilic Vertical Green, and Alternating Cantilevered Floating Balconies with railings.</td>
    </tr>
    <tr>
      <td><strong>Automated Clash Detection</strong></td>
      <td><code class="inline">clash-detection</code></td>
      <td>Heuristic spatial clash detection scanning for architectural, structural, and MEP pipe/duct penetrations before site mobilization.</td>
    </tr>
    <tr>
      <td><strong>IS 1200 & CPWD BOQ Takeoffs</strong></td>
      <td><code class="inline">takeoff-prediction</code></td>
      <td>Automated bill of quantities generating exact concrete volumes (m³), steel reinforcement rebar (MT), cement bags, structural frame ratings (IS 13920 SMRF), and estimated INR project cost.</td>
    </tr>
  </tbody>
</table>

<h3>1.3 Access Tiering, Link Expiry & Backend Token Validation</h3>
<table>
  <thead>
    <tr>
      <th>Access Tier</th>
      <th>Assigned Routes</th>
      <th>Generation Quota & Token Validation Policy</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Public Guest Mode</strong></td>
      <td><code class="inline">/drawing</code>, <code class="inline">/drawings</code></td>
      <td>Strictly capped at <strong>3 generations per calendar day</strong>. Tracked per device date key. 4th generation displays the Quota Exceeded Lockout Modal.</td>
    </tr>
    <tr>
      <td><strong>Organization Users</strong></td>
      <td><code class="inline">/drawing/client</code>, <code class="inline">/drawing/pm</code>, <code class="inline">/drawing/admin</code>, <code class="inline">/drawing/pd</code>, <code class="inline">/drawing/contractor</code></td>
      <td><strong>Infinity / Unlimited generations</strong>. Bypasses all quota limitations with dedicated organizational badges and database organization target selectors.</td>
    </tr>
    <tr>
      <td><strong>Shareable Links & Tokens</strong></td>
      <td><code class="inline">/drawings/share?token=...</code></td>
      <td>Cryptographic token generation with configurable expiration windows: 1 Hour, 24 Hours, 7 Days, 30 Days, or Never. Verified via backend endpoint.</td>
    </tr>
    <tr>
      <td><strong>Access Tracking</strong></td>
      <td><code class="inline">/api/drawings/share/validate</code></td>
      <td>Logs client IP address, User-Agent header, incrementing access counter, and checking Chairman revocation status on each view.</td>
    </tr>
  </tbody>
</table>

<div class="page-break"></div>

<!-- ========================================================================= -->
<!-- SECTION 1 CONTINUED: CORE ERP MODULES -->
<!-- ========================================================================= -->
<div class="header-running">
  <span>SECTION 1: COMPLETE FEATURE CATALOG</span>
  <span>CONSTRUCTION MANAGEMENT MODULES</span>
</div>

<h3>1.4 Project Management & Work Breakdown Structure (WBS)</h3>
<table>
  <thead>
    <tr>
      <th>Capability</th>
      <th>Route & API</th>
      <th>Key Features & Outputs</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Multi-Project Portfolio</strong></td>
      <td><code class="inline">/project-manager</code>, <code class="inline">/api/projects</code></td>
      <td>Comprehensive project master tracking milestones, baseline vs actual schedules, S-curve budget performance, and physical progress percentages.</td>
    </tr>
    <tr>
      <td><strong>WBS & Task Scheduling</strong></td>
      <td><code class="inline">ProjectController.java</code></td>
      <td>Hierarchical task breakdown across substructure, superstructure, MEP rough-in, external glazing, and interior fit-out with Gantt dependencies.</td>
    </tr>
    <tr>
      <td><strong>Daily Progress Reports (DPR)</strong></td>
      <td><code class="inline">/site-management</code>, <code class="inline">/api/site-logs</code></td>
      <td>Daily site logging recording site weather, work activities completed, machinery operating hours, concrete pour logs, and safety toolbox topics.</td>
    </tr>
    <tr>
      <td><strong>Project Alert Gateway</strong></td>
      <td><code class="inline">/notifications</code>, <code class="inline">/api/project-alerts</code></td>
      <td>Critical notification engine alerting stakeholders to schedule delays, cost overruns, safety breaches, and pending Chairman approvals.</td>
    </tr>
  </tbody>
</table>

<h3>1.5 Procurement, Materials & Store Inventory</h3>
<table>
  <thead>
    <tr>
      <th>Capability</th>
      <th>Route & API</th>
      <th>Key Features & Outputs</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Material Requisitions (MRN)</strong></td>
      <td><code class="inline">/procurement-manager</code></td>
      <td>Site-to-procurement workflow requesting cement, aggregate, TMT steel rebars, formwork, and consumables against BOQ budget limits.</td>
    </tr>
    <tr>
      <td><strong>Purchase Orders (PO)</strong></td>
      <td><code class="inline">ProcurementManagerController.java</code></td>
      <td>Formal vendor purchase order issuance with rate contracts, payment milestones, delivery schedules, and tax structures (GST/TDS).</td>
    </tr>
    <tr>
      <td><strong>Goods Receipt Note (GRN)</strong></td>
      <td><code class="inline">/store-manager</code>, <code class="inline">/api/inventory</code></td>
      <td>Security gate verification, weight bridge slips, delivery inspection, three-way matching against PO, and central warehouse stock updates.</td>
    </tr>
    <tr>
      <td><strong>Bin Cards & Min-Max Alerts</strong></td>
      <td><code class="inline">StoreManagerController.java</code></td>
      <td>Real-time inventory levels, re-order level triggers, inventory write-offs, and physical stock reconciliation logs.</td>
    </tr>
  </tbody>
</table>

<h3>1.6 Quality Assurance, Quality Control (QA/QC) & Safety (HSE)</h3>
<table>
  <thead>
    <tr>
      <th>Capability</th>
      <th>Route & API</th>
      <th>Key Features & Outputs</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Concrete Cube Test Logs</strong></td>
      <td><code class="inline">/qa-qc-engineer</code>, <code class="inline">/api/cube-tests</code></td>
      <td>Standard 7-day, 14-day, and 28-day concrete cube compressive strength test logging (M25, M30, M40) with automated pass/fail verification.</td>
    </tr>
    <tr>
      <td><strong>Non-Conformance Reports (NCR)</strong></td>
      <td><code class="inline">QaQcEngineerController.java</code></td>
      <td>Defect tracking, photographic snagging, root cause assignment, corrective action validation, and closeout signoffs.</td>
    </tr>
    <tr>
      <td><strong>HSE & OSHA Compliance</strong></td>
      <td><code class="inline">/compliance</code>, <code class="inline">/api/compliance</code></td>
      <td>Daily safety inspections, mandatory PPE audits, scaffolding load approvals, hazardous work permits, and incident severity logging.</td>
    </tr>
  </tbody>
</table>

<h3>1.7 Billing, Subcontractor & Financial Management</h3>
<table>
  <thead>
    <tr>
      <th>Capability</th>
      <th>Route & API</th>
      <th>Key Features & Outputs</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Running Account (RA) Bills</strong></td>
      <td><code class="inline">/quantity-surveyor</code>, <code class="inline">/finance-accounts</code></td>
      <td>Joint measurement sheet verification, previous bill deductions, retention money (5%), mobilization advance recovery, and net payable calculations.</td>
    </tr>
    <tr>
      <td><strong>Subcontractor Measurement</strong></td>
      <td><code class="inline">/subcontractor</code>, <code class="inline">/api/subcontractors</code></td>
      <td>Item-rate and piece-rate contractor work order tracking, measurement verification by site engineers, and debit note deductions.</td>
    </tr>
    <tr>
      <td><strong>Progress Claims & Revenue</strong></td>
      <td><code class="inline">/api/progress-claims</code></td>
      <td>Client milestone billing, payment certificate issuance, GST compliance invoices, and accounts receivable aging tracking.</td>
    </tr>
  </tbody>
</table>

<div class="page-break"></div>

<!-- ========================================================================= -->
<!-- SECTION 2: WORKFLOW BY ROLES -->
<!-- ========================================================================= -->
<div class="header-running">
  <span>SECTION 2: WORKFLOW BY ROLES</span>
  <span>EXECUTIVE & DIRECTORIAL WORKFLOWS</span>
</div>

<h2>2. Operational Workflow by Roles</h2>
<p>
  BuildCon ERP implements a strict, segregated Role-Based Access Control (RBAC) model. Below are the sequential, day-to-day operational workflows for every key stakeholder in the organization.
</p>

<h3>2.1 Organization Chairman & Executive Board</h3>
<div class="workflow-grid">
  <div class="step-card">
    <div class="step-card-header">
      <span class="step-title"><span class="step-num">1</span>Review Executive Approvals Stream</span>
      <span class="badge-role">Chairman Dashboard</span>
    </div>
    <p>Chairman logs in to <code class="inline">/chairman/approvals</code>. The dashboard aggregates separated approval streams: High-Capital Project Authorizations, Material POs &gt; ₹50 Lakhs, and 3D Building Structural Massing Proposals submitted by site teams.</p>
  </div>
  <div class="step-card">
    <div class="step-card-header">
      <span class="step-title"><span class="step-num">2</span>Inspect 3D Building Model & CAD Blueprint</span>
      <span class="badge-role">Chairman3DModelViewer</span>
    </div>
    <p>Chairman interacts with the 1:1 isometric 3D massing viewer. Inspects champagne gold/cyber obsidian glass facades, alternating cantilever balconies, roof parapet elevations, and structural IS 13920 framing data.</p>
  </div>
  <div class="step-card">
    <div class="step-card-header">
      <span class="step-title"><span class="step-num">3</span>Execute Decision: Approve, Reject, or Moratorium Kill</span>
      <span class="badge-role">Executive Decision</span>
    </div>
    <p>Chairman enters official board remarks. If approved, budget authorizations propagate to the Project Director. If a safety hazard or moratorium directive is issued, Chairman clicks <strong>"Revoke 3D Access"</strong>, executing an immediate kill order invalidating all internal and external access.</p>
  </div>
</div>

<h3>2.2 Project Director (PD) & Managing Director (MD)</h3>
<div class="workflow-grid">
  <div class="step-card">
    <div class="step-card-header">
      <span class="step-title"><span class="step-num">1</span>Portfolio Governance & Capital Allocation</span>
      <span class="badge-role">/project-director</span>
    </div>
    <p>Reviews multi-project cashflows, schedule variance (SPI), cost performance index (CPI), and high-risk safety snags across all active sites.</p>
  </div>
  <div class="step-card">
    <div class="step-card-header">
      <span class="step-title"><span class="step-num">2</span>Contractor Work Order Signoffs & Scope Changes</span>
      <span class="badge-role">Strategic Approvals</span>
    </div>
    <p>Authorizes scope variations, approves major subcontractor contracts, and releases milestone funds upon verification of client payment claims.</p>
  </div>
</div>

<h3>2.3 Project Manager (PM)</h3>
<div class="workflow-grid">
  <div class="step-card">
    <div class="step-card-header">
      <span class="step-title"><span class="step-num">1</span>WBS Milestone Tracking & Resource Scheduling</span>
      <span class="badge-role">/project-manager</span>
    </div>
    <p>Maintains project baseline timelines. Identifies critical path activities (e.g. Raft Foundation, Shear Walls, Tower Crane erection) and assigns daily targets.</p>
  </div>
  <div class="step-card">
    <div class="step-card-header">
      <span class="step-title"><span class="step-num">2</span>Daily DPR Signoff & Material Clearance</span>
      <span class="badge-role">Operational Review</span>
    </div>
    <p>Reviews and approves Daily Progress Reports (DPR) submitted by Senior Site Engineers. Validates material requisition urgency and authorizes emergency local purchases.</p>
  </div>
</div>

<div class="page-break"></div>

<!-- ========================================================================= -->
<!-- SECTION 2 CONTINUED: SITE, QA/QC & PROCUREMENT WORKFLOWS -->
<!-- ========================================================================= -->
<div class="header-running">
  <span>SECTION 2: WORKFLOW BY ROLES</span>
  <span>SITE ENGINEERING, QA/QC & PROCUREMENT</span>
</div>

<h3>2.4 Senior Site Engineer & CAD Engineering Team</h3>
<div class="workflow-grid">
  <div class="step-card">
    <div class="step-card-header">
      <span class="step-title"><span class="step-num">1</span>AI Blueprint Generation & Structural Modeling</span>
      <span class="badge-role">/drawing/pm or /drawing/admin</span>
    </div>
    <p>Uses the Generative AI Blueprint Studio with <strong>Infinity / Unlimited Generations</strong>. Generates parametric blueprints from natural language prompts, selects structural massing form (e.g., T-Shape, H-Shape), and verifies IS 1200 BOQ takeoffs.</p>
  </div>
  <div class="step-card">
    <div class="step-card-header">
      <span class="step-title"><span class="step-num">2</span>Submit 3D Proposal to Organization Chairman</span>
      <span class="badge-role">Send to Chairman Modal</span>
    </div>
    <p>Opens the submission dialog, chooses the target database organization from the catalog dropdown, enters justification notes, and submits for Board Approval.</p>
  </div>
  <div class="step-card">
    <div class="step-card-header">
      <span class="step-title"><span class="step-num">3</span>Share Model with Subcontractors & Generate Token Link</span>
      <span class="badge-role">Share 3D Model</span>
    </div>
    <p>Generates shareable token links with selected expiry (e.g., 24 Hours or 7 Days) for mobile and desktop inspection by structural steel fabricators and MEP sub-vendors.</p>
  </div>
  <div class="step-card">
    <div class="step-card-header">
      <span class="step-title"><span class="step-num">4</span>Execute Pour Cards & Daily Site Logging</span>
      <span class="badge-role">/senior-site-engineer</span>
    </div>
    <p>Completes pre-pour inspection checklists (rebar spacing, cover blocks, shuttering plumb, embedded conduits) and logs DPR data at end-of-shift.</p>
  </div>
</div>

<h3>2.5 QA/QC Quality & Safety Engineer</h3>
<div class="workflow-grid">
  <div class="step-card">
    <div class="step-card-header">
      <span class="step-title"><span class="step-num">1</span>Sample Concrete Cubes & Register Batch ID</span>
      <span class="badge-role">/qa-qc-engineer</span>
    </div>
    <p>Casts 6 concrete test cubes per 50m³ pour. Records batching plant slip, truck transit time, slump test measurement (e.g., 120mm), and curing tank placement.</p>
  </div>
  <div class="step-card">
    <div class="step-card-header">
      <span class="step-title"><span class="step-num">2</span>Crush Test Verification (7-Day & 28-Day Strength)</span>
      <span class="badge-role">Cube Testing Machine</span>
    </div>
    <p>Inputs compressive breaking load (kN) into <code class="inline">/api/cube-tests</code>. System calculates compressive strength in N/mm² and verifies compliance against grade threshold (e.g., &ge; 40 N/mm² for M40 grade).</p>
  </div>
  <div class="step-card">
    <div class="step-card-header">
      <span class="step-title"><span class="step-num">3</span>Issue Snag Lists & Non-Conformance Notices (NCR)</span>
      <span class="badge-role">NCR Management</span>
    </div>
    <p>Logs honeycomb patches, rebar displacement, or cold joints. Issues formal NCR with photos and halts progressive pouring until remediation is verified.</p>
  </div>
</div>

<h3>2.6 Procurement Manager & Store Manager</h3>
<div class="workflow-grid">
  <div class="step-card">
    <div class="step-card-header">
      <span class="step-title"><span class="step-num">1</span>Process Material Requisitions (MRN)</span>
      <span class="badge-role">/procurement-manager</span>
    </div>
    <p>Reviews site requisitions against project BOQ allowances. Groups orders to leverage bulk mill pricing for cement, aggregate, and structural steel.</p>
  </div>
  <div class="step-card">
    <div class="step-card-header">
      <span class="step-title"><span class="step-num">2</span>RFQ, Vendor Comparison & PO Issuance</span>
      <span class="badge-role">PO Generator</span>
    </div>
    <p>Dispatches RFQs, evaluates three commercial quotes, and issues PO with liquidated damages clauses, delivery milestones, and payment terms.</p>
  </div>
  <div class="step-card">
    <div class="step-card-header">
      <span class="step-title"><span class="step-num">3</span>Gate Verification & GRN Stock Inwarding</span>
      <span class="badge-role">/store-manager</span>
    </div>
    <p>Inspects manufacturer test certificates (MTC), validates weighbridge gross/tare weights, issues GRN, and updates central store bin cards.</p>
  </div>
</div>

<div class="page-break"></div>

<!-- ========================================================================= -->
<!-- SECTION 2 CONTINUED: BILLING, CLIENT & PUBLIC USERS -->
<!-- ========================================================================= -->
<div class="header-running">
  <span>SECTION 2: WORKFLOW BY ROLES</span>
  <span>FINANCIAL BILLING, CLIENT PORTAL & PUBLIC GUESTS</span>
</div>

<h3>2.7 Quantity Surveyor (QS) & Billing Engineer</h3>
<div class="workflow-grid">
  <div class="step-card">
    <div class="step-card-header">
      <span class="step-title"><span class="step-num">1</span>Joint Site Measurements (JMS) Verification</span>
      <span class="badge-role">/quantity-surveyor</span>
    </div>
    <p>Conducts joint on-site physical dimension check with subcontractor and client representatives. Cross-references against approved CAD drawings.</p>
  </div>
  <div class="step-card">
    <div class="step-card-header">
      <span class="step-title"><span class="step-num">2</span>Prepare Running Account (RA) Bill</span>
      <span class="badge-role">RA Billing Engine</span>
    </div>
    <p>Applies BOQ contracted item rates. Calculates cumulative progress, deducts previous bill payments, applies 5% statutory retention and statutory tax deductions (TDS, GST-TDS).</p>
  </div>
</div>

<h3>2.8 Client / Owner Stakeholder</h3>
<div class="workflow-grid">
  <div class="step-card">
    <div class="step-card-header">
      <span class="step-title"><span class="step-num">1</span>Review Project Progress & Milestone S-Curves</span>
      <span class="badge-role">/client-portal</span>
    </div>
    <p>Client reviews overall project health, live drone site photos, milestone deliverables, and quality test certificate approvals.</p>
  </div>
  <div class="step-card">
    <div class="step-card-header">
      <span class="step-title"><span class="step-num">2</span>Inspect 3D Architectural Models & Authorize Revisions</span>
      <span class="badge-role">/drawing/client</span>
    </div>
    <p>Client inspects 3D building model with <strong>Unlimited Org Access</strong>. Reviews proposed layout variations and approves architectural revisions.</p>
  </div>
</div>

<h3>2.9 Public / Guest User</h3>
<div class="workflow-grid">
  <div class="step-card">
    <div class="step-card-header">
      <span class="step-title"><span class="step-num">1</span>Explore Public CAD/BIM Studio</span>
      <span class="badge-role">/drawing or /drawings</span>
    </div>
    <p>Public visitor lands on the AI Blueprint Studio in <strong>Guest Mode</strong>. Header clearly indicates: <code class="inline">🌐 Public Guest Mode • 3 / 3 Daily Free Generations Left</code>.</p>
  </div>
  <div class="step-card">
    <div class="step-card-header">
      <span class="step-title"><span class="step-num">2</span>Generate 3 Blueprint Models per Calendar Day</span>
      <span class="badge-role">Daily Quota Enforcement</span>
    </div>
    <p>Visitor generates building designs with real-time 3D models. The daily countdown decrements (3 &rarr; 2 &rarr; 1 &rarr; 0). On the 4th generation attempt, the <strong>Quota Exceeded Modal</strong> appears, preventing further generations and offering an instant upgrade to an Organization Plan.</p>
  </div>
  <div class="step-card">
    <div class="step-card-header">
      <span class="step-title"><span class="step-num">3</span>View External Shareable 3D Models</span>
      <span class="badge-role">/drawings/share?token=...</span>
    </div>
    <p>Accesses client-shared 3D models via responsive web link. Token validity, expiration date, and Chairman kill switch state are validated before rendering.</p>
  </div>
</div>

<div class="page-break"></div>

<!-- ========================================================================= -->
<!-- SECTION 3: COMPLETE REST API SPECIFICATIONS -->
<!-- ========================================================================= -->
<div class="header-running">
  <span>SECTION 3: REST API SPECIFICATION</span>
  <span>SPRING BOOT & FASTAPI ENDPOINTS</span>
</div>

<h2>3. Complete REST API Specifications</h2>
<p>
  BuildCon ERP exposes a comprehensive set of RESTful services partitioned across the Spring Boot backend (<code class="inline">http://localhost:8081</code>) and the FastAPI generative AI engine (<code class="inline">http://localhost:8001</code>).
</p>

<h3>3.1 Spring Boot Core Enterprise Services (Port 8081)</h3>
<table>
  <thead>
    <tr>
      <th style="width: 10%;">Verb</th>
      <th style="width: 32%;">Endpoint Path</th>
      <th style="width: 28%;">Request Body / Params</th>
      <th style="width: 30%;">Response Schema & Codes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><span class="badge badge-get">GET</span></td>
      <td><code class="inline">/api/organizations</code></td>
      <td>None (Public/Session)</td>
      <td><code class="inline">200 OK</code>: Array of organization objects with <code class="inline">id</code>, <code class="inline">name</code>, <code class="inline">subscriptionTier</code>, <code class="inline">orgUsername</code>.</td>
    </tr>
    <tr>
      <td><span class="badge badge-get">GET</span></td>
      <td><code class="inline">/api/chairman/approvals</code></td>
      <td><code class="inline">?orgId={id}</code> (Optional)</td>
      <td><code class="inline">200 OK</code>: List of executive items (<code class="inline">type="3D_MODEL"</code>), requester, amount, status, BOQ JSON.</td>
    </tr>
    <tr>
      <td><span class="badge badge-post">POST</span></td>
      <td><code class="inline">/api/chairman/approvals</code></td>
      <td><code class="inline">approvalPayload</code> (JSON)</td>
      <td><code class="inline">200 OK</code>: Returns created approval record with sequential ID and audit timestamp.</td>
    </tr>
    <tr>
      <td><span class="badge badge-post">POST</span></td>
      <td><code class="inline">/api/chairman/approvals/{id}/action</code></td>
      <td><code class="inline">{ action, remarks, approvedBy }</code></td>
      <td><code class="inline">200 OK</code>: Updates status to <code class="inline">Approved</code>, <code class="inline">Rejected</code>, or <code class="inline">Revoked</code>.</td>
    </tr>
    <tr>
      <td><span class="badge badge-post">POST</span></td>
      <td><code class="inline">/api/drawings/share/create</code></td>
      <td><code class="inline">{ modelTitle, orgName, expiryHours, drawingId }</code></td>
      <td><code class="inline">200 OK</code>: Returns cryptographic <code class="inline">token</code>, <code class="inline">shareUrl</code>, expiry date, access count 0.</td>
    </tr>
    <tr>
      <td><span class="badge badge-get">GET</span></td>
      <td><code class="inline">/api/drawings/share/validate</code></td>
      <td><code class="inline">?token={dwg_token_...}</code></td>
      <td><code class="inline">200 OK</code>: Validates expiration & revocation; increments view count; returns model payload.</td>
    </tr>
    <tr>
      <td><span class="badge badge-post">POST</span></td>
      <td><code class="inline">/api/drawings/{id}/revoke-access</code></td>
      <td><code class="inline">{ reason }</code></td>
      <td><code class="inline">200 OK</code>: Sets status <code class="inline">REVOKED</code>; invalidates share tokens; executes kill order.</td>
    </tr>
    <tr>
      <td><span class="badge badge-get">GET</span></td>
      <td><code class="inline">/api/drawings/{id}/access-tracking</code></td>
      <td>None</td>
      <td><code class="inline">200 OK</code>: Returns access history, view count, client IPs, and revocation directive state.</td>
    </tr>
    <tr>
      <td><span class="badge badge-get">GET</span></td>
      <td><code class="inline">/api/drawings/quota/check</code></td>
      <td><code class="inline">?role={role}</code></td>
      <td><code class="inline">200 OK</code>: Returns quota type (<code class="inline">DAILY_3_LIMIT</code> for public vs <code class="inline">INFINITY</code> for org).</td>
    </tr>
    <tr>
      <td><span class="badge badge-post">POST</span></td>
      <td><code class="inline">/api/drawings/upload</code></td>
      <td><code class="inline">drawingPayload</code> (JSON/DWG)</td>
      <td><code class="inline">200 OK</code>: Registers CAD drawing under <code class="inline">UNDER_REVIEW</code> in Drawings Hub.</td>
    </tr>
    <tr>
      <td><span class="badge badge-get">GET</span></td>
      <td><code class="inline">/api/projects</code></td>
      <td><code class="inline">?status=ACTIVE</code></td>
      <td><code class="inline">200 OK</code>: Returns project list, budget, start/target end dates, percentage completion.</td>
    </tr>
    <tr>
      <td><span class="badge badge-post">POST</span></td>
      <td><code class="inline">/api/projects</code></td>
      <td><code class="inline">{ name, budget, orgId, wbs }</code></td>
      <td><code class="inline">201 Created</code>: Creates new project master record with WBS baseline milestones.</td>
    </tr>
    <tr>
      <td><span class="badge badge-get">GET</span></td>
      <td><code class="inline">/api/site-logs</code></td>
      <td><code class="inline">?projectId={id}</code></td>
      <td><code class="inline">200 OK</code>: Returns daily DPR logs, weather conditions, manpower, plant operating hours.</td>
    </tr>
    <tr>
      <td><span class="badge badge-post">POST</span></td>
      <td><code class="inline">/api/cube-tests</code></td>
      <td><code class="inline">{ grade, batchId, ageDays, breakLoadKn }</code></td>
      <td><code class="inline">200 OK</code>: Calculates compressive strength (N/mm²); returns pass/fail status.</td>
    </tr>
    <tr>
      <td><span class="badge badge-get">GET</span></td>
      <td><code class="inline">/api/inventory</code></td>
      <td><code class="inline">?storeId={id}</code></td>
      <td><code class="inline">200 OK</code>: Stock bin levels, reorder threshold alerts, valuation at weighted average cost.</td>
    </tr>
    <tr>
      <td><span class="badge badge-post">POST</span></td>
      <td><code class="inline">/api/invoices/ra-bill</code></td>
      <td><code class="inline">{ jmsId, boqItems, retentionPct }</code></td>
      <td><code class="inline">200 OK</code>: Returns formatted RA Bill, net payable, tax schedule, and payment advice.</td>
    </tr>
  </tbody>
</table>

<h3>3.2 FastAPI Generative AI & BIM Microservice (Port 8001)</h3>
<table>
  <thead>
    <tr>
      <th style="width: 10%;">Verb</th>
      <th style="width: 32%;">Endpoint Path</th>
      <th style="width: 28%;">Request Body / Params</th>
      <th style="width: 30%;">Response Schema & Codes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><span class="badge badge-post">POST</span></td>
      <td><code class="inline">/api/ai/generate-blueprint</code></td>
      <td><code class="inline">{ prompt, projectType, builtupSqft, floors, theme }</code></td>
      <td><code class="inline">200 OK</code>: Complete blueprint JSON, dimensional rooms, 3D massing spec, takeoff BOQ.</td>
    </tr>
    <tr>
      <td><span class="badge badge-post">POST</span></td>
      <td><code class="inline">/api/ai/clash-detection</code></td>
      <td><code class="inline">{ architecturalDwg, mepDwg }</code></td>
      <td><code class="inline">200 OK</code>: Coordinate-mapped spatial interference report with severity rankings.</td>
    </tr>
    <tr>
      <td><span class="badge badge-post">POST</span></td>
      <td><code class="inline">/api/ai/takeoff-prediction</code></td>
      <td><code class="inline">{ floorCount, builtupSqft, frameType }</code></td>
      <td><code class="inline">200 OK</code>: Concrete (m³), steel rebar (MT), cement bags, brickwork, finishing takeoffs.</td>
    </tr>
    <tr>
      <td><span class="badge badge-post">POST</span></td>
      <td><code class="inline">/api/ai/cost-estimation</code></td>
      <td><code class="inline">{ takeoffBoq, regionPincode }</code></td>
      <td><code class="inline">200 OK</code>: CPWD/DSR indexed structural, MEP, finishing, labor, and total INR project cost.</td>
    </tr>
  </tbody>
</table>

<div class="page-break"></div>

<!-- ========================================================================= -->
<!-- SECTION 4: SYSTEM ARCHITECTURE & DATA FLOW -->
<!-- ========================================================================= -->
<div class="header-running">
  <span>SECTION 4: SYSTEM ARCHITECTURE</span>
  <span>INFRASTRUCTURE, DATA FLOW & SECURITY</span>
</div>

<h2>4. System Architecture & Data Flow</h2>
<p>
  BuildCon ERP is designed around an enterprise 3-tier microservice architecture delivering sub-second response times, zero-latency parametric rendering, and horizontal scalability.
</p>

<h3>4.1 3-Tier Enterprise Infrastructure Architecture</h3>
<div class="diagram-container">
  <svg width="650" height="230" viewBox="0 0 650 230" style="margin: 0 auto; display: block;">
    <!-- Tier 1: Frontend Client -->
    <rect x="20" y="20" width="180" height="190" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" />
    <text x="110" y="45" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">TIER 1: CLIENT PRESENTATION</text>
    <rect x="35" y="60" width="150" height="30" rx="4" fill="#0f172a" stroke="#475569" />
    <text x="110" y="79" fill="#f8fafc" font-size="9" text-anchor="middle">Next.js 14 App Router (Port 3000)</text>
    <rect x="35" y="100" width="150" height="30" rx="4" fill="#0f172a" stroke="#475569" />
    <text x="110" y="119" fill="#f8fafc" font-size="9" text-anchor="middle">AiBlueprintStudio 3D Engine</text>
    <rect x="35" y="140" width="150" height="30" rx="4" fill="#0f172a" stroke="#475569" />
    <text x="110" y="159" fill="#f8fafc" font-size="9" text-anchor="middle">Chairman3DModelViewer</text>
    <rect x="35" y="180" width="150" height="20" rx="4" fill="#0369a1" />
    <text x="110" y="194" fill="#ffffff" font-size="8" font-weight="bold" text-anchor="middle">Tailwind CSS + Lucide Icons</text>

    <!-- Arrow 1 to 2 -->
    <line x1="200" y1="115" x2="235" y2="115" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)" />
    <text x="218" y="105" fill="#94a3b8" font-size="7" text-anchor="middle">REST/JSON</text>

    <!-- Tier 2: Microservices Layer -->
    <rect x="240" y="20" width="200" height="190" rx="8" fill="#1e293b" stroke="#10b981" stroke-width="1.5" />
    <text x="340" y="45" fill="#10b981" font-size="11" font-weight="bold" text-anchor="middle">TIER 2: MICROSERVICES</text>
    <rect x="255" y="60" width="170" height="42" rx="4" fill="#064e3b" stroke="#059669" />
    <text x="340" y="78" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">Spring Boot 3 (Port 8081)</text>
    <text x="340" y="93" fill="#a7f3d0" font-size="7.5" text-anchor="middle">Auth, ERP, Org Catalog, Approvals</text>
    <rect x="255" y="115" width="170" height="42" rx="4" fill="#78350f" stroke="#d97706" />
    <text x="340" y="133" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">FastAPI AI Engine (Port 8001)</text>
    <text x="340" y="148" fill="#fde68a" font-size="7.5" text-anchor="middle">Gemini Pro, Massing, Takeoffs, BOQ</text>
    <rect x="255" y="170" width="170" height="30" rx="4" fill="#0f172a" stroke="#475569" />
    <text x="340" y="189" fill="#94a3b8" font-size="8" text-anchor="middle">Token Validator & Kill Switch Gateway</text>

    <!-- Arrow 2 to 3 -->
    <line x1="440" y1="115" x2="475" y2="115" stroke="#10b981" stroke-width="2" />
    <text x="458" y="105" fill="#94a3b8" font-size="7" text-anchor="middle">JPA/SQL</text>

    <!-- Tier 3: Persistence Layer -->
    <rect x="480" y="20" width="150" height="190" rx="8" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5" />
    <text x="555" y="45" fill="#f59e0b" font-size="11" font-weight="bold" text-anchor="middle">TIER 3: DATA STORE</text>
    <rect x="495" y="65" width="120" height="35" rx="4" fill="#0f172a" stroke="#475569" />
    <text x="555" y="82" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">PostgreSQL / H2</text>
    <text x="555" y="94" fill="#94a3b8" font-size="7" text-anchor="middle">115 JPA Repositories</text>
    <rect x="495" y="110" width="120" height="35" rx="4" fill="#0f172a" stroke="#475569" />
    <text x="555" y="127" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">42+ Orgs Catalog</text>
    <text x="555" y="139" fill="#94a3b8" font-size="7" text-anchor="middle">Tenant Data & Tiers</text>
    <rect x="495" y="155" width="120" height="35" rx="4" fill="#0f172a" stroke="#475569" />
    <text x="555" y="172" fill="#ffffff" font-size="8.5" font-weight="bold" text-anchor="middle">Share Token Registry</text>
    <text x="555" y="184" fill="#94a3b8" font-size="7" text-anchor="middle">Expiration & Access Logs</text>
  </svg>
  <div class="diagram-caption">Figure 4.1: BuildCon ERP 3-Tier Enterprise Infrastructure Architecture</div>
</div>

<h3>4.2 Token Validation & Chairman Moratorium Kill Order Flow</h3>
<p>
  When a user accesses an external 3D model via <code class="inline">/drawings/share?token=dwg_token_...</code>, the system performs a multi-layer verification:
</p>
<ol style="font-size: 8.5pt; color: #334155; line-height: 1.6; margin: 8px 0 16px 20px;">
  <li><strong>Token Cryptographic Verification:</strong> Validates format and matches against stored token registry.</li>
  <li><strong>Mathematical Expiration Check:</strong> Compares current wall-clock timestamp against <code class="inline">expiresAt</code> epoch. If current time &gt; expiration timestamp, access is rejected (<code class="inline">410 Gone / EXPIRED</code>).</li>
  <li><strong>Chairman Moratorium Directive Check:</strong> Queries both <code class="inline">BoardApproval</code> and <code class="inline">DrawingRecord</code> status. If marked <code class="inline">REVOKED</code> by the Executive Chairman, all rendering is aborted and the <strong>Hazardous Red Padlock Lockout Directive</strong> is rendered.</li>
  <li><strong>Access Audit Increment:</strong> Logs client IP, User-Agent, and increments total access counter.</li>
</ol>

<div class="page-break"></div>

<!-- ========================================================================= -->
<!-- SECTION 5: VISUAL DIAGRAM GALLERY & EXAMPLES -->
<!-- ========================================================================= -->
<div class="header-running">
  <span>SECTION 5: VISUAL GALLERY & EXAMPLES</span>
  <span>VECTOR ARCHITECTURAL RENDERINGS</span>
</div>

<h2>5. Visual Diagram Gallery & Input/Output Examples</h2>

<h3>5.1 AI 3D Sky-Mansion Tower Model (Rendered 1:1 in Studio & Chairman Approvals)</h3>
<p>
  Below is the vector architectural massing model generated for the <strong>7-Floor Ultra-Luxury Sky-Mansion Tower</strong>, featuring champagne gold luxury curtain wall glazing, alternating cantilevered floating balconies with white railings, a rooftop elevator penthouse with obstruction beacon, top-level green dashed parapet with <code class="inline">LEVEL 7</code> badge, and height dimension scale.
</p>

<div class="diagram-container">
  <svg width="580" height="340" viewBox="0 0 580 340" style="margin: 0 auto; display: block;">
    <defs>
      <linearGradient id="docGold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.9" />
        <stop offset="50%" stop-color="#D97706" stop-opacity="0.8" />
        <stop offset="100%" stop-color="#FEF08A" stop-opacity="0.95" />
      </linearGradient>
      <linearGradient id="docSlab" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#475569" />
        <stop offset="100%" stop-color="#1E293B" />
      </linearGradient>
    </defs>

    <!-- Plinth Shadow -->
    <ellipse cx="270" cy="300" rx="190" ry="28" fill="rgba(0,0,0,0.5)" />
    <!-- Ground Slab -->
    <polygon points="120,290 270,315 420,290 270,265" fill="#0F172A" stroke="#334155" stroke-width="1.5" />

    <!-- 7 Multi-Story Floors -->
    <!-- Floor 1 -->
    <polygon points="135,260 270,285 405,260 270,235" fill="url(#docSlab)" stroke="#B45309" stroke-width="1" />
    <polygon points="270,285 135,260 135,230 270,255" fill="url(#docGold)" stroke="#FEF08A" stroke-width="1" />
    <polygon points="405,260 270,285 270,255 405,230" fill="url(#docGold)" stroke="#FEF08A" stroke-width="1" />
    <!-- Balcony Floor 1 (Left) -->
    <polygon points="115,265 240,288 240,278 115,255" fill="#451A03" stroke="#F59E0B" stroke-width="1" />
    <line x1="115" y1="250" x2="240" y2="273" stroke="#FFFFFF" stroke-width="1.5" />

    <!-- Floor 2 -->
    <polygon points="135,225 270,250 405,225 270,200" fill="url(#docSlab)" stroke="#B45309" stroke-width="1" />
    <polygon points="270,250 135,225 135,195 270,220" fill="url(#docGold)" stroke="#FEF08A" stroke-width="1" />
    <polygon points="405,225 270,250 270,220 405,195" fill="url(#docGold)" stroke="#FEF08A" stroke-width="1" />
    <!-- Balcony Floor 2 (Right) -->
    <polygon points="280,248 425,225 425,215 280,238" fill="#451A03" stroke="#F59E0B" stroke-width="1" />
    <line x1="280" y1="233" x2="425" y2="210" stroke="#FFFFFF" stroke-width="1.5" />

    <!-- Floor 3 -->
    <polygon points="135,190 270,215 405,190 270,165" fill="url(#docSlab)" stroke="#B45309" stroke-width="1" />
    <polygon points="270,215 135,190 135,160 270,185" fill="url(#docGold)" stroke="#FEF08A" stroke-width="1" />
    <polygon points="405,190 270,215 270,185 405,160" fill="url(#docGold)" stroke="#FEF08A" stroke-width="1" />
    <!-- Balcony Floor 3 (Left) -->
    <polygon points="115,195 240,218 240,208 115,185" fill="#451A03" stroke="#F59E0B" stroke-width="1" />
    <line x1="115" y1="180" x2="240" y2="203" stroke="#FFFFFF" stroke-width="1.5" />

    <!-- Floor 4 -->
    <polygon points="135,155 270,180 405,155 270,130" fill="url(#docSlab)" stroke="#B45309" stroke-width="1" />
    <polygon points="270,180 135,155 135,125 270,150" fill="url(#docGold)" stroke="#FEF08A" stroke-width="1" />
    <polygon points="405,155 270,180 270,150 405,125" fill="url(#docGold)" stroke="#FEF08A" stroke-width="1" />
    <!-- Balcony Floor 4 (Right) -->
    <polygon points="280,178 425,155 425,145 280,168" fill="#451A03" stroke="#F59E0B" stroke-width="1" />
    <line x1="280" y1="163" x2="425" y2="140" stroke="#FFFFFF" stroke-width="1.5" />

    <!-- Floor 5 -->
    <polygon points="135,120 270,145 405,120 270,95" fill="url(#docSlab)" stroke="#B45309" stroke-width="1" />
    <polygon points="270,145 135,120 135,90 270,115" fill="url(#docGold)" stroke="#FEF08A" stroke-width="1" />
    <polygon points="405,120 270,145 270,115 405,90" fill="url(#docGold)" stroke="#FEF08A" stroke-width="1" />
    <!-- Balcony Floor 5 (Left) -->
    <polygon points="115,125 240,148 240,138 115,115" fill="#451A03" stroke="#F59E0B" stroke-width="1" />
    <line x1="115" y1="110" x2="240" y2="133" stroke="#FFFFFF" stroke-width="1.5" />

    <!-- Floor 6 -->
    <polygon points="135,85 270,110 405,85 270,60" fill="url(#docSlab)" stroke="#B45309" stroke-width="1" />
    <polygon points="270,110 135,85 135,55 270,80" fill="url(#docGold)" stroke="#FEF08A" stroke-width="1" />
    <polygon points="405,85 270,110 270,80 405,55" fill="url(#docGold)" stroke="#FEF08A" stroke-width="1" />
    <!-- Balcony Floor 6 (Right) -->
    <polygon points="280,108 425,85 425,75 280,98" fill="#451A03" stroke="#F59E0B" stroke-width="1" />
    <line x1="280" y1="93" x2="425" y2="70" stroke="#FFFFFF" stroke-width="1.5" />

    <!-- Floor 7 (Rooftop) -->
    <polygon points="135,50 270,75 405,50 270,25" fill="#1E293B" stroke="#10B981" stroke-width="1.5" stroke-dasharray="4 2" />
    <polygon points="270,75 135,50 135,20 270,45" fill="url(#docGold)" stroke="#FEF08A" stroke-width="1" />
    <polygon points="405,50 270,75 270,45 405,20" fill="url(#docGold)" stroke="#FEF08A" stroke-width="1" />

    <!-- LEVEL 7 Badge on Top -->
    <rect x="150" y="32" width="55" height="15" rx="3" fill="rgba(15, 23, 42, 0.9)" stroke="#10B981" stroke-width="0.8" />
    <text x="177" y="43" fill="#34D399" font-size="8" font-weight="bold" text-anchor="middle" font-family="monospace">LEVEL 7</text>

    <!-- Elevator Penthouse Core -->
    <polygon points="245,35 295,35 295,12 245,12" fill="#334155" stroke="#64748B" />
    <line x1="270" y1="12" x2="270" y2="-5" stroke="#EF4444" stroke-width="2" />
    <circle cx="270" cy="-5" r="3" fill="#EF4444" />

    <!-- Height Scale Annotation on Right -->
    <line x1="455" y1="20" x2="455" y2="290" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="3 3" />
    <line x1="448" y1="20" x2="462" y2="20" stroke="#38BDF8" stroke-width="2" />
    <line x1="448" y1="290" x2="462" y2="290" stroke="#38BDF8" stroke-width="2" />
    <rect x="468" y="135" width="95" height="34" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="#38BDF8" stroke-width="1" />
    <text x="515" y="148" fill="#38BDF8" font-size="10" font-weight="bold" text-anchor="middle">22.4m (73ft)</text>
    <text x="515" y="161" fill="#94A3B8" font-size="7.5" text-anchor="middle">7 Stories Extrusion</text>
  </svg>
  <div class="diagram-caption">Figure 5.1: 7-Floor Ultra-Luxury Sky-Mansion Tower 3D Parametric Vector Massing</div>
</div>

<div class="page-break"></div>

<!-- ========================================================================= -->
<!-- SECTION 5 CONTINUED: SECURITY & LOCKOUT DIRECTIVES -->
<!-- ========================================================================= -->
<div class="header-running">
  <span>SECTION 5: VISUAL GALLERY & EXAMPLES</span>
  <span>SECURITY MODALS & DIRECTIVE SCREENS</span>
</div>

<h3>5.2 Chairman Executive Lockout Screen & Public Quota Guard</h3>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 14px 0;">
  <!-- Screen 1: Chairman Revocation Screen -->
  <div style="background: #1a0507; border: 1.5px solid #ef4444; border-radius: 8px; padding: 16px; text-align: center;">
    <div style="width: 44px; height: 44px; background: rgba(239, 68, 68, 0.2); border: 2px solid #ef4444; border-radius: 50%; margin: 0 auto 10px auto; display: flex; align-items: center; justify-content: center; color: #ef4444; font-size: 18pt;">
      &#128274;
    </div>
    <div style="background: rgba(239, 68, 68, 0.2); color: #fca5a5; font-size: 7.5pt; font-weight: 700; padding: 3px 8px; border-radius: 12px; display: inline-block; margin-bottom: 8px; font-family: monospace;">
      ACCESS REVOKED BY CHAIRMAN DIRECTIVE
    </div>
    <h4 style="color: #ffffff; margin: 4px 0; font-size: 11pt;">3D Model & CAD Viewing Terminated</h4>
    <p style="color: #fecaca; font-size: 7.5pt; line-height: 1.4; margin: 6px 0;">
      The Executive Chairman has exercised executive board powers to terminate access to this structural building model across all organization and public users.
    </p>
    <div style="background: rgba(127, 29, 29, 0.4); border: 1px solid #991b1b; border-radius: 4px; padding: 8px; margin-top: 10px; text-align: left; font-size: 7pt; color: #cbd5e1;">
      <strong style="color: #f87171;">EXECUTIVE STOP DIRECTIVE:</strong><br>
      <em>&ldquo;Structural audit revision and safety moratorium in effect per Executive Board.&rdquo;</em>
    </div>
  </div>

  <!-- Screen 2: Public User Quota Exceeded Modal -->
  <div style="background: #0f172a; border: 1.5px solid #f59e0b; border-radius: 8px; padding: 16px; text-align: center;">
    <div style="width: 44px; height: 44px; background: rgba(245, 158, 11, 0.2); border: 2px solid #f59e0b; border-radius: 50%; margin: 0 auto 10px auto; display: flex; align-items: center; justify-content: center; color: #f59e0b; font-size: 18pt;">
      &#9888;
    </div>
    <div style="background: rgba(245, 158, 11, 0.2); color: #fde68a; font-size: 7.5pt; font-weight: 700; padding: 3px 8px; border-radius: 12px; display: inline-block; margin-bottom: 8px; font-family: monospace;">
      DAILY QUOTA EXCEEDED (3/3 USED)
    </div>
    <h4 style="color: #ffffff; margin: 4px 0; font-size: 11pt;">Public Guest Generation Limit Reached</h4>
    <p style="color: #cbd5e1; font-size: 7.5pt; line-height: 1.4; margin: 6px 0;">
      Public guests are limited to 3 daily generative building designs. Organization users (Client, PM, Admin, PD, Contractor) receive unlimited access.
    </p>
    <div style="background: rgba(30, 41, 59, 0.8); border: 1px solid #334155; border-radius: 4px; padding: 8px; margin-top: 10px; text-align: left; font-size: 7pt; color: #94a3b8;">
      <strong style="color: #38bdf8;">SWITCH TO ORGANIZATION PLAN:</strong><br>
      <span>&bull; /drawing/client &bull; /drawing/pm &bull; /drawing/admin &bull; /drawing/contractor</span>
    </div>
  </div>
</div>

<h3>5.3 Sample API JSON Input & Output Payloads</h3>

<h4>A. Generative Blueprint Request Payload (Input)</h4>
<pre>{
  "prompt": "7-Floor Ultra-Luxury Sky-Mansion Tower with cantilevered floating balconies",
  "projectType": "RESIDENTIAL",
  "builtupSqft": 2400,
  "floors": 7,
  "includeMep": true,
  "theme": "BLUEPRINT_CLASSIC"
}</pre>

<h4>B. Generative Blueprint Response Payload (Output)</h4>
<pre>{
  "title": "7-Floor Ultra-Luxury Sky-Mansion Tower",
  "drawingNumber": "DWG-AI-RES-007",
  "floors": 7,
  "building3D": {
    "massingForm": "RECTANGULAR",
    "facadePalette": "GOLD_LUXURY",
    "balconyType": "CANTILEVERED_FLOATING",
    "hasHelipad": false,
    "rooftopFeature": "ELEVATOR_PENTHOUSE"
  },
  "dimensions": {
    "builtupAreaSqft": 2400,
    "carpetAreaSqft": 1872,
    "totalHeightMeters": 22.4,
    "wallPerimeterMeters": 210.6
  },
  "takeoff": {
    "grossFloorAreaSqft": 16800,
    "concreteVolumeCuM": 638.4,
    "steelRebarWeightMT": 60.55,
    "cementBags": 4970,
    "totalEstimatedCostINR": 21500000
  }
}</pre>

<h4>C. Share Token Creation Response Payload (Output)</h4>
<pre>{
  "success": true,
  "token": "dwg_token_k9x2m48p7a1b",
  "shareUrl": "http://localhost:3000/drawings/share?token=dwg_token_k9x2m48p7a1b",
  "expiresAt": "2026-11-27T14:30:00Z",
  "expiryHours": 24,
  "accessCount": 0,
  "status": "ACTIVE"
}</pre>

<div style="margin-top: 24px; border-top: 2px solid #e2e8f0; padding-top: 14px; text-align: center; font-size: 8pt; color: #94a3b8;">
  <strong>BUILDCON ENTERPRISE ERP SYSTEM DOCUMENTATION</strong> &bull; VERSION 2.5 &bull; ALL RIGHTS RESERVED
</div>

</body>
</html>
"""

def main():
    print("[1/3] Writing complete documentation HTML...")
    with open(TEMP_HTML_PATH, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"HTML written to: {TEMP_HTML_PATH}")

    # Headless Chrome conversion
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    browser = chrome_path if os.path.exists(chrome_path) else edge_path

    print(f"[2/3] Printing HTML to PDF using {browser}...")
    cmd = [
        browser,
        "--headless",
        "--no-sandbox",
        "--disable-gpu",
        "--run-all-compositor-stages-before-draw",
        f"--print-to-pdf={OUTPUT_PDF_PATH_1}",
        f"file:///{TEMP_HTML_PATH.replace(os.sep, '/')}"
    ]

    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(OUTPUT_PDF_PATH_1):
        file_size = os.path.getsize(OUTPUT_PDF_PATH_1)
        print(f"[3/3] Success! PDF generated at: {OUTPUT_PDF_PATH_1} ({file_size} bytes)")
        # Also copy to secondary public directory if it exists
        if os.path.exists(os.path.dirname(OUTPUT_PDF_PATH_2)):
            try:
                import shutil
                shutil.copyfile(OUTPUT_PDF_PATH_1, OUTPUT_PDF_PATH_2)
                print(f"Copied PDF to secondary path: {OUTPUT_PDF_PATH_2}")
            except Exception as e:
                print(f"Note on secondary copy: {e}")
    else:
        print(f"Error generating PDF. Stderr: {res.stderr}")
        sys.exit(1)

if __name__ == "__main__":
    main()
