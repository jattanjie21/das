import { Sidebar } from '@/components/ui/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
} 