import type { RouteRecordRaw } from "vue-router";
export interface FitWebConfig {
    lock: string;
    routes: RouteRecordRaw[];
}
export declare function createFitWeb(config: FitWebConfig): void;
export default createFitWeb;
