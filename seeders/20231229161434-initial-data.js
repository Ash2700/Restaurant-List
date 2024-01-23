'use strict'
const bcrypt = require('bcryptjs')
const seedData = require('../public/jsons/restaurant.json').results

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let transaction

    try {
      transaction = await queryInterface.sequelize.transaction()
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash('12345678', salt)

      await queryInterface.bulkInsert('Users', [
        {
          email: 'user1@example.com',
          password: hash,
          createdAt: new Date(),
          updatedAt: new Date()
        }, {
          email: 'user2@example.com',
          password: hash,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction })

      await queryInterface.bulkInsert('restaurants',
        seedData.map((data) => ({
          
          name: data.name,
          name_en: data.name_en,
          category: data.category,
          image: data.image,
          location: data.location,
          phone: data.phone,
          google_map: data.google_map,
          rating: data.rating,
          description: data.description,
          userID: data.userID,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        ),{transaction}
      )
      await transaction.commit()
    } catch (error) {
      console.error(error)
      if(transaction) await transaction.rollback()
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null)
  }
}
