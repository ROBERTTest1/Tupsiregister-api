module.exports = (sequelize, DataTypes) => {
  const Shift = sequelize.define("Shift", {
    ShiftID: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUID,
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
