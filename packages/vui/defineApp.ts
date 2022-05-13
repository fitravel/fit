import { type RouteRecordRaw } from "vue-router";

export type BuildHook = (config?: AppConfig) => Promise<void>

export interface AppConfig {
	title?: string;
	kit?: string;
	janus?: string;
	baseURL: string;
	fathom?: string;
	routes?: RouteRecordRaw[];
	beforeBuild?: BuildHook;
	afterBuild?: BuildHook;
}

export const defineApp = (i: AppConfig): AppConfig => i as AppConfig

export default defineApp