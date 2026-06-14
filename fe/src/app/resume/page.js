"use client";

import Link from 'next/link';
import { ArrowLeft, Briefcase, GraduationCap, Award, ExternalLink, Code } from 'lucide-react';

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-6 sm:p-12 md:p-16 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-10 shadow-2xl">
        
        {/* Navigation / Header buttons */}
        <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-6">
          <Link href="/login" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-all text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Portal
          </Link>
          <div className="flex gap-3">
            <a 
              href="https://github.com/tototopark" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 hover:text-white hover:border-zinc-700 transition-all text-xs font-semibold"
            >
              <Code className="w-3.5 h-3.5" />
              GitHub
            </a>
          </div>
        </div>

        {/* Candidate Profile Header */}
        <div className="text-center sm:text-left flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Eungsoon (Brian) Park</h1>
            <p className="text-emerald-400 font-semibold text-lg mt-1.5">Agile IT & Automation Specialist</p>
            <p className="text-zinc-400 text-sm mt-1">Auckland, New Zealand</p>
          </div>
          <div className="flex flex-col items-start sm:items-end text-sm text-zinc-400 gap-1 bg-zinc-950 p-4 rounded-xl border border-zinc-800 w-full sm:w-auto">
            <span>📞 021-265-1995</span>
            <a href="mailto:totopark@hotmail.com" className="text-emerald-400 hover:underline">totopark@hotmail.com</a>
            <span>📍 New Lynn, Auckland 0600</span>
          </div>
        </div>

        {/* Professional Summary */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white border-l-4 border-emerald-500 pl-3 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-400" />
            Professional Summary
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            An agile IT and automation specialist fusing decades of industrial manufacturing and financial programming experience with modern AI-driven development. Expert at analyzing complex operational requirements and translating them into robust software logic. Highly adaptable to any development platform, with a proven track record of rapid prototyping and legacy software modernization (e.g., migrating a legacy enterprise PHP app into a Next.js/FastAPI stack in under 24 hours).
          </p>
        </section>

        {/* Key Competencies Grid */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white border-l-4 border-emerald-500 pl-3 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            Key Competencies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl">
              <h3 className="font-semibold text-zinc-200 text-sm mb-2">Business Logic & Process Analysis</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">Requirement Gathering, Systems Architecture, Workflow Refactoring, Business Logic Translation</p>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl">
              <h3 className="font-semibold text-zinc-200 text-sm mb-2">AI & API Integration</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">LLMs (Gemini/ChatGPT Advanced Prompting), Automation Pipelines (n8n, API Orchestration)</p>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl">
              <h3 className="font-semibold text-zinc-200 text-sm mb-2">Programming & Frameworks</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">Python (FastAPI, Flask), JavaScript (Next.js, React), C# (CAD Automation, Tekla API), SQL</p>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl">
              <h3 className="font-semibold text-zinc-200 text-sm mb-2">Platform Adaptability</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">Rapid self-directed acquisition of new technical stacks, platforms, and development environments</p>
            </div>
          </div>
        </section>

        {/* Key Personal Projects */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white border-l-4 border-emerald-500 pl-3 mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-emerald-400" />
            Key Personal Projects
          </h2>
          <div className="space-y-6">
            
            {/* Project 1 */}
            <div className="border border-zinc-800 p-5 rounded-xl bg-zinc-950">
              <div className="flex justify-between items-start flex-col sm:flex-row gap-2 mb-3">
                <h3 className="text-base font-bold text-white">1. Steelworks Manager - Legacy Migration & Modernization (2026)</h3>
                <div className="flex gap-2">
                  <Link href="/login" className="flex items-center gap-1 text-xs text-emerald-400 hover:underline">
                    <ExternalLink className="w-3 h-3" /> Live Demo
                  </Link>
                  <span className="text-zinc-600">|</span>
                  <a href="https://github.com/tototopark/steelworks-manager-react" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-emerald-400 hover:underline">
                    GitHub Code
                  </a>
                </div>
              </div>
              <ul className="list-disc list-inside text-zinc-400 text-xs sm:text-sm space-y-2 mt-2">
                <li><strong className="text-zinc-300">Implementation</strong>: Completely rebuilt and modernized a legacy PHP tracking system into a Next.js 16 (React 19) and Python FastAPI stack in under 24 hours.</li>
                <li><strong className="text-zinc-300">Details</strong>: Developed 14 fully integrated modules including live timeline feeds, timesheet CSV exports, QA welding NCR logs, and database diagnostic ERD visualizers.</li>
                <li><strong className="text-zinc-300">Outcome</strong>: Demonstrated extreme agility, domain logic translation, and the ability to deploy clean, modular FastAPI codebases in record time.</li>
              </ul>
            </div>

            {/* Project 2 */}
            <div className="border border-zinc-800 p-5 rounded-xl bg-zinc-950">
              <h3 className="text-base font-bold text-white mb-3">2. YouTube Content Automation Pipeline (2025-Present)</h3>
              <ul className="list-disc list-inside text-zinc-400 text-xs sm:text-sm space-y-2">
                <li><strong className="text-zinc-300">Implementation</strong>: Developed an automated content pipeline to produce video content by benchmarking active channels.</li>
                <li><strong className="text-zinc-300">Details</strong>: Automates style guide creation, script writing (Gemini 3.1 Flash Lite), TTS voice synthesis, background audio, scene image generation (Gemini 3.1 Flash Image), and video rendering (Veo 3.1) via API orchestration.</li>
                <li><strong className="text-zinc-300">Outcome</strong>: Proved ability to design, build, and test complex automation flows with modern AI APIs.</li>
              </ul>
            </div>

            {/* Project 3 */}
            <div className="border border-zinc-800 p-5 rounded-xl bg-zinc-950">
              <h3 className="text-base font-bold text-white mb-3">3. CAD Modeling Automation Tool (2022-2024)</h3>
              <ul className="list-disc list-inside text-zinc-400 text-xs sm:text-sm space-y-2">
                <li><strong className="text-zinc-300">Implementation</strong>: Developed a C#-based Tekla Structures API automation tool to construct 3D CAD geometries directly from Excel data tables.</li>
                <li><strong className="text-zinc-300">Outcome</strong>: Compressed a similar feature extension task from 280 hours to under 8 hours with generative LLM assistance (30x velocity increase).</li>
              </ul>
            </div>
            
          </div>
        </section>

        {/* Employment History */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-white border-l-4 border-emerald-500 pl-3 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-400" />
            Employment History
          </h2>
          <div className="relative border-l-2 border-zinc-800 ml-3 pl-6 space-y-8">
            
            {/* Job 1 */}
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 bg-emerald-500 rounded-full border-4 border-zinc-900"></div>
              <div className="flex justify-between flex-col sm:flex-row mb-1">
                <h3 className="text-sm sm:text-base font-bold text-zinc-200">Self-Employed / Freelance IT Contractor</h3>
                <span className="text-zinc-500 text-xs sm:text-sm">Auckland, NZ | Aug 2025 - Present</span>
              </div>
              <p className="text-emerald-400 text-xs font-semibold mb-2">AI Automation & Systems Freelancer</p>
              <ul className="list-disc list-inside text-zinc-400 text-xs sm:text-sm space-y-1">
                <li>Designed and tested automated data extraction and categorization scripts in Python.</li>
                <li>Built and finalized testing on a multi-model AI video automation pipeline.</li>
                <li>Configured local workflow automations using n8n.</li>
              </ul>
            </div>

            {/* Job 2 */}
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 bg-zinc-700 rounded-full border-4 border-zinc-900"></div>
              <div className="flex justify-between flex-col sm:flex-row mb-1">
                <h3 className="text-sm sm:text-base font-bold text-zinc-200">Pengelly Engineers Ltd</h3>
                <span className="text-zinc-500 text-xs sm:text-sm">Auckland, NZ | Nov 2016 - Aug 2025</span>
              </div>
              <p className="text-zinc-400 text-xs font-semibold mb-2">Structural Steel Detailer</p>
              <ul className="list-disc list-inside text-zinc-400 text-xs sm:text-sm space-y-1">
                <li>Performed structural 3D modeling and detailing using Tekla Structures and Advanced Steel.</li>
                <li>Designed and built CAD automation tools in C# to eliminate manual scheduling inefficiencies.</li>
                <li>Coordinated between design offices and shop floor, translating technical designs to physical workflows.</li>
              </ul>
            </div>

            {/* Job 3 */}
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 bg-zinc-700 rounded-full border-4 border-zinc-900"></div>
              <div className="flex justify-between flex-col sm:flex-row mb-1">
                <h3 className="text-sm sm:text-base font-bold text-zinc-200">McGrath Industries Ltd</h3>
                <span className="text-zinc-500 text-xs sm:text-sm">Auckland, NZ | Dec 2015 - Nov 2016</span>
              </div>
              <p className="text-zinc-400 text-xs font-semibold mb-2">Fabricator / Welder / Fitter</p>
            </div>

            {/* Job 4 */}
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 bg-zinc-700 rounded-full border-4 border-zinc-900"></div>
              <div className="flex justify-between flex-col sm:flex-row mb-1">
                <h3 className="text-sm sm:text-base font-bold text-zinc-200">Shinhan Investment Bank</h3>
                <span className="text-zinc-500 text-xs sm:text-sm">Seoul, Korea | Mar 1991 - Dec 2001</span>
              </div>
              <p className="text-zinc-400 text-xs font-semibold mb-2">Strategic Planner / Programmer</p>
            </div>

          </div>
        </section>

        {/* Qualifications & Education */}
        <section>
          <h2 className="text-lg font-bold text-white border-l-4 border-emerald-500 pl-3 mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            Qualifications & Education
          </h2>
          <ul className="list-none text-zinc-400 text-xs sm:text-sm space-y-2 ml-3">
            <li className="flex justify-between flex-col sm:flex-row">
              <span>🎓 <strong className="text-zinc-300">Yonsei University</strong> - Bachelor of Business Administration</span>
              <span className="text-zinc-500">Seoul, Korea</span>
            </li>
            <li>🎓 <strong className="text-zinc-300">Certificate in Small Business Management</strong> (Level 4) - New Zealand</li>
            <li>🎓 <strong className="text-zinc-300">Certificate in Advanced Fabrication and Welding Skills</strong> (Level 3, 4) - New Zealand</li>
          </ul>
        </section>

      </div>
    </div>
  );
}
