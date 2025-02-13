/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
   return knex.schema.createTable("posts",(table)=>{
        table.increments('id').primary(),
        table.integer('authorId').notNullable(),
        table.string('title').notNullable(),
        table.text('content').notNullable()
   });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  knex.schema.dropTable("posts");
};
