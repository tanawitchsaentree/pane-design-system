import SwiftUI
import PaneKit

enum Family: String, CaseIterable, Identifiable, Hashable {
  case surfaces, buttons, fields, choices, sliders, display, lists, navigation, overlays
  var id: String { rawValue }
  var title: String { rawValue.capitalized }
  var subtitle: String {
    switch self {
    case .surfaces: "Glass levels 1 to 4"; case .buttons: "Button and IconButton"; case .fields: "Text, password, invalid, read-only"
    case .choices: "Switch, Checkbox, Segmented, Chip"; case .sliders: "Channel and fill"; case .display: "Badge, Tag, Avatar, Progress, Meter, Scale, Stepper"
    case .lists: "Inset list and empty state"; case .navigation: "Bottom dock and top bar"; case .overlays: "Sheet and toast"
    }
  }
  var symbol: String {
    switch self {
    case .surfaces: "square.stack.3d.up"; case .buttons: "button.horizontal"; case .fields: "character.cursor.ibeam"; case .choices: "switch.2"
    case .sliders: "slider.horizontal.3"; case .display: "gauge.with.dots.needle.33percent"; case .lists: "list.bullet"; case .navigation: "dock.rectangle"; case .overlays: "rectangle.bottomhalf.inset.filled"
    }
  }
  @ViewBuilder var page: some View {
    switch self {
    case .surfaces: SurfacesPage(); case .buttons: ButtonsPage(); case .fields: FieldsPage(); case .choices: ChoicesPage(); case .sliders: SlidersPage()
    case .display: DisplayPage(); case .lists: ListsPage(); case .navigation: NavigationPage(); case .overlays: OverlaysPage()
    }
  }
}

struct GallerySection<Content: View>: View {
  let title: String; let content: Content
  init(_ title: String, @ViewBuilder content: () -> Content) { self.title = title; self.content = content() }
  var body: some View {
    VStack(alignment: .leading, spacing: PaneTokens.gapMd) {
      Text(title).paneFont(.label, weight: PaneTokens.typeWeightSemibold).foregroundStyle(PaneTokens.textSecondary.color).accessibilityAddTraits(.isHeader)
      content
    }
  }
}

struct SurfacesPage: View {
  var body: some View {
    VStack(spacing: PaneTokens.gapXl) {
      PaneCard(level: .one) {
        Text("Level 1, the page's own pane").paneFont(.emphasis, weight: PaneTokens.typeWeightSemibold)
        Text("The scene shows through, dimmed and blurred; the rim catches the light along the top edge.").paneFont(.body).foregroundStyle(PaneTokens.textSecondary.color)
        PaneCard(level: .two) { Text("Level 2, a pane on a pane").paneFont(.body) }
      }
      PaneCard(level: .three) { Text("Level 3, an overlay").paneFont(.body) }
      PaneCard(level: .four) { Text("Level 4, a popover").paneFont(.body) }
    }
  }
}

struct ButtonsPage: View {
  @State private var saving = false
  var body: some View {
    PaneCard {
      GallerySection("Variants") {
        HStack(spacing: PaneTokens.gapMd) { PaneButton("Save") {}; PaneButton("Share", variant: .glass) {} }
        PaneButton("Get Pane Pro", systemImage: "sparkles", variant: .accent) {}
      }
      GallerySection("Sizes and states") {
        HStack(spacing: PaneTokens.gapMd) { PaneButton("Small", size: .sm) {}; PaneButton("Disabled") {}.disabled(true) }
        PaneButton(saving ? "Saving" : "Save changes", loading: saving) { saving = true; Task { try? await Task.sleep(for: .seconds(2)); saving = false } }
      }
      GallerySection("Icon buttons") {
        HStack(spacing: PaneTokens.gapMd) {
          PaneIconButton(systemImage: "heart", label: "Like") {}
          PaneIconButton(systemImage: "ellipsis", label: "More", variant: .ghost) {}
          PaneIconButton(systemImage: "plus", label: "New print", variant: .loud) {}
        }
      }
    }
  }
}

struct FieldsPage: View {
  @State private var name = ""; @State private var email = "mara@lind"; @State private var pass = ""; @State private var city = "Tromsø"
  var body: some View {
    PaneCard {
      PaneTextField("Name", text: $name, prompt: "Mara Lind", help: "As it should appear on the print.", required: true)
      PaneTextField("Email", text: $email, error: "Enter an email address with a domain, like mara@lind.no")
      PaneSecureField("Password", text: $pass)
      PaneTextField("City", text: $city, readOnly: true)
      PaneTextField("Coupon", text: .constant("")).disabled(true)
    }
  }
}

