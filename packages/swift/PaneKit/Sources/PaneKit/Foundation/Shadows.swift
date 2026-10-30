import SwiftUI

/// Draws a token shadow list on a shape, the way the CSS box-shadow does: outer shadows under the shape,
/// inset shadows (the groove's shade, the top-lit rim, a ring) inside it. Spread with no blur is a ring.
struct PaneShadowModifier<S: InsettableShape>: ViewModifier {
  let shadow: PaneDynamicShadow
  let shape: S
  @Environment(\.colorScheme) private var scheme

  func body(content: Content) -> some View {
    let list = shadow.resolve(scheme)
    content
      .background { ZStack { ForEach(Array(list.enumerated()), id: \.offset) { _, s in if !s.inset { outer(s) } } } }
      .overlay { ZStack { ForEach(Array(list.enumerated()), id: \.offset) { _, s in if s.inset { inner(s) } } }.allowsHitTesting(false) }
  }

  @ViewBuilder private func outer(_ s: PaneShadow) -> some View {
    if s.blur == 0 && s.x == 0 && s.y == 0 {
      shape.inset(by: -s.spread / 2).stroke(s.color.color, lineWidth: s.spread)
    } else {
      // the shadow is cast by a copy of the shape and the copy is cut away, so translucent glass stays clear
      let reach = s.blur + abs(s.x) + abs(s.y) + abs(s.spread)
      shape.fill(s.color.color).shadow(color: s.color.color, radius: s.blur / 2, x: s.x, y: s.y)
        .mask { Rectangle().padding(-reach * 2).overlay(shape.blendMode(.destinationOut)).compositingGroup() }
    }
  }

  @ViewBuilder private func inner(_ s: PaneShadow) -> some View {
    if s.blur == 0 && s.x == 0 && s.y == 0 {
      shape.strokeBorder(s.color.color, lineWidth: s.spread)
    } else {
      shape.stroke(s.color.color, lineWidth: s.blur + s.spread * 2).blur(radius: s.blur / 2).offset(x: s.x, y: s.y).mask(shape)
    }
  }
}

public extension View {
  /// Applies a Pane shadow token (outer and inset parts) to the view, following the colour scheme.
  func paneShadow<S: InsettableShape>(_ shadow: PaneDynamicShadow, in shape: S) -> some View { modifier(PaneShadowModifier(shadow: shadow, shape: shape)) }
}
