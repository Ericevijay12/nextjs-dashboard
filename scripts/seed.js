const { sql } = require('@vercel/postgres');
  const { users, customers, invoices, revenue } = require('../app/lib/placeholder-data.js');
  const bcrypt = require('bcryptjs');

  async function seedUsers() {
    try {
      await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
        );
      `;
      const insertedUsers = await Promise.all(
        users.map(async (user) => {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          return sql`
            INSERT INTO users (id, name, email, password)
            VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
            ON CONFLICT (id) DO NOTHING;
          `;
        })
      );
      console.log(`Seeded ${insertedUsers.length} users`);
      return insertedUsers;
    } catch (error) {
      console.error('Error seeding users:', error);
      throw error;
    }
  }

  async function seedCustomers() {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS customers (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          image_url VARCHAR(255) NOT NULL
        );
      `;
      const insertedCustomers = await Promise.all(
        customers.map(
          (customer) => sql`
            INSERT INTO customers (id, name, email, image_url)
            VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
            ON CONFLICT (id) DO NOTHING;
          `
        )
      );
      console.log(`Seeded ${insertedCustomers.length} customers`);
      return insertedCustomers;
    } catch (error) {
      console.error('Error seeding customers:', error);
      throw error;
    }
  }

  async function seedInvoices() {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS invoices (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          customer_id UUID NOT NULL,
          amount INT NOT NULL,
          status VARCHAR(255) NOT NULL,
          date DATE NOT NULL
        );
      `;
      const insertedInvoices = await Promise.all(
        invoices.map(
          (invoice) => sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
            ON CONFLICT (id) DO NOTHING;
          `
        )
      );
      console.log(`Seeded ${insertedInvoices.length} invoices`);
      return insertedInvoices;
    } catch (error) {
      console.error('Error seeding invoices:', error);
      throw error;
    }
  }

  async function seedRevenue() {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS revenue (
          month VARCHAR(4) NOT NULL UNIQUE,
          revenue INT NOT NULL
        );
      `;
      const insertedRevenue = await Promise.all(
        revenue.map(
          (rev) => sql`
            INSERT INTO revenue (month, revenue)
            VALUES (${rev.month}, ${rev.revenue})
            ON CONFLICT (month) DO NOTHING;
          `
        )
      );
      console.log(`Seeded ${insertedRevenue.length} revenue entries`);
      return insertedRevenue;
    } catch (error) {
      console.error('Error seeding revenue:', error);
      throw error;
    }
  }

  async function main() {
    await seedUsers();
    await seedCustomers();
    await seedInvoices();
    await seedRevenue();
    process.exit(0);
  }

  main().catch((err) => {
    console.error('An error occurred while seeding:', err);
    process.exit(1);
  });