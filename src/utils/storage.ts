
function hasConsent(): boolean {
    try {
        return document.cookie
            .split("; ")
            .some((row) => row === "cookie-consent=accepted");
    } catch {
        return false;
    }
}

export function setStorage(key: string, value: any) {
    if (!hasConsent()) return;
    localStorage.setItem(key, JSON.stringify(value));
}

export function getStorage(key: string) {
    const value = localStorage.getItem(key)
    if (value) {
        try {
            return JSON.parse(value)
        } catch (e) {
            return null
        }
    }
    return null
}

export function removeStorage(key: string) {
    localStorage.removeItem(key)
}

export function clearStorage() {
    localStorage.clear()
}
