const bcrypt = require('bcrypt')

const bcryptUtils = {
    hashPassword : async (plainPassword) => {
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(plainPassword, saltRounds)
            return hashedPassword
        } catch (error) {
            console.log('error from bcrypt hash', error);
        }
    },

    comparePassword : async (password, hashedPassword) => {
        try {
            return bcrypt.compare(password, hashedPassword)
        } catch (error) {
            console.log('error from bcrypt compare', error);
        }
    }
}

module.exports = bcryptUtils