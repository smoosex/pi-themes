# pi-themes

A theme pack for [pi](https://github.com/earendil-works/pi), with automatic light/dark switching for paired theme families.

This package currently includes Everforest. More theme families can be added later by following the same `<family>-light` / `<family>-dark` naming convention.

## Included themes

### Everforest

Medium contrast, default family:

- `everforest-dark`
- `everforest-light`

Hard contrast:

- `everforest-hard-dark`
- `everforest-hard-light`

Soft contrast:

- `everforest-soft-dark`
- `everforest-soft-light`

## Auto switching

The bundled extension switches between `<family>-dark` and `<family>-light` based on the current system appearance.

The default family is currently `everforest`, which maps to the medium contrast Everforest pair. Future theme families should use the same naming convention to opt into automatic switching.

Supported detection:

- macOS: System Appearance via `osascript`
- Linux GNOME: `gsettings org.gnome.desktop.interface color-scheme`
- Other platforms: defaults to dark

Environment overrides:

```bash
PI_THEME=everforest       # medium contrast
PI_THEME=everforest-hard  # hard contrast
PI_THEME=everforest-soft  # soft contrast
PI_THEME_APPEARANCE=dark  # or light
PI_THEME_POLL_INTERVAL_MS=2000
```

## Usage

Test locally:

```bash
pi -e ./pi-themes
```

Install globally:

```bash
pi install /absolute/path/to/pi-themes
```

Install for a project:

```bash
pi install ./pi-themes -l
```

## Commands

Set the active auto-switching theme family:

```text
/theme everforest
/theme everforest-hard
/theme everforest-soft
```

The command works with any family that provides both `<family>-light` and `<family>-dark`. For example, if a future `tokyonight-light` / `tokyonight-dark` pair is added, it can be selected with:

```text
/theme tokyonight
```
