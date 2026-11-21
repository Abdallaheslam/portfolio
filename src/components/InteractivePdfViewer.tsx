import { type ReactNode, useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Maximize2,
  Printer,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getPortfolioContent } from '../data/portfolioData';
import { toAbsoluteAssetUrl } from '../utils/assetUrl';
import { getCvPdfBytes } from '../utils/generateCvPdf';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

interface PdfPageCanvasProps {
  pdfDoc: PDFDocumentProxy;
  pageNumber: number;
  containerWidth: number;
  zoom: number;
}

function PdfPageCanvas({
  pdfDoc,
  pageNumber,
  containerWidth,
  zoom,
}: PdfPageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rendering, setRendering] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let renderTask: ReturnType<
      Awaited<ReturnType<PDFDocumentProxy['getPage']>>['render']
    > | null = null;

    async function renderPage() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      setRendering(true);

      try {
        const page = await pdfDoc.getPage(pageNumber);
        if (cancelled) return;

        const baseViewport = page.getViewport({ scale: 1 });
        const availableWidth = Math.max(280, Math.min(containerWidth - 32, 760));
        const fitScale = availableWidth / baseViewport.width;
        const cssScale = fitScale * zoom;
        const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 2), 3);

        const cssViewport = page.getViewport({ scale: cssScale });
        const pixelViewport = page.getViewport({ scale: cssScale * dpr });

        canvas.width = Math.floor(pixelViewport.width);
        canvas.height = Math.floor(pixelViewport.height);
        canvas.style.width = `${Math.floor(cssViewport.width)}px`;
        canvas.style.height = `${Math.floor(cssViewport.height)}px`;

        renderTask = page.render({
          canvas,
          viewport: pixelViewport,
        });

        await renderTask.promise;
        if (!cancelled) {
          setRendering(false);
        }
      } catch (err) {
        const name = (err as { name?: string })?.name;
        if (name !== 'RenderingCancelledException' && !cancelled) {
          setRendering(false);
        }
      }
    }

    renderPage();

    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [pdfDoc, pageNumber, containerWidth, zoom]);

  return (
    <div className="relative flex justify-center">
      <div className="relative overflow-hidden rounded-sm bg-white shadow-lg ring-1 ring-slate-900/10 dark:ring-white/15">
        <canvas ref={canvasRef} className="block" />
        {rendering && (
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-slate-100/60 backdrop-blur-[1px] transition-opacity"
          />
        )}
      </div>
    </div>
  );
}

interface InteractivePdfViewerProps {
  isFullscreen?: boolean;
  onOpenFullscreen?: () => void;
  onCloseFullscreen?: () => void;
  onDownload: () => void;
  onPrint: () => void;
  fallbackContent: ReactNode;
}

