import { Command } from 'cmdk';
import { useEffect, useState } from 'react';
import { site } from '../data/site.js';
import { useThemeCtx } from '../contexts/ThemeContext.js';

const THEME_LABELS = { light: 'Light', dark: 'Dark', system: 'System' };

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { mode, cycle } = useThemeCtx();

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  function close() {
    setOpen(false);
    setQuery('');
  }

  function run(fn) {
    close();
    // tiny delay so the palette closes before navigating
    setTimeout(fn, 60);
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={(v) => { setOpen(v); if (!v) setQuery(''); }}
      label="Command palette"
      className="cmdk-dialog"
    >
      <div className="cmdk-backdrop" onClick={close} aria-hidden />
      <div className="cmdk-panel" role="dialog" aria-modal="true">
        <Command className="cmdk-root">
          <Command.Input
            className="cmdk-input"
            placeholder="Type a command…"
            value={query}
            onValueChange={setQuery}
            autoFocus
          />
          <Command.List className="cmdk-list">
            <Command.Empty className="cmdk-empty">No results.</Command.Empty>

            <Command.Group heading="Navigate" className="cmdk-group">
              {['about', 'experience', 'projects', 'contact'].map((id) => (
                <Command.Item
                  key={id}
                  value={`go to ${id}`}
                  className="cmdk-item"
                  onSelect={() => run(() => scrollTo(id))}
                >
                  <span className="cmdk-icon">↓</span>
                  Go to {id.charAt(0).toUpperCase() + id.slice(1)}
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Theme" className="cmdk-group">
              <Command.Item
                value="toggle theme"
                className="cmdk-item"
                onSelect={() => { cycle(); close(); }}
              >
                <span className="cmdk-icon">◑</span>
                Toggle theme
                <span className="cmdk-hint">{THEME_LABELS[mode]}</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Social" className="cmdk-group">
              <Command.Item
                value="github open"
                className="cmdk-item"
                onSelect={() => run(() => window.open(site.links.github, '_blank', 'noopener'))}
              >
                <span className="cmdk-icon">↗</span>
                GitHub
              </Command.Item>
              <Command.Item
                value="linkedin open"
                className="cmdk-item"
                onSelect={() => run(() => window.open(site.links.linkedin, '_blank', 'noopener'))}
              >
                <span className="cmdk-icon">↗</span>
                LinkedIn
              </Command.Item>
              <Command.Item
                value="email send"
                className="cmdk-item"
                onSelect={() => run(() => { window.location.href = `mailto:${site.links.email}`; })}
              >
                <span className="cmdk-icon">✉</span>
                Send email
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </Command.Dialog>
  );
}
