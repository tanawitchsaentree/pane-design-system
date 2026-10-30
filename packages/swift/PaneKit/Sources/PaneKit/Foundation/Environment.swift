import SwiftUI

/// The scene behind the glass. Studio is the near-black stage the docs use; aurora is the mesh of four
/// colour pools melted together (D-029), a scene and never a control's fill.
public enum PaneScene: String, CaseIterable, Sendable, Identifiable { case studio, aurora; public var id: String { rawValue } }

/// Where Mesh.module.css puts the aurora pools, as fractions of the scene (the art's own layout).
enum MeshLayout {
  static let a = UnitPoint(x: 0.14, y: 0.14) // raw-ok: scene art position
  static let b = UnitPoint(x: 0.90, y: 0.26) // raw-ok: scene art position
  static let c = UnitPoint(x: 0.60, y: 0.96) // raw-ok: scene art position
  static let d = UnitPoint(x: 0.04, y: 0.92) // raw-ok: scene art position
  static let reach: CGFloat = 0.6 // raw-ok: a pool's radius as a share of the scene
}

/// Draws a Pane scene edge to edge behind its content and sets the motion curve the components use.
public struct PaneEnvironment<Content: View>: View {
  let scene: PaneScene
  let content: Content
  public init(scene: PaneScene = .studio, @ViewBuilder content: () -> Content) { self.scene = scene; self.content = content() }
  public var body: some View {
    ZStack { PaneBackdrop(scene: scene).ignoresSafeArea(); content }
  }
}

/// The backdrop alone, for a custom layout.
public struct PaneBackdrop: View {
  let scene: PaneScene
  @Environment(\.colorScheme) private var scheme
  public init(scene: PaneScene) { self.scene = scene }
  public var body: some View {
    switch scene {
    case .studio:
      RadialGradient(colors: [PaneTokens.studioLight.color, PaneTokens.studioBase.color], center: .top, startRadius: PaneTokens.widthHairline, endRadius: PaneTokens.layoutContainerMd)
        .background(PaneTokens.studioBase.color)
    case .aurora:
      // the four pools sit where Mesh.module.css places them, and melt into each other under one blur
      GeometryReader { g in
        ZStack {
          PaneTokens.meshBase.color
          pool(PaneTokens.meshA, at: MeshLayout.a, in: g.size)
          pool(PaneTokens.meshB, at: MeshLayout.b, in: g.size)
          pool(PaneTokens.meshC, at: MeshLayout.c, in: g.size)
          pool(PaneTokens.meshD, at: MeshLayout.d, in: g.size)
        }
        .blur(radius: PaneTokens.meshBlur)
      }
    }
  }
  private func pool(_ c: PaneDynamicColor, at p: UnitPoint, in size: CGSize) -> some View {
    RadialGradient(colors: [c.color, .clear], center: p, startRadius: PaneTokens.widthHairline, endRadius: max(size.width, size.height) * MeshLayout.reach)
  }
}

public extension Animation {
  /// Pane's settling ease at a token duration; zero under Reduce Motion (pass the environment flag).
  static func pane(_ duration: TimeInterval = PaneTokens.motionHover, reduceMotion: Bool = false) -> Animation? { reduceMotion ? nil : PaneTokens.motionEasing.animation(duration) }
}
