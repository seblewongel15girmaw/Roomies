const { House, Image } = require('./houseModel');
const Broker = require('./brokerSignModel')


Broker.hasMany(House, { foreignKey: 'brokerId' });
House.belongsTo(Broker, { foreignKey: 'brokerId' });


House.hasMany(Image, { foreignKey: 'houseId' });
Image.belongsTo(House, { foreignKey: "houseId" })