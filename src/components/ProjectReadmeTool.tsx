import { useMemo, useState } from 'react';
import {
  Check,
  Copy,
  Download,
  Eye,
  FileCode2,
  FolderTree,
  Image as ImageIcon,
  Shield,
  Terminal,
} from 'lucide-react';
import type { Language } from '../context/LanguageContext';
import type { ProjectItem } from '../data/portfolioData';
import {
  generateProjectReadme,
  type ReadmeLicense,
} from '../utils/generateReadme';
import { trackEvent } from '../utils/analytics';

interface ProjectReadmeToolProps {
  project: ProjectItem;
  allProjects: ProjectItem[];
  onSelectProject: (projectId: string) => void;
  repoStars: Record<string, number>;
  lang: Language;
}

const TOOL_COPY: Record<
  Language,
  {
    subtitle: string;
    projectLabel: string;
    viewRaw: string;
    viewPreview: string;
    copyBtn: string;
    copiedBtn: string;
    downloadBtn: string;
    badgesToggle: string;
    screenshotsToggle: string;
    setupToggle: string;
    structureToggle: string;
    licenseLabel: string;
    charCountSuffix: string;
    lineCountSuffix: string;
    githubNote: string;
  }
> = {
  en: {
    subtitle:
      'Auto-formatted GitHub README.md generated directly from structured portfolio project data.',
    projectLabel: 'Target Project',
    viewRaw: 'Raw Markdown',
    viewPreview: 'Formatted Preview',
    copyBtn: 'Copy README.md',
    copiedBtn: 'Copied to Clipboard',
    downloadBtn: 'Download .md',
    badgesToggle: 'Shields Badges',
    screenshotsToggle: 'Screenshots',
    setupToggle: 'Setup Guide',
    structureToggle: 'Folder Tree',
    licenseLabel: 'License',
    charCountSuffix: 'chars',
    lineCountSuffix: 'lines',
    githubNote:
      'Output is formatted in standard English GitHub-Flavored Markdown (`dir="ltr"`) ready to paste into your repository root.',
  },
  ar: {
    subtitle:
      'مولّد ملف README.md احترافي ومنسّق تلقائياً من بيانات المشروع لسهولة النسخ والرفع على GitHub.',
    projectLabel: 'المشروع المحدد',
    viewRaw: 'كود Markdown',
    viewPreview: 'معاينة منسّقة',
    copyBtn: 'نسخ README.md',
    copiedBtn: 'تم النسخ للحافظة',
    downloadBtn: 'تحميل الملف .md',
    badgesToggle: 'شارات التقنيات',
    screenshotsToggle: 'جدول الصور',
    setupToggle: 'خطوات التشغيل',
    structureToggle: 'هيكل المجلدات',
    licenseLabel: 'الترخيص',
    charCountSuffix: 'حرف',
    lineCountSuffix: 'سطر',
    githubNote:
      'يتم توليد الملف بصيغة GitHub-Flavored Markdown القياسية باللغة الإنجليزية جاهزاً للصق مباشرة في مستودع المشروع.',
  },
};

