// Showcase scenarios (R-040): each one is a small working product, one per row, wired end to end, with a
// switch for the states a real screen meets (ready, loading, empty, failing). They replace the grids of
// separate cards, which showed parts side by side and did nothing when pressed.
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Badge, Banner, Button, Calendar, Card, Chip, DataGrid, EmptyState, IconButton, NumberInput, OTPFlow, Pagination,
  PaneProvider, Progress, RadioCards, SegmentedControl, Select, Skeleton, Slider, Stepper, Switch, th,
} from 'pane-react';
import { IconNext, IconPause, IconPlay, IconPrev } from '../icons';
import { Stage } from './kit';

export type ScenarioState = 'ready' | 'loading' | 'empty' | 'error';

/** One scenario: its story and the state switch on the left, the working screen on the right. */
function Scenario({ title, story, built, states, children }: { title: string; story: ReactNode; built: string; states: Array<[ScenarioState, string]>; children: (state: ScenarioState, reset: number) => ReactNode }) {
  const [state, setState] = useState<ScenarioState>('ready');
  const [reset, setReset] = useState(0);
  return (
    <section className="scenario" aria-label={title} data-scenario="">
      <div className="scenario-side">
        <h3 className="flush">{title}</h3>
        <div className="scenario-story">{story}</div>
        <SegmentedControl label="What the screen meets" showLabel size="sm" value={state} onValueChange={(v) => { setState(v as ScenarioState); setReset((n) => n + 1); }} options={states.map(([v, l]) => ({ value: v, label: l }))} />
        <Button variant="ghost" size="sm" onClick={() => setReset((n) => n + 1)}>Start again</Button>
        <p className="scenario-built">Built from {built}</p>
      </div>
      <Stage className="scenario-stage" backdrop="scene" picker><div key={`${state}-${reset}`} className="scenario-screen">{children(state, reset)}</div></Stage>
    </section>
  );
}

