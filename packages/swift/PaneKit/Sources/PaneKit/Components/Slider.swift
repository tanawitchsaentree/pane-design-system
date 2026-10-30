import SwiftUI

public enum PaneSliderVariant: Sendable { case channel, fill }

/// A value along a range. `channel` is a thin carved channel with a bead; `fill` is a tall bar with the
/// label and value inside, for quick settings. Either way VoiceOver gets the system slider (adjustable).
public struct PaneSlider: View {
  let label: String; @Binding var value: Double; let range: ClosedRange<Double>; let step: Double; let variant: PaneSliderVariant; let format: (Double) -> String
  @Environment(\.isEnabled) private var enabled
  public init(_ label: String, value: Binding<Double>, in range: ClosedRange<Double> = 0...100, step: Double = 1, variant: PaneSliderVariant = .channel, format: @escaping (Double) -> String = { String(Int($0.rounded())) }) {
    self.label = label; self._value = value; self.range = range; self.step = step; self.variant = variant; self.format = format
  }
  private var t: Double { (value - range.lowerBound) / max(range.upperBound - range.lowerBound, .ulpOfOne) }
  private func set(_ x: CGFloat, _ w: CGFloat) {
    let raw = range.lowerBound + Double(min(max(x / max(w, PaneTokens.widthHairline), PaneTokens.opacityNone), PaneTokens.opacityFull)) * (range.upperBound - range.lowerBound)
    value = min(max((raw / step).rounded() * step, range.lowerBound), range.upperBound)
  }
  public var body: some View {
    Group { if variant == .fill { fill } else { channel } }
      .opacity(enabled ? PaneTokens.opacityFull : PaneTokens.opacityDisabled)
      .accessibilityRepresentation { Slider(value: $value, in: range, step: step) { Text(label) } }
      .accessibilityValue(format(value))
  }
  private var channel: some View {
    VStack(alignment: .leading, spacing: PaneTokens.sliderGap) {
      HStack { Text(label).paneFont(.label); Spacer(); Text(format(value)).paneFont(.label).monospacedDigit().foregroundStyle(PaneTokens.textSecondary.color) }
        .foregroundStyle(PaneTokens.textPrimary.color)
      GeometryReader { g in
        let w = g.size.width
        ZStack(alignment: .leading) {
          Capsule().fill(PaneTokens.sliderTrackBg.color).frame(height: PaneTokens.sliderTrack).paneShadow(PaneTokens.sliderCarve, in: Capsule())
          Capsule().fill(LinearGradient(colors: [PaneTokens.sliderRangeTop.color, PaneTokens.sliderRangeBg.color], startPoint: .top, endPoint: .bottom)).frame(width: max(PaneTokens.sliderTrack, w * t), height: PaneTokens.sliderTrack)
          Capsule().fill(RadialGradient(colors: [PaneTokens.sliderThumbBg.color, PaneTokens.sliderThumbShade.color], center: .top, startRadius: PaneTokens.widthHairline, endRadius: PaneTokens.sliderThumb))
            .frame(width: PaneTokens.sliderThumbWidth, height: PaneTokens.sliderThumb).paneShadow(PaneTokens.sliderThumbShadow, in: Capsule())
            .offset(x: (w - PaneTokens.sliderThumbWidth) * t)
        }
        .frame(height: PaneTokens.sliderHit).contentShape(Rectangle())
        .gesture(DragGesture(minimumDistance: PaneTokens.opacityNone).onChanged { set($0.location.x, w) })
      }
      .frame(height: PaneTokens.sliderHit)
    }
    .frame(minWidth: PaneTokens.sliderMinWidth)
  }
  private var fill: some View {
    GeometryReader { g in
      let w = g.size.width
      ZStack(alignment: .leading) {
        Capsule().fill(PaneTokens.sliderFillBg.color).paneShadow(PaneTokens.sliderFillCarve, in: Capsule())
        Capsule().fill(LinearGradient(colors: [PaneTokens.sliderFillTop.color, PaneTokens.sliderFillFoot.color], startPoint: .top, endPoint: .bottom))
          .frame(width: max(PaneTokens.sliderFillHeight, w * t)).padding(PaneTokens.sliderFillPadding)
        HStack { Text(label).paneFont(.body, weight: PaneTokens.typeWeightSemibold); Spacer(); Text(format(value)).paneFont(.body).monospacedDigit() }
          .foregroundStyle(PaneTokens.textPrimary.color).padding(.horizontal, PaneTokens.gapXl)
      }
      .contentShape(Rectangle())
      .gesture(DragGesture(minimumDistance: PaneTokens.opacityNone).onChanged { set($0.location.x, w) })
    }
    .frame(minWidth: PaneTokens.sliderMinWidth, minHeight: PaneTokens.sliderFillHeight, maxHeight: PaneTokens.sliderFillHeight)
  }
}
