"use client";
import { usePathname,useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

function SideBarOrganizer() {
  const links = [
    { name: "Dashboard",     href: "/Organizer",            icon: "space_dashboard" },
    { name: "Suscriptores",  href: "/Organizer/Subscribers",icon: "face" },
    { name: "Mis eventos",   href: "/Organizer/MyEvents",   icon: "event_list" },
    { name: "Crea un evento",href: "/Organizer/AddEvent",   icon: "confirmation_number" },
    { name: "Vista de usuario", href: "/User",              icon: "person" },
    { name: "Account",       href: "/Organizer/Account",    icon: "id_card" },
  ];

  const pathname = usePathname();
  const router = useRouter();
  const logout = async () => {
    try { await axios.post("/api/auth/logout"); } finally { router.push("/"); }
  };

  return (
    <aside className="w-80 h-dvh px-5 py-10 flex flex-col justify-between flex-shrink-0">
      <div className="flex items-center gap-2 mb-8">
        <svg height="48" viewBox="0 -960 960 960" width="48" fill="#8C1AF6">
          <path d="M349-120H180q-24.75 0-42.37-17.63Q120-155.25 120-180v-600q0-24.75 17.63-42.38Q155.25-840 180-840h169v60H180v600h169v60Zm103 80v-880h60v880h-60Zm163-80v-60h60v60h-60Zm0-660v-60h60v60h-60Zm165 660v-60h60q0 25-17.62 42.5Q804.75-120 780-120Zm0-165v-60h60v60h-60Zm0-165v-60h60v60h-60Zm0-165v-60h60v60h-60Zm0-165v-60q24.75 0 42.38 17.62Q840-804.75 840-780h-60Z"/>
        </svg>
        <h1 className="font-bold text-4xl">Scann My Ticket</h1>
      </div>

      <div className="flex flex-col justify-around h-[60%]">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`flex items-center font-bold max-w-60 gap-3 px-4 py-2 rounded-lg hover:bg-customGray ${
              pathname === link.href ? "bg-customGray" : "bg-transparent"
            }`}
          >
            <span className="material-symbols-outlined">{link.icon}</span>
            {link.name}
          </Link>
        ))}
      </div>

      <div>
        <button onClick={logout} className="text-red-600 font-bold px-4 py-2 rounded-lg flex items-center gap-2">
          Cerrar Sesión
          <span className="material-symbols-outlined">logout</span>
        </button>
      </div>
    </aside>
  );
}

export default SideBarOrganizer;
