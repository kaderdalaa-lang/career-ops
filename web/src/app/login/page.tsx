"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let unsubscribe = () => {};
    try {
      const supabase = getSupabase();
      supabase.auth.getUser().then(({ data }) => setUser(data.user));
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      unsubscribe = () => data.subscription.unsubscribe();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Erreur inconnue");
    }
    return unsubscribe;
  }, []);

  async function submit(mode: "signin" | "signup") {
    setBusy(true);
    setMessage("");
    try {
      const supabase = getSupabase();
      const { error } =
        mode === "signin"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });
      if (error) setMessage(error.message);
      else if (mode === "signup")
        setMessage("Compte créé. Vérifie ton e-mail si une confirmation est demandée.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    try {
      await getSupabase().auth.signOut();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Erreur inconnue");
    }
  }

  const field = "w-full rounded-md border px-3 py-2 text-sm bg-transparent";
  const button = "rounded-md border px-3 py-2 text-sm disabled:opacity-50";

  return (
    <main className="mx-auto max-w-sm space-y-4 p-6">
      <h1 className="text-xl font-semibold">Connexion Supabase</h1>

      {user ? (
        <div className="space-y-3">
          <p className="text-sm">Connecté : {user.email}</p>
          <button className={button} onClick={signOut}>
            Se déconnecter
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            className={field}
            type="email"
            placeholder="E-mail"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className={field}
            type="password"
            placeholder="Mot de passe"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex gap-2">
            <button className={button} disabled={busy} onClick={() => submit("signin")}>
              Se connecter
            </button>
            <button className={button} disabled={busy} onClick={() => submit("signup")}>
              Créer un compte
            </button>
          </div>
        </div>
      )}

      {message && <p className="text-sm">{message}</p>}
    </main>
  );
}
