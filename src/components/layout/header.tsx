import Link from 'next/link';
import { MountainSnow, ShoppingCart } from 'lucide-react'; // Using MountainSnow as a placeholder for Martins' feel

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <MountainSnow className="h-7 w-7" />
          <h1 className="text-xl font-bold tracking-tight">Martins Prime</h1>
        </Link>
        <nav>
          <ul className="flex items-center gap-4">
            <li>
              <Link href="/services" className="flex items-center gap-1 hover:text-accent transition-colors">
                <ShoppingCart className="h-5 w-5" />
                Serviços
              </Link>
            </li>
            {/* Additional navigation items can be added here */}
          </ul>
        </nav>
      </div>
    </header>
  );
}
