'use client';

import { useRouter } from 'next/navigation';


export default function Dashboard() {

    const router = useRouter();

  const navigateToMenu1 = () => {
    router.push('/customer-input'); // Ganti '/menu1' dengan rute yang sesuai
  };

    return (
      <div className="min-h-screen flex flex-col md:flex-row">
        <aside className="w-64 bg-gray-800 text-white hidden md:block">
          <nav>
            <ul>
            <li className="p-4 cursor-pointer hover:bg-gray-700" onClick={navigateToMenu1}>
              Input Customer Data
            </li>
              <li className="p-4">Menu 2</li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-4">
          <h1 className="text-xl font-bold">Dashboard</h1>
        </main>
      </div>
    );
  }
  