struct ChoicesPage: View {
  @State private var wifi = true; @State private var terms = false; @State private var view = "map"; @State private var night = true; @State private var coast = false
  var body: some View {
    PaneCard {
      Toggle("Wi-Fi", isOn: $wifi).toggleStyle(PaneSwitchStyle())
      Toggle("Bluetooth", isOn: .constant(false)).toggleStyle(PaneSwitchStyle()).disabled(true)
      Toggle("Email me when a print ships", isOn: $terms).toggleStyle(PaneCheckboxStyle())
      Toggle("I accept the print terms", isOn: .constant(false)).toggleStyle(PaneCheckboxStyle(invalid: true))
      PaneSegmentedControl("View", selection: $view, options: [("map", "Map"), ("list", "List"), ("grid", "Grid")])
      HStack(spacing: PaneTokens.gapSm) { PaneChip("Night", isOn: $night); PaneChip("Coast", isOn: $coast) }
    }
  }
}

struct SlidersPage: View {
  @State private var volume = 40.0; @State private var brightness = 70.0
  var body: some View {
    PaneCard {
      PaneSlider("Volume", value: $volume)
      PaneSlider("Brightness", value: $brightness, variant: .fill, format: { "\(Int($0))%" })
      PaneSlider("Disabled", value: .constant(30)).disabled(true)
    }
  }
}

struct DisplayPage: View {
  var body: some View {
    VStack(spacing: PaneTokens.gapXl) {
      PaneCard {
        GallerySection("Badges and tags") {
          HStack(spacing: PaneTokens.gapSm) { PaneBadge("Shipped", tone: .positive); PaneBadge("Late", tone: .warning); PaneBadge("Failed", tone: .critical) }
          HStack(spacing: PaneTokens.gapSm) { PaneTag("A3"); PaneTag("Cotton rag") }
        }
        GallerySection("Avatars") { HStack(spacing: PaneTokens.gapMd) { PaneAvatar(name: "Mara Lind", size: .sm); PaneAvatar(name: "Jon Berg"); PaneAvatar(name: "Ida Holm", size: .lg) } }
      }
      PaneCard {
        PaneProgress("Uploading 3 photos", value: 0.62, showValue: true)
        PaneProgress("Preparing the print")
        PaneMeter("Storage", value: 86, high: 80, critical: 95)
      }
      PaneCard {
        GallerySection("Scale") {
          PaneScale("Speed", value: 4, words: ["Slow", "Steady", "Medium", "Fast", "Very fast"], compare: 3, compareLabel: "the format average")
          PaneScale("Interaction", value: 2.4, words: ["Low", "Light", "Medium", "High", "Very high"], compare: 3.2, compareLabel: "the format average")
        }
        GallerySection("Stepper") { PaneStepper(steps: ["Cart", "Shipping", "Pay"], current: 1) }
      }
    }
  }
}

struct ListsPage: View {
  var body: some View {
    VStack(spacing: PaneTokens.gapXl) {
      PaneList {
        PaneListRow("Mara Lind", subtitle: "Commented on Lofoten", chevron: true, action: {}) { PaneAvatar(name: "Mara Lind", size: .sm) }
        PaneListRow("Wi-Fi", trailing: { Text("Home") })
        PaneListRow("Storage", subtitle: "41 of 50 GB", chevron: true, divider: false, action: {})
      }
      PaneCard { PaneEmptyState(systemImage: "photo.on.rectangle", title: "No prints yet", message: "Add your first print to start a collection.") { PaneButton("Add a print") {} } }
    }
  }
}

struct NavigationPage: View {
  @State private var tab = "feed"
  var body: some View {
    VStack(spacing: PaneTokens.gapXl) {
      PaneNavbar("Lofoten", back: {}) { PaneIconButton(systemImage: "square.and.arrow.up", label: "Share", variant: .ghost) {} }
      PaneBottomNav(selection: $tab, items: [PaneNavItem("feed", label: "Feed", systemImage: "house"), PaneNavItem("trips", label: "Trips", systemImage: "airplane"), PaneNavItem("inbox", label: "Inbox", systemImage: "tray", badge: 3)])
    }
  }
}

struct OverlaysPage: View {
  @State private var sheet = false; @State private var toast = false
  var body: some View {
    PaneCard {
      PaneButton("Open a sheet", variant: .glass) { sheet = true }
      PaneButton("Show a toast", variant: .glass) { toast = true }
    }
    .sheet(isPresented: $sheet) { VStack(alignment: .leading, spacing: PaneTokens.gapLg) { Text("Filters").paneFont(.title, weight: PaneTokens.typeWeightSemibold); Toggle("Only saved", isOn: .constant(true)).toggleStyle(PaneSwitchStyle()) }.padding(PaneTokens.gapXl).presentationDetents([.medium]).paneSheet() }
    .paneToast(isPresented: $toast, message: "Print saved to Lofoten", actionTitle: "Undo") {}
  }
}