function LightweightMarkdownPreview({ markdown }: { markdown: string }) {
  const blocks = useMemo(() => {
    const lines = markdown.replace(/\r\n/g, '\n').split('\n');
    const parsed: Array<
      | { type: 'h1' | 'h2'; text: string }
      | { type: 'quote'; text: string }
      | { type: 'code'; text: string }
      | { type: 'list'; items: string[] }
      | { type: 'table'; headers: string[]; rows: string[][] }
      | { type: 'paragraph'; text: string }
    > = [];

    let i = 0;
    while (i < lines.length) {
      const line = lines[i];

      if (!line.trim()) {
        i++;
        continue;
      }

      if (line.startsWith('```')) {
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        i++;
        parsed.push({ type: 'code', text: codeLines.join('\n') });
        continue;
      }

      if (line.startsWith('# ')) {
        parsed.push({ type: 'h1', text: line.slice(2).trim() });
        i++;
        continue;
      }

      if (line.startsWith('## ')) {
        parsed.push({ type: 'h2', text: line.slice(3).trim() });
        i++;
        continue;
      }

      if (line.startsWith('> ')) {
        parsed.push({ type: 'quote', text: line.slice(2).trim() });
        i++;
        continue;
      }

      if (line.startsWith('|') && i + 1 < lines.length && lines[i + 1].includes('---')) {
        const splitRow = (row: string) =>
          row
            .split('|')
            .slice(1, -1)
            .map((cell) => cell.trim());

        const headers = splitRow(line);
        i += 2;
        const rows: string[][] = [];
        while (i < lines.length && lines[i].startsWith('|')) {
          rows.push(splitRow(lines[i]));
          i++;
        }
        parsed.push({ type: 'table', headers, rows });
        continue;
      }

      if (line.startsWith('- ')) {
        const items: string[] = [];
        while (i < lines.length && lines[i].startsWith('- ')) {
          items.push(lines[i].slice(2).trim());
          i++;
        }
        parsed.push({ type: 'list', items });
        continue;
      }

      const paraLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() !== '' &&
        !lines[i].startsWith('#') &&
        !lines[i].startsWith('>') &&
        !lines[i].startsWith('```') &&
        !lines[i].startsWith('- ') &&
        !lines[i].startsWith('|')
      ) {
        paraLines.push(lines[i]);
        i++;
      }
      parsed.push({ type: 'paragraph', text: paraLines.join(' ') });
    }

    return parsed;
  }, [markdown]);

  const renderInline = (text: string) => {
    // Render linked badges [![alt](img)](href)
    const tokenRegex =
      /(\[!\[[^\]]*\]\([^)]+\)\]\([^)]+\)|!\[[^\]]*\]\([^)]+\)|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|`[^`]+`)/g;
    const parts = text.split(tokenRegex);

    return parts.map((part, idx) => {
      if (!part) return null;

      const linkedBadge = part.match(/^\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)$/);
      if (linkedBadge) {
        return (
          <a
            key={idx}
            href={linkedBadge[3]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block align-middle me-1.5 my-0.5"
          >
            <img
              src={linkedBadge[2]}
              alt={linkedBadge[1]}
              className="h-5 w-auto rounded-[3px]"
            />
          </a>
        );
      }

      const image = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (image) {
        const resolvedSrc = image[2].startsWith('./') ? image[2].slice(1) : image[2];
        if (resolvedSrc.startsWith('https://img.shields.io/')) {
          return (
            <img
              key={idx}
              src={resolvedSrc}
              alt={image[1]}
              className="inline-block h-5 w-auto align-middle me-1.5 my-0.5 rounded-[3px]"
            />
          );
        }
        return (
          <img
            key={idx}
            src={resolvedSrc}
            alt={image[1]}
            referrerPolicy="no-referrer"
            className="h-14 w-24 rounded-md border border-slate-200 dark:border-white/10 object-cover object-top"
          />
        );
      }

      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        return (
          <a
            key={idx}
            href={link[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            {link[1]}
          </a>
        );
      }

      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className="font-semibold text-slate-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }

      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={idx}
            className="rounded bg-slate-200/80 px-1.5 py-0.5 font-mono text-xs text-slate-800 dark:bg-white/10 dark:text-blue-300"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div
      dir="ltr"
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 sm:p-6 text-left text-sm text-slate-700 dark:border-white/10 dark:bg-[#060A13] dark:text-slate-300"
    >
      {blocks.map((block, idx) => {
        if (block.type === 'h1') {
          return (
            <h1
              key={idx}
              className="border-b border-slate-200 pb-2 font-display text-2xl font-bold text-slate-900 dark:border-white/10 dark:text-white"
            >
              {block.text}
            </h1>
          );
        }
        if (block.type === 'h2') {
          return (
            <h2
              key={idx}
              className="border-b border-slate-200/80 pt-2 pb-1.5 font-display text-lg font-bold text-slate-900 dark:border-white/[0.08] dark:text-white"
            >
              {block.text}
            </h2>
          );
        }
        if (block.type === 'quote') {
          return (
            <blockquote
              key={idx}
              className="border-l-4 border-blue-500 pl-3.5 text-slate-600 dark:text-slate-300"
            >
              {renderInline(block.text)}
            </blockquote>
          );
        }
        if (block.type === 'code') {
          return (
            <pre
              key={idx}
              className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-900 p-3.5 font-mono text-xs leading-relaxed text-slate-100 dark:border-white/10"
            >
              <code>{block.text}</code>
            </pre>
          );
        }
        if (block.type === 'list') {
          return (
            <ul key={idx} className="list-disc space-y-1.5 pl-5">
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx} className="leading-relaxed">
                  {renderInline(item)}
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === 'table') {
          return (
            <div key={idx} className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.03]">
                    {block.headers.map((header, hIdx) => (
                      <th
                        key={hIdx}
                        className="px-3 py-2 text-left font-semibold text-slate-800 dark:text-slate-200"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="border-b border-slate-200/70 dark:border-white/[0.06]"
                    >
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-3 py-2 align-middle">
                          {renderInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return (
          <p key={idx} className="leading-relaxed">
            {renderInline(block.text)}
          </p>
        );
      })}
    </div>
  );
}

export default function ProjectReadmeTool({
  project,
  allProjects,
  onSelectProject,
  repoStars,
  lang,
}: ProjectReadmeToolProps) {
  const copy = TOOL_COPY[lang];
  const [includeBadges, setIncludeBadges] = useState(true);
  const [includeScreenshots, setIncludeScreenshots] = useState(true);
  const [includeSetupGuide, setIncludeSetupGuide] = useState(true);
  const [includeStructure, setIncludeStructure] = useState(true);
  const [license, setLicense] = useState<ReadmeLicense>('MIT');
  const [viewMode, setViewMode] = useState<'raw' | 'preview'>('raw');
  const [copied, setCopied] = useState(false);

  const liveStars = project.repoSlug ? repoStars[project.repoSlug] : undefined;

  const markdown = useMemo(
    () =>
      generateProjectReadme(
        project,
        {
          includeBadges,
          includeScreenshots,
          includeSetupGuide,
          includeStructure,
          license,
        },
        liveStars,
      ),
    [
      project,
      includeBadges,
      includeScreenshots,
      includeSetupGuide,
      includeStructure,
      license,
      liveStars,
    ],
  );

  const lineCount = useMemo(() => markdown.trimEnd().split('\n').length, [markdown]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = markdown;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    trackEvent('README Copied', { section: 'projects-modal', label: project.id });
    window.setTimeout(() => setCopied(false), 2200);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${project.repoSlug || project.id}-README.md`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    trackEvent('README Downloaded', { section: 'projects-modal', label: project.id });
  };

  return (
    <div className="space-y-5">
      {/* Top Toolbar: Project Selector + Actions */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-white/[0.08] dark:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            {copy.subtitle}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {copy.githubNote}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex min-h-[40px] items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700'
            }`}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span>{copied ? copy.copiedBtn : copy.copyBtn}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 dark:border-white/15 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.09] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <span>{copy.downloadBtn}</span>
          </button>
        </div>
      </div>

      {/* Project Switcher + Section Options */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-1.5">
          <label
            htmlFor="readme-project-select"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            {copy.projectLabel}
          </label>
          <select
            id="readme-project-select"
            value={project.id}
            onChange={(e) => onSelectProject(e.target.value)}
            className="w-full min-h-[40px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 focus:border-blue-500 focus:outline-none dark:border-white/15 dark:bg-[#060A13] dark:text-white"
          >
            {allProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} {p.repoSlug ? `(${p.repoSlug})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-8 flex flex-wrap items-end gap-2">
          <button
            type="button"
            onClick={() => setIncludeBadges((v) => !v)}
            aria-pressed={includeBadges}
            className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              includeBadges
                ? 'border-blue-500/40 bg-blue-600/10 text-blue-700 dark:text-blue-300'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400'
            }`}
          >
            <Shield className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{copy.badgesToggle}</span>
          </button>

          <button
            type="button"
            onClick={() => setIncludeScreenshots((v) => !v)}
            aria-pressed={includeScreenshots}
            className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              includeScreenshots
                ? 'border-blue-500/40 bg-blue-600/10 text-blue-700 dark:text-blue-300'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400'
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{copy.screenshotsToggle}</span>
          </button>

          <button
            type="button"
            onClick={() => setIncludeSetupGuide((v) => !v)}
            aria-pressed={includeSetupGuide}
            className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              includeSetupGuide
                ? 'border-blue-500/40 bg-blue-600/10 text-blue-700 dark:text-blue-300'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{copy.setupToggle}</span>
          </button>

          <button
            type="button"
            onClick={() => setIncludeStructure((v) => !v)}
            aria-pressed={includeStructure}
            className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              includeStructure
                ? 'border-blue-500/40 bg-blue-600/10 text-blue-700 dark:text-blue-300'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400'
            }`}
          >
            <FolderTree className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{copy.structureToggle}</span>
          </button>

          <div className="flex items-center gap-1.5">
            <label
              htmlFor="readme-license-select"
              className="text-xs font-medium text-slate-600 dark:text-slate-400"
            >
              {copy.licenseLabel}:
            </label>
            <select
              id="readme-license-select"
              value={license}
              onChange={(e) => setLicense(e.target.value as ReadmeLicense)}
              className="min-h-[38px] rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-white/10 dark:bg-[#060A13] dark:text-slate-200"
            >
              <option value="MIT">MIT</option>
              <option value="Apache-2.0">Apache-2.0</option>
              <option value="Proprietary">Proprietary</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mode Switcher Bar (Raw Markdown vs Formatted Preview) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="README output mode"
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-white/[0.08] dark:bg-[#060A13]"
        >
          <button
            type="button"
            onClick={() => setViewMode('raw')}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              viewMode === 'raw'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <FileCode2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{copy.viewRaw}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              viewMode === 'preview'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{copy.viewPreview}</span>
          </button>
        </div>

        <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
          {lineCount} {copy.lineCountSuffix} · {markdown.length} {copy.charCountSuffix}
        </p>
      </div>

      {/* Markdown Output */}
      {viewMode === 'raw' ? (
        <div dir="ltr" className="relative">
          <pre className="max-h-[440px] overflow-auto rounded-xl border border-slate-200 bg-[#060A13] p-5 font-mono text-xs leading-relaxed text-slate-100 dark:border-white/10">
            <code>{markdown}</code>
          </pre>
        </div>
      ) : (
        <div className="max-h-[460px] overflow-y-auto">
          <LightweightMarkdownPreview markdown={markdown} />
        </div>
      )}
    </div>
  );
}
