import { useState, useEffect } from "react"
import useFetchData from "../../../hooks/useFetchData"
import { queryUserRoles } from "../../../utiles/querys"
import DinamicModal from "../../../components/DinamicModal"
const currentUser = JSON.parse(localStorage.getItem("currentUser"));


export default function Index() {
    const { trigger } = useFetchData("/api/findRelations");
    const { trigger: deleteRelation } = useFetchData(`/api/deleteRelation`);
    const [roles, setRoles] = useState()
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetch = async () => {
            try {

                const data = await trigger({
                    method: 'POST',
                    body: queryUserRoles,
                    headers: { "Authorization": currentUser.token }
                });
                setRoles(data.items);
            } catch (err) {
                console.error('Error al hacer la request:', err.message);
            }

        }
        fetch()
    }, [trigger]);

    const filteredRoles = roles?.filter((rol) => {
        const fullName = `${rol.user.name} ${rol.user.last_name}`.toLowerCase();
        return fullName.includes(search.toLowerCase());
    });


    const [relationDeleted, setRelationDeleted] = useState(false);
    const [errorDeleting, setErrorDeleting] = useState(null);
    const handleRemoveRelation = async (id) => {
        try {
            await deleteRelation({
                method: 'DELETE',
                id: `/${id}`,
                body: {},
                headers: { "Authorization": currentUser.token }
            });
            setRelationDeleted(true);
            setTimeout(() => window.location.reload(), 1500);
        } catch {
            setErrorDeleting("Error al eliminar el rol");
        }
    }

    return (
        <div className="m-0 row">
            {/* Encabezado */}
            <div className="m-0 row col-12 p-2 px-0 bg-white rounded shadow-sm">
                <div className="col-md-7 col-lg-8 col-xl-9 mb-2 m-md-0">
                    <h3>Administración de Personal</h3>
                </div>
                <div className="col-md-5 col-lg-4 col-xl-3 d-flex">
                    <input
                        type="text"
                        placeholder="Nombre del Usuario"
                        className="form-control me-2"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button className="btn btn-success d-flex" data-bs-toggle="modal" data-bs-target="#newRole">Nuevo</button>
                </div>
            </div>

            <Modal />

            {/* Lista de Roles */}
            <div className="p-0 col-12 mt-3">
                {filteredRoles?.map((rol) => (
                    <div
                        key={rol._id}
                        className="d-flex flex-column flex-md-row align-items-md-center justify-content-between bg-white mb-3 p-3 rounded shadow-sm"
                    >
                        {/* Imagen */}
                        <div className="mb-3 mb-md-0 me-md-3 text-center" style={{ minWidth: '64px' }}>
                            <img
                                src={rol.user.image || "https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg"}
                                alt={rol.user.name}
                                className="rounded-circle"
                                style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                            />
                        </div>

                        {/* Datos del Usuario */}
                        <div className="flex-grow-1 text-center text-md-start mb-3 mb-md-0">
                            <div className="fw-bold">{rol.user.name} {rol.user.last_name}</div>
                            <div className="text-muted" style={{ fontSize: '0.9rem' }}>{rol.user.email}</div>
                        </div>

                        {/* Rol */}
                        <div className="text-center text-md-start mb-2 mb-md-0 me-md-2">
                            <span className="rounded bg-success bg-opacity-75 p-2 text-white">{rol.role}</span>
                        </div>

                        {/* Botón Eliminar */}
                        <div className="text-center text-md-end">
                            <button className="btn btn-sm btn-outline-danger" data-bs-toggle="modal" data-bs-target={`#${rol._id}`}>
                                Eliminar
                            </button>
                        </div>
                        <DinamicModal id={rol._id} title={"Eliminar Rol"}>
                            <p className="text-center mb-4">¿Estas seguro de eliminar el rol del usuario <strong>{rol.user.name} {rol.user.last_name}</strong>?</p>
                            <div className="d-flex justify-content-center">
                                <button className="btn btn-success" onClick={() => handleRemoveRelation(rol._id)}>
                                    Eliminar Rol
                                </button>
                            </div>
                            {relationDeleted && (
                                <div className="alert alert-success mt-3 text-center">
                                    Rol eliminado correctamente
                                </div>
                            )}

                            {errorDeleting && (
                                <div className="alert alert-danger mt-3 text-center">
                                    {errorDeleting}
                                </div>
                            )}
                        </DinamicModal>
                    </div>
                ))}
            </div>
        </div>
    );
}


