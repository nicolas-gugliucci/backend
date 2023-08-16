import userModel from "../models/Users.model.js";

export default class Users{
    constructor(){}
    getAll = async() => {
        let users = await userModel.find().populate('carts')
        return users.map(user => user.toObject())
    }
    saveUser = async(user)=>{
        let result = await userModel.create(user)
        return result
    }

    getById = async (param) => {
        let result = await userModel.findOne(param).populate('carts').lean()
        return result
    }

    updateUser = async (id, user) => {
        delete user._id
        let result = await userModel.updateOne({_id:id},{$set:user})
        return result
    }
}