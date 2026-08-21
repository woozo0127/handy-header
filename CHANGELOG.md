# Changelog

## 0.3.0

### Changed

- Redirect rules now always substitute the URL: a `match` with no wildcard is
  treated as a prefix, and the tail it captures is appended to the `target`.
  Rules that used to match one exact URL now match everything under that prefix.

### Fixed

- Two slashes in a row rendered as one in the code-font fields. Ligatures are
  now disabled on `.mono`.

## 0.2.0

### Added

- Open the full-tab view from the right-click options menu.

### Fixed

- Pasted text no longer carries formatting in from the clipboard.

## 0.1.0

Initial release.

### Added

- Request and response header rules, each with its own on/off switch.
- URL redirect rules with wildcard capture and substitution.
- Profiles: switch, add, rename, delete, and JSON export/import.
- Global on/off toggle and a badge showing the active rule count.
- Automatic declarativeNetRequest sync whenever a rule changes.
