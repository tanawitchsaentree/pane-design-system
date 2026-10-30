import SwiftUI

/// A glass pane: level 1 is the page's own pane, 2 a pane on a pane, 3 an overlay, 4 a popover.
public struct PaneCard<Content: View>: View {
  let level: PaneLevel; let content: Content
  public init(level: PaneLevel = .one, @ViewBuilder content: () -> Content) { self.level = level; self.content = content() }
  public var body: some View {
    VStack(alignment: .leading, spacing: PaneTokens.cardGap) { content }
      .padding(level == .one ? PaneTokens.cardPadding : PaneTokens.gapXl)
      .frame(maxWidth: .infinity, alignment: .leading)
      .foregroundStyle(PaneTokens.textPrimary.color)
      .paneGlass(level, in: RoundedRectangle(cornerRadius: level == .one ? PaneTokens.cardRadius : PaneTokens.cornerMedia, style: .continuous))
      .accessibilityElement(children: .contain)
  }
}
