/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
 return knex.schema.createTable("blacklisted_tokens", (table) => {
    table.increments("id").primary().notNullable(),
      table.text("token").notNullable(),
      table.timestamp("expires_at").notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists("blacklisted_tokens");
};
