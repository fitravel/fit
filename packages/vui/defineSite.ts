import { type RouteRecordRaw } from "vue-router"

export type BuildHookFn = (config?: SiteConfig) => Promise<void>
export type SiteRoute   = Omit<RouteRecordRaw, 'component'> & { view: string; }
export type BuildHook   = 'beforeInit'|'beforeApp'|'beforeCleanup'|'afterInit'|'afterApp'|'afterCleanup'

export interface BuildHooks {
	'beforeInit'?: BuildHookFn;
	'afterInit'?: BuildHookFn;
	'beforeApp'?: BuildHookFn;
	'afterApp'?: BuildHookFn;
	'beforeCleanup'?: BuildHookFn;
	'afterCleanup'?: BuildHookFn;
} 

export interface SiteConfig {
	'title'?: string;
	'kit'?: string;
	'janus'?: string;
	'baseURL': string;
	'fathom'?: string;
	'history'?: 'hash'|'html5';
}

export const defineSite = (i: SiteConfig): SiteConfig => i as SiteConfig

export default defineSite