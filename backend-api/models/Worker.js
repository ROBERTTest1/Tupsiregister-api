module.exports = (sequelize, DataTypes) => {
  const Worker = sequelize.define("Worker", {
    WorkerID: {
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
  console.log(Worker === sequelize.models.Worker);
  return Worker;
};
