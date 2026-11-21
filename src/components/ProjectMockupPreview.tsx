import { CheckSquare, Database, Lock, Server, Smartphone } from 'lucide-react';

interface ProjectMockupPreviewProps {
  type: 'flutter-ui' | 'nodejs-api';
}

export default function ProjectMockupPreview({ type }: ProjectMockupPreviewProps) {
  if (type === 'flutter-ui') {
    return (
      <div
        aria-label="Flutter ToDo App architecture preview"
        className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0B1325] via-[#0F1B33] to-[#08101E] p-5"
      >
        <div className="w-full max-w-[260px] rounded-xl border border-white/10 bg-[#060A13]/95 p-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
            <div className="flex items-center gap-2">
              <Smartphone className="h-3.5 w-3.5 text-blue-400" aria-hidden="true" />
              <span className="font-display text-xs font-semibold text-white">
                Flutter ToDo
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
              <Lock className="h-3 w-3 text-blue-400" aria-hidden="true" />
              Firebase Auth
            </span>
          </div>

          <div className="mt-3 space-y-2">
            {[
              { label: 'Create Task (POST)', state: 'CRUD' },
              { label: 'Read & Sync Tasks', state: 'Firebase' },
              { label: 'Update / Complete', state: 'State' },
              { label: 'Delete Task Entry', state: 'CRUD' },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2"
              >
                <span className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckSquare className="h-3.5 w-3.5 text-blue-400" aria-hidden="true" />
                  <span>{row.label}</span>
                </span>
                <span className="font-mono text-[10px] text-slate-400">{row.state}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      aria-label="Node.js Web Application API architecture preview"
      className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0B1325] via-[#0E182E] to-[#070D19] p-5"
    >
      <div className="w-full max-w-[300px] rounded-xl border border-white/10 bg-[#060A13]/95 p-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
          <div className="flex items-center gap-2">
            <Server className="h-3.5 w-3.5 text-blue-400" aria-hidden="true" />
            <span className="font-display text-xs font-semibold text-white">
              Express.js + MongoDB
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <Database className="h-3 w-3 text-blue-400" aria-hidden="true" />
            Postman Tested
          </span>
        </div>

        <div className="mt-3 space-y-2 font-mono text-[11px]">
          {[
            { method: 'GET', path: '/api/items', note: 'Read' },
            { method: 'POST', path: '/api/items', note: 'Create' },
            { method: 'PUT', path: '/api/items/:id', note: 'Update' },
            { method: 'DELETE', path: '/api/items/:id', note: 'Delete' },
          ].map((route) => (
            <div
              key={`${route.method}-${route.path}`}
              className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-12 font-semibold text-blue-400">{route.method}</span>
                <span className="text-slate-200">{route.path}</span>
              </div>
              <span className="text-slate-500">{route.note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
