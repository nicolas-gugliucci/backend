import userDAO from "../models/daos/mongoDB/users.dao.js"

const dao = new userDAO()

export default class UserService{

    getAll = async() => {
        const users = await dao.getAll()
        return users.map(user => user.toObject())
    }
    saveUser = async(user)=>{
        const result = await dao.saveUser(user)
        return result
    }

    getById = async (param) => {
        const result = await dao.getById(param)
        return result
    }

    updateUser = async (id, user) => {
        delete user._id
        const result = await dao.updateUser(id, user)
        return result
    }

    deleteUser = async (email) => {
        const result = await dao.deleteUser(email)
        return result
    }

}