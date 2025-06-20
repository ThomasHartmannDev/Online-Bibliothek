// src/app/login/page.tsx
"use client";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "./page.module.css";
import { jwtDecode } from "jwt-decode";


// Define the interface for the JWT payload (assuming it contains a "role" property)
interface TokenPayload {
  role: string;
  name: string;
}

// Helper function to determine the redirect route based on the user's role
function getRedirectRoute(token: string): string {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const role = decoded.role;
      if (role === "ADMIN") return "/admin";
      if (role === "ITSUPPORT") return "/dashboard";
      if (role === "STUDENT") return "/";
      return "/404";
    } catch (error) {
      return "/4O4";
    }
  }

export default function LoginPage() {
  const router = useRouter();

  // If a token exists, decode it and redirect the user to the correct page
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const route = getRedirectRoute(token);
      router.push(route);
    }
  }, [router]);

  // States for storing email, password, and error messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Function to handle form submission using axios
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("token", token);
      const route = getRedirectRoute(token);
      router.push(route);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || "An error occurred.");
      }
    }
  }

  return (
    <main className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </main>
  );
}
