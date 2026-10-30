import SwiftUI
import PaneKit

enum Theme: String, CaseIterable, Identifiable { case system, dark, light; var id: String { rawValue }
  var scheme: ColorScheme? { self == .dark ? .dark : self == .light ? .light : nil } }
enum Language: String, CaseIterable, Identifiable { case english = "English", thai = "ไทย"; var id: String { rawValue }
  var messages: PaneMessages { self == .thai ? .thai : .english } }

/// The gallery's front page: the scene, the theme and the language at the top, then one row per family.
public struct GalleryRoot: View {
  @State private var scene: PaneScene = .studio
  @State private var theme: Theme = .system
  @State private var language: Language = .english
  public init() {}
  public var body: some View {
    NavigationStack {
      PaneEnvironment(scene: scene) {
        ScrollView {
          VStack(alignment: .leading, spacing: PaneTokens.gapXl) {
            PaneCard {
              Text("Pane Gallery").paneFont(.headline, weight: PaneTokens.typeWeightSemibold)
              Text("Every PaneKit family on this device. Change the scene, the theme and the language here; they hold on every page.").paneFont(.body).foregroundStyle(PaneTokens.textSecondary.color)
              PaneSegmentedControl("Scene", selection: $scene, options: PaneScene.allCases.map { ($0, $0.rawValue.capitalized) })
              PaneSegmentedControl("Theme", selection: $theme, options: Theme.allCases.map { ($0, $0.rawValue.capitalized) })
              PaneSegmentedControl("Language", selection: $language, options: Language.allCases.map { ($0, $0.rawValue) })
            }
            PaneList {
              ForEach(Family.allCases) { f in
                NavigationLink(value: f) { PaneListRow(f.title, subtitle: f.subtitle, chevron: true, divider: f != Family.allCases.last) { Image(systemName: f.symbol).frame(width: PaneTokens.controlIconMd) } }.buttonStyle(.plain)
              }
            }
          }
          .padding(PaneTokens.gapXl)
        }
      }
      .navigationDestination(for: Family.self) { f in PaneEnvironment(scene: scene) { ScrollView { f.page.padding(PaneTokens.gapXl) } }.navigationTitle(f.title) }
      .navigationTitle("Pane")
    }
    .preferredColorScheme(theme.scheme)
    .paneMessages(language.messages)
  }
}
