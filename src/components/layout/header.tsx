import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
        <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <ShieldAlert className="h-8 w-8" />
          <h1 className="text-2xl font-headline font-semibold">
            Alert Karachi
          </h1>
        </Link>
        {/* Future navigation items can go here */}
      </div>
    </header>
  );
}
