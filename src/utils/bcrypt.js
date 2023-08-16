import bcrypt from 'bcrypt'

export const createHash = async (password) => {
    const salts = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salts)
}

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)
