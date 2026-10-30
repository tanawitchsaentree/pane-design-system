// swift-tools-version: 5.9
// Pane Gallery: every PaneKit family on one iPhone, in both themes, on the studio or aurora scene, in
// English or Thai. Open this folder in Xcode (File › Open), pick your iPhone and press Run. See README.md.
// The app manifest needs Xcode (AppleProductTypes); PaneKit itself builds with `swift build`.
import PackageDescription
import AppleProductTypes

let package = Package(
  name: "PaneGallery",
  platforms: [.iOS("17.0")],
  products: [
    .iOSApplication(
      name: "Pane Gallery",
      targets: ["AppModule"],
      bundleIdentifier: "design.pane.gallery",
      teamIdentifier: "",
      displayVersion: "0.7.0",
      bundleVersion: "1",
      appIcon: .placeholder(icon: .sparkle),
      supportedDeviceFamilies: [.pad, .phone],
      supportedInterfaceOrientations: [.portrait, .landscapeRight, .landscapeLeft, .portraitUpsideDown(.when(deviceFamilies: [.pad]))]
    )
  ],
  dependencies: [.package(path: "../../../packages/swift/PaneKit")],
  targets: [.executableTarget(name: "AppModule", dependencies: [.product(name: "PaneKit", package: "PaneKit")], path: "Sources")]
)
