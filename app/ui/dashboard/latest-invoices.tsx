import Image from 'next/image';
     import { lusitana } from '@/app/ui/fonts';
     import { ArrowPathIcon } from '@heroicons/react/24/outline';

     export default function LatestInvoices({ latestInvoices }: { latestInvoices: { id: string; amount: number; name: string; image_url: string; email: string }[] }) {
       return (
         <div className="w-full md:col-span-4">
           <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
             Latest Invoices
           </h2>
           <div className="rounded-xl bg-gray-50 p-4">
             {latestInvoices.map((invoice) => (
               <div
                 key={invoice.id}
                 className="flex flex-row items-center justify-between py-4 border-b last:border-b-0"
               >
                 <div className="flex items-center">
                   <Image
                     src={invoice.image_url}
                     alt={`${invoice.name}'s profile picture`}
                     className="mr-4 rounded-full"
                     width={32}
                     height={32}
                   />
                   <div>
                     <p>{invoice.name}</p>
                     <p className="text-sm text-gray-500">{invoice.email}</p>
                   </div>
                 </div>
                 <p className="text-gray-900">
                   ${(invoice.amount / 100).toFixed(2)}
                 </p>
               </div>
             ))}
           </div>
         </div>
       );
     }