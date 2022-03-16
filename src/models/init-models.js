const {DataTypes} = require("sequelize");
const _SequelizeMetum = require("./SequelizeMetum");
const _User = require("./User");

function initModels(sequelize) {
  const SequelizeMetum = _SequelizeMetum(sequelize, DataTypes);
  const User = _User(sequelize, DataTypes);


  return {
    SequelizeMetum,
    User,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
