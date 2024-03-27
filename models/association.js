const { House, Image } = require('./houseModel');
const Broker = require("./brokerModel")


const setAssociations = function() {
Broker.hasMany(House, { foreignKey: 'brokerId',  onDelete: 'CASCADE' });
House.belongsTo(Broker, { foreignKey: 'brokerId' });


House.hasMany(Image, { foreignKey: 'houseId', onDelete: 'CASCADE' } );
Image.belongsTo(House, { foreignKey: "houseId" })
 }
module.exports = setAssociations;
 
