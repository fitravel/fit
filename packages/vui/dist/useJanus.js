import { useStorage } from "@vueuse/core";
import { getProps } from "./getProps";
import { curry } from "ramda";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
const dummyUser = () => ({
    id: 0,
    name: '',
    email: '',
    roles: {
        isSales: false,
        isMarketing: false,
        isAdmin: false
    },
    isActive: false
});
const dummyAuth = () => ({
    token: '',
    lock: '',
    isConfirmed: false,
    isActive: false
});
const user = ref(dummyUser());
const auth = ref(dummyAuth());
const token = useStorage('JANUS', '');
const lock = ref('');
const url = ref('');
const isLoggingIn = ref(false);
const isInitialized = ref(false);
export function useJanus(lockArg, urlArg) {
    const { janus = '' } = useRoute().query;
    const endpoint = 'https://api.fitravel.info/janus'; //'http://localhost:8888/janus'/
    lock.value = lockArg ?? lock.value;
    url.value = urlArg ?? url.value;
    const reset = () => {
        user.value = dummyUser();
        auth.value = dummyAuth();
        token.value = '';
        return getProps({ token, auth, user });
    };
    const request = curry(async (method, payload) => {
        const config = { method, body: JSON.stringify(getProps(payload)) };
        const load = await fetch(endpoint, config).then(i => i.json());
        if (load.success) {
            user.value = load?.user ?? user.value;
            auth.value = load?.auth ?? auth.value;
            token.value = load?.token ?? token.value;
        }
        if (!load.success && method === 'POST')
            reset();
        return load;
    });
    const authentication = (body) => {
        if (!lock.value)
            return reset();
        return request('POST', { lock, ...body });
    };
    const action = (action) => (update) => request('PATCH', { token, action, update });
    const actions = {
        enableUser: action('enable_user'),
        disableUser: action('disable_user'),
        enableAuth: action('enable_auth'),
        disableAuth: action('disable_auth'),
        updateUser: action('update_user')
    };
    const requestToken = (email) => authentication({ email, url });
    const login = async () => {
        isLoggingIn.value = true;
        await authentication({ token });
        isLoggingIn.value = false;
    };
    const logout = async () => {
        await actions.disableAuth();
        reset();
    };
    const isLoggedIn = computed(() => (token.value && auth.value.token) && (token.value === auth.value.token));
    if (janus && !token.value)
        token.value = janus;
    if (token.value && !auth.value.token && !isLoggingIn.value && !isInitialized.value) {
        login();
        isInitialized.value = true;
    }
    return { user, auth, ...actions, requestToken, login, logout, isLoggedIn, isLoggingIn, isInitialized };
}
//# sourceMappingURL=useJanus.js.map