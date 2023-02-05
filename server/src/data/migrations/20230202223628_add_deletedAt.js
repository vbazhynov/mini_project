const TableName = {
  POSTS: 'posts'
};

const ColumnName = {
  DELETED_AT: 'deleted_at'
};

export async function up(knex) {
  return knex.schema.table(TableName.POSTS, table => {
    table.dateTime(ColumnName.DELETED_AT).defaultTo(null);
  });
}

export async function down(knex) {
  return knex.schema.table(TableName.POSTS, table => {
    table.dropColumn(ColumnName.DELETED_AT);
  });
}
