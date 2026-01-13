module.exports = (sequelize, DataTypes) => {
  const Shift = sequelize.define("Shift", {
    ShiftID: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUID,
    },
    WorkerWorkerID: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Workers",
        key: "WorkerID",
      },
    },
    ScheduleScheduleID: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Schedules",
        key: "ScheduleID",
      },
    },
    ShiftDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    StartTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    EndTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  });
  console.log(Shift === sequelize.models.Shift);
  return Shift;
};
