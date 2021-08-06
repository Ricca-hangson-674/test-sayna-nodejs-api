import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors   from 'colors'
import faker from 'faker'
import bcrypt from 'bcryptjs'

import connectDB from './src/config/db.js'

import User from './src/models/userModel.js'

dotenv.config()

connectDB()

const importData = async () => {
    try {
        await User.deleteMany()

        let users = []
        for (let i = 0; i < 5; i++) {

            users = [...users, {
                firstname       : faker.name.firstName(),
                lastname        : faker.name.lastName(),
                sexe			: faker.name.gender(),
                date_naissance  : faker.date.past(),
                email           : faker.internet.email(),
        		password 		: bcrypt.hashSync('password', 10)
            }]
        }

        // Users
        console.log('Users')
        const createUsers = await User.insertMany(users)

    	console.log('Data Imported!'.green.inverse)
        process.exit()
    }catch (error) {
        console.error(`${error}`.red.inverse)
        process.exit(1)
    }
}

const destroyData = async () => {
    try {
        await User.deleteMany()

        console.log('Data Imported!'.green.inverse)
        process.exit()
    }catch (error) {
        console.error(`${error}`.red.inverse)
        process.exit(1)
    }
}

if (process.argv[2] === '-d') {
    destroyData()
} else {
    importData()
}