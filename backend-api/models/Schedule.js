module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define("Schedule", {
    ScheduleID: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    ScheduleName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "Name",
    },
    StartDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    EndDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  });
  console.log(Schedule === sequelize.models.Schedule);
  return Schedule;
};
