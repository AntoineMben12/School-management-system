import express from "express";
import * as controller from "../controllers/superadmin.controller.js";
import checkRole from "../middleware/role.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes require Auth + SuperAdmin role
router.use(authMiddleware);
router.use(checkRole(["super_admin"]));

// ── Dashboard ────────────────────────────────────────────────────────────────
router.get("/dashboard", controller.dashboard);

// ── Schools ──────────────────────────────────────────────────────────────────
router.get("/schools", controller.getSchools);
router.get("/schools/:schoolId", controller.getSchoolById);
router.post("/schools", controller.createSchool);
router.put("/schools/:schoolId", controller.updateSchool);
router.delete("/schools/:schoolId", controller.deleteSchool);

// ── Licenses ─────────────────────────────────────────────────────────────────
router.get("/licenses", controller.getLicenses);
router.put("/licenses/:schoolId", controller.updateLicense);
router.put("/licenses/:licenseId/renew", controller.renewLicense);

// ── Finance ──────────────────────────────────────────────────────────────────
router.get("/finance/summary", controller.getFinanceSummary);
router.get("/finance/payments", controller.getRecentPayments);

// ── Users ────────────────────────────────────────────────────────────────────
router.get("/users", controller.getUsers);
router.patch("/users/:userId/toggle-active", controller.toggleUserActive);

export default router;
