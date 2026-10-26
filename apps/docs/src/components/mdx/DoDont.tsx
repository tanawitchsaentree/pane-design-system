export function DoDont({ dos, donts }: { dos: string[]; donts: string[] }) {
  return (
    <div className="docs-dodont">
      <div>
        <div style={{ color: 'var(--ds-color-feedback-success)', fontWeight: 'var(--ds-font-weight-semibold)', marginBlockEnd: 'var(--ds-space-stack-sm)' }}>
          Do
        </div>
        <ul>
          {dos.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <div style={{ color: 'var(--ds-color-feedback-danger)', fontWeight: 'var(--ds-font-weight-semibold)', marginBlockEnd: 'var(--ds-space-stack-sm)' }}>
          Don&apos;t
        </div>
        <ul>
          {donts.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
