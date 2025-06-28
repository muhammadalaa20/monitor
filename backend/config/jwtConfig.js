// config/jwtConfig.js

import dotenv from 'dotenv';
dotenv.config();

export const jwtSecret = process.env.JWT_SECRET || 'super_secret_fallback';
export const jwtExpiry = '3d'; // 3 days token lifetime
