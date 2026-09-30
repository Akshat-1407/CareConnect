export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-8 text-center text-sm text-slate-500">
      <div className="container mx-auto max-w-7xl px-4">
        <p>&copy; {new Date().getFullYear()} CareConnect Telemedicine. All rights reserved.</p>
        <p className="mt-1 text-xs text-slate-400">Secure, HIPAA-conscious virtual care consultations.</p>
      </div>
    </footer>
  );
}