const Modal = () => {
    const { trigger: getUsers } = useFetchData("/api/findUsers");
    const { trigger: getRoles } = useFetchData("/api/findObjects");
    const { trigger: createRelation } = useFetchData("/api/createRelation");
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersResponse = await getUsers({
                    method: 'POST',
                    body: [],
                    headers: { "Authorization": currentUser.token }
                });
                setUsers(usersResponse.items);
                setFilteredUsers(usersResponse.items);

                const rolesResponse = await getRoles({
                    method: 'POST',
                    body: [
                        {
                            "$match": {
                                "type": "role",
                                "owner": "6819fccf6b483e8f69f3ca15"
                            }
                        }
                    ],
                    headers: { "Authorization": currentUser.token }
                });
                setRoles(rolesResponse.items);

            } catch (err) {
                console.error('Error al hacer la request:', err.message);
            }
        }
        fetchData();
    }, [getUsers, getRoles]);

    useEffect(() => {
        if (search) {
            const filtered = users.filter(user =>
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.last_name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    }, [search, users]);

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setShowUserDropdown(false);
        setSearch(`${user.name} ${user.last_name} (${user.email})`);
    };

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
    };

    const [relationCreated, setRelationCreated] = useState(null);
    const [isError, setIsError] = useState(false);

    const handleSave = async () => {
        if (selectedUser && selectedRole) {
            try {
                await createRelation({
                    method: 'POST',
                    body: {
                        "type": "has_role",
                        "from": selectedUser._id,
                        "to": selectedRole._id,
                        "owner": "6819fccf6b483e8f69f3ca15"
                    },
                    headers: { "Authorization": currentUser.token }
                });

                setRelationCreated("Rol asignado correctamente");
                setIsError(false);

                // Recargar después de 1.5 segundos (para que el usuario vea el mensaje)
                setTimeout(() => {
                    window.location.reload();
                }, 1500);

            } catch (error) {
                setRelationCreated("Error al asignar el rol");
                setIsError(true);
                console.error("Error al crear relación:", error);
            }
        } else {
            setRelationCreated("Por favor selecciona un usuario y un rol");
            setIsError(true);
        }
    };

    return (
        <DinamicModal id={"newRole"} title={"Asignar Rol"}>
            <div className="container-fluid p-3">
                {/* Selector de usuario con búsqueda */}
                <div className="form-group mb-3">
                    <label className="form-label">Buscar Usuario</label>
                    <div className="dropdown">
                        <input
                            type="text"
                            className="form-control"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setShowUserDropdown(true);
                            }}
                            onFocus={() => setShowUserDropdown(true)}
                            placeholder="Buscar por nombre, apellido o email"
                        />
                        {showUserDropdown && filteredUsers.length > 0 && (
                            <div className="dropdown-menu show w-100" style={{ maxHeight: "200px", overflowY: "auto" }}>
                                {filteredUsers.map(user => (
                                    <button
                                        key={user._id}
                                        type="button"
                                        className="dropdown-item"
                                        onClick={() => handleUserSelect(user)}
                                    >
                                        <div className="fw-bold">{user.name} {user.last_name}</div>
                                        <small className="text-muted">{user.email}</small>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Selector de rol con dropdown */}
                <div className="form-group mb-4">
                    <label className="form-label">Seleccionar Rol</label>
                    <select
                        className="form-select"
                        value={selectedRole?._id || ""}
                        onChange={(e) => {
                            const role = roles.find(r => r._id === e.target.value);
                            handleRoleSelect(role);
                        }}
                    >
                        <option value="">Selecciona un rol</option>
                        {roles.map(role => (
                            <option key={role._id} value={role._id}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Botón para guardar */}
                <div className="d-grid">
                    <button
                        onClick={handleSave}
                        className="btn btn-success"
                    >
                        Asignar Rol
                    </button>
                </div>

                {/* Mensaje de feedback */}
                {relationCreated && (
                    <div className={`alert ${isError ? 'alert-danger' : 'alert-success'} mt-3 text-center`}>
                        {relationCreated}
                    </div>
                )}
            </div>
        </DinamicModal>
    );
};