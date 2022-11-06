const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
    origin: (origin, callback) => {
        // only in array can access (screen out postman)
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true, // access control allow credentials header
    optionsSuccessStatus: 200 // smart tvs 204 problem
}

module.exports = corsOptions