# Pane Gallery on your iPhone

Every PaneKit family in one app, with the scene, the theme (system, dark, light) and the language
(English, ไทย) switchable at the top.

1. Install **Xcode** from the Mac App Store (free). Open it once so it can install its parts.
2. In Xcode: **File › Open…** and pick the folder `apps/ios/PaneGallery.swiftpm`.
3. Plug in your iPhone (or use the same Wi-Fi after pairing). On the iPhone, allow **Trust This Computer**.
   On iOS 16 or later, turn on **Settings › Privacy & Security › Developer Mode** and restart when asked.
4. At the top of the Xcode window, pick your iPhone as the run destination.
5. Click the app in the file list (the blue icon at the top), open **Signing & Capabilities**, and under
   **Team** choose **Add an Account…** and sign in with your Apple ID. A free Apple ID gives a
   "Personal Team", which is enough. If Xcode says the bundle identifier is taken, change
   `design.pane.gallery` in `Package.swift` to something of your own, such as `com.yourname.panegallery`.
6. Press **Run** (▶). The first time, the iPhone refuses to open it: go to **Settings › General ›
   VPN & Device Management**, tap your Apple ID under Developer App and choose **Trust**. Run again.

A build signed with a free Personal Team runs for 7 days; press Run again to renew it.
