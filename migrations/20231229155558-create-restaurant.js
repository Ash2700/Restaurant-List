'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('restaurants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      name_en:{
        type:Sequelize.STRING
      },
      category:{
        type:Sequelize.STRING
      },
      image:{
        type:Sequelize.STRING
      },
      location:{
        type:Sequelize.STRING
      },
      phone:{
        type:Sequelize.STRING
      },
      google_map:{
        type:Sequelize.STRING
      },
      rating:{
        type:Sequelize.FLOAT
      },
      description:{
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('restaurants');
  }
};