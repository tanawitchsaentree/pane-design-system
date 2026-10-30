import SwiftUI

/// A label above a field, help or an error under it, the error said in words with the critical mark.
struct PaneFieldFrame<Field: View>: View {
  let label: String; let required: Bool; let help: String?; let error: String?; let field: Field
  @Environment(\.paneMessages) private var t
  var body: some View {
    VStack(alignment: .leading, spacing: PaneTokens.gapSm) {
      HStack(spacing: PaneTokens.gapXs) {
        Text(label).paneFont(.label, weight: PaneTokens.typeWeightMedium).foregroundStyle(PaneTokens.textPrimary.color)
        if required { Text("*").foregroundStyle(PaneTokens.textSecondary.color).accessibilityHidden(true) }
      }
      field
      if let e = error {
        Label { Text(e) } icon: { Image(systemName: "exclamationmark.octagon").foregroundStyle(PaneTokens.statusCriticalMark.color) }
          .paneFont(.label).foregroundStyle(PaneTokens.textPrimary.color)
      } else if let h = help { Text(h).paneFont(.label).foregroundStyle(PaneTokens.textSecondary.color) }
    }
    .accessibilityElement(children: .combine)
    .accessibilityHint(error ?? help ?? "")
    .accessibilityValue(required ? t.required : "")
  }
}

/// A single-line field cut into the glass as a groove. Invalid adds the critical ring and the words of
/// `error`; read-only drops the groove for a hairline so the value reads as settled but can be selected.
public struct PaneTextField: View {
  let label: String; @Binding var text: String; let prompt: String?; let help: String?; let error: String?; let required: Bool; let readOnly: Bool
  @Environment(\.isEnabled) private var enabled
  @FocusState private var focused: Bool
  public init(_ label: String, text: Binding<String>, prompt: String? = nil, help: String? = nil, error: String? = nil, required: Bool = false, readOnly: Bool = false) {
    self.label = label; self._text = text; self.prompt = prompt; self.help = help; self.error = error; self.required = required; self.readOnly = readOnly
  }
  public var body: some View {
    PaneFieldFrame(label: label, required: required, help: help, error: error, field:
      TextField(label, text: readOnly ? .constant(text) : $text, prompt: prompt.map { Text($0).foregroundStyle(PaneTokens.inputPlaceholder.color) })
        .textFieldStyle(.plain)
        .paneFont(.body)
        .foregroundStyle(PaneTokens.inputFg.color)
        .focused($focused)
        .padding(.horizontal, PaneTokens.inputPadding)
        .frame(minHeight: PaneTokens.inputHeightMd)
        .paneGroove(in: RoundedRectangle(cornerRadius: PaneTokens.inputRadius, style: .continuous), invalid: error != nil, readOnly: readOnly)
        .overlay { if focused { RoundedRectangle(cornerRadius: PaneTokens.inputRadius, style: .continuous).inset(by: -PaneTokens.focusRingWidth * 2).strokeBorder(PaneTokens.focusRingColor.color, lineWidth: PaneTokens.focusRingWidth) } }
        .opacity(enabled ? PaneTokens.opacityFull : PaneTokens.opacityDisabled)
        .labelsHidden()
    )
  }
}

/// A password field with a show button at its end that says its state and swaps the eye for a slashed one.
public struct PaneSecureField: View {
  let label: String; @Binding var text: String; let error: String?; let required: Bool
  @State private var shown = false
  @Environment(\.paneMessages) private var t
  public init(_ label: String, text: Binding<String>, error: String? = nil, required: Bool = false) { self.label = label; self._text = text; self.error = error; self.required = required }
  public var body: some View {
    PaneFieldFrame(label: label, required: required, help: nil, error: error, field:
      HStack(spacing: PaneTokens.gapSm) {
        Group { if shown { TextField(label, text: $text) } else { SecureField(label, text: $text) } }
          .textFieldStyle(.plain).paneFont(.body).foregroundStyle(PaneTokens.inputFg.color).labelsHidden()
          #if os(iOS)
          .textInputAutocapitalization(.never).autocorrectionDisabled()
          #endif
        Button { shown.toggle() } label: { Image(systemName: shown ? "eye" : "eye.slash").foregroundStyle(PaneTokens.textSecondary.color).frame(minWidth: PaneTokens.layoutTouch, minHeight: PaneTokens.layoutTouch) }
          .buttonStyle(.plain).accessibilityLabel(shown ? t.hidePassword : t.showPassword)
      }
      .padding(.leading, PaneTokens.inputPadding)
      .frame(minHeight: PaneTokens.inputHeightMd)
      .paneGroove(in: RoundedRectangle(cornerRadius: PaneTokens.inputRadius, style: .continuous), invalid: error != nil)
    )
  }
}
