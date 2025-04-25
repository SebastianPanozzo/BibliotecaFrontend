const hashString = async (text) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

const login = async (data) => {
    const { password, email } = data;

    try {
        const api_key = import.meta.env.VITE_API_KEY;

        const passwordHashed = await hashString(password);
        let body = [{ "$match": { "type": "user", "props.email": email, "props.password": passwordHashed } }]

        let res = await fetch(
            "https://back-production-3d53.up.railway.app/api/findObjects",
            { method: 'POST', headers: { 'api-key': api_key, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
        );

        let response = await res.json();
        if (response.items[0]) {
            return {ok: {data: response.items[0]}}
        } else {
            return { err: "Correo o contraseña incorrectos" }
        }
    } catch (err) {
        return { err: err.message }
    }
}

export default login;