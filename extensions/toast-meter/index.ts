import fs from "node:fs";
import path from "node:path";
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

const WIDGET_KEY = "smart-dumb-zone-indicator";
const DEFAULT_CONFIG_PATH = path.join(__dirname, "config.default.json");
const PROJECT_CONFIG_PATH = path.join(process.cwd(), ".pi", "toast-meter.json");
const DEFAULT_REFRESH_MS = 2000;

type IndicatorConfig = {
	mode?: "de" | "en";
	refreshIntervalMs?: number;
	showText?: boolean;
	label?: string;
	levels?: Partial<Record<1 | 2 | 3 | 4 | 5, number>>;
};

type Preset = {
	labels: [string, string, string, string, string, string];
	icons: [string, string, string, string, string, string];
	thresholds: [number, number, number, number, number];
};

const PRESETS: Record<NonNullable<IndicatorConfig["mode"]>, Preset> = {
	de: {
		labels: ["Smart Zone", "Langsam bröckelt’s", "Context Rot", "Dumb Zone", "Dumm wie Brot", "House is on fire"],
		icons: ["🧠🧠🧠🧠", "🧠🧠🧠🍞", "🧠🧠🍞🍞", "🧠🍞🍞🍞", "🍞🍞🍞🍞", "🏠🔥"],
		thresholds: [80e3, 100e3, 120e3, 140e3, 150e3],
	},
	en: {
		labels: ["Smart Zone", "Getting Toasty", "Context Rot", "Dumb Zone", "Dumb as a Brick", "House is on fire"],
		icons: ["🧠🧠🧠🧠", "🧠🧠🧠🧱", "🧠🧠🧱🧱", "🧠🧱🧱🧱", "🧱🧱🧱🧱", "🏠🔥"],
		thresholds: [80e3, 100e3, 120e3, 140e3, 150e3],
	},
};

const DEFAULT_MODE: NonNullable<IndicatorConfig["mode"]> = "en";

function readJsonConfig(configPath: string): IndicatorConfig {
	try {
		const raw = fs.readFileSync(configPath, "utf8");
		return JSON.parse(raw) as IndicatorConfig;
	} catch {
		return {};
	}
}

function readConfig(): IndicatorConfig {
	const defaults = readJsonConfig(DEFAULT_CONFIG_PATH);
	const project = readJsonConfig(PROJECT_CONFIG_PATH);
	return {
		...defaults,
		...project,
		levels: {
			...(defaults.levels ?? {}),
			...(project.levels ?? {}),
		},
	};
}

function buildLevels(config: IndicatorConfig): { at: number; icon: string; label: string }[] {
	const mode = config.mode ?? DEFAULT_MODE;
	const preset = PRESETS[mode];
	const thresholds = preset.thresholds.map((fallback, index) => config.levels?.[(index + 1) as 1 | 2 | 3 | 4 | 5] ?? fallback);
	return [
		{ at: 0, icon: preset.icons[0], label: preset.labels[0] },
		...thresholds.map((at, index) => ({ at, icon: preset.icons[index + 1], label: preset.labels[index + 1] })),
	];
}

function formatStatus(ctx: ExtensionContext, config: IndicatorConfig): string {
	const usage = ctx.getContextUsage();
	const tokens = usage?.tokens ?? null;
	const theme = ctx.ui.theme;
	const levels = buildLevels(config);
	const fallbackLabel = config.label ?? levels[0]?.label ?? "Smart Zone";

	if (tokens === null) {
		return theme.fg("muted", `${fallbackLabel}: ?`);
	}

	const k = Math.round(tokens / 1000);
	const showText = config.showText ?? false;
	const current = levels.reduce((acc, level) => (tokens >= level.at ? level : acc), levels[0]);
	const isFinalStage = tokens >= (levels[levels.length - 1]?.at ?? Number.MAX_SAFE_INTEGER);
	const value = theme.fg("muted", `${k}k`);
	const iconPart = theme.fg(isFinalStage ? "error" : tokens >= 100e3 ? "warning" : "success", current?.icon ?? "🍞");
	if (!showText) return `${value} ${iconPart}`;
	const textLabel = config.label ?? current?.label ?? fallbackLabel;
	return `${value} ${iconPart} ${theme.fg("dim", "•")} ${theme.fg("muted", textLabel)}`;
}

export default function (pi: ExtensionAPI) {
	let timer: ReturnType<typeof setInterval> | null = null;

	const stopTimer = () => {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	};

	const refresh = (ctx: ExtensionContext) => {
		if (!ctx.hasUI) return;
		const config = readConfig();
		ctx.ui.setStatus(WIDGET_KEY, formatStatus(ctx, config));
	};

	pi.on("session_start", (_event, ctx) => {
		refresh(ctx);
		stopTimer();
		const config = readConfig();
		const refreshMs = config.refreshIntervalMs ?? DEFAULT_REFRESH_MS;
		timer = setInterval(() => refresh(ctx), refreshMs);
	});

	pi.on("turn_end", (_event, ctx) => refresh(ctx));
	pi.on("model_select", (_event, ctx) => refresh(ctx));
	pi.on("session_shutdown", (_event, ctx) => {
		stopTimer();
		if (ctx.hasUI) ctx.ui.setStatus(WIDGET_KEY, undefined);
	});
}
