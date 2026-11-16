import { useMemo, useState, type ReactNode } from 'react';
import {
  Activity, AlertCircle, ArrowUpRight, Bell, Check, ChevronDown,
  CircleHelp, ClipboardCheck, Command, FileSearch, Gauge,
  LayoutDashboard, MapPin, Menu, Plus, RefreshCw, Search, ShieldCheck,
  Sparkles, Wrench, X,
} from 'lucide-react';
import { analyzeObservation, prepareLocalModel } from './lib/relay-ai';
import { relayFirebaseReady, relayFirebaseSetupError } from './lib/firebase';
import type { RelayResult } from './lib/contracts';
import './styles.css';

const initialRecords = [
  { id: 'REL-0248', asset: 'P-204 · Transfer pump', site: 'North Wharf Facility', issue: 'Abnormal vibration reported', status: 'Needs review', time: '12 min ago', severity: 'high' },
  { id: 'REL-0247', asset: 'DB-018 · Distribution board', site: 'Central Operations Block', issue: 'Thermal inspection evidence missing', status: 'Evidence gap', time: '48 min ago', severity: 'medium' },
  { id: 'REL-0246', asset: 'HVAC-11 · Air handling unit', site: 'North Wharf Facility', issue: 'Filter replacement confirmed', status: 'Approved', time: '2 hours ago', severity: 'low' },
];

const sampleObservation = 'Pump P-204 is making more noise than usual during operation. The technician also noticed increased vibration this morning. No vibration measurement was taken and the inspection could not be completed because access was restricted.';

