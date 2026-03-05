import React from "react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import {
  MenuIcon,
  Home,
  LogOut,
  BookUser,
  UserPlus,
  Bell,
  CircleDollarSign,
  ScrollText,
  Box,
  Route,
  Grid2x2Check,
  BookMarked,
  BadgeCheck,
  Handshake
} from "lucide-react";
import { useAuth } from '../contexts/AuthContext';
import { useState } from "react";
import type { ReactNode } from "react";
import { listarAlertasAtivos } from '../services/alertas';

//botão de admin
import DevLogin from "./adminButton";

const alertasNaoLidos = listarAlertasAtivos().length;

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ElementType;
}


interface LayoutProps {
  children: ReactNode;
}


interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  items: SidebarItem[];
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  items,
}) => {
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const sidebarClasses = sidebarOpen ? "w-64" : "w-20";
  const { logout, user } = useAuth();

  return (
    <aside
      className={cn(
        "flex flex-col bg-linear-to-b from-[var(--color-primary)] to-[var(--color-primary-dark)] shadow-md transition-all duration-300",
        "h-screen overflow-y-auto",
        "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        sidebarClasses
      )}
    >
      <div className="flex px-4 justify-between ">
        {sidebarOpen && (
          <div className="flex justify-center">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="font-black text-2xl tracking-tighter uppercase italic text-[var(--color-primary-dark)]">
                Jit<span className="text-white/80">Sucata</span>
              </span>
            </Link>
          </div>
        )}

        <Button
          size="icon"
          onClick={toggleSidebar}
          className="!bg-[var(--color-primary)] hover:border-gray-900 !border-none text-white hover:bg-[#BF5A1B]"
        >
          <MenuIcon className="h-5 w-5 text-white flex justify-end" />
        </Button>
      </div>

      <nav className="flex flex-col h-full gap-1 p-3 mt-2 ">
        {items.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className={cn(
              "flex items-center gap-3 p-2 rounded-xl font-medium  text-gray-900 transition-all duration-200",
              "hover:bg-[var(--color-primary-dark)] hover:border-gray-900 hover:border"
            )}
          >
            <div className="flex justify-center items-center w-8 h-8 rounded-lg   group-hover:bg-[var(--color-primary-dark)] transition">
              <item.icon className="h-4 w-4 text-white group-hover:text-gray-800" />
            </div>
            {sidebarOpen && (
              <span className="truncate text-sm text-white ">{item.label}</span>
            )}
          </Link>
        ))}
      </nav>

      <div className=" mt-9 flex p-3 ">
        {user?.perfil === 'admin' && (
          <Link to="/admin/alertas" className="relative p-1 hover:text-white/80 transition-colors text-sm font-medium uppercase tracking-wider">
            <Bell className="text-white h-4 w-4 ml-5 " />
            {alertasNaoLidos > 0 && (
              <span className="absolute -top-1 -right-3 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-[var(--color-primary)] animate-pulse"
                style={{ backgroundColor: 'var(--color-danger)' }}>
                {alertasNaoLidos}
              </span>
            )}
          </Link>
        )}
        <button
          onClick={logout}
          className=" flex items-center p-2 rounded-xl !border-none hover:bg-[var(--color-primary-dark)]   text-left !bg-[var(--color-primary-dark)]  text-white  hover:text-red-600 transition-all duration-200"
        >
          <div className="flex justify-center items-center  w-8 h-8 rounded-lg group-hover:bg-red-200 transition">
            <LogOut className="h-4 w-4 text-red-600" />
          </div>
          {sidebarOpen && (
            <span className="truncate text-sm font-medium">Sair</span>
          )}
        </button>
        <DevLogin />

      </div>
    </aside>
  );
};



export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? "ml-64" : "ml-20";

  const sidebarItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/fornecedores", label: "Fornecedores", icon: UserPlus },
    { href: "/materialMercado", label: "Material no Mercado ", icon: Handshake },
    { href: "/rotas", label: "Rotas de Coleta", icon: Route },
    { href: "/metas", label: "Metas", icon: BadgeCheck },
    { href: "/usuarios", label: "Usuarios", icon: BookUser },
    { href: "/pagamentos", label: "Pagamentos", icon: CircleDollarSign },
    { href: "/historico-pagamento", label: "Historico Pagamento", icon: ScrollText },
    { href: "/inventory", label: "Estoque", icon: Box },
    { href: "/tabela-preços", label: "Tabela de Preço", icon: Grid2x2Check },
    { href: "/Classificação", label: "Classificação", icon: BookMarked },
  ];

  return (
    <div className="flex min-h-screen w-full bg-[var(--color-primary)]">
      <aside className="fixed top-0 left-0 h-screen z-50">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          items={sidebarItems}
        />
      </aside>

      <main
        className={`${sidebarWidth} flex-1 min-h-screen transition-all duration-300`}
      >
        <div className="p-6 w-full min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
