module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    UserID: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    EmailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    PasswordHASH: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    DisplayName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    IsAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  });
  console.log(User === sequelize.models.User);
  return User;
};
