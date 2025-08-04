"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const supabase = createClient();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(false);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

    if (error) {
      console.error("Error sending magic link:", error);
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div>
      <h1>Sign In with Magic Link</h1>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Magic Link</button>
      </form>
      {submitted && <p>Please check your email for the magic link.</p>}
    </div>
  );
}
