module.exports = (sequelize, DataTypes) => {
  const Worker = sequelize.define("Worker", {
    WorkerID: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUID,
    },
    FirstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    LastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Workload: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    IsActive: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  console.log(Worker === sequelize.models.Worker);
  return Worker;
};
