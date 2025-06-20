"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "./page.module.css";
import { jwtDecode } from "jwt-decode";

/** Interface for token payload */
interface TokenPayload {
  role: string;
  name: string;
}

/** Interface for School */
interface School {
  id: number;
  name: string;
  address: string;
  contactEmail: string;
}

/** Interface for User */
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  schoolId?: number;
}

export default function AdminPage() {
  const router = useRouter();

  // Theme management with persistence
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

  // Basic user information
  const [userName, setUserName] = useState("");

  // Selected tab
  const [selectedTab, setSelectedTab] = useState<"schools" | "itSupport">("schools");

  // School management
  const [schools, setSchools] = useState<School[]>([]);
  const [createName, setCreateName] = useState("");
  const [createAddress, setCreateAddress] = useState("");
  const [createContactEmail, setCreateContactEmail] = useState("");
  const [selectedEditSchoolId, setSelectedEditSchoolId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editContactEmail, setEditContactEmail] = useState("");
  const [selectedDeleteSchoolId, setSelectedDeleteSchoolId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteName, setDeleteName] = useState("");
  const [deleteAddress, setDeleteAddress] = useState("");
  const [deleteContactEmail, setDeleteContactEmail] = useState("");
  // ================
  // LOGOUT FUNCTION
  // ================
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };
  async function fetchSchools(token: string) {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get("http://localhost:8080/schools/getall", config);
      setSchools(response.data);
    } catch (error) {
      console.error("Failed to fetch schools:", error);
    }
  }

  async function handleCreateSchool(e: FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.post(
        "http://localhost:8080/schools/create",
        {
          name: createName,
          address: createAddress,
          contactEmail: createContactEmail,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCreateName("");
      setCreateAddress("");
      setCreateContactEmail("");
      fetchSchools(token);
    } catch (error) {
      console.error("Failed to create school:", error);
    }
  }

  function handleSelectEditSchool(id: number) {
    setSelectedEditSchoolId(id);
    const school = schools.find((s) => s.id === id);
    if (school) {
      setEditName(school.name);
      setEditAddress(school.address);
      setEditContactEmail(school.contactEmail);
    }
  }

  async function handleUpdateSchool(e: FormEvent) {
    e.preventDefault();
    if (selectedEditSchoolId === null) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.put(
        `http://localhost:8080/schools/${selectedEditSchoolId}`,
        {
          name: editName,
          address: editAddress,
          contactEmail: editContactEmail,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedEditSchoolId(null);
      setEditName("");
      setEditAddress("");
      setEditContactEmail("");
      fetchSchools(token);
    } catch (error) {
      console.error("Failed to update school:", error);
    }
  }

  function handleSelectDeleteSchool(id: number) {
    setSelectedDeleteSchoolId(id);
  }

  function openDeleteModal() {
    if (selectedDeleteSchoolId === null) return;
    setDeleteName("");
    setDeleteAddress("");
    setDeleteContactEmail("");
    setShowDeleteModal(true);
  }

  function closeDeleteModal() {
    setShowDeleteModal(false);
  }

  async function handleConfirmDeleteSchool() {
    if (selectedDeleteSchoolId === null) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    const school = schools.find((s) => s.id === selectedDeleteSchoolId);
    if (!school) return;
    const isMatch =
      deleteName === school.name &&
      deleteAddress === school.address &&
      deleteContactEmail === school.contactEmail;
    if (!isMatch) {
      alert("Die eingegebenen Daten stimmen nicht mit den Informationen der ausgewählten Schule überein!");
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/schools/${selectedDeleteSchoolId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      closeDeleteModal();
      setSelectedDeleteSchoolId(null);
      fetchSchools(token);
    } catch (error) {
      console.error("Failed to delete school:", error);
    }
  }

  // IT Support users management
  const [itSupportUsers, setItSupportUsers] = useState<User[]>([]);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedDeleteUser, setSelectedDeleteUser] = useState<User | null>(null);
  const [deleteUserSchoolConfirmation, setDeleteUserSchoolConfirmation] = useState("");
  const [selectedItSupportSchoolId, setSelectedItSupportSchoolId] = useState<number | null>(null);

  useEffect(() => {
    if (selectedItSupportSchoolId !== null) {
      fetchItSupportUsersForSchool(selectedItSupportSchoolId);
    }
  }, [selectedItSupportSchoolId]);

  async function fetchItSupportUsersForSchool(schoolId: number) {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`http://localhost:8080/schools/${schoolId}/users`, config);
      const itUsers = response.data.filter((u: User) => u.role === "ITSUPPORT");
      setItSupportUsers(itUsers);
    } catch (error) {
      console.error("Failed to fetch IT support users for school:", error);
    }
  }

  async function createItSupportUser(e: FormEvent) {
    e.preventDefault();
    if (selectedItSupportSchoolId === null) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.post(
        "http://localhost:8080/users/create",
        {
          name: newUserName,
          email: newUserEmail,
          password: newUserPassword,
          role: "ITSUPPORT",
          schoolId: selectedItSupportSchoolId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewUserName("");
      setNewUserEmail("");
      setNewUserPassword("");
      fetchItSupportUsersForSchool(selectedItSupportSchoolId);
    } catch (error) {
      console.error("Failed to create IT Support user:", error);
    }
  }

  async function updateUser(e: FormEvent) {
    e.preventDefault();
    if (!editingUser || editingUser.id == null || selectedItSupportSchoolId == null) {
      alert("Die Benutzer-ID oder die Schul-ID ist nicht definiert.");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.put(
        `http://localhost:8080/users/${editingUser.id}`,
        {
          name: editingUser.name,
          email: editingUser.email,
          role: "ITSUPPORT",
          schoolId: selectedItSupportSchoolId, // necessary to fetch the school from the service
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingUser(null);
      fetchItSupportUsersForSchool(selectedItSupportSchoolId);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  }
  

  async function handleConfirmDeleteUser() {
    if (!selectedDeleteUser || selectedItSupportSchoolId === null) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    const school = schools.find((s) => s.id === selectedItSupportSchoolId);
    if (!school) return;
    if (deleteUserSchoolConfirmation !== school.name) {
      alert("Der eingegebene Schulname stimmt nicht mit dem Namen der ausgewählten Schule überein!");
      return;
    }
    try {
      await axios.delete(`http://localhost:8080/users/${selectedDeleteUser.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedDeleteUser(null);
      setDeleteUserSchoolConfirmation("");
      fetchItSupportUsersForSchool(selectedItSupportSchoolId);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  }

  function openDeleteUserModal(user: User) {
    setSelectedDeleteUser(user);
    setDeleteUserSchoolConfirmation("");
  }

  function closeDeleteUserModal() {
    setSelectedDeleteUser(null);
    setDeleteUserSchoolConfirmation("");
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      if (decoded.role !== "ADMIN") {
        router.push("/login");
        return;
      }
      setUserName(decoded.name);
      fetchSchools(token);
    } catch (error) {
      console.error("Invalid token:", error);
      router.push("/login");
    }
  }, [router]);

  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      <aside className={styles.sidebar}>
        <div>
          <div className={styles.username}>Hallo, {userName}</div>
          <nav className={styles.nav}>
            <button className={styles.navButton} onClick={() => setSelectedTab("schools")}>
              Schulen
            </button>
            <button className={styles.navButton} onClick={() => setSelectedTab("itSupport")}>
              IT-Support
            </button>
          </nav>
        </div>
        <div className={styles.themeToggleContainer}>
          <span className={styles.themeLabel}>
            {theme === "light" ? "Dunkelmodus" : "Hellmodus"}
          </span>
          <label className={styles.switch}>
            <input type="checkbox" checked={theme === "dark"} onChange={toggleTheme} />
            <span className={styles.slider}></span>
          </label>
                    {/* Logout button positioned at the bottom */}
          <button className={styles.primaryButton} onClick={handleLogout}>
            Abmelden
          </button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {selectedTab === "schools" && (
            <section className={styles.card}>
              <h2>Schulverwaltung</h2>
              <div className={`${styles.section} ${styles.createSchoolSection}`}>
                <h3>Schule erstellen</h3>
                <form className={styles.form} onSubmit={handleCreateSchool}>
                  <input
                    type="text"
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    placeholder="Schulname"
                    required
                  />
                  <input
                    type="text"
                    value={createAddress}
                    onChange={(e) => setCreateAddress(e.target.value)}
                    placeholder="Schuladresse"
                    required
                  />
                  <input
                    type="email"
                    value={createContactEmail}
                    onChange={(e) => setCreateContactEmail(e.target.value)}
                    placeholder="Kontakt-E-Mail"
                    required
                  />
                  <button type="submit" className={styles.primaryButton}>
                    Erstellen
                  </button>
                </form>
              </div>
              <hr className={styles.divider} />
              <div className={styles.section}>
                <h3>Schule bearbeiten</h3>
                <div className={styles.form}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label>Wählen Sie eine Schule:</label>
                    <select
                      value={selectedEditSchoolId ?? ""}
                      onChange={(e) => handleSelectEditSchool(Number(e.target.value))}
                    >
                      <option value="">-- Wählen Sie eine Schule --</option>
                      {schools.map((school) => (
                        <option key={school.id} value={school.id}>
                          {school.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {selectedEditSchoolId && (
                  <div className={styles.schoolInfo}>
                    <p>
                      <strong>Aktuelle Daten:</strong>
                    </p>
                    <p>Name: {editName}</p>
                    <p>Adresse: {editAddress}</p>
                    <p>Kontakt-E-Mail: {editContactEmail}</p>
                    <h4>Schule aktualisieren</h4>
                    <form className={styles.form} onSubmit={handleUpdateSchool}>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Schulname"
                        required
                      />
                      <input
                        type="text"
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        placeholder="Schuladresse"
                        required
                      />
                      <input
                        type="email"
                        value={editContactEmail}
                        onChange={(e) => setEditContactEmail(e.target.value)}
                        placeholder="Kontakt-E-Mail"
                        required
                      />
                      <button type="submit" className={styles.primaryButton}>
                        Aktualisieren
                      </button>
                    </form>
                  </div>
                )}
              </div>
              <hr className={styles.divider} />
              <div className={styles.section}>
                <h3>Schule löschen</h3>
                <div className={styles.form} style={{ flexDirection: "column", gap: "0.5rem" }}>
                  <label>Wählen Sie eine Schule zum Löschen:</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <select
                      value={selectedDeleteSchoolId ?? ""}
                      onChange={(e) => handleSelectDeleteSchool(Number(e.target.value))}
                    >
                      <option value="">-- Wählen Sie eine Schule --</option>
                      {schools.map((school) => (
                        <option key={school.id} value={school.id}>
                          {school.name}
                        </option>
                      ))}
                    </select>
                    <button onClick={openDeleteModal} disabled={!selectedDeleteSchoolId} className={styles.dangerButton}>
                      Schule löschen
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {selectedTab === "itSupport" && (
            <section className={styles.card}>
              <h2 className={styles.itSupportHeader}>IT-Support-Benutzerverwaltung</h2>
              <div className={styles.form}>
                <label>Schule auswählen:</label>
                <select
                  value={selectedItSupportSchoolId ?? ""}
                  onChange={(e) =>
                    setSelectedItSupportSchoolId(e.target.value ? Number(e.target.value) : null)
                  }
                >
                  <option value="">-- Wählen Sie eine Schule --</option>
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>
                      {school.name}
                    </option>
                  ))}
                </select>
              </div>
              {selectedItSupportSchoolId ? (
                <>
                  <h3>{editingUser ? "IT-Support-Benutzer bearbeiten" : "IT-Support-Benutzer hinzufügen"}</h3>
                  <form
                    className={styles.form}
                    onSubmit={editingUser ? updateUser : createItSupportUser}
                  >
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
                  {/* Listing of IT Support users in a table-like layout without dividing lines */}
                  <div className={styles.userTable}>
                    <div className={styles.tableHeader}>
                      <div className={styles.tableCell}>Name</div>
                      <div className={styles.tableCell}>E-Mail</div>
                      <div className={`${styles.tableCell} ${styles.actionsHeader}`}></div>
                    </div>
                    {itSupportUsers.map((user) => (
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
                </>
              ) : (
                <p>Bitte wählen Sie eine Schule aus, um deren IT-Support-Benutzer zu verwalten.</p>
              )}
            </section>
          )}
        </div>
      </main>

      {/* Modal for school deletion */}
      {showDeleteModal && selectedDeleteSchoolId && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h4>Schullöschung bestätigen</h4>
            <p>Bitte geben Sie die Daten der ausgewählten Schule erneut ein, um zu bestätigen:</p>
            <input
              type="text"
              placeholder="Schulname"
              value={deleteName}
              onChange={(e) => setDeleteName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Schuladresse"
              value={deleteAddress}
              onChange={(e) => setDeleteAddress(e.target.value)}
            />
            <input
              type="email"
              placeholder="Kontakt-E-Mail"
              value={deleteContactEmail}
              onChange={(e) => setDeleteContactEmail(e.target.value)}
            />
            <div className={styles.modalActions}>
              <button onClick={handleConfirmDeleteSchool} className={styles.dangerButton}>
                Löschung bestätigen
              </button>
              <button onClick={closeDeleteModal} className={styles.primaryButton}>
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for IT Support user deletion */}
      {selectedDeleteUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h4>Benutzerlöschung bestätigen</h4>
            <p>
              Um die Löschung zu bestätigen, geben Sie bitte den Namen der Schule ein (
              {schools.find((s) => s.id === selectedItSupportSchoolId)?.name || "die ausgewählte Schule"}
              ).
            </p>
            <input
              type="text"
              placeholder="Schulname"
              value={deleteUserSchoolConfirmation}
              onChange={(e) => setDeleteUserSchoolConfirmation(e.target.value)}
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
    </div>
  );
}
