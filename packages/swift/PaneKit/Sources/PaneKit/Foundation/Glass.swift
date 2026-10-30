import SwiftUI

/// The four glass levels (D-025): 1 the page's own pane, 2 a pane on a pane, 3 an overlay over a scrim,
/// 4 a popover. Each is the system material lit from above, with the top-lit rim and the cast shadow.
public enum PaneLevel: Int, Sendable { case one = 1, two, three, four
  var fill: PaneDynamicColor { switch self { case .one: PaneTokens.level1; case .two: PaneTokens.level2; case .three: PaneTokens.level3; case .four: PaneTokens.level4 } }
  var shadow: PaneDynamicShadow { switch self { case .one: PaneTokens.levelShadow1; case .two: PaneTokens.levelShadow2; case .three: PaneTokens.levelShadow3; case .four: PaneTokens.levelShadow4 } }
}

/// Glass on any shape: the blurred material behind, the level's tint over it, the rim along the top edge.
/// Under Reduce Transparency the material gives way to the opaque surface (D-005).
struct PaneGlass<S: InsettableShape>: ViewModifier {
  let level: PaneLevel
  let shape: S
  @Environment(\.accessibilityReduceTransparency) private var solid

  func body(content: Content) -> some View {
    content
      .background {
        ZStack {
          if solid { shape.fill(PaneTokens.surfaceSolid.color) } else { shape.fill(.ultraThinMaterial); shape.fill(level.fill.color) }
          // the rim: light catching the top edge, brightest at the top, gone by the middle
          shape.strokeBorder(LinearGradient(colors: [PaneTokens.lineRimHi.color, PaneTokens.lineRimLo.color, .clear], startPoint: .top, endPoint: .center), lineWidth: PaneTokens.widthHairline)
        }
      }
      .paneShadow(level.shadow, in: shape)
  }
}

public extension View {
  /// Sets the view on a glass pane of the given level and shape.
  func paneGlass<S: InsettableShape>(_ level: PaneLevel = .one, in shape: S) -> some View { modifier(PaneGlass(level: level, shape: shape)) }
  /// Sets the view on a glass pane with the panel corner.
  func paneGlass(_ level: PaneLevel = .one) -> some View { modifier(PaneGlass(level: level, shape: RoundedRectangle(cornerRadius: level == .one ? PaneTokens.cornerPanel : PaneTokens.cornerMedia, style: .continuous))) }
}

/// The carved recess every field and channel is cut into: the surface dimmed, shade under the top lip,
/// light along the bottom lip, and the 3:1 edge.
struct PaneGroove<S: InsettableShape>: ViewModifier {
  let shape: S
  var invalid = false
  var readOnly = false
  func body(content: Content) -> some View {
    content
      .background { if readOnly { shape.fill(.clear) } else { shape.fill(PaneTokens.inputBg.color) } }
      .paneShadow(readOnly ? PaneTokens.elevationLens : PaneTokens.inputGroove, in: shape)
      .overlay { if readOnly { shape.strokeBorder(PaneTokens.inputRingReadonly.color, lineWidth: PaneTokens.widthHairline) } }
      .overlay { if invalid { shape.strokeBorder(PaneTokens.inputRingInvalid.color, lineWidth: PaneTokens.widthRing) } }
  }
}

public extension View {
  /// Cuts the view into the field groove; invalid adds the critical ring, read-only swaps the groove for a hairline.
  func paneGroove<S: InsettableShape>(in shape: S, invalid: Bool = false, readOnly: Bool = false) -> some View { modifier(PaneGroove(shape: shape, invalid: invalid, readOnly: readOnly)) }
}
