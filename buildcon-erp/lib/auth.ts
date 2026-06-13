"use client";

export type Role = "chairman" | "md" | "project-director" | "business-director" | "finance-director" | "super-admin" | "admin" | "construction-manager" | "marketing-manager" | "hr-manager" | "digital-marketing-tl" | "digital-marketing-executive" | "sales-executive" | "project-manager" | "quantity-surveyor" | "procurement-manager" | "finance-accounts" | "site-management" | "workforce-manager" | "subcontractor" | "senior-site-engineer";

export interface Session { email: string; role: Role; name: string; organizationId?: number; }

const KEY = "buildcon_session";

export async function login(email: string, password: string, allowedRoles: Role[]): Promise<Session | null> {
  try {
    const res = await fetch("http://localhost:8081/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }) // Username holds the identifier
    });
    
    if (res.ok) {
      const data = await res.json();
      // Map returned roles (e.g. ROLE_CHAIRMAN) back to local role types
      let matchedRole: Role | null = null;
      const backendRoles = data.roles || [];
      
      for (const r of backendRoles) {
        const cleaned = r.replace("ROLE_", "").toLowerCase().replace("_", "-");
        matchedRole = cleaned as Role;
      }
      
      if (matchedRole && allowedRoles.includes(matchedRole)) {
        const s: Session = { 
          email: data.email || email, 
          role: matchedRole, 
          name: data.username,
          organizationId: data.organizationId
        };
        localStorage.setItem(KEY, JSON.stringify(s));
        localStorage.setItem("buildcon_token", data.token); // Use token property from backend
        return s;
      }
    }
  } catch (e) {
    console.error("Backend signin failed", e);
  }

  return null;
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; }
}

export function logout() { 
  localStorage.removeItem(KEY);
  localStorage.removeItem("buildcon_token");
}

export function homeForRole(role: Role): string {
  switch (role) {
    case "chairman": return "/chairman";
    case "md": return "/md";
    case "project-director": return "/project-director";
    case "business-director": return "/business-director";
    case "finance-director": return "/finance-director";
    case "super-admin":
    case "admin": return "/super-admin";
    case "construction-manager": return "/construction-manager";
    case "marketing-manager": return "/marketing-manager";
    case "digital-marketing-tl": return "/digital-marketing-tl";
    case "digital-marketing-executive": return "/digital-marketing-executive";
    case "sales-executive": return "/sales-executive";
    case "project-manager": return "/project-manager";
    case "quantity-surveyor": return "/quantity-surveyor";
    case "procurement-manager": return "/procurement-manager";
    case "finance-accounts": return "/finance-accounts";
    case "site-management": return "/site-management";
    case "workforce-manager": return "/workforce-manager";
    case "subcontractor": return "/subcontractor";
    case "senior-site-engineer": return "/senior-site-engineer";
    case "hr-manager": return "/hr-manager";
  }
}
