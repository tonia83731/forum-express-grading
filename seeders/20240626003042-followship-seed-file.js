'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT id FROM Users', {
      type: queryInterface.sequelize.QueryTypes.SELECT
    })

    await queryInterface.bulkInsert('Followships', [
      {
        follower_id: users[Math.floor(Math.random() * users.length)].id,
        following_id: users[Math.floor(Math.random() * users.length)].id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        follower_id: users[Math.floor(Math.random() * users.length)].id,
        following_id: users[Math.floor(Math.random() * users.length)].id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        follower_id: users[Math.floor(Math.random() * users.length)].id,
        following_id: users[Math.floor(Math.random() * users.length)].id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        follower_id: users[Math.floor(Math.random() * users.length)].id,
        following_id: users[Math.floor(Math.random() * users.length)].id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        follower_id: users[Math.floor(Math.random() * users.length)].id,
        following_id: users[Math.floor(Math.random() * users.length)].id,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
}
