import { createAuth0Client } from "@auth0/auth0-spa-js";
import { reactive, computed } from "vue";
import axios from "axios";

let client;
const state = reactive({
    loading: true,
    isAuthenticated: false,
    user: {},
    userDatabase: {},
    error: null
})

async function handleRedirectCallback() {
    state.loading = true;

    try {
        await client.handleRedirectCallback();
        state.user = await client.getUser();
        state.isAuthenticated = true
    } catch (e) {
        state.error = e;
    } finally {
        state.loading = false;
    }

}

function loginWithRedirect(o) {
    return client.loginWithRedirect(o)
}

function getTokenSilently(o) {
    return client.getTokenSilently(o);
}

function logout(o) {
    return client.logout(o);
}

async function getUserID() {
    state.loading = true;

    try {
        // Garante que o usuário está autenticado
        if (!state.isAuthenticated) {
            await handleRedirectCallback();
        }
        const user = await client.getUser();
        state.user = user;
        state.isAuthenticated = true;
        return user.sub; // Retorna o ID do usuário
    } catch (e) {
        state.error = e;
    } finally {
        state.loading = false;
    }
}

const authPlugin = {
    isAuthenticated: computed(() => state.isAuthenticated),
    loading: computed(() => state.loading),
    user: computed(() => state.user),
    getTokenSilently,
    loginWithRedirect,
    logout,
    handleRedirectCallback,
    getUserID
}

const routeGuard = (to, from, next) => {
    const { isAuthenticated, loading, loginWithRedirect } = authPlugin;

    const verify = () => {
        if (to.meta.unprotected) return next();

        if (isAuthenticated.value) {
            const redirect_uri = localStorage.getItem("post_login_redirect_uri");
            if (redirect_uri) {
                localStorage.removeItem("post_login_redirect_uri");
                return next(redirect_uri);
            }
            return next()
        }

        localStorage.setItem("post_login_redirect_uri", to.fullPath);

        loginWithRedirect({ appState: { targetUrl: to.fullPath } });
        // if (state.isAuthenticated == false) {
        //     console.log("false", isAuthenticated.value);
        //     loginWithRedirect();
        //     isAuthenticated.value = true;
    }

    if (!loading.value) {
        return verify();
    }

    watchEffect(() => {
        if (loading.value === false) {
            return verify();
        }
    });
}



async function init(options) {
    client = await createAuth0Client({
        domain: options.domain,
        clientId: options.clientId,
        authorizationParams: {
            redirect_uri: options.redirectUri
        }
    });

    try {
        if (window.location.search.includes("code=") || window.location.search.includes("state=")) {
            const { appState } = await client.handleRedirectCallback();
            options.onRedirectCallback(appState);
        }

    } catch (error) {
        state.error = error;
    } finally {
        window.history.replaceState({}, document.title, window.location.pathname)
        state.isAuthenticated = await client.isAuthenticated();
        state.user = await client.getUser();
        // state.userDatabase = await getUserOnDatabase();
        sessionStorage.setItem("user", JSON.stringify(state.user));
        // sessionStorage.setItem("userDatabase", JSON.stringify(state.userDatabase));
        state.loading = false;
    }

    return {
        install: app => {
            app.provide("Auth", authPlugin);
        }
    }
}

export default { init, routeGuard }