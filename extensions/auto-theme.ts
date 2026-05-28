import { exec } from "node:child_process";
import { promisify } from "node:util";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

const execAsync = promisify(exec);

const DEFAULT_FAMILY = process.env.PI_THEME || "everforest";
const POLL_INTERVAL_MS = Number(process.env.PI_THEME_POLL_INTERVAL_MS || "2000");

type Appearance = "dark" | "light";

async function getSystemAppearance(): Promise<Appearance> {
	const override = process.env.PI_THEME_APPEARANCE?.toLowerCase();
	if (override === "dark" || override === "light") return override;

	if (process.platform === "darwin") {
		try {
			const { stdout } = await execAsync(
				"osascript -e 'tell application \"System Events\" to tell appearance preferences to return dark mode'",
			);
			return stdout.trim() === "true" ? "dark" : "light";
		} catch {
			return "dark";
		}
	}

	if (process.platform === "linux") {
		try {
			const { stdout } = await execAsync(
				"gsettings get org.gnome.desktop.interface color-scheme 2>/dev/null || true",
			);
			return stdout.toLowerCase().includes("dark") ? "dark" : "light";
		} catch {
			return "dark";
		}
	}

	return "dark";
}

function pairedThemeName(family: string, appearance: Appearance): string {
	return `${family}-${appearance}`;
}

async function applyTheme(ctx: ExtensionContext, family: string, previous: Appearance | null) {
	const appearance = await getSystemAppearance();
	if (appearance === previous) return previous;

	const themeName = pairedThemeName(family, appearance);
	if (!ctx.ui.getTheme(themeName)) {
		ctx.ui.notify(`pi-themes: theme not found: ${themeName}`, "warning");
		return previous;
	}

	const result = ctx.ui.setTheme(themeName);
	if (!result.success) {
		ctx.ui.notify(`pi-themes: failed to switch theme: ${result.error}`, "error");
		return previous;
	}

	ctx.ui.setStatus("pi-themes", ctx.ui.theme.fg("accent", `theme:${themeName}`));
	return appearance;
}

export default function (pi: ExtensionAPI) {
	let intervalId: ReturnType<typeof setInterval> | null = null;
	let currentAppearance: Appearance | null = null;
	let currentFamily = DEFAULT_FAMILY;

	pi.on("session_start", async (_event, ctx) => {
		currentAppearance = await applyTheme(ctx, currentFamily, currentAppearance);

		intervalId = setInterval(() => {
			void applyTheme(ctx, currentFamily, currentAppearance).then((appearance) => {
				currentAppearance = appearance;
			});
		}, POLL_INTERVAL_MS);
	});

	pi.registerCommand("theme", {
		description: "Set auto-switching theme family, e.g. everforest",
		handler: async (args, ctx) => {
			const family = args.trim();
			if (!family) {
				ctx.ui.notify(`Current theme family: ${currentFamily}`, "info");
				return;
			}

			const lightName = pairedThemeName(family, "light");
			const darkName = pairedThemeName(family, "dark");
			if (!ctx.ui.getTheme(lightName) || !ctx.ui.getTheme(darkName)) {
				ctx.ui.notify(
					`Theme family \"${family}\" needs both ${lightName} and ${darkName}`,
					"error",
				);
				return;
			}

			currentFamily = family;
			currentAppearance = null;
			currentAppearance = await applyTheme(ctx, currentFamily, currentAppearance);
			ctx.ui.notify(`Theme family set to: ${currentFamily}`, "info");
		},
	});

	pi.on("session_shutdown", () => {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
	});
}
