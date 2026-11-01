// "Onboard your agent to Pane": one press copies the line a person pastes into their coding agent. The
// agent fetches /agent-setup/prompt.md (written by kiln's agent-setup.mjs from kiln.config.json), which
// asks before installing, installs into the project only and never touches a credential.
import { useEffect, useRef, useState } from 'react';
import { Button } from 'pane-react';
import { Link } from './kit';

const line = () => `Fetch ${location.origin}/agent-setup/prompt.md and follow it to set up Pane in this project. Ask me before you install anything.`;

// four agents, drawn as plain marks: a spark, a terminal, a cube and a window
const Marks = () => (
  <span className="agent-marks" aria-hidden="true">
    <svg viewBox="0 0 20 20"><path d="M10 1.5v17M1.5 10h17M4 4l12 12M16 4 4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
    <svg viewBox="0 0 20 20"><rect x="1.5" y="3" width="17" height="14" rx="4" fill="currentColor" /><path d="m5.5 8 2.5 2-2.5 2M10 12.5h4" stroke="var(--ds-surface-solid)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
    <svg viewBox="0 0 20 20"><path d="M10 1.5 17.5 6v8L10 18.5 2.5 14V6Z" fill="currentColor" /><path d="M10 10 17.5 6M10 10v8.5M10 10 2.5 6" stroke="var(--ds-surface-solid)" strokeWidth="1.2" /></svg>
    <svg viewBox="0 0 20 20"><rect x="3" y="1.5" width="14" height="17" rx="2" fill="currentColor" /><rect x="6" y="4.5" width="8" height="11" rx="1" fill="var(--ds-surface-solid)" /></svg>
  </span>
);

export function AgentOnboard() {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    clearTimeout(timer.current);
    try { await navigator.clipboard.writeText(line()); setState('copied'); timer.current = setTimeout(() => setState('idle'), 2600); }
    catch { setState('failed'); }
  };
  return (
    <div className="agent-onboard">
      <Button variant="glass" className="agent-pill" onClick={copy} iconEnd={<Marks />} aria-describedby="agent-onboard-note">
        {state === 'copied' ? 'Copied. Paste it into your agent' : 'Onboard your agent to Pane'}
      </Button>
      <p id="agent-onboard-note" className="flush muted agent-note" aria-live="polite">
        {state === 'failed'
          ? <>Copying was blocked. Copy this line yourself: <code>{line()}</code></>
          : <>Copies one line for Claude Code, Cursor, Codex or Copilot. It asks before installing anything. <Link to="/getting-started/ai">What it does</Link> · <a href="/agent-setup/prompt.md">Read the prompt</a></>}
      </p>
    </div>
  );
}
