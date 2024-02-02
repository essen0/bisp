const UserModel = require('../models/userModels')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mailService')
const tokenService = require('./tokenService')
const UserDto = require('../dtos/userdto')
const ApiError = require('../exceptions/apiError')
const userModels = require('../models/userModels')

class UserService {
    async registration (email, password) {
        // checking for existance 
        const candidate = await UserModel.findOne({email})
        if(candidate) {
            throw ApiError.BadRequest(`Пользоватьль с такие ${email} уже существует`)
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const activationLink = uuid.v4()
        // hashing and sending email for activation
        const user = await UserModel.create({email, password:hashPassword, activationLink})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}` )
        //creating tokens ... refresh tokens 
        const userDto = new UserDto(user) // id,email,isActivated 
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens, 
            user: userDto
        }
    }
    async activate(activationLink){
        const user = await UserModel.findOne({activationLink})
        if(!user){
            throw ApiError.BadRequest('Не коректнная ссылка активации')
        }
        user.isActivated = true
        await user.save()
    }
    async login(email, password) {
        const user = await UserModel.findOne({email})
        if(!user) {
            throw ApiError.BadRequest('Пользователь с таким имэйлом не найден')
        }
        if(!user.isActivated){
            throw ApiError.BadRequest('Активируйте аккаунт')
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if(!isPassEquals) {
            throw ApiError.BadRequest('Неправельный пароль')
        }
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return{...tokens, userDto} 
     }
     async logout(refreshToken) {
        const token  = await tokenService.removeToken(refreshToken)
        return token
    }
    async refresh(refreshToken) {
        if(!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if(!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError()
        }
        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return{...tokens, userDto}

    }
    async getAllUser() {
        const users = await UserModel.find()
        return users
    }
}

module.exports = new UserService()