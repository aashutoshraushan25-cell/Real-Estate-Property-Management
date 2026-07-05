/* Shared dashboard shell — glass sidebar with tab navigation */
import { useApp } from '../../context/AppContext';
import { Badge, Icon } from '../../components/ui';

export interface DashTab { id: string; label: string; icon: string }

export function DashShell({ title, subtitle, tabs, active, onChange, children }: {
  title: string; subtitle: string; tabs: DashTab[]; active: string;
  onChange: (id: string) => void; children: React.ReactNode;
}) {
  const { user } = useApp();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-500">{subtitle}</p>
        <h1 className="section-title mt-1.5">{title}</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        <aside className="h-fit lg:sticky lg:top-24">
          {/* user card */}
          {user && (
            <div className="card mb-4 flex items-center gap-3 p-4">
              <img src={user.profileImage} alt={user.name} className="h-11 w-11 rounded-xl object-cover" />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                <Badge label={user.role} />
              </div>
            </div>
          )}
          {/* tabs */}
          <nav className="card flex gap-1 overflow-x-auto p-2 lg:flex-col" aria-label="Dashboard sections">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => onChange(t.id)}
                aria-current={active === t.id ? 'page' : undefined}
                className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${active === t.id
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-600/25'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60'}`}>
                <Icon name={t.icon} className="h-4.5 w-4.5" /> {t.label}
              </button>
            ))}
          </nav>
        </aside>
        <div className="anim-fade-in min-w-0">{children}</div>
      </div>
    </div>
  );
}

/* Simple data table used across dashboards, with CSV export */
export function DataTable({ title, headers, rows, onExport }: {
  title: string; headers: string[]; rows: React.ReactNode[][]; onExport?: () => void;
}) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">
        <h2 className="font-bold text-slate-900 dark:text-white">{title}</h2>
        {onExport && (
          <button onClick={onExport} className="btn-ghost !px-3 !py-1.5 text-xs"><Icon name="doc" className="h-3.5 w-3.5" /> Export CSV</button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400 dark:border-slate-800">
              {headers.map((h) => <th key={h} className="px-5 py-3 font-bold">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={headers.length} className="px-5 py-10 text-center text-slate-400">No records found.</td></tr>
            )}
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-slate-50 transition hover:bg-slate-50/60 dark:border-slate-800/60 dark:hover:bg-slate-800/30">
                {r.map((cell, j) => <td key={j} className="px-5 py-3.5 align-middle">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* CSV download helper */
export function downloadCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = [headers.map(esc).join(','), ...rows.map((r) => r.map(esc).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}
