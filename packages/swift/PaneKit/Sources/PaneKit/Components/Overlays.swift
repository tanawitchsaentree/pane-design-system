import SwiftUI

public extension View {
  /// Styles a sheet's content as a Pane level-3 pane: the system material, a grabber, the panel corner.
  func paneSheet() -> some View {
    self
      .presentationBackground(.ultraThinMaterial)
      .presentationCornerRadius(PaneTokens.cornerPanel)
      .presentationDragIndicator(.visible)
  }

  /// Shows a toast at the bottom for a short while: a short line, an optional action, said politely.
  func paneToast(isPresented: Binding<Bool>, message: String, actionTitle: String? = nil, action: (() -> Void)? = nil) -> some View {
    modifier(PaneToastModifier(isPresented: isPresented, message: message, actionTitle: actionTitle, action: action))
  }
}

struct PaneToastModifier: ViewModifier {
  @Binding var isPresented: Bool; let message: String; let actionTitle: String?; let action: (() -> Void)?
  @Environment(\.accessibilityReduceMotion) private var still
  @Environment(\.paneMessages) private var t
  func body(content: Content) -> some View {
    content.overlay(alignment: .bottom) {
      if isPresented {
        PaneToast(message: message, actionTitle: actionTitle, action: action) { isPresented = false }
          .padding(PaneTokens.overlayMargin)
          .transition(still ? .opacity : .move(edge: .bottom).combined(with: .opacity))
          .task {
            #if os(iOS)
            UIAccessibility.post(notification: .announcement, argument: message)
            #endif
            try? await Task.sleep(for: .seconds(PaneTokens.motionToastHold))
            withAnimation(.pane(reduceMotion: still)) { isPresented = false }
          }
      }
    }
    .animation(.pane(reduceMotion: still), value: isPresented)
  }
}

/// The toast itself, for a custom placement: a level-3 pane with the line, an action and a close button.
public struct PaneToast: View {
  let message: String; let actionTitle: String?; let action: (() -> Void)?; let dismiss: () -> Void
  @Environment(\.paneMessages) private var t
  public init(message: String, actionTitle: String? = nil, action: (() -> Void)? = nil, dismiss: @escaping () -> Void) { self.message = message; self.actionTitle = actionTitle; self.action = action; self.dismiss = dismiss }
  public var body: some View {
    HStack(spacing: PaneTokens.gapMd) {
      Text(message).paneFont(.label).foregroundStyle(PaneTokens.textPrimary.color)
      Spacer(minLength: PaneTokens.gapSm)
      if let actionTitle, let action { PaneButton(actionTitle, variant: .glass, size: .sm) { action(); dismiss() } }
      PaneIconButton(systemImage: "xmark", label: t.dismiss, variant: .ghost, size: .sm, action: dismiss)
    }
    .padding(.leading, PaneTokens.gapXl).padding(.vertical, PaneTokens.gapXs).padding(.trailing, PaneTokens.gapXs)
    .frame(maxWidth: PaneTokens.overlayToast)
    .paneGlass(.three, in: RoundedRectangle(cornerRadius: PaneTokens.cornerMedia, style: .continuous))
  }
}
