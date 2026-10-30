import SwiftUI

public enum PaneTone: Sendable { case neutral, info, positive, warning, critical
  var mark: Color { switch self { case .neutral: PaneTokens.badgeNeutralMark.color; case .info: PaneTokens.badgeInfoMark.color; case .positive: PaneTokens.badgePositiveMark.color; case .warning: PaneTokens.badgeWarningMark.color; case .critical: PaneTokens.badgeCriticalMark.color } }
  var symbol: String { switch self { case .neutral: "circle.fill"; case .info: "info.circle.fill"; case .positive: "checkmark.circle.fill"; case .warning: "exclamationmark.triangle.fill"; case .critical: "exclamationmark.octagon.fill" } }
}

/// A status in a few words: its own glyph in its mark colour and the word in the text colour, so the
/// status reads by shape and words, never by hue alone.
public struct PaneBadge: View {
  let text: String; let tone: PaneTone
  public init(_ text: String, tone: PaneTone = .neutral) { self.text = text; self.tone = tone }
  public var body: some View {
    HStack(spacing: PaneTokens.gapXs) { Image(systemName: tone.symbol).font(.system(size: PaneTokens.badgeGlyph)).foregroundStyle(tone.mark); Text(text) }
      .paneFont(.caption, weight: PaneTokens.typeWeightMedium).foregroundStyle(PaneTokens.badgeFg.color)
      .padding(.horizontal, PaneTokens.badgePaddingInline).frame(minHeight: PaneTokens.badgeHeight)
      .background(Capsule().fill(PaneTokens.surfaceQuiet.color))
  }
}

/// A label etched into the pane, for metadata that is not a status.
public struct PaneTag: View {
  let text: String
  public init(_ text: String) { self.text = text }
  public var body: some View {
    Text(text).paneFont(.caption, weight: PaneTokens.typeWeightMedium).foregroundStyle(PaneTokens.tagFg.color)
      .padding(.horizontal, PaneTokens.tagPaddingInline).padding(.vertical, PaneTokens.tagPaddingBlock)
      .background { RoundedRectangle(cornerRadius: PaneTokens.tagRadius, style: .continuous).fill(PaneTokens.tagBg.color).paneShadow(PaneTokens.tagEtch, in: RoundedRectangle(cornerRadius: PaneTokens.tagRadius, style: .continuous)) }
  }
}

/// A person or a thing as a disc: the image, or initials on the fallback tone.
public struct PaneAvatar: View {
  public enum Size: Sendable { case sm, md, lg }
  let name: String; let image: Image?; let size: Size
  public init(name: String, image: Image? = nil, size: Size = .md) { self.name = name; self.image = image; self.size = size }
  public var body: some View {
    let d = size == .sm ? PaneTokens.avatarSizeSm : size == .lg ? PaneTokens.avatarSizeLg : PaneTokens.avatarSizeMd
    ZStack {
      Circle().fill(PaneTokens.avatarFallbackBg.color)
      if let image { image.resizable().scaledToFill() } else {
        Text(name.split(separator: " ").prefix(2).compactMap(\.first).map(String.init).joined()).font(.system(size: size == .sm ? PaneTokens.typeCaption : size == .lg ? PaneTokens.typeTitle : PaneTokens.typeLabel, weight: PaneTokens.typeWeightSemibold)).foregroundStyle(PaneTokens.avatarFallbackFg.color)
      }
    }
    .frame(width: d, height: d).clipShape(Circle())
    .paneShadow(PaneTokens.avatarLens, in: Circle())
    .accessibilityElement().accessibilityLabel(name).accessibilityAddTraits(.isImage)
  }
}

/// How far a task has come: the slider channel filled with the loud solid; with no value it travels.
public struct PaneProgress: View {
  let label: String; let value: Double?; let showValue: Bool
  public init(_ label: String, value: Double? = nil, showValue: Bool = false) { self.label = label; self.value = value; self.showValue = showValue }
  public var body: some View {
    VStack(alignment: .leading, spacing: PaneTokens.progressGap) {
      HStack { Text(label).paneFont(.label); Spacer(); if showValue, let v = value { Text(v, format: .percent.precision(.fractionLength(0))).paneFont(.label).foregroundStyle(PaneTokens.textSecondary.color) } }
        .foregroundStyle(PaneTokens.textPrimary.color)
      if let v = value {
        GeometryReader { g in
          ZStack(alignment: .leading) {
            Capsule().fill(PaneTokens.progressBg.color).paneShadow(PaneTokens.progressCarve, in: Capsule())
            Capsule().fill(LinearGradient(colors: [PaneTokens.progressFillTop.color, PaneTokens.progressFillFoot.color], startPoint: .top, endPoint: .bottom)).frame(width: g.size.width * min(max(v, PaneTokens.opacityNone), PaneTokens.opacityFull))
          }
        }
        .frame(height: PaneTokens.progressTrack)
      } else {
        ProgressView().progressViewStyle(.linear).tint(PaneTokens.progressFillTop.color)
      }
    }
    .accessibilityElement(children: .ignore).accessibilityLabel(label)
    .accessibilityValue(value.map { Text($0, format: .percent.precision(.fractionLength(0))) } ?? Text(""))
  }
}

