import AdminNav from "@/components/admin/AdminNav";

export const metadata = {
  title: "CareConnect — Admin Portal",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sidebar (Fixed on Desktop, Header on Mobile) */}
      <AdminNav />

      {/* Main Content Area - strictly offset by sidebar width on desktop */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
