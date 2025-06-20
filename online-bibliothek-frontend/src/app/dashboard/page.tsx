"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "../admin/page.module.css"; // adjust the path as needed
import { jwtDecode } from "jwt-decode";

/** Interface for the token payload with a numeric "id" field */
interface TokenPayload {
  role: string;
  name: string;
  id: number;          // numeric user id
  schoolId: number;    // IT Support school ID
}

/** Interface for User */
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  schoolId: number;
}

/** Interface for Module */
interface Module {
  id: number;
  name: string;
  description: string;
}

/** Updated Resource Interface */
interface Resource {
  id: number;
  title: string;
  url: string;
  modulo: { id: number; name: string };
  uploadedBy: { id: number; name: string };
  userOwner: { id: number; name: string };
  createdAt: string;
}

export default function ITSupportDashboard() {
  const router = useRouter();

  // ==============================
  // THEME (Light/Dark)
  // ==============================
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
    }
  }, []);

  // ==============================
  // USER INFO (Logged in IT Support)
  // ==============================
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [userSchoolId, setUserSchoolId] = useState<number | null>(null);

  // ==============================
  // SELECTED TAB
  // ==============================
  const [selectedTab, setSelectedTab] = useState<"users" | "modules" | "resources">("users");

  // ==============================
  // USERS (STUDENT) Management
  // ==============================
  const [schoolUsers, setSchoolUsers] = useState<User[]>([]);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedDeleteUser, setSelectedDeleteUser] = useState<User | null>(null);
  const [deleteUserNameConfirmation, setDeleteUserNameConfirmation] = useState("");

  // ==============================
  // MODULES Management
  // ==============================
  const [modules, setModules] = useState<Module[]>([]);
  const [newModuleName, setNewModuleName] = useState("");
  const [newModuleDescription, setNewModuleDescription] = useState("");
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [selectedDeleteModule, setSelectedDeleteModule] = useState<Module | null>(null);
  const [deleteModuleNameConfirmation, setDeleteModuleNameConfirmation] = useState("");

  // ==============================
  // RESOURCES Management
  // ==============================
  const [resources, setResources] = useState<Resource[]>([]);
  const [newResourceTitle, setNewResourceTitle] = useState("");
  const [newResourceUrl, setNewResourceUrl] = useState("");
  // For selects, if no value is chosen, we keep it as null
  const [newResourceModuleId, setNewResourceModuleId] = useState<number | null>(null);
  const [newResourceOwnerId, setNewResourceOwnerId] = useState<number | null>(null);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [selectedDeleteResource, setSelectedDeleteResource] = useState<Resource | null>(null);
  const [deleteResourceTitleConfirmation, setDeleteResourceTitleConfirmation] = useState("");

  // List of students (STUDENT) for the resource dropdown
  const [schoolStudents, setSchoolStudents] = useState<User[]>([]);

  // ==============================
  // LOGOUT FUNCTION
  // ==============================
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // ==============================
  // CHECK TOKEN AND LOAD DATA
  // ==============================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      if (decoded.role !== "ITSUPPORT") {
        router.push("/login");
        return;
      }
      setUserName(decoded.name);
      setUserId(decoded.id); // using the numeric "id" field
      setUserSchoolId(decoded.schoolId);
      fetchAllData(decoded.schoolId, token);
    } catch (error) {
      console.error("Invalid token:", error);
      router.push("/login");
    }
  }, [router]);

  // Effect to update resources whenever the "resources" tab is selected
  useEffect(() => {
    if (selectedTab === "resources" && userSchoolId !== null) {
      const token = localStorage.getItem("token");
      if (token) {
        fetchSchoolResources(userSchoolId, token);
      }
    }
  }, [selectedTab, userSchoolId]);

  async function fetchAllData(schoolId: number, token: string) {
    await fetchSchoolUsers(schoolId, token);
    await fetchSchoolModules(schoolId, token);
    // Optional: you may also fetch resources here if desired
    await fetchSchoolResources(schoolId, token);
  }

  // ==============================
  // FETCH: SCHOOL USERS (only STUDENTS)
  // ==============================
  async function fetchSchoolUsers(schoolId: number, token: string) {
    try {
      const res = await axios.get(`http://localhost:8080/schools/${schoolId}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filter to display only users with role STUDENT
      const students = res.data.filter((u: User) => u.role === "STUDENT");
      setSchoolUsers(students);
      setSchoolStudents(students);
    } catch (err) {
      console.error("Failed to fetch school users:", err);
    }
  }

  // ==============================
  // FETCH: SCHOOL MODULES
  // ==============================
  async function fetchSchoolModules(schoolId: number, token: string) {
    try {
      const res = await axios.get(`http://localhost:8080/schools/${schoolId}/modules`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setModules(res.data);
    } catch (err) {
      console.error("Failed to fetch modules:", err);
    }
  }

  // ==============================
  // FETCH: SCHOOL RESOURCES (NEW ENDPOINT)
  // ==============================
  async function fetchSchoolResources(schoolId: number, token: string) {
    try {
      const response = await axios.get(`http://localhost:8080/resources/school/${schoolId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResources(response.data);
    } catch (err) {
      console.error("Failed to fetch resources:", err);
    }
  }

  // ==============================
  // CRUD: USERS (STUDENT)
  // ==============================
  async function handleCreateUser(e: FormEvent) {
    e.preventDefault();
    if (userSchoolId === null) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.post(
        "http://localhost:8080/users/create",
        {
          name: newUserName,
          email: newUserEmail,
          password: newUserPassword,
          role: "STUDENT",
          schoolId: userSchoolId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewUserName("");
      setNewUserEmail("");
      setNewUserPassword("");
      await fetchSchoolUsers(userSchoolId, token);
    } catch (err) {
      console.error("Failed to create user:", err);
    }
  }

  async function handleUpdateUser(e: FormEvent) {
    e.preventDefault();
    if (!editingUser || !editingUser.id || userSchoolId === null) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.put(
        `http://localhost:8080/users/${editingUser.id}`,
        {
          name: editingUser.name,
          email: editingUser.email,
          role: "STUDENT",
          schoolId: userSchoolId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingUser(null);
      await fetchSchoolUsers(userSchoolId, token);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  }

  function openDeleteUserModal(user: User) {
    setSelectedDeleteUser(user);
    setDeleteUserNameConfirmation("");
  }

  function closeDeleteUserModal() {
    setSelectedDeleteUser(null);
    setDeleteUserNameConfirmation("");
  }

  async function handleConfirmDeleteUser() {
    if (!selectedDeleteUser || userSchoolId === null) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    if (deleteUserNameConfirmation !== selectedDeleteUser.name) {
      alert("Der eingegebene Name stimmt nicht mit dem Namen des Benutzers überein!");
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/users/${selectedDeleteUser.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      closeDeleteUserModal();
      await fetchSchoolUsers(userSchoolId, token);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  }

  // ==============================
  // CRUD: MODULES
  // ==============================
  async function handleCreateModule(e: FormEvent) {
    e.preventDefault();
    if (userSchoolId === null) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.post(
        "http://localhost:8080/modules/create",
        {
          name: newModuleName,
          description: newModuleDescription,
          school: { id: userSchoolId },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewModuleName("");
      setNewModuleDescription("");
      await fetchSchoolModules(userSchoolId, token);
    } catch (error) {
      console.error("Failed to create module:", error);
    }
  }

  async function handleUpdateModule(e: FormEvent) {
    e.preventDefault();
    if (!editingModule || userSchoolId === null) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.put(
        `http://localhost:8080/modules/${editingModule.id}`,
        {
          name: editingModule.name,
          description: editingModule.description,
          school: { id: userSchoolId },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingModule(null);
      await fetchSchoolModules(userSchoolId, token);
    } catch (error) {
      console.error("Failed to update module:", error);
    }
  }

  function openDeleteModuleModal(mod: Module) {
    setSelectedDeleteModule(mod);
    setDeleteModuleNameConfirmation("");
  }

  function closeDeleteModuleModal() {
    setSelectedDeleteModule(null);
    setDeleteModuleNameConfirmation("");
  }

  async function handleConfirmDeleteModule() {
    if (!selectedDeleteModule || userSchoolId === null) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    if (deleteModuleNameConfirmation !== selectedDeleteModule.name) {
      alert("Der eingegebene Name stimmt nicht mit dem Modulnamen überein!");
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/modules/${selectedDeleteModule.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      closeDeleteModuleModal();
      await fetchSchoolModules(userSchoolId, token);
    } catch (error) {
      console.error("Failed to delete module:", error);
    }
  }

  // ==============================
  // CRUD: RESOURCES
  // ==============================
  async function handleCreateResource(e: FormEvent) {
    e.preventDefault();
    // Explicit validation for resource fields
    if (
      userId === null ||
      newResourceModuleId === null ||
      newResourceOwnerId === null ||
      newResourceTitle.trim() === "" ||
      newResourceUrl.trim() === ""
    ) {
      alert("Bitte füllen Sie alle erforderlichen Felder für die Ressource aus!");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.post(
        "http://localhost:8080/resources/create",
        {
          Title: newResourceTitle,
          URL: newResourceUrl,
          module: { id: newResourceModuleId },
          uploadedBy: { id: userId },
          UserOwner: { id: newResourceOwnerId },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewResourceTitle("");
      setNewResourceUrl("");
      setNewResourceModuleId(null);
      setNewResourceOwnerId(null);
      if (userSchoolId !== null) {
        await fetchSchoolResources(userSchoolId, token);
      }
    } catch (error) {
      console.error("Failed to create resource:", error);
    }
  }

  async function handleUpdateResource(e: FormEvent) {
    e.preventDefault();
    if (!editingResource || userSchoolId === null) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.put(
        `http://localhost:8080/resources/${editingResource.id}`,
        {
          Title: editingResource.title,
          URL: editingResource.url,
          module: { id: editingResource.modulo.id },
          uploadedBy: { id: editingResource.uploadedBy.id },
          UserOwner: { id: editingResource.userOwner.id },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingResource(null);
      await fetchSchoolResources(userSchoolId, token);
    } catch (error) {
      console.error("Failed to update resource:", error);
    }
  }

  function openDeleteResourceModal(res: Resource) {
    setSelectedDeleteResource(res);
    setDeleteResourceTitleConfirmation("");
  }

  function closeDeleteResourceModal() {
    setSelectedDeleteResource(null);
    setDeleteResourceTitleConfirmation("");
  }

  async function handleConfirmDeleteResource() {
    if (!selectedDeleteResource || userSchoolId === null) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    if (deleteResourceTitleConfirmation !== selectedDeleteResource.title) {
      alert("Der eingegebene Titel stimmt nicht mit dem Ressourcentitel überein!");
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/resources/${selectedDeleteResource.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      closeDeleteResourceModal();
      await fetchSchoolResources(userSchoolId, token);
    } catch (error) {
      console.error("Failed to delete resource:", error);
    }
  }

  // ==============================
  // RENDER
  // ==============================
  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div>
          <div className={styles.username}>Hallo, {userName}</div>
          <nav className={styles.nav}>
            <button className={styles.navButton} onClick={() => setSelectedTab("users")}>
              Benutzer
            </button>
            <button className={styles.navButton} onClick={() => setSelectedTab("modules")}>
              Module
            </button>
            <button className={styles.navButton} onClick={() => setSelectedTab("resources")}>
              Ressourcen
            </button>
          </nav>
        </div>
        <div className={styles.themeToggleContainer}>
          <span className={styles.themeLabel}>{theme === "light" ? "Dunkelmodus" : "Hellmodus"}</span>
          <label className={styles.switch}>
            <input type="checkbox" checked={theme === "dark"} onChange={toggleTheme} />
            <span className={styles.slider}></span>
          </label>
        </div>
        <div className={styles.bottomContainer}>
          <button className={styles.primaryButton} onClick={handleLogout}>
            Abmelden
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {/* ===================== USERS TAB ===================== */}
          {selectedTab === "users" && (
            <section className={styles.card}>
              <h2>Benutzerverwaltung</h2>
              <h3>{editingUser ? "Benutzer bearbeiten" : "Benutzer hinzufügen (Student)"}</h3>
              <form className={styles.form} onSubmit={editingUser ? handleUpdateUser : handleCreateUser}>
                <input
                  type="text"
                  value={editingUser ? editingUser.name : newUserName}
                  onChange={(e) => {
                    if (editingUser) {
                      setEditingUser({ ...editingUser, name: e.target.value });
                    } else {
                      setNewUserName(e.target.value);
                    }
                  }}
                  placeholder="Name"
                  required
                />
                <input
                  type="email"
                  value={editingUser ? editingUser.email : newUserEmail}
                  onChange={(e) => {
                    if (editingUser) {
                      setEditingUser({ ...editingUser, email: e.target.value });
                    } else {
                      setNewUserEmail(e.target.value);
                    }
                  }}
                  placeholder="E-Mail"
                  required
                />
                {!editingUser && (
                  <input
                    type="password"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    placeholder="Passwort"
                    required
                  />
                )}
                <button type="submit" className={styles.primaryButton}>
                  {editingUser ? "Aktualisieren" : "Erstellen"}
                </button>
                {editingUser && (
                  <button type="button" onClick={() => setEditingUser(null)} className={styles.primaryButton}>
                    Abbrechen
                  </button>
                )}
              </form>
              <hr className={styles.divider} />
              <div className={styles.userTable}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableCell}>Name</div>
                  <div className={styles.tableCell}>E-Mail</div>
                  <div className={`${styles.tableCell} ${styles.actionsHeader}`}></div>
                </div>
                {schoolUsers.map((user) => (
                  <div key={user.id} className={styles.tableRow}>
                    <div className={styles.tableCell}>{user.name}</div>
                    <div className={styles.tableCell}>{user.email}</div>
                    <div className={`${styles.tableCell} ${styles.actionsCell}`}>
                      <button className={styles.primaryButton} onClick={() => setEditingUser(user)}>
                        Bearbeiten
                      </button>
                      <button className={styles.dangerButton} onClick={() => openDeleteUserModal(user)}>
                        Löschen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ===================== MODULES TAB ===================== */}
          {selectedTab === "modules" && (
            <section className={styles.card}>
              <h2>Modulverwaltung</h2>
              <h3>{editingModule ? "Modul bearbeiten" : "Modul hinzufügen"}</h3>
              <form className={styles.form} onSubmit={editingModule ? handleUpdateModule : handleCreateModule}>
                <input
                  type="text"
                  value={editingModule ? editingModule.name : newModuleName}
                  onChange={(e) => {
                    if (editingModule) {
                      setEditingModule({ ...editingModule, name: e.target.value });
                    } else {
                      setNewModuleName(e.target.value);
                    }
                  }}
                  placeholder="Modulname"
                  required
                />
                <input
                  type="text"
                  value={editingModule ? editingModule.description : newModuleDescription}
                  onChange={(e) => {
                    if (editingModule) {
                      setEditingModule({ ...editingModule, description: e.target.value });
                    } else {
                      setNewModuleDescription(e.target.value);
                    }
                  }}
                  placeholder="Modulbeschreibung"
                  required
                />
                <button type="submit" className={styles.primaryButton}>
                  {editingModule ? "Aktualisieren" : "Erstellen"}
                </button>
                {editingModule && (
                  <button type="button" onClick={() => setEditingModule(null)} className={styles.primaryButton}>
                    Abbrechen
                  </button>
                )}
              </form>
              <hr className={styles.divider} />
              <div className={styles.userTable}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableCell}>Name</div>
                  <div className={styles.tableCell}>Beschreibung</div>
                  <div className={`${styles.tableCell} ${styles.actionsHeader}`}></div>
                </div>
                {modules.map((mod) => (
                  <div key={mod.id} className={styles.tableRow}>
                    <div className={styles.tableCell}>{mod.name}</div>
                    <div className={styles.tableCell}>{mod.description}</div>
                    <div className={`${styles.tableCell} ${styles.actionsCell}`}>
                      <button className={styles.primaryButton} onClick={() => setEditingModule(mod)}>
                        Bearbeiten
                      </button>
                      <button className={styles.dangerButton} onClick={() => openDeleteModuleModal(mod)}>
                        Löschen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ===================== RESOURCES TAB ===================== */}
          {selectedTab === "resources" && (
            <section className={styles.card}>
              <h2>Ressourcenverwaltung</h2>
              <h3>{editingResource ? "Ressource bearbeiten" : "Ressource hinzufügen"}</h3>
              <form className={styles.form} onSubmit={editingResource ? handleUpdateResource : handleCreateResource}>
                <input
                  type="text"
                  value={editingResource ? editingResource.title : newResourceTitle}
                  onChange={(e) => {
                    if (editingResource) {
                      setEditingResource({ ...editingResource, title: e.target.value });
                    } else {
                      setNewResourceTitle(e.target.value);
                    }
                  }}
                  placeholder="Titel"
                  required
                />
                <input
                  type="text"
                  value={editingResource ? editingResource.url : newResourceUrl}
                  onChange={(e) => {
                    if (editingResource) {
                      setEditingResource({ ...editingResource, url: e.target.value });
                    } else {
                      setNewResourceUrl(e.target.value);
                    }
                  }}
                  placeholder="URL"
                  required
                />
                <select
                  value={
                    editingResource
                      ? editingResource.modulo.id
                      : newResourceModuleId !== null
                      ? newResourceModuleId
                      : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    const val = value === "" ? null : Number(value);
                    if (editingResource) {
                      setEditingResource({
                        ...editingResource,
                        modulo: { ...editingResource.modulo, id: val as number },
                      });
                    } else {
                      setNewResourceModuleId(val);
                    }
                  }}
                  required
                >
                  <option value="">-- Wähle ein Modul --</option>
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <select
                  value={
                    editingResource
                      ? editingResource.userOwner.id
                      : newResourceOwnerId !== null
                      ? newResourceOwnerId
                      : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    const val = value === "" ? null : Number(value);
                    if (editingResource) {
                      setEditingResource({
                        ...editingResource,
                        userOwner: { ...editingResource.userOwner, id: val as number },
                      });
                    } else {
                      setNewResourceOwnerId(val);
                    }
                  }}
                  required
                >
                  <option value="">-- Wähle einen Studenten (Besitzer) --</option>
                  {schoolStudents.map((stu) => (
                    <option key={stu.id} value={stu.id}>
                      {stu.name}
                    </option>
                  ))}
                </select>
                <button type="submit" className={styles.primaryButton}>
                  {editingResource ? "Aktualisieren" : "Erstellen"}
                </button>
                {editingResource && (
                  <button type="button" onClick={() => setEditingResource(null)} className={styles.primaryButton}>
                    Abbrechen
                  </button>
                )}
              </form>
              <hr className={styles.divider} />
              <div className={styles.userTable}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableCell}>Titel</div>
                  <div className={styles.tableCell}>Modul</div>
                  <div className={styles.tableCell}>Besitzer</div>
                  <div className={styles.tableCell}>URL</div>
                  <div className={`${styles.tableCell} ${styles.actionsHeader}`}></div>
                </div>
                {resources.map((res) => (
                  <div key={res.id} className={styles.tableRow}>
                    <div className={styles.tableCell}>{res.title}</div>
                    <div className={styles.tableCell}>{res.modulo.name}</div>
                    <div className={styles.tableCell}>{res.userOwner.name}</div>
                    <div className={styles.tableCell}>
                      <a href={res.url} target="_blank" rel="noreferrer">
                        {res.url}
                      </a>
                    </div>
                    <div className={`${styles.tableCell} ${styles.actionsCell}`}>
                      <button className={styles.primaryButton} onClick={() => setEditingResource(res)}>
                        Bearbeiten
                      </button>
                      <button className={styles.dangerButton} onClick={() => openDeleteResourceModal(res)}>
                        Löschen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* MODAL: DELETE USER */}
      {selectedDeleteUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h4>Benutzerlöschung bestätigen</h4>
            <p>
              Zur Bestätigung geben Sie bitte den Namen des Benutzers ein: <strong>{selectedDeleteUser.name}</strong>
            </p>
            <input
              type="text"
              placeholder="Benutzername"
              value={deleteUserNameConfirmation}
              onChange={(e) => setDeleteUserNameConfirmation(e.target.value)}
            />
            <div className={styles.modalActions}>
              <button onClick={handleConfirmDeleteUser} className={styles.dangerButton}>
                Löschung bestätigen
              </button>
              <button onClick={closeDeleteUserModal} className={styles.primaryButton}>
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELETE MODULE */}
      {selectedDeleteModule && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h4>Modullöschung bestätigen</h4>
            <p>
              Zur Bestätigung geben Sie bitte den Modulnamen ein: <strong>{selectedDeleteModule.name}</strong>
            </p>
            <input
              type="text"
              placeholder="Modulname"
              value={deleteModuleNameConfirmation}
              onChange={(e) => setDeleteModuleNameConfirmation(e.target.value)}
            />
            <div className={styles.modalActions}>
              <button onClick={handleConfirmDeleteModule} className={styles.dangerButton}>
                Löschung bestätigen
              </button>
              <button onClick={closeDeleteModuleModal} className={styles.primaryButton}>
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELETE RESOURCE */}
      {selectedDeleteResource && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h4>Ressourcenlöschung bestätigen</h4>
            <p>
              Zur Bestätigung geben Sie bitte den Ressourcentitel ein: <strong>{selectedDeleteResource.title}</strong>
            </p>
            <input
              type="text"
              placeholder="Ressourcentitel"
              value={deleteResourceTitleConfirmation}
              onChange={(e) => setDeleteResourceTitleConfirmation(e.target.value)}
            />
            <div className={styles.modalActions}>
              <button onClick={handleConfirmDeleteResource} className={styles.dangerButton}>
                Löschung bestätigen
              </button>
              <button onClick={closeDeleteResourceModal} className={styles.primaryButton}>
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
