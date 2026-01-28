import * as teacherService from '../services/teacher.service.js'
import { addMark } from './mark.controller.js'

export const addMarks = async (req, res, next) => {
    try {
        const result = await teacherService.addMarks(req.user, req.body)
        res.status(201).json(result)
    } catch (error) {
        next(error)
    }
}

export const markAttendance = async (req, res, next) => {
    try {
        const result = await teacherService.markAttendance(req.user, req.body)
        res.status(201).json(result)
    } catch (error) {
        next(error)
    }
}

export const getMyStudents = async (req, res, next) => {
    try {
        const result = await teacherService.getMyStudents(req.user)
        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}