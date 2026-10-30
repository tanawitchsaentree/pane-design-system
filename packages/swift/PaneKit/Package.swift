// swift-tools-version: 5.9
// PaneKit: Pane for SwiftUI. Tokens are generated from the same DTCG source as pane-tokens and pane-react
// (packages/tokens/build.mjs → build/swift/PaneTokens.swift, copied in by scripts/sync-tokens.sh).
import PackageDescription

let package = Package(
  name: "PaneKit",
  defaultLocalization: "en",
  platforms: [.iOS(.v17), .macOS(.v14)],
  products: [.library(name: "PaneKit", targets: ["PaneKit"])],
  targets: [.target(name: "PaneKit", path: "Sources/PaneKit")]
)
