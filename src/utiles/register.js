const hashString = async (text) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

const register = async (data) => {
    const { name, last_name, password1, password2, email } = data;

    if (!name || !last_name || !password1 || !password2 || !email) return { err: "Todos los campos son obligatorios" };
    if (password1 !== password2) return { err: "Las contraseñas no coinciden" };
    if (password1.length < 6) return { err: "La contraseña debe tener al menos 6 caracteres" };

    try {
        const api_key = import.meta.env.VITE_API_KEY;

        //primera consulta, que no exista un usuario con ese email
        let body = [{ "$match": { "type": "user", "props.email": email } }]
        let res = await fetch(
            "https://back-production-3d53.up.railway.app/api/findObjects",
            { method: 'POST', headers: { 'api-key': api_key, 'Content-Type': 'application/json' }, body: JSON.stringify(body)}
        );
        let response = await res.json();
        if (response.items[0]) return { err: "Ya existe un usuario con ese email" }

        //crear el usuario
        const passwordHashed = await hashString(password1);
        const user = {
            "type": "user",
            "name": name,
            "props": {
                "full_name": `${name} ${last_name}`,
                "email": email,
                "password": passwordHashed
            }
        }
        const res2 = await fetch(
            "https://back-production-3d53.up.railway.app/api/createObject",
            { method: 'POST', headers: { 'api-key': api_key, 'Content-Type': 'application/json' }, body: JSON.stringify(user) }
        );
        const response2 = await res2.json();
        const userData = response2.item;
        if(userData) {
            return {ok: {message: "Usuario creado correctamente", data: userData}}
        } else {
            return { err: "Error al crear el usuario" }
        }

    } catch (err) {
        return { err: err.message }
    }
}

export default register;