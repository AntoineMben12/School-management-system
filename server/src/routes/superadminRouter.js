import express from "express";
import * as controller from "../controllers/superadmin.controller.js";
import checkRole from "../middleware/role.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes require Auth + SuperAdmin role
router.use(authMiddleware);
router.use(checkRole(["super_admin"]));

// ── Dashboard ─────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /superadmin/dashboard:
 *   get:
 *     tags: [SuperAdmin - Dashboard]
 *     summary: Get global platform metrics
 *     description: >
 *       Returns aggregated platform-wide metrics including total schools,
 *       users, students, teachers, revenue, and licenses expiring soon.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Global metrics retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GlobalMetrics'
 *             example:
 *               total_schools: 15
 *               active_schools: 12
 *               total_users: 4800
 *               total_students: 4200
 *               total_teachers: 350
 *               total_revenue: 125000
 *               expiring_soon: 3
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/dashboard", controller.dashboard);

// ── Schools ───────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /superadmin/schools:
 *   get:
 *     tags: [SuperAdmin - Schools]
 *     summary: List all schools
 *     description: >
 *       Returns a paginated list of all school tenants on the platform.
 *       Supports free-text search (matched against school name and email)
 *       and filtering by status.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/searchParam'
 *       - name: status
 *         in: query
 *         description: Filter schools by status.
 *         schema:
 *           type: string
 *           enum: [active, inactive, suspended]
 *           example: active
 *     responses:
 *       200:
 *         description: Schools retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SchoolsListResponse'
 *             example:
 *               data:
 *                 - school_id: 1
 *                   name: Springfield High School
 *                   address: 742 Evergreen Terrace, Springfield
 *                   phone: "+1234567890"
 *                   email: info@springfield.edu
 *                   status: active
 *                   student_count: 320
 *                   teacher_count: 25
 *                   created_at: "2024-01-15T08:00:00.000Z"
 *               pagination:
 *                 total: 15
 *                 page: 1
 *                 limit: 10
 *                 totalPages: 2
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/schools", controller.getSchools);

