'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import AssignmentsSticky from './AssignmentsSticky';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  if (isLanding) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen max-w-[1600px] mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-8">
        <Navbar />
        {children}
      </div>
      <AssignmentsSticky />
    </div>
  );
}
