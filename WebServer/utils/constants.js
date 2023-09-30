const ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports.defaultResponse = {
  ok: true,
  message: '',
  results: null,
}

module.exports.accountStatus = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
}

module.exports.jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //token duoc lay tu header Bearer,
  secretOrKey: process.env.JWT_SECRET,
};

module.exports.multerErrorMessages = {
  LIMIT_PART_COUNT: 'Too many parts',
  LIMIT_FILE_SIZE: 'Kích thước tệp quá lớn',
  LIMIT_FILE_COUNT: 'Quá nhiều tệp',
  LIMIT_FIELD_KEY: 'Field name too long',
  LIMIT_FIELD_VALUE: 'Field value too long',
  LIMIT_FIELD_COUNT: 'Too many fields',
  LIMIT_UNEXPECTED_FILE: 'Unexpected field',
  MISSING_FIELD_NAME: 'Field name missing'
}

module.exports.mongooseCastErrorField = {
  genre: 'Thể loại'
}

module.exports.DefaultPageLimit = 10
