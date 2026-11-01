# Launch posts for Pane (post them yourself; each site's rules are noted)

Before posting, three things only you can do:
1. GitHub repo → Settings → Social preview → upload `apps/docs/public/og.jpg`. Add topics: react,
   design-system, glassmorphism, design-tokens, accessibility, wcag, thai, mcp.
2. If you can, `npm publish` first. "npm install pane-react" working removes the biggest step for
   readers. Until then every post uses the tarball line.
3. Post one place a day and answer comments the same day. Replies are what people judge.

---

## Show HN (news.ycombinator.com/submit). Title ≤ 80 chars, link to the site

Title: Show HN: Pane – glass UI for React with every text measured for contrast

Text (first comment):
I wanted the visionOS look on the web, and the usual problem kept coming back. Text on frosted glass
becomes unreadable on half the wallpapers. Pane measures it. A headless browser renders every page of the
docs in light and dark, in normal, reduced-transparency and forced-colours modes, over real photos,
and reads the worst pixel behind each line of text. At the last full run 1,001,729 of 1,001,774 checks
passed, and the docs list the rest.

It is 126 React components (forms, data grid, charts, command palette, chat and agent pieces), tokens
for CSS, Tailwind, SwiftUI, Compose, Flutter and Figma, and English and Thai throughout. MIT. It is
not on npm yet; the site hosts the tarball.

It was built with kiln, a design-system factory I made, which turns every complaint into a gate that
fails the build. Happy to talk about how the glass and contrast measurement work.

---

## Reddit r/reactjs (self-promotion is allowed in the weekly thread or with the "Show /r/reactjs" flair; read the sidebar)

Title: I built a glass design system for React that measures every line of text for contrast

Body: same as the HN text, plus the install line:
`npm install https://pane-design-system.pages.dev/downloads/pane-react-0.8.0.tgz`

## Reddit r/web_design (Showcase flair)

Title: Glass UI that stays readable on any photo: Pane, an open-source design system
Body: two lines and the og image. Ask what backdrops break it, since that is useful feedback.

---

## X / Threads (4 posts, attach og.jpg to the first)

1/ Pane is a glass design system for React. It has clear panes over real photos, and every line of
text is measured for contrast pixel by pixel. https://pane-design-system.pages.dev

2/ Frosted glass usually fails on bright or busy photos. Pane renders every docs page over real
scenes in light and dark and reads the worst pixel behind each text. 1,001,729 of 1,001,774 checks pass.

3/ There are 126 components, including a data grid, charts, a command palette and chat/agent pieces,
plus tokens for Tailwind, SwiftUI, Compose, Flutter and Figma, all in English and Thai. MIT.

4/ Your coding agent can set it up. One line for Claude Code, Cursor or Codex is on the home page, and
it asks before it installs anything.

---

## LinkedIn

I spent the last weeks building Pane, an open-source glass design system for React, and kiln, the
factory that built it.

Glass interfaces look great in a mockup and fail on real photos, where white text on frosted glass
drops below readable contrast. Pane measures it. Every docs page is rendered over real scenes, in light
and dark and in three accessibility modes, and the worst pixel behind each line of text is checked.
At the last full run 1,001,729 of 1,001,774 checks passed.

It has 126 components, tokens for web, iOS, Android and Figma, and English and Thai throughout.
https://pane-design-system.pages.dev

---

## Facebook groups in Thai (Thai Developers / UX/UI Thailand / React Thailand; read each group's rules)

แจก design system ฟรีครับ ชื่อ Pane เป็น UI แบบกระจกใส (สไตล์ visionOS) สำหรับ React

จุดที่ต่างจาก glass UI ทั่วไปคือวัด contrast ของตัวหนังสือจริงทุกบรรทัด บนรูปพื้นหลังจริง ทั้ง light
และ dark รอบล่าสุดผ่าน 1,001,729 จาก 1,001,774 จุด ส่วนที่เหลือมีบันทึกไว้ในเว็บ

- มี 126 component เช่น form, data grid, chart, command palette, chat
- รองรับภาษาไทยทั้งชุด ปฏิทินแสดง พ.ศ.
- token ใช้กับ Tailwind, SwiftUI, Compose, Flutter และ Figma ได้
- MIT ใช้ฟรี

ดูได้ที่ https://pane-design-system.pages.dev
ยังไม่ได้ขึ้น npm ให้ติดตั้งจาก `npm install https://pane-design-system.pages.dev/downloads/pane-react-0.8.0.tgz`
ใครลองแล้วเจอพื้นหลังที่ตัวหนังสืออ่านยาก ส่งมาได้เลยครับ จะเอาไปแก้

---

## Product Hunt (launch at 00:01 Pacific; needs a maker account and a gallery)

Name: Pane
Tagline: Glass UI for React that stays readable on any photo
Description: 126 open-source React components of clear glass over real scenes, with every line of
text measured for contrast in light, dark and three accessibility modes. Tokens for web, iOS, Android
and Figma, English and Thai, and a one-line setup for coding agents. MIT.
Gallery: og.jpg, then system/portfolio-shots/*.png (glass-vs-solid, ten-brands-one-card,
thai-booking-flow, order-a-print-scenario).

## Directories to submit to (each takes a form)
- MCP server lists (pane-mcp): the official MCP registry, mcp.so, glama.ai
- llms.txt directories (llmstxt.site, directory.llmstxt.cloud)
- awesome-react-components and awesome-design-systems (open a pull request)
