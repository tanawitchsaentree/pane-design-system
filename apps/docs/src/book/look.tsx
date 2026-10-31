// Getting started, Choose your look (M1): the four choices that set how a product looks, in the order a
// team makes them, each with the one line of code that sets it and the chapter that explains it.
import { Code, Link, Page, Section } from './kit';

export function ChooseLook() {
  return (
    <Page eyebrow="Getting started" title="Choose your look" lede={<p>Four choices set how a product built with Pane looks, and each is one attribute or prop. Make them in this order, because each one narrows the next.</p>}>
      <Section id="material" title="1. Material">
        <p>Glass shows the scene through blurred, dimmed panes. Solid keeps the same lit, carved shapes and makes them opaque. A live backdrop or a reading-heavy tool points to solid, and a product with a scene worth seeing points to glass. Pick one for the whole screen.</p>
        <Code label="React">{`<Environment material="glass">…</Environment>   // or "solid"`}</Code>
        <p>The full journey, the comparison and what it changes are in <Link to="/foundations/materials">Materials</Link>.</p>
      </Section>
      <Section id="theme" title="2. Theme">
        <p>Dark and light work on both materials. With no attribute the page follows the reader's system setting, and a region can hold its own theme, such as a light panel in a dark app.</p>
        <Code label="HTML">{`<html data-theme="light">   <!-- or "dark"; leave it out to follow the system -->`}</Code>
        <p>More in <Link to="/foundations/themes">Themes &amp; backdrops</Link>.</p>
      </Section>
      <Section id="brand" title="3. Brand">
        <p>A white-label product loads one brand sheet and sets its id. A brand changes only the loud action, focus, chosen glass, the typeface and the corners, and the build checks its contrast in both themes.</p>
        <Code label="CSS and HTML">{`@import 'pane-react/tokens/brands/harbor.css';\n<html data-brand="harbor">`}</Code>
        <p>More in <Link to="/foundations/brands">White-label brands</Link>.</p>
      </Section>
      <Section id="environment" title="4. Environment">
        <p>Tell Pane how bright the scene behind the interface can get, dim, mid or bright, sized for the brightest spot a pane can land on. Glass uses it to dim the scene enough for text to keep 4.5:1. Solid ignores it, so it is safe to set either way.</p>
        <Code label="React">{`<Environment material="glass" brightness="bright">\n  <App />\n</Environment>`}</Code>
        <p>More in <Link to="/foundations/glass">Glass &amp; environment</Link>.</p>
      </Section>
      <Section id="ai" title="Let an assistant choose">
        <p>Describe the product to an assistant that has the Pane MCP server, and its choose_appearance tool answers all four with the code. The Claude Code skill asks the same questions in the same order.</p>
        <Code label="Claude Code">{`claude mcp add pane -- npx pane-mcp`}</Code>
      </Section>
    </Page>
  );
}
