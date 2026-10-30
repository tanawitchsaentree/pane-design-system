import SwiftUI

/// The identities a view needs that are not design values: fully shown, hidden, unscaled. Named so the
/// components carry no bare numbers (scripts/check-raw.sh).
public extension PaneTokens {
  static let opacityFull: Double = 1 // raw-ok: identity
  static let opacityNone: Double = 0 // raw-ok: identity
  static let scaleNone: CGFloat = 1 // raw-ok: identity
}

public extension PaneTokens {
  /// How long a toast stays, the same as pane-react's Toast default (5 s).
  static let motionToastHold: TimeInterval = 5 // raw-ok: matches Toast duration default
}