const money = (n: number, cur = 'EUR', loc = 'en-GB') => new Intl.NumberFormat(loc, { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(n);

// ---------- 1. Order a print ----------
const SIZES = [{ value: 'a4', title: 'A4', price: 45, note: '21 × 30 cm' }, { value: 'a3', title: 'A3', price: 70, note: '30 × 42 cm' }, { value: 'a2', title: 'A2', price: 120, note: '42 × 59 cm, two weeks' }];
function OrderPrint({ state }: { state: ScenarioState }) {
  const [size, setSize] = useState('a3');
  const [qty, setQty] = useState<number | null>(1);
  const [wrap, setWrap] = useState(false);
  const [phase, setPhase] = useState<'edit' | 'sending' | 'done' | 'failed'>('edit');
  const p = SIZES.find((s) => s.value === size)!;
  const total = p.price * (qty ?? 0) + (wrap ? 6 : 0);
  const place = () => { setPhase('sending'); setTimeout(() => setPhase(state === 'error' ? 'failed' : 'done'), 1200); };
  if (state === 'loading') return <Card as="div" className="scenario-card"><Skeleton shape="block" /><Skeleton lines={3} /></Card>;
  if (state === 'empty') return <Card as="div" className="scenario-card"><EmptyState title="Lofoten, March is sold out" description="The last print went this morning. We can tell you when the next run is printed." actions={<Button variant="glass">Tell me</Button>} /></Card>;
  if (phase === 'done') return (
    <Card as="div" className="scenario-card">
      <Banner tone="positive" title="Order placed" live="polite">{qty} × {p.title}{wrap ? ', gift wrapped' : ''}. {money(total)} charged. It ships on Thursday.</Banner>
      <Button variant="glass" onClick={() => setPhase('edit')}>Order another</Button>
    </Card>
  );
  return (
    <Card as="section" aria-label="Order a print" className="scenario-card">
      <div className="scenario-head"><img src="/scenes/forest-sm.jpg" alt="" className="scenario-thumb" /><div><h4 className="flush">Lofoten, March</h4><p className="flush muted">Giclée on cotton rag</p></div><Badge tone="accent">New</Badge></div>
      {phase === 'failed' && <Banner tone="critical" title="The payment did not go through" live="assertive" action={<Button size="sm" variant="glass" onClick={place}>Try again</Button>}>Your card was not charged. Check the card details or try again.</Banner>}
      <RadioCards label="Size" value={size} onValueChange={setSize} options={SIZES.map((s) => ({ value: s.value, title: `${s.title} · ${money(s.price)}`, description: s.note }))} />
      <div className="scenario-row">
        <NumberInput label="Quantity" min={1} max={10} value={qty} onValueChange={setQty} />
        <Switch label="Gift wrap" description="+ €6" checked={wrap} onCheckedChange={setWrap} />
      </div>
      <div className="scenario-total"><span>Total</span><b aria-live="polite">{money(total)}</b></div>
      <Button loading={phase === 'sending'} disabled={!qty} onClick={place}>Place order</Button>
    </Card>
  );
}

// ---------- 2. Living room ----------
const SCENES = { reading: { b: 80, w: 40 }, film: { b: 25, w: 70 }, away: { b: 0, w: 0 } } as const;
function LivingRoom({ state }: { state: ScenarioState }) {
  const [b, setB] = useState(70);
  const [w, setW] = useState(35);
  const [night, setNight] = useState(true);
  const [scene, setScene] = useState<keyof typeof SCENES | null>(null);
  const [off, setOff] = useState('2300');
  const [saved, setSaved] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const touch = () => { setSaved('saving'); clearTimeout(timer.current); timer.current = setTimeout(() => setSaved(state === 'error' ? 'failed' : 'saved'), 700); };
  useEffect(() => () => clearTimeout(timer.current), []);
  const pick = (s: keyof typeof SCENES) => { setScene(s); setB(SCENES[s].b); setW(SCENES[s].w); touch(); };
  if (state === 'loading') return <Card as="div" className="scenario-card"><Skeleton lines={2} /><Skeleton shape="block" /></Card>;
  if (state === 'empty') return <Card as="div" className="scenario-card"><EmptyState title="No lights in this room yet" description="Add a lamp from the hub, then it shows up here." actions={<Button variant="glass">Add a lamp</Button>} /></Card>;
  const warm = `color-mix(in oklab, var(--ds-crystal-warning-hue) ${w}%, var(--ds-crystal-info-hue))`;
  return (
    <Card as="section" aria-label="Living room" className="scenario-card">
      <div className="scenario-head"><div><h4 className="flush">Living room</h4><p className="flush muted" aria-live="polite">{saved === 'saving' ? 'Saving…' : saved === 'failed' ? 'Not saved' : saved === 'saved' ? 'Saved to the hub' : '3 lights'}</p></div>
        <span className="scenario-lamp" aria-hidden="true" style={{ opacity: b / 100, background: warm }} /></div>
      {saved === 'failed' && <Banner tone="warning" title="The hub did not answer" action={<Button size="sm" variant="glass" onClick={touch}>Retry</Button>}>The lights keep their last setting until it is back.</Banner>}
      <Slider label="Brightness" value={b} onValueChange={(v) => { setB(v); setScene(null); touch(); }} format={(v) => `${v}%`} />
      <Slider label="Warmth" value={w} onValueChange={(v) => { setW(v); setScene(null); touch(); }} format={(v) => `${v}%`} />
      <div className="scenario-row" role="group" aria-label="Scenes">{(Object.keys(SCENES) as Array<keyof typeof SCENES>).map((s) => <Chip key={s} tone="info" selected={scene === s} onSelectedChange={() => pick(s)}>{s[0].toUpperCase() + s.slice(1)}</Chip>)}</div>
      <Switch label="Night shift" description="Warmer light after sunset" checked={night} onCheckedChange={(v) => { setNight(v); touch(); }} />
      <Select label="Turn off" value={off} onValueChange={(v) => { setOff(v); touch(); }} options={[{ value: 'never', label: 'Never' }, { value: '2300', label: 'At 23:00' }, { value: 'sunrise', label: 'At sunrise' }]} />
    </Card>
  );
}

// ---------- 3. Listening ----------
const TRACKS = [{ t: 'Night drive', a: 'Lumen', s: 214 }, { t: 'Harbour lights', a: 'Lumen', s: 187 }, { t: 'Low tide', a: 'Mara Lind', s: 241 }];
function Listening({ state }: { state: ScenarioState }) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(state !== 'error');
  const [pos, setPos] = useState(42);
  const [vol, setVol] = useState(62);
  useEffect(() => { if (!playing) return; const id = setInterval(() => setPos((p) => { if (p + 1 >= TRACKS[i].s) { setI((x) => (x + 1) % TRACKS.length); return 0; } return p + 1; }), 1000); return () => clearInterval(id); }, [playing, i]);
  const tr = TRACKS[i]; const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  if (state === 'loading') return <Card as="div" className="scenario-card"><Skeleton shape="block" /><Skeleton lines={2} /></Card>;
  if (state === 'empty') return <Card as="div" className="scenario-card"><EmptyState title="Nothing queued" description="Pick an album and it plays here." actions={<Button variant="glass">Browse albums</Button>} /></Card>;
  return (
    <Card as="section" aria-label="Now playing" className="scenario-card">
      <div className="scenario-head"><img src="/scenes/night-sm.jpg" alt="" className="scenario-thumb" /><div><h4 className="flush">{tr.t}</h4><p className="flush muted">{tr.a}</p></div>{state === 'error' ? <Badge tone="warning">Offline</Badge> : <Badge tone="positive">Synced</Badge>}</div>
      {state === 'error' && <Banner tone="warning" title="You are offline">Downloaded tracks still play. The rest come back when you are online.</Banner>}
      <Progress label="Played" value={pos} max={tr.s} valueText={`${mmss(pos)} of ${mmss(tr.s)}`} showValue />
      <div className="scenario-transport">
        <IconButton aria-label="Previous track" variant="glass" onClick={() => { setI((x) => (x + TRACKS.length - 1) % TRACKS.length); setPos(0); }}><IconPrev /></IconButton>
        <IconButton aria-label={playing ? 'Pause' : 'Play'} variant="loud" onClick={() => setPlaying((p) => !p)}>{playing ? <IconPause /> : <IconPlay />}</IconButton>
        <IconButton aria-label="Next track" variant="glass" onClick={() => { setI((x) => (x + 1) % TRACKS.length); setPos(0); }}><IconNext /></IconButton>
      </div>
      <Slider label="Volume" value={vol} onValueChange={setVol} format={(v) => `${v}%`} />
      <ol className="scenario-queue" aria-label="Up next">{TRACKS.map((x, k) => <li key={x.t} aria-current={k === i ? 'true' : undefined}>{x.t} <span className="muted">{mmss(x.s)}</span></li>)}</ol>
    </Card>
  );
}

const STATES: Array<[ScenarioState, string]> = [['ready', 'Ready'], ['loading', 'Loading'], ['empty', 'Empty'], ['error', 'Failing']];

/** The opening showcase: three products, one per row. */
export function Scenarios() {
  return (
    <div className="scenarios">
      <Scenario title="Order a print" built="RadioCards, NumberInput, Switch, Button loading, Banner, EmptyState, Skeleton, Badge" states={STATES}
        story={<p className="flush">Pick a size and a quantity and the total follows. Placing the order shows the button busy, then a receipt. Set it to Failing and the payment is refused with a way to try again; Empty is a sold-out print.</p>}>
        {(s) => <OrderPrint state={s} />}
      </Scenario>
      <Scenario title="Living room" built="Slider, Chip with a tone, Switch, Select, Banner, Skeleton, EmptyState" states={STATES}
        story={<p className="flush">A scene sets both sliders at once. Every change saves to the hub, and the lamp shows the light. Under Failing the hub never answers, so the controls hold their place and offer a retry.</p>}>
        {(s) => <LivingRoom state={s} />}
      </Scenario>
      <Scenario title="Now playing" built="IconButton, Progress, Slider, Badge, Banner, Skeleton, EmptyState" states={STATES}
        story={<p className="flush">It really plays. The progress runs, the next track starts when one ends, and the queue keeps up. Failing means offline, said in words.</p>}>
        {(s) => <Listening state={s} />}
      </Scenario>
    </div>
  );
}

// ---------- Thai: book a print pick-up ----------
type Print = { id: number; print: string; size: string; price: number };
const PRINTS: Print[] = ['โลโฟเทน', 'เซนยา', 'ลาวเตอร์บรุนเนน', 'ไซ่ง่อนยามค่ำ', 'ฟยอร์ด', 'ทะเลหมอก', 'ป่าฝน', 'เมืองเก่า', 'ทุ่งลาเวนเดอร์', 'ภูเขาไฟ', 'อ่าวพังงา', 'หิมะแรก'].map((p, k) => ({ id: k + 1, print: p, size: ['A4', 'A3', 'A2'][k % 3], price: [950, 1200, 1800][k % 3] }));
const COLS = [{ key: 'print', header: 'ภาพพิมพ์', sortable: true }, { key: 'size', header: 'ขนาด' }, { key: 'price', header: 'ราคา (บาท)', align: 'end' as const, sortable: true }];
const PER = 4;
function ThaiFlow({ state }: { state: ScenarioState }) {
  const [step, setStep] = useState(0);
  const [date, setDate] = useState<Date | null>(null);
  const [page, setPage] = useState(1);
  const [picked, setPicked] = useState<(string | number)[]>([]);
  const rows = state === 'empty' ? [] : PRINTS;
  const pages = Math.max(1, Math.ceil(rows.length / PER));
  const shown = useMemo(() => rows.slice((page - 1) * PER, page * PER), [rows, page]);
  const total = PRINTS.filter((p) => picked.includes(p.id)).reduce((a, p) => a + p.price, 0);
  const baht = (n: number) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(n);
  const dateText = date ? new Intl.DateTimeFormat('th-TH', { dateStyle: 'long' }).format(date) : '';
  if (state === 'loading') return <Card as="div" className="scenario-card" lang="th"><Skeleton lines={2} /><Skeleton shape="block" /></Card>;
  return (
    <PaneProvider messages={th} locale="th-TH">
      <Card as="section" aria-label="จองรับภาพพิมพ์" className="scenario-card scenario-wide" lang="th">
        <Stepper label="ขั้นตอน" current={step} steps={[{ label: 'วันรับภาพ' }, { label: 'เลือกภาพ' }, { label: 'ยืนยันตัวตน' }, { label: 'เสร็จ' }]} />
        {step === 0 && <>
          <Calendar label="วันรับภาพ" value={date} onValueChange={setDate} min={new Date(2026, 10, 2)} isUnavailable={(d) => d.getDay() === 0} />
          <p className="flush muted">ร้านปิดวันอาทิตย์ {date ? `· รับภาพ ${dateText}` : ''}</p>
          <Button disabled={!date} onClick={() => setStep(1)}>ถัดไป</Button>
        </>}
        {step === 1 && <>
          {rows.length === 0
            ? <EmptyState title="ยังไม่มีภาพพิมพ์ให้รับในวันนั้น" description="ลองเลือกวันอื่น หรือสั่งพิมพ์ใหม่ได้จากหน้าภาพ" actions={<Button variant="glass" onClick={() => setStep(0)}>เลือกวันใหม่</Button>} />
            : <>
              <DataGrid caption="ภาพพิมพ์ที่พร้อมรับ" selectable selected={picked} onSelectedChange={setPicked} columns={COLS} rows={shown} />
              <Pagination page={page} total={pages} onPageChange={setPage} />
              <div className="scenario-total"><span>เลือก {picked.length} ภาพ</span><b aria-live="polite">{baht(total)}</b></div>
              <div className="scenario-row"><Button variant="glass" onClick={() => setStep(0)}>ย้อนกลับ</Button><Button disabled={!picked.length} onClick={() => setStep(2)}>ถัดไป</Button></div>
            </>}
        </>}
        {step === 2 && <>
          <OTPFlow destination="•••• 4821" length={6} onVerify={(c) => { const ok = state !== 'error' && c === '123456'; if (ok) setTimeout(() => setStep(3), 600); return ok; }} onResend={() => {}} />
          <p className="flush muted">{state === 'error' ? 'สถานการณ์นี้: รหัสทุกตัวจะผิด เพื่อดูข้อความแจ้งและการส่งรหัสใหม่' : 'ลองใส่ 123456'}</p>
        </>}
        {step === 3 && <Banner tone="positive" title="จองเรียบร้อย">รับภาพ {picked.length} ภาพ วันที่ {dateText} ยอดชำระที่ร้าน {baht(total)}</Banner>}
      </Card>
    </PaneProvider>
  );
}

/** The Language chapter's showcase: one Thai flow from date to confirmation. */
export function ThaiScenario() {
  return (
    <div className="scenarios">
      <Scenario title="จองรับภาพพิมพ์ (Book a pick-up, in Thai)" built="PaneProvider th, Stepper, Calendar, DataGrid, Pagination, OTPFlow, Banner, EmptyState" states={STATES}
        story={<p className="flush">The whole flow runs under the Thai provider. The calendar writes the Buddhist year and closes on Sundays. The grid pages and adds up what you pick, and the code step speaks Thai. Try 123456. Failing makes every code wrong, and Empty has no prints that day.</p>}>
        {(s) => <ThaiFlow state={s} />}
      </Scenario>
    </div>
  );
}
