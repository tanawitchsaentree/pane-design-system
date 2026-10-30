import SwiftUI

/// One destination in the bottom dock.
public struct PaneNavItem<Value: Hashable>: Identifiable {
  public let value: Value; public let label: String; public let systemImage: String; public let badge: Int?
  public var id: Value { value }
  public init(_ value: Value, label: String, systemImage: String, badge: Int? = nil) { self.value = value; self.label = label; self.systemImage = systemImage; self.badge = badge }
}

/// The bottom navigation as a floating pill dock of glass, the current destination as chosen glass with
/// its symbol filled, each item a 44pt target with its name under the symbol.
public struct PaneBottomNav<Value: Hashable>: View {
  @Binding var selection: Value; let items: [PaneNavItem<Value>]
  @Environment(\.accessibilityReduceMotion) private var still
  @Namespace private var ns
  public init(selection: Binding<Value>, items: [PaneNavItem<Value>]) { self._selection = selection; self.items = items }
  public var body: some View {
    HStack(spacing: PaneTokens.navGap) {
      ForEach(items) { item in
        let on = item.value == selection
        Button { withAnimation(.pane(PaneTokens.motionPress, reduceMotion: still)) { selection = item.value } } label: {
          VStack(spacing: PaneTokens.gapXs) {
            Image(systemName: on ? "\(item.systemImage).fill" : item.systemImage).font(.system(size: PaneTokens.controlIconMd, weight: PaneTokens.typeWeightMedium))
              .overlay(alignment: .topTrailing) { if let b = item.badge, b > 0 { Text("\(b)").paneFont(.micro, weight: PaneTokens.typeWeightSemibold).foregroundStyle(PaneTokens.navBadgeFg.color).padding(.horizontal, PaneTokens.gapXs).background(Capsule().fill(PaneTokens.navBadgeBg.color)).offset(x: PaneTokens.gapMd, y: -PaneTokens.gapSm) } }
            Text(item.label).paneFont(.micro, weight: on ? PaneTokens.typeWeightSemibold : PaneTokens.typeWeightMedium)
          }
          .foregroundStyle(on ? PaneTokens.textPrimary.color : PaneTokens.textSecondary.color)
          .frame(minWidth: PaneTokens.navItemMin, minHeight: PaneTokens.navItemHeight)
          .padding(.horizontal, PaneTokens.gapSm)
          .background { if on { Capsule().fill(LinearGradient(colors: [PaneTokens.navOnTop.color, PaneTokens.navOnFoot.color], startPoint: .top, endPoint: .bottom)).paneShadow(PaneTokens.navOnCast, in: Capsule()).matchedGeometryEffect(id: "on", in: ns) } }
          .contentShape(Capsule())
        }
        .buttonStyle(.plain)
        .accessibilityLabel(item.badge.map { "\(item.label), \($0)" } ?? item.label)
        .accessibilityAddTraits(on ? [.isSelected, .isButton] : .isButton)
      }
    }
    .padding(PaneTokens.navDockInset)
    .paneGlass(.three, in: Capsule())
    .paneShadow(PaneTokens.navDockShadow, in: Capsule())
  }
}

/// The top bar: a glass strip with an optional back button, the title and trailing actions.
public struct PaneNavbar<Trailing: View>: View {
  let title: String; let back: (() -> Void)?; let trailing: Trailing
  @Environment(\.paneMessages) private var t
  @Environment(\.layoutDirection) private var dir
  public init(_ title: String, back: (() -> Void)? = nil, @ViewBuilder trailing: () -> Trailing = { EmptyView() }) { self.title = title; self.back = back; self.trailing = trailing() }
  public var body: some View {
    HStack(spacing: PaneTokens.gapMd) {
      if let back { PaneIconButton(systemImage: dir == .rightToLeft ? "chevron.right" : "chevron.left", label: t.back, variant: .ghost, action: back) }
      Text(title).paneFont(.emphasis, weight: PaneTokens.typeWeightSemibold).foregroundStyle(PaneTokens.textPrimary.color).accessibilityAddTraits(.isHeader)
      Spacer()
      trailing
    }
    .padding(.horizontal, PaneTokens.gapLg)
    .frame(minHeight: PaneTokens.navBar)
    .background { Rectangle().fill(.ultraThinMaterial).overlay(alignment: .bottom) { Rectangle().fill(PaneTokens.lineDivider.color).frame(height: PaneTokens.widthHairline) } }
  }
}
