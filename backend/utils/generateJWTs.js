import jwt from  'jsonwebtoken'

const generateJWTs= (user_id)=>{
    const accessToken = jwt.sign(
        { id : user_id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn : '30m'}
    )

    const refreshToken = jwt.sign(
        { id : user_id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn : "7d"}
    )

    return { accessToken, refreshToken }
}

export default generateJWTs