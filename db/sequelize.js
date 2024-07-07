const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgresql://postgres.indgkajyyhexktcjuwjb:cropthemyoung.@aws-0-eu-central-1.pooler.supabase.com:6543/postgres')

module.exports = { sequelize, DataTypes };