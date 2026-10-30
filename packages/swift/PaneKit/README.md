# PaneKit

Pane for SwiftUI, iOS 17 and macOS 14. Generated from the same tokens as `pane-tokens` and `pane-react`,
so a native app and the web share every colour, size, curve and shadow, in both themes.

## Install

Xcode › File › Add Package Dependencies › Add Local… and pick `packages/swift/PaneKit`, or in a
`Package.swift`:

```swift
.package(path: "../pilot-glass/packages/swift/PaneKit")
// once the repo is public:
// .package(url: "https://github.com/tanawitchsaentree/pane-design-system", branch: "main")
```

## Use

```swift
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
    .paneMessages(.thai) // or .english, the default
  }
}
```

Components: `PaneEnvironment`, `PaneBackdrop`, `PaneCard` (levels 1–4), `PaneButton` / `PaneButtonStyle`,
`PaneIconButton`, `PaneTextField`, `PaneSecureField`, `PaneSwitchStyle`, `PaneCheckboxStyle`, `PaneSlider`
(channel and fill), `PaneSegmentedControl`, `PaneChip`, `PaneBadge`, `PaneTag`, `PaneAvatar`, `PaneList`
and `PaneListRow`, `PaneProgress`, `PaneMeter`, `PaneScale`, `PaneStepper`, `PaneBottomNav`, `PaneNavbar`,
`.paneSheet()`, `.paneToast(…)`, `PaneEmptyState`. Modifiers: `.paneGlass(_:in:)`, `.paneGroove(in:)`,
`.paneShadow(_:in:)`, `.paneFont(_:weight:)`.

Every control keeps a 44 pt target, scales with Dynamic Type, gives VoiceOver its label, value and
traits (Switch, Checkbox and Slider hand VoiceOver the system control), stands still under Reduce Motion
and turns glass opaque under Reduce Transparency.

## Keeping the tokens in step

```sh
node packages/tokens/build.mjs              # writes packages/tokens/build/swift/PaneTokens.swift
packages/swift/PaneKit/scripts/sync-tokens.sh
packages/swift/PaneKit/scripts/check-raw.sh # fails on a hex or a bare number in a component
swift build --package-path packages/swift/PaneKit
```
