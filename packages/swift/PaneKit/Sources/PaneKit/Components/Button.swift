import SwiftUI

public enum PaneButtonVariant: Sendable { case light, accent, glass }
public enum PaneControlSize: Sendable { case sm, md }

/// The Pane button look as a ButtonStyle: `light` is the loud solid (white in dark, ink in light), the one
/// main action on a pane; `accent` is the same solid glowing with its own light; `glass` is quiet glass lit
/// from above. Every size keeps a 44pt press area; a press shrinks it a little, as something pushed.
public struct PaneButtonStyle: ButtonStyle {
  let variant: PaneButtonVariant; let size: PaneControlSize; let loading: Bool
  @Environment(\.isEnabled) private var enabled
  @Environment(\.accessibilityReduceMotion) private var still
  @Environment(\.paneMessages) private var t
  public init(_ variant: PaneButtonVariant = .light, size: PaneControlSize = .md, loading: Bool = false) { self.variant = variant; self.size = size; self.loading = loading }

  public func makeBody(configuration: Configuration) -> some View {
    let shape = Capsule(style: .continuous)
    configuration.label
      .paneFont(size == .sm ? .label : .body, weight: PaneTokens.typeWeightSemibold)
      .opacity(loading ? PaneTokens.opacityNone : PaneTokens.opacityFull)
      .overlay { if loading { ProgressView().controlSize(.small).tint(fg) } }
      .padding(.horizontal, size == .sm ? PaneTokens.buttonPaddingSm : PaneTokens.buttonPaddingMd)
      .frame(minHeight: size == .sm ? PaneTokens.buttonHeightSm : PaneTokens.buttonHeightMd)
      .foregroundStyle(fg)
      .background { fill(shape) }
      .paneShadow(variant == .glass ? PaneTokens.buttonEdge : variant == .accent ? PaneTokens.buttonAccentCast : PaneTokens.buttonCast, in: shape)
      .contentShape(Rectangle().inset(by: -max(0, (PaneTokens.buttonHit - (size == .sm ? PaneTokens.buttonHeightSm : PaneTokens.buttonHeightMd)) / 2)))
      .scaleEffect(configuration.isPressed && !still ? PaneTokens.motionPressScale : PaneTokens.scaleNone)
      .animation(.pane(PaneTokens.motionPress, reduceMotion: still), value: configuration.isPressed)
      .opacity(enabled ? PaneTokens.opacityFull : PaneTokens.opacityDisabled)
      .accessibilityValue(loading ? t.loading : "")
  }
  private var fg: Color { switch variant { case .light: PaneTokens.buttonLightFg.color; case .accent: PaneTokens.buttonAccentFg.color; case .glass: PaneTokens.buttonGlassFg.color } }
  @ViewBuilder private func fill(_ shape: Capsule) -> some View {
    switch variant {
    case .light: shape.fill(LinearGradient(colors: [PaneTokens.buttonLightTop.color, PaneTokens.buttonLightBg.color], startPoint: .top, endPoint: .center))
    case .accent: shape.fill(LinearGradient(colors: [PaneTokens.buttonAccentTop.color, PaneTokens.buttonAccentBg.color, PaneTokens.buttonAccentFoot.color], startPoint: .top, endPoint: .bottom))
    case .glass: ZStack { shape.fill(.ultraThinMaterial); shape.fill(LinearGradient(colors: [PaneTokens.buttonGlassTop.color, .clear], startPoint: .top, endPoint: .center)); shape.fill(PaneTokens.buttonGlassFoot.color) }
    }
  }
}

/// A Pane button with a title, and an optional SF Symbol before it.
public struct PaneButton: View {
  let title: String; let systemImage: String?; let variant: PaneButtonVariant; let size: PaneControlSize; let loading: Bool; let action: () -> Void
  public init(_ title: String, systemImage: String? = nil, variant: PaneButtonVariant = .light, size: PaneControlSize = .md, loading: Bool = false, action: @escaping () -> Void) {
    self.title = title; self.systemImage = systemImage; self.variant = variant; self.size = size; self.loading = loading; self.action = action
  }
  public var body: some View {
    Button { if !loading { action() } } label: {
      HStack(spacing: PaneTokens.buttonGap) { if let s = systemImage { Image(systemName: s).imageScale(.medium) }; Text(title) }
    }
    .buttonStyle(PaneButtonStyle(variant, size: size, loading: loading))
  }
}

public enum PaneIconButtonVariant: Sendable { case glass, ghost, loud }

/// A round button holding one SF Symbol; its label is the whole accessible name, so it is required.
public struct PaneIconButton: View {
  let systemImage: String; let label: String; let variant: PaneIconButtonVariant; let size: PaneControlSize; let action: () -> Void
  @Environment(\.isEnabled) private var enabled
  public init(systemImage: String, label: String, variant: PaneIconButtonVariant = .glass, size: PaneControlSize = .md, action: @escaping () -> Void) {
    self.systemImage = systemImage; self.label = label; self.variant = variant; self.size = size; self.action = action
  }
  public var body: some View {
    let d = size == .sm ? PaneTokens.iconButtonSizeSm : PaneTokens.iconButtonSize
    Button(action: action) {
      Image(systemName: systemImage).font(.system(size: PaneTokens.iconButtonIcon, weight: PaneTokens.typeWeightSemibold))
        .frame(width: d, height: d)
        .foregroundStyle(variant == .loud ? PaneTokens.iconButtonLoudFg.color : variant == .ghost ? PaneTokens.iconButtonGhostFg.color : PaneTokens.iconButtonFg.color)
        .background {
          switch variant {
          case .glass: ZStack { Circle().fill(.ultraThinMaterial); Circle().fill(LinearGradient(colors: [PaneTokens.iconButtonGlassTop.color, PaneTokens.iconButtonGlassFoot.color], startPoint: .top, endPoint: .bottom)) }.paneShadow(PaneTokens.iconButtonEdge, in: Circle())
          case .loud: Circle().fill(LinearGradient(colors: [PaneTokens.iconButtonLoudTop.color, PaneTokens.iconButtonLoudFoot.color], startPoint: .top, endPoint: .bottom)).paneShadow(PaneTokens.iconButtonCast, in: Circle())
          case .ghost: Color.clear
          }
        }
        .frame(minWidth: PaneTokens.iconButtonHit, minHeight: PaneTokens.iconButtonHit)
        .contentShape(Rectangle())
    }
    .buttonStyle(PanePressStyle())
    .opacity(enabled ? PaneTokens.opacityFull : PaneTokens.opacityDisabled)
    .accessibilityLabel(label)
  }
}

/// The press every Pane control shares: a slight shrink on the short press curve; still under Reduce Motion.
struct PanePressStyle: ButtonStyle {
  @Environment(\.accessibilityReduceMotion) private var still
  func makeBody(configuration: Configuration) -> some View {
    configuration.label.scaleEffect(configuration.isPressed && !still ? PaneTokens.motionPressScale : PaneTokens.scaleNone)
      .animation(.pane(PaneTokens.motionPress, reduceMotion: still), value: configuration.isPressed)
  }
}
