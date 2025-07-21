import { sql } from '@vercel/postgres';

     // Define interfaces for type safety
     export interface Revenue {
       month: string;
       revenue: number;
     }

     export interface LatestInvoice {
       id: string;
       amount: number;
       name: string;
       image_url: string;
       email: string;
     }

     export async function fetchRevenue(): Promise<Revenue[]> {
       try {
         const data = await sql`SELECT * FROM revenue`;
         return data.rows as Revenue[];
       } catch (error) {
         console.error('Database Error:', error);
         throw new Error('Failed to fetch revenue data.');
       }
     }

     export async function fetchLatestInvoices(): Promise<LatestInvoice[]> {
       try {
         const data = await sql`
           SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
           FROM invoices
           JOIN customers ON invoices.customer_id = customers.id
           ORDER BY invoices.date DESC
           LIMIT 5`;
         return data.rows as LatestInvoice[];
       } catch (error) {
         console.error('Database Error:', error);
         throw new Error('Failed to fetch the latest invoices.');
       }
     }

     export async function fetchCardData() {
       try {
         const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
         const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
         const invoiceStatusPromise = sql`
           SELECT
             SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
             SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
           FROM invoices`;
         const data = await Promise.all([
           invoiceCountPromise,
           customerCountPromise,
           invoiceStatusPromise,
         ]);
         return {
           numberOfInvoices: Number(data[0].rows[0].count),
           numberOfCustomers: Number(data[1].rows[0].count),
           totalPaidInvoices: data[2].rows[0].paid,
           totalPendingInvoices: data[2].rows[0].pending,
         };
       } catch (error) {
         console.error('Database Error:', error);
         throw new Error('Failed to fetch card data.');
       }
     }