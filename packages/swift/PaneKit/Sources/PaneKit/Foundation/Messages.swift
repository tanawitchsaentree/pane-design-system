import SwiftUI

/// Every word a PaneKit component shows or speaks on its own, so a Thai app never shows English.
/// Inject with `.paneMessages(.thai)`; English is the default.
public struct PaneMessages: Sendable {
  public var loading: String; public var dismiss: String; public var showPassword: String; public var hidePassword: String
  public var clearSearch: String; public var required: String; public var decrease: @Sendable (String) -> String; public var increase: @Sendable (String) -> String
  public var of: @Sendable (Int, Int) -> String; public var above: String; public var below: String; public var levelWith: String
  public var almostFull: String; public var full: String; public var stepOf: @Sendable (Int, Int) -> String; public var nothingToShow: String
  public var back: String; public var close: String; public var on: String; public var off: String

  public static let english = PaneMessages(loading: "Loading", dismiss: "Dismiss", showPassword: "Show password", hidePassword: "Hide password",
    clearSearch: "Clear search", required: "required", decrease: { "Decrease \($0)" }, increase: { "Increase \($0)" },
    of: { "\($0) of \($1)" }, above: "above", below: "below", levelWith: "level with", almostFull: "Almost full", full: "Full",
    stepOf: { "Step \($0) of \($1)" }, nothingToShow: "Nothing to show yet", back: "Back", close: "Close", on: "On", off: "Off")

  public static let thai = PaneMessages(loading: "กำลังโหลด", dismiss: "ปิด", showPassword: "แสดงรหัสผ่าน", hidePassword: "ซ่อนรหัสผ่าน",
    clearSearch: "ล้างคำค้นหา", required: "จำเป็น", decrease: { "ลด\($0)" }, increase: { "เพิ่ม\($0)" },
    of: { "\($0) จาก \($1)" }, above: "สูงกว่า", below: "ต่ำกว่า", levelWith: "เท่ากับ", almostFull: "ใกล้เต็ม", full: "เต็ม",
    stepOf: { "ขั้นที่ \($0) จาก \($1)" }, nothingToShow: "ยังไม่มีข้อมูล", back: "ย้อนกลับ", close: "ปิด", on: "เปิด", off: "ปิด")
}

private struct PaneMessagesKey: EnvironmentKey { static let defaultValue = PaneMessages.english }
public extension EnvironmentValues { var paneMessages: PaneMessages { get { self[PaneMessagesKey.self] } set { self[PaneMessagesKey.self] = newValue } } }
public extension View {
  /// Sets the language of every PaneKit component below: `.english` (default) or `.thai`, or your own.
  func paneMessages(_ messages: PaneMessages) -> some View { environment(\.paneMessages, messages) }
}
