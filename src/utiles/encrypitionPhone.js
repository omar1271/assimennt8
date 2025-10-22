import crypto from 'crypto';

const ENCRYPTION_KEY = crypto.randomBytes(32);
const IV = crypto.randomBytes(16);

export const encryptPhone = (phone) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
  let encrypted = cipher.update(phone, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
};
