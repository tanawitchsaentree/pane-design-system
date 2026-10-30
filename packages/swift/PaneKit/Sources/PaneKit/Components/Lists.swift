import SwiftUI

/// Rows of one kind on one level-2 pane, with hairlines that start where the text starts.
public struct PaneList<Content: View>: View {
  let content: Content
  public init(@ViewBuilder content: () -> Content) { self.content = content() }
  public var body: some View {
    VStack(spacing: PaneTokens.opacityNone) { content }
      .padding(PaneTokens.listInset)
      .background { RoundedRectangle(cornerRadius: PaneTokens.cornerMedia, style: .continuous).fill(PaneTokens.listBg.color) }
      .paneShadow(PaneTokens.listEdge, in: RoundedRectangle(cornerRadius: PaneTokens.cornerMedia, style: .continuous))
  }
}

/// One row: an optional leading view, a title and a second line, an optional trailing view, and a chevron
/// when it opens a page. A row with an action is pressed as a whole and keeps a 44pt height.
public struct PaneListRow<Leading: View, Trailing: View>: View {
  let title: String; let subtitle: String?; let chevron: Bool; let divider: Bool; let action: (() -> Void)?; let leading: Leading; let trailing: Trailing
  @Environment(\.layoutDirection) private var dir
  public init(_ title: String, subtitle: String? = nil, chevron: Bool = false, divider: Bool = true, action: (() -> Void)? = nil, @ViewBuilder leading: () -> Leading = { EmptyView() }, @ViewBuilder trailing: () -> Trailing = { EmptyView() }) {
    self.title = title; self.subtitle = subtitle; self.chevron = chevron; self.divider = divider; self.action = action; self.leading = leading(); self.trailing = trailing()
  }
  private var row: some View {
    HStack(spacing: PaneTokens.listGap) {
      leading
      VStack(alignment: .leading, spacing: PaneTokens.gapXs) {
        Text(title).paneFont(.body).foregroundStyle(PaneTokens.textPrimary.color)
        if let s = subtitle { Text(s).paneFont(.label).foregroundStyle(PaneTokens.textSecondary.color) }
      }
      Spacer(minLength: PaneTokens.gapSm)
      trailing.paneFont(.label).foregroundStyle(PaneTokens.textSecondary.color)
      if chevron { Image(systemName: dir == .rightToLeft ? "chevron.left" : "chevron.right").font(.system(size: PaneTokens.listChevron, weight: PaneTokens.typeWeightSemibold)).foregroundStyle(PaneTokens.textSecondary.color).accessibilityHidden(true) }
    }
    .padding(.horizontal, PaneTokens.listPadding).padding(.vertical, PaneTokens.listPaddingBlock)
    .frame(minHeight: PaneTokens.listRow).contentShape(Rectangle())
  }
  public var body: some View {
    VStack(spacing: PaneTokens.opacityNone) {
      if let action { Button(action: action) { row }.buttonStyle(PaneRowStyle()) } else { row }
      if divider { Rectangle().fill(PaneTokens.listDivider.color).frame(height: PaneTokens.widthHairline).padding(.leading, PaneTokens.listPadding) }
    }
  }
}

struct PaneRowStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label.background { RoundedRectangle(cornerRadius: PaneTokens.listRadius, style: .continuous).fill(configuration.isPressed ? PaneTokens.listHighlight.color : .clear) }
  }
}

/// The place where content will be when there is none yet: a glyph in a carved well, a title, a sentence
/// and the way out.
public struct PaneEmptyState<Actions: View>: View {
  let systemImage: String; let title: String; let message: String?; let actions: Actions
  public init(systemImage: String, title: String, message: String? = nil, @ViewBuilder actions: () -> Actions = { EmptyView() }) { self.systemImage = systemImage; self.title = title; self.message = message; self.actions = actions() }
  public var body: some View {
    VStack(spacing: PaneTokens.emptyStateGap) {
      Image(systemName: systemImage).font(.system(size: PaneTokens.emptyStateIcon)).foregroundStyle(PaneTokens.textSecondary.color)
        .frame(width: PaneTokens.emptyStateWell, height: PaneTokens.emptyStateWell)
        .background(Circle().fill(PaneTokens.emptyStateWellBg.color)).paneShadow(PaneTokens.emptyStateWellCarve, in: Circle()).accessibilityHidden(true)
      Text(title).paneFont(.title, weight: PaneTokens.typeWeightSemibold).foregroundStyle(PaneTokens.textPrimary.color).accessibilityAddTraits(.isHeader)
      if let m = message { Text(m).paneFont(.body).foregroundStyle(PaneTokens.textSecondary.color).multilineTextAlignment(.center) }
      actions.padding(.top, PaneTokens.emptyStateGap)
    }
    .padding(PaneTokens.emptyStatePadding).frame(maxWidth: .infinity)
  }
}
