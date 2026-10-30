import SwiftUI

/// The switch as a ToggleStyle: a carved track, a white knob lit from above, the on track in the loud solid
/// with a tick, so on reads by position and mark as well as tone. A 44pt press area around it.
public struct PaneSwitchStyle: ToggleStyle {
  @Environment(\.isEnabled) private var enabled
  @Environment(\.accessibilityReduceMotion) private var still
  public init() {}
  public func makeBody(configuration: Configuration) -> some View {
    Button { configuration.isOn.toggle() } label: {
      HStack(spacing: PaneTokens.gapLg) {
        configuration.label.paneFont(.body).foregroundStyle(PaneTokens.textPrimary.color)
        Spacer(minLength: PaneTokens.gapMd)
        ZStack(alignment: configuration.isOn ? .trailing : .leading) {
          Capsule().fill(configuration.isOn ? AnyShapeStyle(LinearGradient(colors: [PaneTokens.switchOnTop.color, PaneTokens.switchOnBg.color], startPoint: .top, endPoint: .bottom)) : AnyShapeStyle(PaneTokens.switchBg.color))
            .paneShadow(configuration.isOn ? PaneTokens.switchOnCarve : PaneTokens.switchCarve, in: Capsule())
          Circle().fill(RadialGradient(colors: [PaneTokens.switchKnobBg.color, PaneTokens.switchKnobShade.color], center: .top, startRadius: PaneTokens.widthHairline, endRadius: PaneTokens.switchKnob))
            .frame(width: PaneTokens.switchKnob, height: PaneTokens.switchKnob)
            .paneShadow(PaneTokens.switchKnobShadow, in: Circle())
            .padding(PaneTokens.switchInsetGap)
        }
        .frame(width: PaneTokens.switchWidth, height: PaneTokens.switchHeight)
        .animation(.pane(PaneTokens.motionPress, reduceMotion: still), value: configuration.isOn)
      }
      .frame(minHeight: PaneTokens.switchHit).contentShape(Rectangle())
    }
    .buttonStyle(.plain)
    .opacity(enabled ? PaneTokens.opacityFull : PaneTokens.opacityDisabled)
    .accessibilityRepresentation { Toggle(isOn: configuration.$isOn) { configuration.label } }
  }
}

/// A checkbox as a ToggleStyle: a small carved well that holds a check when on; invalid rings it in the
/// critical mark. Use `.toggleStyle(PaneCheckboxStyle())` on a Toggle.
public struct PaneCheckboxStyle: ToggleStyle {
  let invalid: Bool
  @Environment(\.isEnabled) private var enabled
  public init(invalid: Bool = false) { self.invalid = invalid }
  public func makeBody(configuration: Configuration) -> some View {
    let box = RoundedRectangle(cornerRadius: PaneTokens.checkRadius, style: .continuous)
    Button { configuration.isOn.toggle() } label: {
      HStack(spacing: PaneTokens.gapMd) {
        ZStack {
          box.fill(configuration.isOn ? PaneTokens.actionLoudTop.color : PaneTokens.checkBg.color).paneShadow(configuration.isOn ? PaneTokens.elevationCastPress : PaneTokens.checkCarve, in: box)
          if configuration.isOn { Image(systemName: "checkmark").font(.system(size: PaneTokens.controlIconSm, weight: PaneTokens.typeWeightSemibold)).foregroundStyle(PaneTokens.textOnAccent.color) }
        }
        .frame(width: PaneTokens.checkSize, height: PaneTokens.checkSize)
        .overlay { if invalid { box.inset(by: -PaneTokens.widthHairline * 2).strokeBorder(PaneTokens.checkRingInvalid.color, lineWidth: PaneTokens.widthRing) } }
        configuration.label.paneFont(.body).foregroundStyle(PaneTokens.textPrimary.color)
      }
      .frame(minHeight: PaneTokens.checkHit).contentShape(Rectangle())
    }
    .buttonStyle(.plain)
    .opacity(enabled ? PaneTokens.opacityFull : PaneTokens.opacityDisabled)
    .accessibilityRepresentation { Toggle(isOn: configuration.$isOn) { configuration.label } }
  }
}

/// A row of options in a carved track, the chosen one lifted as chosen glass in semibold.
public struct PaneSegmentedControl<Value: Hashable>: View {
  let label: String; @Binding var selection: Value; let options: [(value: Value, label: String)]
  @Environment(\.accessibilityReduceMotion) private var still
  @Namespace private var ns
  public init(_ label: String, selection: Binding<Value>, options: [(value: Value, label: String)]) { self.label = label; self._selection = selection; self.options = options }
  public var body: some View {
    HStack(spacing: PaneTokens.navGap) {
      ForEach(options, id: \.value) { o in
        let on = o.value == selection
        Button { withAnimation(.pane(PaneTokens.motionPress, reduceMotion: still)) { selection = o.value } } label: {
          Text(o.label).paneFont(.label, weight: on ? PaneTokens.typeWeightSemibold : PaneTokens.typeWeightMedium)
            .foregroundStyle(on ? PaneTokens.textPrimary.color : PaneTokens.textSecondary.color)
            .frame(maxWidth: .infinity, minHeight: PaneTokens.navItemHeight)
            .padding(.horizontal, PaneTokens.gapLg)
            .background { if on { Capsule().fill(LinearGradient(colors: [PaneTokens.navOnTop.color, PaneTokens.navOnFoot.color], startPoint: .top, endPoint: .bottom)).paneShadow(PaneTokens.navOnCast, in: Capsule()).matchedGeometryEffect(id: "on", in: ns) } }
            .contentShape(Capsule())
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(on ? [.isSelected, .isButton] : .isButton)
      }
    }
    .padding(PaneTokens.navInset)
    .background { Capsule().fill(PaneTokens.surfaceCarve.color).paneShadow(PaneTokens.navCarve, in: Capsule()) }
    .accessibilityElement(children: .contain).accessibilityLabel(label)
  }
}

/// A small pill that is on or off, with a check when chosen; or a removable pill with its own remove button.
public struct PaneChip: View {
  let label: String; @Binding var isOn: Bool
  public init(_ label: String, isOn: Binding<Bool>) { self.label = label; self._isOn = isOn }
  public var body: some View {
    Button { isOn.toggle() } label: {
      HStack(spacing: PaneTokens.chipGap) { if isOn { Image(systemName: "checkmark").font(.system(size: PaneTokens.chipIcon, weight: PaneTokens.typeWeightSemibold)) }; Text(label) }
        .paneFont(.label, weight: isOn ? PaneTokens.typeWeightSemibold : PaneTokens.typeWeightMedium)
        .foregroundStyle(isOn ? PaneTokens.chipOnFg.color : PaneTokens.chipFg.color)
        .padding(.horizontal, PaneTokens.chipPaddingInline)
        .frame(minHeight: PaneTokens.chipHeight)
        .background { Capsule().fill(LinearGradient(colors: isOn ? [PaneTokens.chipOnTop.color, PaneTokens.chipOnFoot.color] : [PaneTokens.chipTop.color, PaneTokens.chipFoot.color], startPoint: .top, endPoint: .bottom)) }
        .paneShadow(isOn ? PaneTokens.chipOnCast : PaneTokens.chipEdge, in: Capsule())
        .frame(minHeight: PaneTokens.chipHit).contentShape(Rectangle())
    }
    .buttonStyle(PanePressStyle())
    .accessibilityAddTraits(isOn ? [.isSelected, .isButton] : .isButton)
  }
}
