import SuperAdminService from '../services/superadmin.service.js';

export const createSchool = async (req, res) => {
    try {
        const { school, license, admin } = req.body;

        // Basic Validation
        if (!school || !license || !admin) {
            return res.status(400).json({ message: 'Missing required fields: school, license, or admin data.' });
        }

        const result = await SuperAdminService.createSchoolTenant({
            schoolData: school,
            licenseData: license,
            adminData: admin
        });

        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
};

export const dashboard = async (req, res) => {
    try {
        const metrics = await SuperAdminService.getGlobalMetrics();
        res.json(metrics);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching dashboard metrics' });
    }
};

export const updateLicense = async (req, res) => {
    try {
        const { schoolId } = req.params;
        const { plan_name, end_date, status, max_students } = req.body;

        await SuperAdminService.updateLicense(schoolId, { plan_name, end_date, status, max_students });
        res.json({ message: 'License updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating license' });
    }
};
