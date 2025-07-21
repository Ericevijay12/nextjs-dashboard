'use client';
     import { Bar } from 'react-chartjs-2';
     import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

     ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

     export default function RevenueChart({ revenue }: { revenue: { month: string; revenue: number }[] }) {
       const data = {
         labels: revenue.map((rev) => rev.month),
         datasets: [
           {
             label: 'Revenue ($)',
             data: revenue.map((rev) => rev.revenue),
             backgroundColor: '#4A90E2',
             borderColor: '#2F5DAA',
             borderWidth: 1,
           },
         ],
       };

       const options = {
         responsive: true,
         plugins: {
           legend: { position: 'top' as const },
           title: { display: true, text: 'Monthly Revenue' },
         },
       };

       return (
         <div className="w-full md:col-span-4">
           <h2 className="mb-4 text-xl md:text-2xl">Revenue</h2>
           <Bar data={data} options={options} />
         </div>
       );
     }