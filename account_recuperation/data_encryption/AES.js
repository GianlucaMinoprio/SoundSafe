const crypto = require('crypto');

// Clé de chiffrement et IV (Initialisation Vector)
// Dans une application réelle, stockez ces éléments de manière sécurisée et ne les hardcodez pas //  FIXME !!
const ENCRYPTION_KEY = 'my32lengthsupersecretnooneknows1'; // Doit être de 32 octets (256 bits)
const IV_LENGTH = 16; // Pour AES, c'est toujours 16

function encrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}

// Exemple d'utilisation
const data = "laurick@gmail.com";
const encryptedData = encrypt(data);
console.log("Données chiffrées:", encryptedData);

const decryptedData = decrypt(encryptedData);
console.log("Données déchiffrées:", decryptedData);
