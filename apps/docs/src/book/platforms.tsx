// Other frameworks and platforms (D-042): what Pane ships for each, what works and what is still React's.
import { Code, Page, Section } from './kit';

const ROWS: Array<[string, string, string]> = [
  ['React', 'pane-react, with every component, its behaviour and the tokens', 'Complete'],
  ['HTML, Vue, Svelte, Angular, Solid', 'pane-react/all.css with stable class names, and an HTML block under each component’s live demo', 'Looks complete; keyboard, open and close are yours to wire'],
  ['Tailwind', 'pane-tokens/tailwind, a preset whose values are the CSS variables', 'Complete for colour, spacing, corners, type and motion'],
  ['SwiftUI', 'pane-tokens Swift file (PaneTokens.swift), with both themes per colour', 'Tokens; no SwiftUI components yet'],
  ['Jetpack Compose', 'pane-tokens/kotlin, PaneDark and PaneLight objects', 'Tokens; no Compose components yet'],
  ['Flutter', 'pane-tokens/dart, PaneDark and PaneLight classes', 'Tokens; no Flutter widgets yet'],
  ['Figma', 'pane-tokens/figma, one collection with Dark and Light modes', 'Tokens as variables'],
];

export function Platforms() {
  return (
    <Page eyebrow="Getting started" title="Other frameworks and platforms" lede={<p>Pane is written in React, and its tokens are written once and built for every place a product lives. This page says what each platform gets today, and where the work is still yours.</p>}>
      <Section id="what" title="What each platform gets">
        <div className="table-wrap"><table className="tokens"><thead><tr><th scope="col">Where</th><th scope="col">What ships</th><th scope="col">How far it goes</th></tr></thead>
          <tbody>{ROWS.map(([w, s, h]) => <tr key={w}><td>{w}</td><td>{s}</td><td>{h}</td></tr>)}</tbody></table></div>
        <p>Every platform reads the same token names, so a brand file or a change to the glass reaches all of them from one build.</p>
      </Section>
      <Section id="html" title="Without React">
        <p>Load the tokens and the component sheet, then use the class names. Each component page shows the HTML for its live demo under the TSX, so you can copy the exact markup. A Card, a Button, a Badge or a Tag need nothing else. Anything that opens, moves focus or answers keys, such as a Select, a Dialog or Tabs, needs its behaviour from React or from your own accessible script.</p>
        <Code label="HTML">{`<link rel="stylesheet" href="pane-react/tokens.css">
<link rel="stylesheet" href="pane-react/all.css">

<section data-component="Card" class="pane-Card-module__root pane-Card-module__glass">
  <h3>Trip to Lauterbrunnen</h3>
  <button class="pane-Button-module__root pane-Button-module__light pane-Button-module__md">Join</button>
</section>`}</Code>
      </Section>
      <Section id="tailwind" title="Tailwind">
        <Code label="tailwind.config.js">{`module.exports = {
  presets: [require('pane-tokens/tailwind')],
};
// then: bg-surface-solid text-text-primary rounded-panel p-inset`}</Code>
      </Section>
      <Section id="native" title="SwiftUI, Compose and Flutter">
        <p>The native files hold both themes. Pick the set that matches the system appearance, and read sizes as points or dp, one to one with the CSS pixels.</p>
        <Code label="Kotlin">{`import dev.pane.tokens.PaneDark
Text("Join", color = PaneDark.textPrimary)`}</Code>
        <Code label="Dart">{`import 'pane_tokens.dart';
Text('Join', style: TextStyle(color: PaneDark.textPrimary));`}</Code>
      </Section>
      <Section id="figma" title="Figma">
        <p>Import pane-tokens/figma with Tokens Studio, or as DTCG variables. It is one collection with a Dark and a Light mode, so a design file switches theme the way the product does.</p>
      </Section>
    </Page>
  );
}
