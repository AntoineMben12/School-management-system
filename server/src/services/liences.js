import * as licenseModel from '../models/licences.js'

export const createLicense = async (data) => {
    if (new Date(data.endDate) <= new Date(data.startDate)) {
        throw new Error('End date must be greater than start date')
    }
    return licenseModel.create(data)
}