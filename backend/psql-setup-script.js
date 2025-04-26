const { sequelize } = require('./db/models');

async function ensureSchemaExists() {
  try {
    const schemas = await sequelize.showAllSchemas({ logging: false });
    if (!schemas.includes(process.env.SCHEMA)) {
      console.log(`Schema ${process.env.SCHEMA} does not exist. Creating...`);
      await sequelize.createSchema(process.env.SCHEMA);
      console.log(`Schema ${process.env.SCHEMA} created successfully!`);
    } else {
      console.log(`Schema ${process.env.SCHEMA} already exists.`);
    }
  } catch (error) {
    console.error('Error checking/creating schema:', error);
  } finally {
    process.exit();
  }
}

ensureSchemaExists();