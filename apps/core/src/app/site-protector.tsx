"use client";

import { useState } from "react";
import { verifyPassword } from "./actions";

type Props = {
  children: React.ReactNode;
};

const SiteProtector = ({ children }: Props) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isAuthenticated = sessionStorage.getItem("isAuthenticated");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isPasswordValid = await verifyPassword(password);

    if (isPasswordValid) {
      sessionStorage.setItem("isAuthenticated", "true");
      window.location.reload();
    } else {
      setError("Incorrect password");
    }
  };

  if (!isAuthenticated) {
    return (
      <html>
        <body>
          <div>
            <h1>Password protected website</h1>
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
              <button type="submit">Submit</button>
            </form>
            {error && <p>{error}</p>}
          </div>
        </body>
      </html>
    );
  }

  return children;
};

export default SiteProtector;
