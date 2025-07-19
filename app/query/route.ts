import { sql } from '@vercel/postgres';
     import { NextResponse } from 'next/server';

     export async function GET() {
       try {
         const result = await sql`
           SELECT invoices.amount, customers.name
           FROM invoices
           JOIN customers ON invoices.customer_id = customers.id
           WHERE invoices.amount = 666;
         `;
         return NextResponse.json(result.rows);
       } catch (error) {
         console.error('Query error:', error);
         return NextResponse.json({ error: 'Failed to execute query' }, { status: 500 });
       }
     }