/// A reading in a known range; a high reading adds the warning or critical glyph and its word.
public struct PaneMeter: View {
  let label: String; let value: Double; let range: ClosedRange<Double>; let high: Double?; let critical: Double?
  @Environment(\.paneMessages) private var t
  public init(_ label: String, value: Double, in range: ClosedRange<Double> = 0...100, high: Double? = nil, critical: Double? = nil) { self.label = label; self.value = value; self.range = range; self.high = high; self.critical = critical }
  public var body: some View {
    let f = (value - range.lowerBound) / max(range.upperBound - range.lowerBound, .ulpOfOne)
    let level: PaneTone = critical.map { value >= $0 } == true ? .critical : high.map { value >= $0 } == true ? .warning : .neutral
    let word = level == .critical ? t.full : level == .warning ? t.almostFull : nil
    VStack(alignment: .leading, spacing: PaneTokens.meterGap) {
      HStack(spacing: PaneTokens.meterGap) {
        Text(label).paneFont(.label); Spacer()
        if let word { Label(word, systemImage: level.symbol).labelStyle(.titleAndIcon).foregroundStyle(PaneTokens.textPrimary.color).symbolRenderingMode(.palette) }
        Text(f, format: .percent.precision(.fractionLength(0))).foregroundStyle(PaneTokens.textSecondary.color)
      }
      .paneFont(.label).foregroundStyle(PaneTokens.textPrimary.color)
      GeometryReader { g in
        ZStack(alignment: .leading) {
          Capsule().fill(PaneTokens.meterBg.color).paneShadow(PaneTokens.meterCarve, in: Capsule())
          Capsule().fill(LinearGradient(colors: [PaneTokens.meterFillTop.color, PaneTokens.meterFillFoot.color], startPoint: .top, endPoint: .bottom)).frame(width: g.size.width * min(max(f, PaneTokens.opacityNone), PaneTokens.opacityFull))
        }
      }
      .frame(height: PaneTokens.meterTrack)
    }
    .accessibilityElement(children: .ignore).accessibilityLabel(label)
    .accessibilityValue([Text(f, format: .percent.precision(.fractionLength(0))), word.map { Text($0) }].compactMap { $0 }.reduce(Text("")) { $0 + Text(" ") + $1 })
  }
}

