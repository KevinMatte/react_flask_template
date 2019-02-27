
export const ID_TOKEN_KEY = 'sessionid_token';

function getIdToken() {
    return sessionStorage.getItem(ID_TOKEN_KEY);
}

export function isLoggedIn() {
    const idToken = getIdToken();
    return !!idToken;
}

function getFetchHeaders() {
    let headers = {
        "Content-Type": "application/json",
    };
    if (isLoggedIn())
        headers["Authorization"] = `Bearer ${getIdToken()}`;
    return headers;
}

export function apiFetch(method, url, postData = {}) {
    let headers = getFetchHeaders();
    let init = {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: headers,
        redirect: "error", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
    };
    if (method === "POST" || method === "PUT" || method === "PATCH")
        init.body = JSON.stringify(postData);

    return fetch(url, init).then((response) => {
        if (response.ok)
            return Promise.all([response, response.json()]);
        else
            return Promise.reject(response);
    }).then(([response2, data]) => {
        if (response2.ok) {
            return data;
        } else {
            return {status: data.status, result: response2.statusText};
        }
    }).catch(result => {
        return Promise.resolve({status: "error", result});
    });
}

