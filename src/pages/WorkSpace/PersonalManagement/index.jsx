import { useState, useEffect } from "react"
import useFetchData from "../../../hooks/useFetchData"
import { queryUserRoles } from "../../../utiles/querys"
import DinamicModal from "../../../components/DinamicModal"

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

export default function Index() {
    const { trigger, isMutating } = useFetchData("/api/findRelations");
    const { trigger: deleteRelation } = useFetchData(`/api/deleteRelation`);
    const [roles, setRoles] = useState();
    const [search, setSearch] = useState("");
    const [relationDeleted, setRelationDeleted] = useState(false);
    const [errorDeleting, setErrorDeleting] = useState(null);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const data = await trigger({
                    method: 'POST',
                    body: queryUserRoles,
                    headers: { "Authorization": currentUser.token }
                });
                setRoles(data.items);
            } catch (err) {
                console.error('Error al hacer la request:', err.message);
                // Considera mostrar un mensaje de error al usuario aquí
            }
        }
        fetchRoles();
    }, [trigger]);

    const filteredRoles = roles?.filter((rol) => {
        const fullName = `${rol.user.name} ${rol.user.last_name} ${rol.user.email} ${rol.role}`.toLowerCase();
        return fullName.includes(search.toLowerCase());
    });

    const handleRemoveRelation = async (id) => {
        try {
            await deleteRelation({
                method: 'DELETE',
                id: `/${id}`,
                body: {},
                headers: { "Authorization": currentUser.token }
            });
            setRelationDeleted(true);
            setErrorDeleting(null);
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            console.error("Error al eliminar el rol:", error);
            setErrorDeleting("Error al eliminar el rol. Inténtalo de nuevo.");
            setRelationDeleted(false);
        }
    }

    return (
        <div className="container-fluid p-0">
            {/* Encabezado */}
            <div className="row m-0 mb-3">
                <div className="col-12 bg-white shadow-sm p-3 rounded border-start border-success border-4">
                    <h3 className="text-success fw-bold mb-0">Administración de Personal</h3>
                </div>
            </div>

            {/* Búsqueda y botón nuevo */}
            <div className="row m-0 mb-3">
                <div className="col-12 bg-white shadow-sm p-3 rounded">
                    <div className="d-flex flex-column flex-md-row gap-3 align-items-center">
                        <div className="flex-grow-1 w-100">
                            <input
                                type="text"
                                placeholder="Buscar por nombre, email o rol..."
                                className="form-control border-success"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex-shrink-0">
                            <button
                                className="btn btn-success d-flex align-items-center"
                                data-bs-toggle="modal"
                                data-bs-target="#newRoleModal"
                            >
                                <i className="bi bi-plus-lg me-2"></i> Nuevo
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para asignar nuevo rol */}
            <AssignRoleModal />

            {isMutating && (
                <div className="col-12 mt-3">
                    <div className="p-5 alert alert-info text-center mb-0 text-info shadow-sm" role="alert">
                        <p className="fs-6 fw-bold">Cargando personal</p>
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            )}

            {!isMutating && (
                <div className="row col-12 bg-white m-0 shadow-sm p-3 rounded">
                    <div className="col-12 p-0 border-bottom border-success border-3 d-flex justify-content-between align-items-center">
                        <h4 className="text-success fw-bold mb-0 lh-1">Personal del Spa</h4>
                        <h5 className="bg-success rounded text-white p-2 mb-1 flex-shrink-0">
                            <i className="bi bi-people"></i> {filteredRoles?.length || 0}
                        </h5>
                    </div>
                    <div className="col-12 p-0">
                        {filteredRoles?.length > 0 ? (
                            filteredRoles.map((rol) => (
                                <div key={rol._id} className="row col-12 m-0 mt-3 bg-white shadow border rounded p-2 py-3 py-sm-2">
                                    <div className="col-sm-2 col-lg-1 d-flex justify-content-center align-items-center p-sm-0 mb-3 mb-sm-0" style={{ minHeight: '80px', maxHeight: '100px' }}>
                                        <div 
                                            className="rounded-circle border border-success overflow-hidden d-flex justify-content-center align-items-center"
                                            style={{ 
                                                width: '80px', 
                                                height: '80px',
                                                minWidth: '80px',
                                                minHeight: '80px'
                                            }}
                                        >
                                            <img
                                                src={rol.user.image || "https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg"}
                                                alt={`${rol.user.name} ${rol.user.last_name}`}
                                                className="w-100 h-100"
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-lg-8 mb-3 mb-sm-0">
                                        <h5 className="mb-1">{rol.user.name} {rol.user.last_name}</h5>
                                        <p className="m-0 text-muted">
                                            <i className="bi bi-envelope me-1"></i>{rol.user.email}
                                        </p>
                                        <p className="m-0">
                                            <span className="badge bg-success bg-opacity-25 text-success">
                                                <i className="bi bi-person-check me-1"></i>{rol.role}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="col-sm-4 col-lg-3 d-flex align-items-center justify-content-end p-2 p-sm-0">
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            data-bs-toggle="modal"
                                            data-bs-target={`#delete-role-${rol._id}`}
                                        >
                                            <i className="bi bi-trash me-1"></i> Eliminar
                                        </button>
                                    </div>

                                    {/* Modal para confirmar eliminación de rol */}
                                    <DinamicModal id={`delete-role-${rol._id}`} title={"Confirmar Eliminación de Rol"}>
                                        <p className="text-center mb-4 fs-5">
                                            ¿Estás seguro de eliminar el rol de <strong className="text-danger">{rol.role}</strong> para el usuario <strong>{rol.user.name} {rol.user.last_name}</strong>?
                                        </p>
                                        <div className="d-flex justify-content-center">
                                            <button
                                                className="btn btn-danger me-2"
                                                onClick={() => handleRemoveRelation(rol._id)}
                                            >
                                                <i className="bi bi-trash me-1"></i> Sí, Eliminar Rol
                                            </button>
                                            <button
                                                className="btn btn-secondary"
                                                data-bs-dismiss="modal"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                        {relationDeleted && (
                                            <div className="alert alert-success mt-3 text-center" role="alert">
                                                <i className="bi bi-check-circle me-1"></i> Rol eliminado correctamente.
                                            </div>
                                        )}
                                        {errorDeleting && (
                                            <div className="alert alert-danger mt-3 text-center" role="alert">
                                                <i className="bi bi-exclamation-triangle me-1"></i> {errorDeleting}
                                            </div>
                                        )}
                                    </DinamicModal>
                                </div>
                            ))
                        ) : (
                            <p className="text-center mt-3 text-muted">No se encontraron usuarios con roles.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// Componente para asignar nuevo rol
const AssignRoleModal = () => {
    const { trigger: getUsers } = useFetchData("/api/findUsers");
    const { trigger: getRoles } = useFetchData("/api/findObjects");
    const { trigger: createRelation } = useFetchData("/api/createRelation");
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [searchUser, setSearchUser] = useState(""); // Renombrado para evitar conflicto
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    const [relationCreated, setRelationCreated] = useState(null);
    const [isError, setIsError] = useState(false);
    const [errors, setErrors] = useState({});

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
                // Aquí podrías mostrar un error en la UI del modal
            }
        }
        fetchData();
    }, [getUsers, getRoles]);

    useEffect(() => {
        if (searchUser) {
            const filtered = users.filter(user =>
                user.name.toLowerCase().includes(searchUser.toLowerCase()) ||
                user.last_name.toLowerCase().includes(searchUser.toLowerCase()) ||
                user.email.toLowerCase().includes(searchUser.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    }, [searchUser, users]);

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setShowUserDropdown(false);
        setSearchUser(`${user.name} ${user.last_name} (${user.email})`);
        setErrors(prev => ({ ...prev, selectedUser: '' })); // Limpiar error
    };

    const handleRoleSelect = (e) => {
        const role = roles.find(r => r._id === e.target.value);
        setSelectedRole(role);
        setErrors(prev => ({ ...prev, selectedRole: '' })); // Limpiar error
    };

    const validateForm = () => {
        let newErrors = {};
        if (!selectedUser) newErrors.selectedUser = "Debes seleccionar un usuario.";
        if (!selectedRole) newErrors.selectedRole = "Debes seleccionar un rol.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            setIsError(true);
            setRelationCreated("Por favor, selecciona un usuario y un rol.");
            return;
        }

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

            setRelationCreated("Rol asignado correctamente.");
            setIsError(false);
            // Recargar después de 1.5 segundos para que el usuario vea el mensaje
            setTimeout(() => {
                window.location.reload();
            }, 1500);

        } catch (error) {
            setRelationCreated("Error al asignar el rol. Es posible que el usuario ya tenga ese rol.");
            setIsError(true);
            console.error("Error al crear relación:", error);
        }
    };

    return (
        <DinamicModal id={"newRoleModal"} title={"Asignar Rol a Personal"}>
            <div className="container-fluid p-3">
                {/* Selector de usuario con búsqueda */}
                <div className="mb-3">
                    <label htmlFor="searchUser" className="form-label text-success">Buscar Usuario <span className="text-danger">*</span></label>
                    <div className="dropdown">
                        <input
                            type="text"
                            className={`form-control ${errors.selectedUser ? 'is-invalid' : ''}`}
                            id="searchUser"
                            value={searchUser}
                            onChange={(e) => {
                                setSearchUser(e.target.value);
                                setShowUserDropdown(true);
                            }}
                            onFocus={() => setShowUserDropdown(true)}
                            placeholder="Buscar por nombre, apellido o email"
                            autoComplete="off"
                        />
                        {errors.selectedUser && <div className="invalid-feedback d-block">{errors.selectedUser}</div>}
                        {showUserDropdown && filteredUsers.length > 0 && (
                            <div className="dropdown-menu show w-100" style={{ maxHeight: "200px", overflowY: "auto", position: "relative" }}>
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
                        {showUserDropdown && filteredUsers.length === 0 && searchUser.length > 0 && (
                            <div className="dropdown-menu show w-100">
                                <span className="dropdown-item text-muted">No se encontraron usuarios.</span>
                            </div>
                        )}
                    </div>
                    {selectedUser && (
                        <div className="mt-2 text-success">
                            Usuario seleccionado: <strong>{selectedUser.name} {selectedUser.last_name}</strong>
                        </div>
                    )}
                </div>

                {/* Selector de rol con dropdown */}
                <div className="mb-4">
                    <label htmlFor="selectRole" className="form-label text-success">Seleccionar Rol <span className="text-danger">*</span></label>
                    <select
                        className={`form-select ${errors.selectedRole ? 'is-invalid' : ''}`}
                        id="selectRole"
                        value={selectedRole?._id || ""}
                        onChange={handleRoleSelect}
                    >
                        <option value="">Selecciona un rol</option>
                        {roles.map(role => (
                            <option key={role._id} value={role._id}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                    {errors.selectedRole && <div className="invalid-feedback">{errors.selectedRole}</div>}
                </div>

                {/* Botón para guardar */}
                <div className="d-grid gap-2">
                    <button
                        type="button"
                        onClick={handleSave}
                        className="btn btn-success btn-lg"
                    >
                        <i className="bi bi-person-plus-fill me-2"></i> Asignar Rol
                    </button>
                </div>

                {/* Mensaje de feedback */}
                {relationCreated && (
                    <div className={`alert ${isError ? 'alert-danger' : 'alert-success'} mt-3 text-center`} role="alert">
                        {relationCreated}
                    </div>
                )}
            </div>
        </DinamicModal>
    );
};