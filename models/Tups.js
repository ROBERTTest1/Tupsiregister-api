module.exports = (sequelize, DataTypes) => {
  const Tups = sequelize.define("Tups", {
    TupsID: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUID,
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Strength: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
  });
  console.log(Tups === sequelize.models.Tups);
  return Tups;
};