export default function InteractivePdfViewer({
  isFullscreen = false,
  onOpenFullscreen,
  onCloseFullscreen,
  onDownload,
  onPrint,
  fallbackContent,
}: InteractivePdfViewerProps) {
  const { lang } = useLanguage();
  const { cvSection } = getPortfolioContent(lang);
  const { viewer } = cvSection;

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(720);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');
  const [loading, setLoading] = useState(true);
  const [renderError, setRenderError] = useState(false);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const updateWidth = () => {
      if (el.clientWidth > 0) {
        setContainerWidth(el.clientWidth);
      }
    };
    updateWidth();

    const observer = new ResizeObserver(() => updateWidth());
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let active = true;
    let loadedDoc: PDFDocumentProxy | null = null;
    const loadingTask = pdfjsLib.getDocument({
      data: getCvPdfBytes(),
      standardFontDataUrl: toAbsoluteAssetUrl('pdf-standard-fonts/'),
    });

    loadingTask.promise
      .then((doc) => {
        if (!active) {
          void doc.cleanup();
          return;
        }
        loadedDoc = doc;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setCurrentPage(1);
        setLoading(false);
        setRenderError(false);
      })
      .catch(() => {
        if (active) {
          setLoading(false);
          setRenderError(true);
        }
      });

    return () => {
      active = false;
      void loadingTask.destroy();
      void loadedDoc?.cleanup();
    };
  }, []);

  const handleZoomOut = () => setZoom((z) => Math.max(0.7, Number((z - 0.15).toFixed(2))));
  const handleZoomIn = () => setZoom((z) => Math.min(1.75, Number((z + 0.15).toFixed(2))));
  const handleResetZoom = () => setZoom(1);

  const pageNumbers =
    viewMode === 'all'
      ? Array.from({ length: numPages }, (_, idx) => idx + 1)
      : [currentPage];

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/[0.08] dark:bg-[#0B1120] ${
        isFullscreen ? 'h-full shadow-2xl' : 'shadow-xs dark:shadow-none'
      }`}
    >
      {/* Interactive PDF Toolbar */}
      <div
        dir="ltr"
        className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/95 px-4 py-3 dark:border-white/[0.08] dark:bg-[#0D1528]/95"
      >
        {/* File Name & Page Count */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500/30 dark:bg-blue-600/10 dark:text-blue-400">
            <FileText className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-mono text-xs font-semibold text-slate-900 dark:text-white">
              {viewer.fileLabel}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
              {viewer.page} {currentPage} {viewer.of} {numPages}
            </p>
          </div>
        </div>

        {/* Navigation, Zoom & View Mode Controls */}
        {!renderError && (
          <div className="flex flex-wrap items-center gap-2">
            {/* Page Stepper */}
            {numPages > 1 && (
              <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-0.5 dark:border-white/10 dark:bg-[#060A13]">
                <button
                  type="button"
                  disabled={currentPage <= 1 || viewMode === 'all'}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  aria-label={viewer.prevPage}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none dark:text-slate-200 dark:hover:bg-white/[0.06] cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-0.5 px-1">
                  {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => {
                        setViewMode('single');
                        setCurrentPage(pageNum);
                      }}
                      className={`h-6 min-w-[24px] rounded px-1.5 font-mono text-[11px] font-semibold transition-colors cursor-pointer ${
                        viewMode === 'single' && currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.06]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  disabled={currentPage >= numPages || viewMode === 'all'}
                  onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
                  aria-label={viewer.nextPage}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none dark:text-slate-200 dark:hover:bg-white/[0.06] cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Zoom Controls */}
            <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-0.5 dark:border-white/10 dark:bg-[#060A13]">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoom <= 0.7}
                aria-label={viewer.zoomOut}
                title={viewer.zoomOut}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none dark:text-slate-200 dark:hover:bg-white/[0.06] cursor-pointer"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="min-w-[44px] text-center font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoom >= 1.75}
                aria-label={viewer.zoomIn}
                title={viewer.zoomIn}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none dark:text-slate-200 dark:hover:bg-white/[0.06] cursor-pointer"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              {zoom !== 1 && (
                <button
                  type="button"
                  onClick={handleResetZoom}
                  aria-label={viewer.fitWidth}
                  title={viewer.fitWidth}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-white cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Single / All Pages Switch */}
            {numPages > 1 && (
              <div className="hidden sm:inline-flex items-center rounded-lg border border-slate-200 bg-white p-0.5 dark:border-white/10 dark:bg-[#060A13]">
                <button
                  type="button"
                  onClick={() => setViewMode('single')}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                    viewMode === 'single'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  {viewer.singlePage}
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('all')}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                    viewMode === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  {viewer.allPages}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Print, Fullscreen, Download Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrint}
            aria-label={cvSection.printLabel}
            title={cvSection.printLabel}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-[#060A13] dark:text-slate-200 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden md:inline">{cvSection.printLabel}</span>
          </button>

          {!isFullscreen && onOpenFullscreen && (
            <button
              type="button"
              onClick={onOpenFullscreen}
              aria-label={viewer.fullscreen}
              title={viewer.fullscreen}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-[#060A13] dark:text-slate-200 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden md:inline">{viewer.fullscreen}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onDownload}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-500 transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{cvSection.downloadPdfShort}</span>
          </button>

          {isFullscreen && onCloseFullscreen && (
            <button
              type="button"
              onClick={onCloseFullscreen}
              aria-label={viewer.closePreview}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-[#060A13] dark:text-slate-200 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Document Viewport */}
      <div
        ref={viewportRef}
        className={`relative overflow-auto bg-slate-200/80 dark:bg-[#070B14] p-4 sm:p-6 ${
          isFullscreen ? 'flex-1' : 'max-h-[640px]'
        }`}
      >
        {loading && !renderError && (
          <div className="flex min-h-[380px] flex-col items-center justify-center gap-3 text-xs text-slate-600 dark:text-slate-400">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600 dark:border-white/15 dark:border-t-blue-400" />
            <span>{viewer.loadingPdf}</span>
          </div>
        )}

        {!loading && !renderError && pdfDoc && (
          <div dir="ltr" className="space-y-6">
            {pageNumbers.map((pageNumber) => (
              <PdfPageCanvas
                key={pageNumber}
                pdfDoc={pdfDoc}
                pageNumber={pageNumber}
                containerWidth={containerWidth}
                zoom={zoom}
              />
            ))}
          </div>
        )}

        {/* Graceful Resume Sheet Fallback if PDF canvas worker is unavailable */}
        {renderError && (
          <div className="mx-auto max-w-3xl rounded-xl bg-white text-slate-900 shadow-lg ring-1 ring-slate-900/10">
            {fallbackContent}
          </div>
        )}
      </div>
    </div>
  );
}
