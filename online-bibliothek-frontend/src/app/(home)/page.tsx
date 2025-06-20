"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "../admin/page.module.css";
import {jwtDecode} from "jwt-decode";

/** Interface for token payload (adjust as necessary) */
interface TokenPayload {
  role: string;
  name: string;
  id: number;       // User ID (STUDENT)
  schoolId: number; // If school ID is needed
}

/** Interface for Book/Resource returned by the API */
interface BookResource {
  id: number;
  title: string;
  url: string;
  modulo: {
    id: number;
    name: string;
  };
}

/** Page that lists all user's books and allows filtering by module, and includes a password update tab */
export default function StudentBooksPage() {
  const router = useRouter();

  // ================
  // THEME (Light/Dark)
  // ================
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

  // ================
  // USER INFO
  // ================
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState<number | null>(null);

  // ================
  // BOOK DATA
  // ================
  const [books, setBooks] = useState<BookResource[]>([]);
  const [modules, setModules] = useState<{ id: number; name: string }[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);

  // ================
  // ACTIVE TAB STATE ("books" or "password")
  // ================
  const [activeTab, setActiveTab] = useState<"books" | "password">("books");

  // ================
  // PASSWORD UPDATE FORM STATES
  // ================
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  // ================
  // CHECK TOKEN AND LOAD DATA
  // ================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      setUserName(decoded.name);
      setUserId(decoded.id);

      // Fetch books only if "books" tab is active
      if (activeTab === "books") {
        fetchUserBooks(decoded.id, token);
      }
    } catch (error) {
      console.error("Invalid token:", error);
      router.push("/login");
    }
  }, [router, activeTab]);

  // Function to fetch all user's books
  async function fetchUserBooks(userId: number, token: string) {
    try {
      const response = await axios.get(`http://localhost:8080/resources/user/${userId}/books`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userBooks: BookResource[] = response.data;
      setBooks(userBooks);

      // Extract modules from the returned books
      const uniqueModulesMap = new Map<number, { id: number; name: string }>();
      userBooks.forEach((bk) => {
        const { id, name } = bk.modulo;
        if (!uniqueModulesMap.has(id)) {
          uniqueModulesMap.set(id, { id, name });
        }
      });

      // Convert map to array
      const modulesArray = Array.from(uniqueModulesMap.values());
      setModules(modulesArray);
    } catch (error) {
      console.error("Failed to fetch user books:", error);
    }
  }

  // ================
  // LOGOUT FUNCTION
  // ================
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // ================
  // BOOK FILTER
  // ================
  const filteredBooks =
    activeTab === "books"
      ? selectedModuleId
        ? books.filter((bk) => bk.modulo.id === selectedModuleId)
        : books
      : [];

  // ================
  // HANDLE PASSWORD UPDATE FORM SUBMISSION
  // ================
  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Check if newPassword and confirmPassword match
    if (newPassword !== confirmPassword) {
      setPasswordMessage("Die neuen Passwörter stimmen nicht überein.");
      return;
    }
    if (!userId) {
      setPasswordMessage("Benutzer-ID nicht gefunden.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/users/${userId}/password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPasswordMessage("Passwort wurde erfolgreich aktualisiert.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      if (error.response && error.response.data) {
        setPasswordMessage(error.response.data);
      } else {
        setPasswordMessage("Fehler beim Aktualisieren des Passworts.");
      }
    }
  };

  // ================
  // RENDER
  // ================
  return (
    <div className={`${styles.container} ${styles[theme]}`}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.topContainer}>
          <div className={styles.username}>Hallo, {userName}</div>
          <nav className={styles.nav}>
            {/* Button for "Alle Bücher" */}
            <button
              className={styles.navButton}
              onClick={() => {
                setActiveTab("books");
                setSelectedModuleId(null);
              }}
            >
              Alle Bücher
            </button>

            {/* Listing of modules */}
            {modules.map((mod) => (
              <button
                key={mod.id}
                className={styles.navButton}
                onClick={() => {
                  setActiveTab("books");
                  setSelectedModuleId(mod.id);
                }}
              >
                {mod.name}
              </button>
            ))}

            {/* New tab for password change */}
            <button
              className={styles.navButton}
              onClick={() => {
                setActiveTab("password");
              }}
            >
              Passwort ändern
            </button>
          </nav>
        </div>

        <div className={styles.bottomContainer}>
          <div className={styles.themeToggleContainer}>
            <span className={styles.themeLabel}>
              {theme === "light" ? "Dunkelmodus" : "Hellmodus"}
            </span>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={theme === "dark"}
                onChange={toggleTheme}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          {/* Logout button positioned at the bottom */}
          <button className={styles.primaryButton} onClick={handleLogout}>
            Abmelden
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {activeTab === "books" && (
            <section className={styles.card}>
              <h2>Meine Bücher</h2>
              <hr className={styles.divider} />
              {filteredBooks.length === 0 ? (
                <p>Keine Bücher gefunden.</p>
              ) : (
                <div className={styles.userTable}>
                  <div className={styles.tableHeader}>
                    <div className={styles.tableCell}>Titel</div>
                    <div className={styles.tableCell}>Modul</div>
                    <div className={styles.tableCell}>Download</div>
                  </div>
                  {filteredBooks.map((book) => (
                    <div key={book.id} className={styles.tableRow}>
                      <div className={styles.tableCell}>{book.title}</div>
                      <div className={styles.tableCell}>{book.modulo.name}</div>
                      <div className={styles.tableCell}>
                        <button
                          className={styles.primaryButton}
                          onClick={() => window.open(book.url, "_blank")}
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "password" && (
            <section className={styles.card}>
              <h2>Passwort ändern</h2>
              <hr className={styles.divider} />
              {/* Password update form with vertical layout */}
              <form
                onSubmit={handlePasswordUpdate}
                className={styles.form}
                style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
              >
                <div className={styles.formGroup}>
                  {/* Label for current password */}
                  <label htmlFor="currentPassword">Aktuelles Passwort</label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  {/* Label for new password */}
                  <label htmlFor="newPassword">Neues Passwort</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  {/* Label for confirm new password */}
                  <label htmlFor="confirmPassword">Neues Passwort bestätigen</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className={styles.primaryButton}>
                  Passwort aktualisieren
                </button>
                {passwordMessage && <p>{passwordMessage}</p>}
              </form>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