/// A position on a short ordered scale: steps up to the value lit, a bead at the value, a hollow ring
/// to compare with and a band and arrow between them, said in words as well.
public struct PaneScale: View {
  let label: String; let value: Double; let steps: Int; let words: [String]?; let compare: Double?; let compareLabel: String?; let higherIsBetter: Bool
  @Environment(\.paneMessages) private var t
  @Environment(\.layoutDirection) private var dir
  public init(_ label: String, value: Double, steps: Int = 5, words: [String]? = nil, compare: Double? = nil, compareLabel: String? = nil, higherIsBetter: Bool = true) {
    self.label = label; self.value = value; self.steps = steps; self.words = words; self.compare = compare; self.compareLabel = compareLabel; self.higherIsBetter = higherIsBetter
  }
  private func at(_ x: Double) -> Double { (min(max(x, 1), Double(steps)) - 1) / Double(max(1, steps - 1)) } // raw-ok: steps count from one
  public var body: some View {
    let v = min(max(value, 1), Double(steps)) // raw-ok: steps count from one
    let word = words.flatMap { $0.indices.contains(Int(v.rounded()) - 1) ? $0[Int(v.rounded()) - 1] : nil } // raw-ok: index
    let up = compare.map { v > $0 } ?? false, down = compare.map { v < $0 } ?? false
    let good = (up && higherIsBetter) || (down && !higherIsBetter)
    HStack(spacing: PaneTokens.scaleGap) {
      Text(label).paneFont(.label).foregroundStyle(PaneTokens.textPrimary.color).frame(width: PaneTokens.scaleLabel, alignment: .leading)
      GeometryReader { g in
        let w = g.size.width
        ZStack(alignment: .leading) {
          HStack(spacing: PaneTokens.scaleStepGap) {
            ForEach(1...steps, id: \.self) { i in Rectangle().fill(Double(i) <= v.rounded() ? PaneTokens.scaleOn.color : PaneTokens.scaleOff.color).frame(height: PaneTokens.scaleTrack) }
          }
          .clipShape(Capsule())
          if let c = compare, up || down {
            Capsule().fill(good ? PaneTokens.scaleGood.color : PaneTokens.scaleBad.color).frame(width: w * abs(at(v) - at(c)), height: PaneTokens.scaleTrack).offset(x: w * min(at(v), at(c)))
          }
          if let c = compare { Circle().strokeBorder(PaneTokens.scaleRing.color, lineWidth: PaneTokens.widthRing).frame(width: PaneTokens.scaleBead, height: PaneTokens.scaleBead).offset(x: w * at(c) - PaneTokens.scaleBead / 2) }
          Circle().fill(PaneTokens.scaleBeadBg.color).frame(width: PaneTokens.scaleBead, height: PaneTokens.scaleBead).paneShadow(PaneTokens.scaleBeadShadow, in: Circle()).offset(x: w * at(v) - PaneTokens.scaleBead / 2)
        }
        .frame(maxHeight: .infinity)
      }
      .frame(minWidth: PaneTokens.scaleMin, minHeight: PaneTokens.scaleHit)
      HStack(spacing: PaneTokens.gapXs) {
        if up || down { Image(systemName: up ? "arrow.up" : "arrow.down").font(.system(size: PaneTokens.controlIconSm, weight: PaneTokens.typeWeightSemibold)) }
        Text(word ?? t.of(Int(v.rounded()), steps))
      }
      .paneFont(.label, weight: PaneTokens.typeWeightMedium).foregroundStyle(PaneTokens.textPrimary.color).frame(width: PaneTokens.scaleWord, alignment: .trailing)
    }
    .accessibilityElement(children: .ignore)
    .accessibilityLabel(label)
    .accessibilityValue([word, t.of(Int(v.rounded()), steps), compare.map { _ in "\(up ? t.above : down ? t.below : t.levelWith) \(compareLabel ?? "")" }].compactMap { $0 }.joined(separator: ", "))
  }
}

/// The steps of a task: done is a check, now a filled number, ahead an outline, on an etched groove.
public struct PaneStepper: View {
  let steps: [String]; let current: Int
  @Environment(\.paneMessages) private var t
  public init(steps: [String], current: Int) { self.steps = steps; self.current = current }
  public var body: some View {
    HStack(alignment: .top, spacing: PaneTokens.gapSm) {
      ForEach(Array(steps.enumerated()), id: \.offset) { i, s in
        VStack(spacing: PaneTokens.gapXs) {
          ZStack {
            if i < current { Circle().fill(PaneTokens.stepperLit.color); Image(systemName: "checkmark").font(.system(size: PaneTokens.controlIconSm, weight: PaneTokens.typeWeightSemibold)).foregroundStyle(PaneTokens.textOnAccent.color) }
            else if i == current { Circle().fill(PaneTokens.stepperCurrent.color).paneShadow(PaneTokens.stepperGlow, in: Circle()); Text("\(i + 1)").foregroundStyle(PaneTokens.stepperCurrentFg.color) } // raw-ok: steps count from one
            else { Circle().strokeBorder(PaneTokens.lineRing.color, lineWidth: PaneTokens.widthRing); Text("\(i + 1)").foregroundStyle(PaneTokens.textSecondary.color) } // raw-ok: steps count from one
          }
          .paneFont(.label, weight: PaneTokens.typeWeightSemibold).frame(width: PaneTokens.controlCheck, height: PaneTokens.controlCheck)
          Text(s).paneFont(.caption, weight: i == current ? PaneTokens.typeWeightSemibold : PaneTokens.typeWeightRegular).foregroundStyle(i <= current ? PaneTokens.textPrimary.color : PaneTokens.textSecondary.color).multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .accessibilityElement(children: .combine).accessibilityValue(t.stepOf(i + 1, steps.count)) // raw-ok: steps count from one
        .accessibilityAddTraits(i == current ? .isSelected : [])
      }
    }
  }
}
