// The Language chapter: PaneProvider, the Thai catalog, the Buddhist year from th-TH, and how to add a
// language. The demo runs real components under the Thai provider, so the page itself is the proof.
import { useState } from 'react';
import { Calendar, Card, DataGrid, OTPFlow, Pagination, PaneProvider, th } from 'pane-react';
import { Code, Example, Page, Section } from './kit';

const ROWS = [{ id: 1, print: 'โลโฟเทน', price: 1200 }, { id: 2, print: 'เซนยา', price: 950 }];
const COLS = [{ key: 'print', header: 'ภาพพิมพ์', sortable: true }, { key: 'price', header: 'ราคา', align: 'end' as const, sortable: true }];

function ThaiDemo() {
  const [page, setPage] = useState(2);
  return (
    <PaneProvider messages={th} locale="th-TH">
      <div className="lang-demo" lang="th">
        <Card as="div" className="demo-card"><Calendar label="วันรับภาพ" defaultValue={new Date(2026, 10, 12)} /></Card>
        <Card as="div" className="demo-card"><DataGrid caption="ภาพพิมพ์" selectable columns={COLS} rows={ROWS} /></Card>
        <Card as="div" className="demo-card"><Pagination page={page} total={9} onPageChange={setPage} /></Card>
        <Card as="div" className="demo-card"><OTPFlow destination="•••• 4821" length={6} onVerify={() => false} onResend={() => {}} /></Card>
      </div>
    </PaneProvider>
  );
}

export function Language() {
  return (
    <Page eyebrow="Getting started" title="Language" lede={<p>Every word a Pane component shows or speaks on its own comes from one catalog. English is the default; Thai ships with the package; any other language is one object you write.</p>}>
      <Section id="provider" title="Set the language once">
        <p>Wrap the app in PaneProvider with a catalog and a locale. The catalog holds the words, from button names to what a screen reader hears when a table is empty. The locale gives how dates and numbers are written, and in th-TH it also gives the Buddhist year, so November 2026 reads as พฤศจิกายน 2569.</p>
        <Code label="main.tsx">{"import { PaneProvider, th } from 'pane-react';\n\n<PaneProvider messages={th} locale=\"th-TH\">\n  <App />\n</PaneProvider>"}</Code>
        <p>Without a provider every component speaks English and writes dates in the browser's locale, as before. Words you pass yourself, such as a label or a placeholder, always win over the catalog.</p>
      </Section>
      <Section id="thai" title="Thai, live" wide>
        <p>These are the real components under the Thai provider. The calendar's month and year come from the locale, the grid's checkboxes and the pagination's buttons from the catalog, and the code step speaks Thai to screen readers as well. Try the arrows.</p>
        <Example title="Calendar, DataGrid, Pagination and OTPFlow in Thai" code={"<PaneProvider messages={th} locale=\"th-TH\">…</PaneProvider>"}><ThaiDemo /></Example>
      </Section>
      <Section id="change-words" title="Change a few words">
        <p>To keep a catalog and change only some of its words, pass them as overrides. Anything you leave out stays as the catalog has it.</p>
        <Code>{"<PaneProvider messages={th} overrides={{ loadMore: 'ดูเพิ่ม' }}>"}</Code>
      </Section>
      <Section id="new-language" title="Add a language">
        <p>Copy the English catalog and translate each value. Type it as PaneMessages, and the compiler tells you every key that is missing or misspelled, so a new release that adds a word cannot ship with a hole in your language. Keys that take values, such as page or ratingScore, are small functions, so word order can follow the language.</p>
        <Code label="ja.ts">{"import type { PaneMessages } from 'pane-react';\n\nexport const ja: PaneMessages = {\n  cancel: 'キャンセル',\n  page: (n) => `${n}ページ`,\n  // …every other key\n};"}</Code>
        <p>Kiln checks the other half. The i18n lint fails the build when a component has a word of its own instead of a key, so no English is left behind in a translated product.</p>
      </Section>
    </Page>
  );
}
