export declare function useAlerts(scope?: string): {
    alerts: import("vue").ComputedRef<{
        type: string;
        message: string;
        index: number;
        isDismissed: boolean;
    }[]>;
    alert: (message: string, type?: string) => {
        type: string;
        message: string;
        index: number;
        isDismissed: boolean;
    };
    dismiss: (index: number) => {
        type: string;
        message: string;
        index: number;
        isDismissed: boolean;
    } | null;
    clear: () => void;
};
export default useAlerts;
