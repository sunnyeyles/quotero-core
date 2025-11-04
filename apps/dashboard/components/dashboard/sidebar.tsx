"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Bot, BarChart3 } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

const navigation = [
  { name: "Documents", href: "/dashboard/documents", icon: FileText },
  { name: "Chatbots", href: "/dashboard/chatbots", icon: Bot },
  { name: "Usage", href: "/dashboard/usage", icon: BarChart3 },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold">Quotero</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

