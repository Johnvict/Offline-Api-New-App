/**
 * This is a model that defines the USER TABLE
 * It gives our app a modeling of how to interract with the users table
 */

const Sequelize = require('sequelize');
const PROTECTED_ATTRIBUTES = require('./../middleware/validator').protected;
const Model = Sequelize.Model;


class User extends Model {
  toJSON () {
    // To hide protected fields such as password.. we do not want to return that to a user when he logs in
    let attributes = Object.assign({}, this.get())
    for (let a of PROTECTED_ATTRIBUTES) {
      delete attributes[a]
    }
    return attributes
  }
}
User.init(
  {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    client_id: Sequelize.INTEGER(11),
    location_id: Sequelize.INTEGER(11),
    username: {
      type: Sequelize.STRING(30),
      allowNull: false,
      unique: true
    },
    email: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING(200),
      allowNull: false
    },
    address: {
      type: Sequelize.STRING(200),
      allowNull: false
    },
    phone: {
      type: Sequelize.STRING(12),
      allowNull: false,
      unique: true
    },

    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  },
  {
    sequelize,
    modelName: "users"
  }
);

module.exports = User;
