import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/User";
import { RoleModel } from "../models/Role";
import { verifyToken } from "../utils/auth";
import { AuthenticatedUser } from "../types";

/**
 * Middleware to authenticate requests using our own JWT.
 * Expects Authorization header: Bearer <token>
 * Role/permissions are always read fresh from the database on every
 * request, so revoking a permission or reassigning a role takes effect
 * immediately without requiring the user to log in again.
 */
export async function authenticateRequest(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Missing or invalid authorization header" });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const payload = verifyToken(token);

    const user = await UserModel.findById(payload.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const role = await RoleModel.findById(user.roleId);

    if (!role) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const authenticatedUser: AuthenticatedUser = {
      id: user._id.toString(),
      email: user.email,
      isActive: user.isActive,
      role: { id: role._id.toString(), name: role.name, slug: role.slug },
      permissions: role.permissions,
    };

    req.user = authenticatedUser;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

/**
 * Middleware factory requiring the authenticated user to have a specific
 * permission. Must be used after `authenticateRequest`.
 */
export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
}

/**
 * Middleware factory requiring the authenticated user to have at least one
 * of the given permissions. Must be used after `authenticateRequest`.
 */
export function requireAnyPermission(permissions: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (
      !permissions.some((permission) =>
        req.user!.permissions.includes(permission),
      )
    ) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
}
