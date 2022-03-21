declare type UserUpdate = {
    name?: string;
    isSales?: boolean;
    isMarketing?: boolean;
    isAdmin?: boolean;
};
export declare function useJanus(lockArg?: string, urlArg?: string): {
    requestToken: (email: string) => Record<string, string> | Promise<any>;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    isLoggedIn: import("vue").ComputedRef<boolean | "">;
    isLoggingIn: import("vue").Ref<boolean>;
    isInitialized: import("vue").Ref<boolean>;
    enableUser: (update?: UserUpdate | undefined) => Promise<any>;
    disableUser: (update?: UserUpdate | undefined) => Promise<any>;
    enableAuth: (update?: UserUpdate | undefined) => Promise<any>;
    disableAuth: (update?: UserUpdate | undefined) => Promise<any>;
    updateUser: (update?: UserUpdate | undefined) => Promise<any>;
    user: import("vue").Ref<{
        id: number;
        name: string;
        email: string;
        roles: {
            isSales: boolean;
            isMarketing: boolean;
            isAdmin: boolean;
        };
        isActive: boolean;
    }>;
    auth: import("vue").Ref<{
        token: string;
        lock: string;
        isConfirmed: boolean;
        isActive: boolean;
    }>;
};
export {};
