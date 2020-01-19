const Sequelize = require("sequelize");
const Model = Sequelize.Model;

class TransactionLog extends Model {}

TransactionLog.init(
  {
    id: {
      type: Sequelize.INTEGER(11),
	  primaryKey: true,
      autoIncrement: true
    },
    token: Sequelize.STRING(50),
    item_class_id: Sequelize.INTEGER(11),
    item_category_id: Sequelize.INTEGER(11),
    item_id: Sequelize.INTEGER(11), 
    user_id: {
      type: Sequelize.INTEGER(11),
      references: {
        model: "users",
        key: "id"
      }
    },
    customer: Sequelize.STRING(200),
    qty: Sequelize.INTEGER,
    price: Sequelize.DOUBLE(),
    discount: Sequelize.FLOAT(),
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  },
  {
    sequelize,
    modelName: "transaction_logs"
  }
);

module.exports = TransactionLog;
