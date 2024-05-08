const { House, Image } = require('./houseModel');
const Broker = require("./brokerModel");
const Guarantor = require('./guarantorModel');
const User = require('./userModel');


const setAssociations = function() {
Broker.hasMany(House, { foreignKey: 'brokerId',  onDelete: 'CASCADE' });
House.belongsTo(Broker, { foreignKey: 'brokerId' });


House.hasMany(Image, { foreignKey: 'houseId', onDelete: 'CASCADE' } );
Image.belongsTo(House, { foreignKey: "houseId" });
    
User.hasOne(Guarantor, {foreignKey:"userId", onDelete:"CASCADE"})
Guarantor.belongsTo(User, {foreignKey: "userId"})
 }
module.exports = setAssociations;
 