function App() {
  const [activeNav, setActiveNav] = useState('Overview');
  const [assetId, setAssetId] = useState('P-204');
  const [siteName, setSiteName] = useState('North Wharf Facility');
  const [observation, setObservation] = useState(sampleObservation);
  const [result, setResult] = useState<RelayResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Ready when you are.');
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [records, setRecords] = useState(initialRecords);

  const navItems = useMemo(() => [
    { label: 'Overview', icon: LayoutDashboard },
    { label: 'Sites & assets', icon: MapPin },
    { label: 'Field capture', icon: Plus },
    { label: 'Continuity intelligence', icon: FileSearch },
    { label: 'Work orders', icon: Wrench },
    { label: 'Handover centre', icon: RefreshCw },
    { label: 'TrustLedger', icon: ShieldCheck },
  ], []);

  const handlePrepare = async () => {
    setPreparing(true);
    setError('');
    setProgress(0);
    try {
      await prepareLocalModel({ onStatus: setStatus, onProgress: setProgress });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not prepare the AI model.');
    } finally {
      setPreparing(false);
    }
  };

  const handleAnalyze = async () => {
    setBusy(true);
    setError('');
    setResult(null);
    try {
      const next = await analyzeObservation(
        { assetId, siteName, observation },
        { onStatus: setStatus },
      );
      setResult(next);
      setRecords((previous) => [
        {
          id: `REL-${String(249 + previous.length - initialRecords.length).padStart(4, '0')}`,
          asset: `${assetId} · ${assetId === 'P-204' ? 'Transfer pump' : 'Field asset'}`,
          site: siteName,
          issue: next.analysis.observations[0] ?? 'New field observation',
          status: 'Needs review',
          time: 'Just now',
          severity: next.analysis.severity,
        },
        ...previous,
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Analysis failed.');
      setStatus('Analysis could not be completed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark">R</div>
          <div><div className="brand-name">RELAY</div><div className="brand-byline">BY ASIVARO CONCEPTS</div></div>
          <button className="icon-button close-mobile" aria-label="Close navigation" onClick={() => setMobileMenuOpen(false)}><X size={17} /></button>
        </div>
        <div className="workspace-switcher">
          <div className="workspace-avatar">A</div>
          <div className="workspace-copy"><strong>Asivaro Operations</strong><span>Workspace</span></div>
          <ChevronDown size={15} className="muted-icon" />
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav className="main-nav">
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} onClick={() => { setActiveNav(label); setMobileMenuOpen(false); }} className={`nav-item ${activeNav === label ? 'active' : ''}`}>
              <Icon size={17} strokeWidth={1.8} /><span>{label}</span>
              {label === 'Continuity intelligence' && <span className="nav-count">3</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><div className="help-icon"><CircleHelp size={16} /></div><div><strong>Need a hand?</strong><span>Explore the RELAY guide</span></div><ArrowUpRight size={14} /></div>
          <div className="profile-row"><div className="profile-avatar">EI</div><div className="profile-copy"><strong>Workspace Admin</strong><span>ASIVARO CONCEPTS</span></div><MoreDots /></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMobileMenuOpen(true)}><Menu size={19} /></button>
          <div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{activeNav}</strong></div>
          <div className="topbar-actions"><div className="search-box"><Search size={15} /><span>Search anything</span><kbd>⌘ K</kbd></div><button className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /><i /></button><div className="topbar-avatar">EI</div></div>
        </header>

        <div className="page-content">
          <div className="page-heading">
            <div><div className="eyebrow"><span className="live-dot" /> OPERATIONAL INTELLIGENCE <span className="sample-tag">SYNTHETIC DEMO DATA</span></div><h1>Good day. <span>Here's your overview.</span></h1><p>Keep every observation connected to the next decision.</p></div>
            <button className="primary-button top-action" onClick={() => { setActiveNav('Field capture'); document.getElementById('capture-card')?.scrollIntoView({ behavior: 'smooth' }); }}><Plus size={16} /> New observation</button>
          </div>

          <div className={`connection-banner ${relayFirebaseReady ? 'connected' : 'not-connected'}`}>
            <div className="connection-icon">{relayFirebaseReady ? <Check size={16} /> : <AlertCircle size={16} />}</div>
            <div className="connection-copy"><strong>{relayFirebaseReady ? 'Firebase AI Logic is configured' : 'Firebase connection is pending'}</strong><span>{relayFirebaseReady ? 'Hybrid inference is ready to test. Actual execution source will be reported for each request.' : relayFirebaseSetupError ?? 'Complete Firebase project configuration to enable real AI inference.'}</span></div>
            {!relayFirebaseReady && <span className="setup-pill">SETUP REQUIRED</span>}
          </div>

          <section className="metric-grid">
            <Metric icon={<Activity size={17} />} label="Active observations" value="24" change="+6 this week" tone="blue" />
            <Metric icon={<AlertCircle size={17} />} label="Evidence gaps" value="07" change="3 need attention" tone="amber" />
            <Metric icon={<ClipboardCheck size={17} />} label="Actions awaiting review" value="12" change="4 due today" tone="violet" />
            <Metric icon={<Gauge size={17} />} label="Continuity score" value="86%" change="+8% this month" tone="gold" />
          </section>

          <section className="content-grid">
            <div className="left-column">
              <section className="panel capture-panel" id="capture-card">
                <div className="panel-heading"><div><div className="section-kicker">FIELD INTELLIGENCE</div><h2>Capture an observation</h2><p>Turn a field note into a verified, actionable record.</p></div><div className="panel-icon"><Sparkles size={18} /></div></div>
                <div className="form-row"><label>Asset identifier<input value={assetId} onChange={(e) => setAssetId(e.target.value)} placeholder="e.g. P-204" /></label><label>Site / location<input value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="e.g. North Wharf Facility" /></label></div>
                <label className="observation-label">What did the team observe?<textarea value={observation} onChange={(e) => setObservation(e.target.value)} rows={5} placeholder="Describe what was observed, when it happened and what is still unknown…" /></label>
                <div className="capture-footer"><span><ShieldCheck size={14} /> AI-generated drafts always require human review</span><button className="text-button" onClick={() => setObservation(sampleObservation)}>Load sample note</button></div>
                <div className="action-row"><button className="secondary-button" onClick={handlePrepare} disabled={!relayFirebaseReady || preparing || busy}><Sparkles size={15} /> {preparing ? 'Preparing local AI…' : 'Prepare local AI'}</button><button className="primary-button" onClick={handleAnalyze} disabled={!relayFirebaseReady || busy || preparing || !observation.trim()}>{busy ? <span className="spinner" /> : <FileSearch size={15} />} {busy ? 'Analysing…' : 'Analyse observation'} <ArrowUpRight size={14} /></button></div>
                {(preparing || status !== 'Ready when you are.') && <div className="status-line"><span className="status-pulse" />{status}{preparing && <span className="progress-value">{progress}%</span>}</div>}
                {preparing && <div className="progress-track"><div style={{ width: `${progress}%` }} /></div>}
                {error && <div className="error-message"><AlertCircle size={15} />{error}</div>}
              </section>

              {result && <section className="panel result-panel"><div className="result-heading"><div><div className="section-kicker">ANALYSIS RESULT</div><h2>Continuity assessment</h2></div><span className={`source-chip ${result.inferenceSource === 'ON_DEVICE' ? 'source-local' : 'source-cloud'}`}><span />{result.inferenceSource === 'ON_DEVICE' ? 'ON DEVICE' : result.inferenceSource === 'IN_CLOUD' ? 'IN CLOUD' : 'SOURCE UNKNOWN'}</span></div><div className="result-meta"><span>{result.analysis.assetId}</span><span>·</span><span>{new Date(result.completedAt).toLocaleTimeString()}</span></div><div className="result-summary"><strong>Recommended next action</strong><p>{result.analysis.recommendedNextAction}</p></div><div className="result-columns"><ResultList title="Known facts" items={result.analysis.knownFacts} /><ResultList title="Missing evidence" items={result.analysis.missingEvidence} /></div><div className="result-caution"><ShieldCheck size={15} />{result.analysis.caution} Human approval required: {result.analysis.requiresHumanReview ? 'Yes' : 'No'}.</div></section>}

              <section className="panel records-panel"><div className="panel-heading compact"><div><div className="section-kicker">LATEST ACTIVITY</div><h2>Recent observations</h2></div><button className="text-button">View all <ArrowUpRight size={13} /></button></div><div className="records-table"><div className="table-head"><span>RECORD / ASSET</span><span>OBSERVATION</span><span>STATUS</span><span>UPDATED</span></div>{records.slice(0, 5).map((r) => <div className="record-row" key={r.id}><div className="record-asset"><strong>{r.id}</strong><span>{r.asset}</span><small>{r.site}</small></div><div className="record-issue">{r.issue}</div><div><span className={`record-status ${r.status === 'Approved' ? 'approved' : r.status === 'Evidence gap' ? 'gap' : 'review'}`}>{r.status}</span></div><div className="record-time">{r.time}</div></div>)}</div></section>
            </div>

            <div className="right-column">
              <section className="panel continuity-panel"><div className="panel-heading compact"><div><div className="section-kicker">CONTINUITY ENGINE</div><h2>What needs attention</h2></div><span className="attention-count">03</span></div><div className="attention-list"><AttentionItem color="amber" title="Evidence still missing" subtitle="Pump P-204 · Vibration measurement" meta="Needs technician follow-up" /><AttentionItem color="violet" title="Shift handover incomplete" subtitle="Central Operations · Night shift" meta="2 records not acknowledged" /><AttentionItem color="blue" title="Supervisor review pending" subtitle="Distribution board DB-018" meta="Waiting for approval" /></div><button className="full-width-button">Open continuity centre <ArrowUpRight size={14} /></button></section>

              <section className="panel hybrid-panel"><div className="hybrid-title"><div className="hybrid-symbol"><Command size={17} /></div><div><div className="section-kicker">HYBRID INTELLIGENCE</div><h2>Two environments. One experience.</h2></div></div><p>RELAY prefers on-device inference when available and falls back to cloud intelligence when needed.</p><div className="hybrid-path"><div className="path-node"><div className="path-icon local"><Sparkles size={15} /></div><div><strong>On-device AI</strong><span>Private, local processing</span></div><span className="path-tag">PREFERRED</span></div><div className="path-connector"><i /></div><div className="path-node"><div className="path-icon cloud"><Activity size={15} /></div><div><strong>Cloud AI</strong><span>Expanded model capability</span></div><span className="path-tag fallback">FALLBACK</span></div></div><div className="hybrid-note"><ShieldCheck size={14} /> The source label is taken from Firebase's inference response, not estimated by the interface.</div></section>

              <section className="quote-card"><div className="quote-mark">“</div><p>Nothing important gets lost between the field and the next decision.</p><span>THE RELAY PRINCIPLE</span><div className="quote-orbit orbit-one" /><div className="quote-orbit orbit-two" /></section>
            </div>
          </section>
          <footer className="page-footer"><span>RELAY <i>·</i> ASIVARO CONCEPTS</span><span>OPERATIONAL INTELLIGENCE & CONTINUITY NETWORK</span><span>BUILD 0.1.0</span></footer>
        </div>
      </main>
    </div>
  );
}

function MoreDots() { return <span className="more-dots">···</span>; }

function Metric({ icon, label, value, change, tone }: { icon: ReactNode; label: string; value: string; change: string; tone: string }) {
  return <div className="metric-card"><div className={`metric-icon ${tone}`}>{icon}</div><span className="metric-label">{label}</span><strong className="metric-value">{value}</strong><span className={`metric-change ${tone}`}>{change}</span></div>;
}

function AttentionItem({ color, title, subtitle, meta }: { color: string; title: string; subtitle: string; meta: string }) {
  return <div className="attention-item"><span className={`attention-dot ${color}`} /><div className="attention-copy"><strong>{title}</strong><span>{subtitle}</span><small>{meta}</small></div><ArrowUpRight size={14} /></div>;
}

function ResultList({ title, items }: { title: string; items: string[] }) {
  return <div className="result-list"><strong>{title}</strong>{items.length ? items.map((item, index) => <span key={`${item}-${index}`}>• {item}</span>) : <span>None identified in the supplied note.</span>}</div>;
}

export default App;
