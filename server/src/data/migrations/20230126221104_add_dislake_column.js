const TableName = {
  POST_REACTIONS: 'post_reactions'
};

const ColumnName = {
  IS_REACTED_BEFORE: 'is_reacted_before'
};

export async function up(knex) {
  return knex.schema.table(TableName.POST_REACTIONS, table => {
    table.boolean(ColumnName.IS_REACTED_BEFORE).notNullable().defaultTo(false);
  });
}

export async function down(knex) {
  return knex.schema.table(TableName.POST_REACTIONS, table => {
    table.dropColumn(ColumnName.IS_REACTED_BEFORE);
  });
}
