
import './globals.css';
import ClientLayout from '@/components/Application/ClientLayout';

export const metadata = {
  title: "Product Ecommerce",
  description: "Nourish Your Body with Organic Superfoods",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans bg-[#F5F1E8]">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
