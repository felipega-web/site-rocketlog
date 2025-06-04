import { env } from "@/env"

export const AuthConfig = {
    jwt: {
        secret: env.JWT_SECRET,
        expiresIn: '1d',
    },
}