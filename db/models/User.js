import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../Sequelize.js";
import { EMAIL_REGEX } from "../../constants/auth.js";

const User = sequelize.define("user", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: EMAIL_REGEX,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subscription: {
    type: DataTypes.ENUM,
    values: ["starter", "pro", "business"],
    defaultValue: "starter",
  },
  avatarUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  token: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
});

User.sync();

export default User;
