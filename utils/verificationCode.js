

exports.generateVerificationCode = (digit = 6) => {

     // eslint-disable-next-line prefer-const
     let opt = '';
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < digit; i++) {

        // eslint-disable-next-line no-undef
        opt += Math.floor(Math.random() * 10);
    }

    return opt;
}

exports.generatePasswordRandom = (digit = 8) => {

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < digit; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
      }
    
      return password;
}


// module.exports = generateVerificationCode;