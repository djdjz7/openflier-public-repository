---
outline: deep
---

# Changelogs
## Latest Version
### 1.1.2
- Feature: Kill other processes and continue.
- Feature: Revert text color.
- UI: Refactored settings UI.
- UI: ConnectCode Label in system tray now uses StyleSet01 of Inter.

## Earlier Versions
### 1.1.1
- Feature: Language switch.
- UI: ConnectCode Label now uses StyleSet01 of Inter.
- Fix: Horizontal scrollbar is reversed.
- Fix: CommandInput user is not updated after config has been modified.
- Fix: Now kills OpenFlier before installing plugins.
- Fix: Auto update failed.
- Misc: Removed debug message.
- Misc: Removed Insider label.

### 1.1.0
- **BREAKING CHANGE:** Modified `ICommandInputPlugin` and `IMqttServicePlugin` to add `BeforeExit()` hook.
- Feature: Detect currently running processes.

### 1.0.1
- Feature: Throws exceptions occured in plugins to user.
- UI: Hide scrollbar when page is not scrollable.
- Fix: MQTT Server not fully quit.

### 1.0.0
- Initial release.