import SwiftUI

/// The type scale as Dynamic Type fonts: each step keeps its token size at the default text size and grows
/// and shrinks with the reader's setting, relative to the text style it plays.
public enum PaneTextStyle: Sendable { case micro, caption, label, body, reading, emphasis, title, headline, display
  var size: CGFloat { switch self { case .micro: PaneTokens.typeMicro; case .caption: PaneTokens.typeCaption; case .label: PaneTokens.typeLabel; case .body: PaneTokens.typeBody; case .reading: PaneTokens.typeReading; case .emphasis: PaneTokens.typeEmphasis; case .title: PaneTokens.typeTitle; case .headline: PaneTokens.typeHeadline; case .display: PaneTokens.typeDisplay } }
  var relative: Font.TextStyle { switch self { case .micro: .caption2; case .caption: .caption; case .label: .subheadline; case .body, .reading: .body; case .emphasis: .callout; case .title: .title3; case .headline: .title; case .display: .largeTitle } }
}

public extension Font {
  /// A Pane type step at a Pane weight, scaled with Dynamic Type.
  static func pane(_ style: PaneTextStyle, weight: Font.Weight = PaneTokens.typeWeightRegular) -> Font { .system(size: style.size, weight: weight).leading(.standard) }
}

struct PaneScaledFont: ViewModifier {
  let style: PaneTextStyle; let weight: Font.Weight
  @ScaledMetric private var size: CGFloat
  init(style: PaneTextStyle, weight: Font.Weight) { self.style = style; self.weight = weight; _size = ScaledMetric(wrappedValue: style.size, relativeTo: style.relative) }
  func body(content: Content) -> some View { content.font(.system(size: size, weight: weight)) }
}

public extension View {
  /// Sets a Pane type step that follows Dynamic Type.
  func paneFont(_ style: PaneTextStyle, weight: Font.Weight = PaneTokens.typeWeightRegular) -> some View { modifier(PaneScaledFont(style: style, weight: weight)) }
}
