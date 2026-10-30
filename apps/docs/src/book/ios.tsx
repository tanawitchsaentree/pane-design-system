// Getting started › iOS (SwiftUI): PaneKit, the native side of Pane (roadmap X10). Every claim points at a
// file a reader can open: the token build, the package, the gallery app.
import { Code, Page, Section } from './kit';

export function IOSPage() {
  return (
    <Page eyebrow="Getting started" title="iOS (SwiftUI)" lede={<p>PaneKit is Pane for SwiftUI. It is generated from the same tokens as the web packages, so a native app and a website share every colour, size, curve and shadow, in both themes, and change together when a token changes.</p>}>
      <Section id="install" title="1 · Install">
        <p>Add the package to the app in Xcode with File, Add Package Dependencies, Add Local, and pick the folder <code>packages/swift/PaneKit</code>. A <code>Package.swift</code> can point at the same folder by path. It needs iOS 17 or macOS 14.</p>
        <Code label="Package.swift">{`dependencies: [
  .package(path: "../pilot-glass/packages/swift/PaneKit")
],
targets: [
  .target(name: "App", dependencies: [.product(name: "PaneKit", package: "PaneKit")])
]`}</Code>
      </Section>
      <Section id="use" title="2 · Use">
        <p>Put the screen in a <code>PaneEnvironment</code> with a scene, then build it from Pane components. The words the components say on their own come in English and Thai; set Thai once at the top and every component below follows.</p>
        <Code label="ContentView.swift">{`import SwiftUI
import PaneKit

struct ContentView: View {
  @State private var name = ""
  @State private var wifi = true
  var body: some View {
    PaneEnvironment(scene: .studio) {
      PaneCard {
        PaneTextField("Name", text: $name, prompt: "Mara Lind")
        Toggle("Wi-Fi", isOn: $wifi).toggleStyle(PaneSwitchStyle())
        PaneButton("Save") { }
      }
      .padding(PaneTokens.gapXl)
    }
    .paneMessages(.thai)
  }
}`}</Code>
        <p>The package has the environment and backdrop, Card in four glass levels, Button and IconButton, the text and password fields, Switch and Checkbox styles, Slider in both variants, SegmentedControl, Chip, Badge, Tag, Avatar, the inset List, Progress, Meter, Scale, Stepper, the bottom dock, the top bar, sheet styling, Toast and EmptyState.</p>
      </Section>
      <Section id="access" title="Accessibility">
        <p>Every control keeps a 44 point target and grows with Dynamic Type. VoiceOver hears a name, a value and the right traits. The switch, the checkbox and the slider hand VoiceOver the system control, so they behave like the ones people know. Under Reduce Motion nothing moves, and under Reduce Transparency the glass turns opaque.</p>
      </Section>
      <Section id="gallery" title="Try it on your iPhone">
        <p>The gallery app shows every family on a real phone, with the scene, the theme and the language switchable at the top. Open the folder <code>apps/ios/PaneGallery.swiftpm</code> in Xcode, pick the iPhone, sign in with an Apple ID and press Run. A free Apple ID is enough. Builds signed that way run for seven days, and pressing Run again renews them. The steps, including trusting the developer on the phone, are in the gallery's README.</p>
      </Section>
      <Section id="tokens" title="Keeping the tokens in step">
        <p>Run the token build, then the sync script that copies the Swift tokens into the package, then the raw-value check. That check fails on a hex colour or a bare number in a component.</p>
        <Code label="Terminal">{`node packages/tokens/build.mjs
packages/swift/PaneKit/scripts/sync-tokens.sh
packages/swift/PaneKit/scripts/check-raw.sh
swift build --package-path packages/swift/PaneKit`}</Code>
      </Section>
    </Page>
  );
}
