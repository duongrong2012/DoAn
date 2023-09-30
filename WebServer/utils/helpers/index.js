const request = require('./request');

module.exports = {
    ...request,
}

module.exports.getFilePath = (file) => {
    const fileDestination = file.destination.replace('public', '')

    return `${fileDestination}${file.filename}`
}