/**
 * @swagger
 * /superadmin/schools/{schoolId}:
 *   get:
 *     tags: [SuperAdmin - Schools]
 *     summary: Get a school by ID
 *     description: Returns the full details of a single school tenant.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/schoolIdPath'
 *     responses:
 *       200:
 *         description: School retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/School'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/schools/:schoolId", controller.getSchoolById);

/**
 * @swagger
 * /superadmin/schools:
 *   post:
 *     tags: [SuperAdmin - Schools]
 *     summary: Create a new school tenant
 *     description: >
 *       Provisions a complete new school tenant in a single atomic request.
 *       This creates the school record, an optional license, and the initial
 *       school admin account. If `license` is omitted a default basic 1-year
 *       license is applied automatically.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSchoolRequest'
 *           example:
 *             school:
 *               name: Springfield High School
 *               address: 742 Evergreen Terrace, Springfield
 *               phone: "+1234567890"
 *               email: info@springfield.edu
 *             license:
 *               plan_name: standard
 *               end_date: "2025-12-31"
 *               max_students: 500
 *             admin:
 *               username: admin_springfield
 *               email: admin@springfield.edu
 *               password: AdminPass123!
 *               first_name: Alice
 *               last_name: Morgan
 *     responses:
 *       201:
 *         description: School tenant provisioned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: School created successfully.
 *                 school_id:
 *                   type: integer
 *                   example: 7
 *                 admin_id:
 *                   type: integer
 *                   example: 42
 *                 license_id:
 *                   type: integer
 *                   example: 7
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post("/schools", controller.createSchool);

/**
 * @swagger
 * /superadmin/schools/{schoolId}:
 *   put:
 *     tags: [SuperAdmin - Schools]
 *     summary: Update a school
 *     description: >
 *       Updates one or more fields of an existing school. Only the fields
 *       present in the request body are modified; omitted fields retain
 *       their current values.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/schoolIdPath'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSchoolRequest'
 *           example:
 *             name: Springfield High School (Renamed)
 *             status: active
 *     responses:
 *       200:
 *         description: School updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *             example:
 *               message: School updated successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put("/schools/:schoolId", controller.updateSchool);

/**
 * @swagger
 * /superadmin/schools/{schoolId}:
 *   delete:
 *     tags: [SuperAdmin - Schools]
 *     summary: Delete a school
 *     description: >
 *       Permanently deletes a school tenant and all associated data including
 *       users, classes, marks, and license records. **This action is
 *       irreversible.** Ensure all data is backed up before proceeding.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/schoolIdPath'
 *     responses:
 *       200:
 *         description: School deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *             example:
 *               message: School deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.delete("/schools/:schoolId", controller.deleteSchool);

// ── Licenses ──────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /superadmin/licenses:
 *   get:
 *     tags: [SuperAdmin - Licenses]
 *     summary: List all licenses
 *     description: >
 *       Returns a paginated list of all school licenses on the platform.
 *       Supports free-text search (matched against school name) and
 *       filtering by license status (`active`, `expired`, or `suspended`).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/searchParam'
 *       - name: status
 *         in: query
 *         description: Filter licenses by status.
 *         schema:
 *           type: string
 *           enum: [active, expired, suspended]
 *           example: active
 *     responses:
 *       200:
 *         description: Licenses retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LicensesListResponse'
 *             example:
 *               data:
 *                 - license_id: 1
 *                   school_id: 1
 *                   school_name: Springfield High School
 *                   plan_name: standard
 *                   start_date: "2024-01-01"
 *                   end_date: "2025-12-31"
 *                   status: active
 *                   max_students: 500
 *                   student_count: 320
 *                   days_remaining: 180
 *               pagination:
 *                 total: 15
 *                 page: 1
 *                 limit: 10
 *                 totalPages: 2
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/licenses", controller.getLicenses);

/**
 * @swagger
 * /superadmin/licenses/{schoolId}:
 *   put:
 *     tags: [SuperAdmin - Licenses]
 *     summary: Update a school's license
 *     description: >
 *       Updates any subset of license fields for the specified school.
 *       Use this endpoint to change the plan, adjust the student cap,
 *       or manually set the license status. To extend the expiry date
 *       use the dedicated `PUT /superadmin/licenses/{licenseId}/renew`
 *       endpoint instead.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/schoolIdPath'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateLicenseRequest'
 *           example:
 *             plan_name: premium
 *             max_students: 1000
 *             status: active
 *     responses:
 *       200:
 *         description: License updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *             example:
 *               message: License updated successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put("/licenses/:schoolId", controller.updateLicense);

/**
 * @swagger
 * /superadmin/licenses/{licenseId}/renew:
 *   put:
 *     tags: [SuperAdmin - Licenses]
 *     summary: Renew a license
 *     description: >
 *       Extends (renews) an existing license by setting a new expiry date.
 *       The `end_date` field is required. Optionally update the plan name
 *       and maximum student count at the same time. The license status is
 *       automatically set back to `active` upon renewal.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/licenseIdPath'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RenewLicenseRequest'
 *           example:
 *             end_date: "2026-12-31"
 *             plan_name: standard
 *             max_students: 500
 *     responses:
 *       200:
 *         description: License renewed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *             example:
 *               message: License renewed successfully
 *       400:
 *         description: end_date is required or is invalid.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: end_date is required
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.put("/licenses/:licenseId/renew", controller.renewLicense);

// ── Finance ───────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /superadmin/finance/summary:
 *   get:
 *     tags: [SuperAdmin - Finance]
 *     summary: Get finance summary
 *     description: >
 *       Returns high-level financial metrics for the entire platform:
 *       total all-time revenue, current month revenue, number of active
 *       schools, pending payments, and expired licenses.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Finance summary retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FinanceSummary'
 *             example:
 *               total_revenue: 125000
 *               monthly_revenue: 12500
 *               active_schools: 10
 *               pending_payments: 3
 *               expired_licenses: 2
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/finance/summary", controller.getFinanceSummary);

/**
 * @swagger
 * /superadmin/finance/payments:
 *   get:
 *     tags: [SuperAdmin - Finance]
 *     summary: Get recent payments
 *     description: >
 *       Returns a paginated list of payment records across all schools,
 *       sorted by date descending. Supports free-text search matched
 *       against school name and plan name.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/searchParam'
 *     responses:
 *       200:
 *         description: Payments retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentsListResponse'
 *             example:
 *               data:
 *                 - payment_id: 1
 *                   school_id: 2
 *                   school_name: Springfield High School
 *                   amount: 2500
 *                   date: "2024-03-01T10:00:00.000Z"
 *                   status: paid
 *                   plan_name: standard
 *               pagination:
 *                 total: 45
 *                 page: 1
 *                 limit: 10
 *                 totalPages: 5
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/finance/payments", controller.getRecentPayments);

// ── Users ─────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /superadmin/users:
 *   get:
 *     tags: [SuperAdmin - Users]
 *     summary: List all platform users
 *     description: >
 *       Returns a paginated list of all user accounts across every school on
 *       the platform. Supports free-text search (matched against username and
 *       email) and filtering by role. Super admin accounts are included.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/searchParam'
 *       - $ref: '#/components/parameters/roleFilterParam'
 *     responses:
 *       200:
 *         description: Users retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersListResponse'
 *             example:
 *               data:
 *                 - user_id: 1
 *                   username: john_doe
 *                   email: john@school.com
 *                   role: teacher
 *                   school_id: 1
 *                   school_name: Springfield High School
 *                   is_active: true
 *                   created_at: "2024-01-15T08:00:00.000Z"
 *                   last_login: "2024-06-01T09:30:00.000Z"
 *               pagination:
 *                 total: 4800
 *                 page: 1
 *                 limit: 12
 *                 totalPages: 400
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get("/users", controller.getUsers);

/**
 * @swagger
 * /superadmin/users/{userId}/toggle-active:
 *   patch:
 *     tags: [SuperAdmin - Users]
 *     summary: Toggle a user's active status
 *     description: >
 *       Activates or deactivates a user account platform-wide.
 *       Deactivated users cannot log in. Super admin accounts
 *       should not be deactivated through this endpoint to avoid
 *       losing platform access.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/userIdPath'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ToggleUserActiveRequest'
 *           examples:
 *             activate:
 *               summary: Activate a user
 *               value:
 *                 is_active: true
 *             deactivate:
 *               summary: Deactivate a user
 *               value:
 *                 is_active: false
 *     responses:
 *       200:
 *         description: User status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *             examples:
 *               activated:
 *                 summary: User activated
 *                 value:
 *                   message: User activated successfully
 *               deactivated:
 *                 summary: User deactivated
 *                 value:
 *                   message: User deactivated successfully
 *       400:
 *         description: is_active field is missing from the request body.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: is_active is required
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.patch("/users/:userId/toggle-active", controller.toggleUserActive);

export default router;
