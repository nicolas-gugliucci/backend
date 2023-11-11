import {userModel} from "../../schemas/user.schema.js"

export default class UserDAO {

    getAll = async() => {
        try {
            let users = await userModel.find()
            return users.map(user => user.toObject())
        } catch (error) {
            return { message: error.message, error: error.name }
        }
    }
    saveUser = async(user)=>{
        try {
            let result = (await userModel.create(user)).populate('cart._id').lean()
            return result
        } catch (error) {
            return { message: error.message, error: error.name }
        }
    }

    getById = async (param) => {
        try {
            let result = await userModel.findOne(param)
            return result
        } catch (error) {
            return { message: error.message, error: error.name }
        }
    }

    updateUser = async (id, user) => {
        try {
            let result = await userModel.updateOne({_id:id},{$set:user})
            return result
        } catch (error) {
            return { message: error.message, error: error.name }
        }
    }

    deleteUser = async (email) => {
        try {
            const result = await userModel.deleteOne({email: email})
            return result
        } catch (error) {
            return { message: error.message, error: error.name }
        }
    }
}