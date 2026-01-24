const school = require('../models/school')
const licenseService = require('../services/license.service')
const admin = require('../models/admin')

exports.createSchool = async (req, res) => {
    const School = await school.create(req.body)
    res.status(200).json({
        success: true,
        message: "School created successfully",
        data: School
    })
}

exports.grantLicense = async (req, res) => {
    const license = await licenseService.createLicense(req.body)
    res.status(200).json({
        success: true,
        message: "License granted successfully",
        data: license
    })
}

exports.createSchoolAdmin = async (req, res) => {
    const admin = await admin.create(req.body)
    res.status(200).json({
        success: true,
        message: "School admin created successfully",
        data: admin
    })
}

exports.updateSchoolStatus = async (req, res) => {
    const school = await school.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json({
        success: true,
        message: "School status updated successfully",
        data: school
    })
}

exports.dashboard = async (req, res) => {
    const stats = await school.getGlobalStats()
    res.json(stats)
}
