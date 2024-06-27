"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query("SELECT id FROM Users", {
      type: queryInterface.sequelize.QueryTypes.SELECT,
    });

    await queryInterface.bulkInsert("Followships", [
      {
        follower_id: 11,
        following_id: users[0].id,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        follower_id: 11,
        following_id: users[1].id,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        follower_id: 11,
        following_id: users[2].id,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        follower_id: users[users.length - 1].id,
        following_id: 11,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        follower_id: users[users.length - 2].id,
        following_id: 11,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
