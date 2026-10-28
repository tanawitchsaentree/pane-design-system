# Docs audit 2026-10-28

42/42 gates pass. Failed gates first, every problem listed.

## ✓ G-P0 every page renders: a <main>, a heading and no uncaught error

146 pages


## ✓ G-D3 no literal backtick in rendered text

146 pages


## ✓ G-S1 a chapter opens as a new page at the top with its heading focused (375/768/1280px)


## ✓ G-S2 on narrow screens Esc closes the menu and returns focus to the Menu button


## ✓ G-S3 no two surfaces touch (<8px) or overlap, every page, 375 and 1280px


## ✓ G-S5 a new chapter is fully visible on its first painted frame with motion on


## ✓ G-R1 long-form text is readable: ≥16px, line height ≥1.5, lines ≤ 80 characters


## ✓ G-A1 in the nav, what you can press looks different from what you cannot, and reacts to hover

differ in fontSize, fontWeight, textTransform, color, letterSpacing


## ✓ G-PF1 the first painted frame is the final page: right theme, all content, no layout shift


## ✓ G-PF2 page weight: no image over 300 kB, no page over 1.5 MB transferred (gzip counted)


## ✓ G-SH1 the docs chrome is plain and opaque: no blur or see-through surface outside demo stages


## ✓ G-C1 every code block has a Copy button you can see

333 code blocks


## ✓ G-C2 Copy puts the whole snippet on the clipboard, including hidden lines


## ✓ G-F1 every foundation page has a playground whose first control changes its preview

12 pages


## ✓ G-N1 every select, slider, checkbox and radio on the docs is one of the system's own components, never a browser control


## ✓ G-T1 the theme control switches tokens and the evidence covers every theme


## ✓ G-K1 every component has its tab routes and a shared header with status, last updated and a live demo with theme and variant selectors


## ✓ G-K2 every Usage section U1–U14 is present, or says why it does not apply


## ✓ G-K3 the variants and sizes tables have one row per option the props declare


## ✓ G-K4 every variant option has a deep dive with a live in-context example and a live do/don't


## ✓ G-K5 the Style tab is generated: every spec cell names its token and value


## ✓ G-K6 usage depth ≥ 0.5 × the Carbon page for the same component (words and sections)

Container 480w/24s (no benchmark) · Grid 502w/25s (no benchmark) · Stack 481w/25s (no benchmark) · Environment 604w/26s (no benchmark) · Card 1203/2181w 35/44s · Avatar 838w/30s (no benchmark) · Button 2931/5260w 43/36s · IconButton 1056w/29s (no benchmark) · Tabs 1656/3081w 33/33s · Tag 1005/1910w 31/27s · Badge 1187w/34s (no benchmark) · Chip 1036w/29s (no benchmark) · Select 1952/3259w 32/44s · Slider 1040/1592w 29/22s · Input 1534/2580w 30/31s · Textarea 630w/27s (no benchmark) · Checkbox 889/1378w 29/23s · Radio 853/1333w 28/24s · Switch 575/1076w 28/22s · FormField 433w/26s (no benchmark) · Label 368w/25s (no benchmark) · HelperText 571w/27s (no benchmark) · Fieldset 345w/25s (no benchmark) · InputGroup 371w/25s (no benchmark) · PinInput 444w/25s (no benchmark) · Banner 1729/2507w 47/34s


## ✓ G-K7 every component cites at least two external references


## ✓ G-K8 every component shows a live RTL render and a live overflow render that is not clipped


## ✓ G-B1 every component is shown in every theme over a dark and a bright scene


## ✓ G-L1 every component states status, its own change history, limitations and the app's accessibility duties


## ✓ demo-floor each component has at least variant dimensions + 3 live demos


## ✓ G-W1 reasons are on the page: token tables have a filled Why column and every component page explains its parts, states and motion

758 token rows with reasons


## ✓ G-X1 no habitual pattern (accent stripe, tinted icon disc with bold title and muted body) unless the derivation names and justifies it


## ✓ G-NT1 diagram parts stand at least 3:1 off their ground, in every theme (WCAG 1.4.11)

2 diagrams


## ✓ G-BT1 every topic the reference systems cover on a page is covered on ours, or declined with a reason

126 topics across 12 pages


## ✓ G-M1 the accessibility matrix lists every component and no cell is blank


## ✓ G-IA1 the nav shows the whole catalog (planned items marked) and the required parts and pages


## ✓ G-TODO1 no starter placeholder is left on any page: no TODO( and no seed reason

146 pages clean


## ✓ G-CL1 every colour value written in the book is a current token value (no stale hex in prose)

408 values checked


## ✓ G-NT2 every form control shows its boundary at least 3:1 against what it sits on, in every theme (WCAG 1.4.11)

188 controls in 2 themes


## ✓ G-NR1 a highlighted row inside a rounded flyout nests its corner: inner radius = outer radius − inset

2 flyouts


## ✓ G-NAV1 every page in routes.json is reachable from the book nav at 375 and 1280px

68 pages


## ✓ G-SM1 following an in-page link (table of contents, heading anchor) lands with its heading clear of the sticky header

134 links followed


## ✓ G-TT1 every control in a live example and in the shell gives a pointer at least 44px each way

2161 controls


## ✓ axe-none axe finds no WCAG 2.2 AA violations on any page (forced-colors none)


## ✓ axe-active axe finds no WCAG 2.2 AA violations on any page (forced-colors active)

