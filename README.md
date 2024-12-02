# aqua-royal-backend

### Migration File Overview

**Description**: Adds a new column named `testType` to the `customers` table, and provides a way to revert this change.

### Migration File Content

```js
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add a new column 'testType' to the 'customers' table
    await queryInterface.addColumn("customers", "testType", {
      type: Sequelize.ENUM("a", "b", "c"),
      // You can add other column options here if needed (e.g., allowNull, defaultValue, etc.)
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the 'testType' column from the 'customers' table
    await queryInterface.removeColumn("customers", "testType");
  },
};
```

### Commands for Database Management

#### Create the Database

To create the database based on the configuration file, use the following command:

```sh
npx sequelize-cli db:create
```

# todo-backend
