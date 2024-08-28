'use strict'
const bcrypt = require('bcryptjs')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        email: 'root@example.com',
        password: await bcrypt.hash('1234', 10),
        is_admin: true,
        name: 'Root',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        email: 'user1@example.com',
        password: await bcrypt.hash('1234', 10),
        is_admin: false,
        name: 'User1',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        email: 'user2@example.com',
        password: await bcrypt.hash('1234', 10),
        is_admin: false,
        name: 'User2',
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', {})
  }
}
