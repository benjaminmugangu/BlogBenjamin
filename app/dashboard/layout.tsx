"use client";


import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react"; // Importer le type ReactNode pour typer les enfants
import DashboardItems from "../components/dashboard/DashboardItems";
import { CircleUser, DollarSign, Globe, Home } from "lucide-react";
import { ThemeToggle } from "../components/dashboard/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {LogoutLink} from '@kinde-oss/kinde-auth-nextjs/components';

export default function DashboardLayout({ children }: { children: ReactNode }) { 
    const NavLinks = [
        {
            name: "Dashboard", 
            href: "/dashboard", 
            icon: Home, 
        },

        {
            name: "Sites",
            href: "/dashboard/sites",
            icon: Globe,
        },

        {
            name: "Pricing",
            href: "/dashboard/pricing",
            icon: DollarSign,
        }
    ];

    return (
       <section className="grid min-h-screen w-full md:grid-cols-[220px_1fr]
       lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block"> 
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px]
                lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <Image src="/logo-dark.png" alt="Logo" width={32} height={32} className="h-8 w-8" />
                        <h3 className="text-2xl">Blog<span className="text-primary">Benjamin</span></h3>
                    </Link>
                </div>

                <div className="flex-1">
                    <nav className="grid items-start px-4 font-medium lg:px-4">
                        <DashboardItems navLinks={NavLinks} />
                    </nav>
                </div>
            </div>
        </div>

        {/* <div className="flex-1">{children}</div> */}

        <div className="flex flex-col">
            <header className="flex h-14 items-center gap-4 border-b bg-muted/40
            px-4 lg:h-[60px] lg:px-6">
                <div className="ml-auto flex items-center gap-x-5">
                            <div className="flex items-center gap-3">
                                <ThemeToggle />

                                <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button 
                                    variant="secondary" 
                                    size="icon"
                                    className="rounded-full"
                                >
                                    <CircleUser className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <LogoutLink> Log out </LogoutLink>
                                </DropdownMenuItem>
                            </DropdownMenuContent>

                        </DropdownMenu>
                    </div>
                </div>
            </header>
             <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                {children}
             </main>
        </div>

    </section>
    );
}























// Le fichier layout.tsx définit le layout (mise en page / conteneur partagé) pour toutes les routes situées sous dashboard dans une application Next.js utilisant l'App Router. Autrement dit, tout ce qui est rendu sous /dashboard/* sera enveloppé par ce composant.

// Que fait exactement ce fichier ?
// Il exporte un composant React (souvent une fonction par défaut) qui reçoit une prop children et retourne l'arborescence HTML/JSX commune à toutes les pages du dossier dashboard.
// Il sert à fournir des éléments persistants à toutes ces pages : par exemple un en-tête (header), une barre latérale (sidebar), un footer, des wrappers d'autorisation, des providers (contexte React), et le CSS spécifique au layout.
// Il compose avec le layout racine layout.tsx. Les layouts sont imbriqués : le layout racine s’applique d’abord, puis layout.tsx s’applique autour des pages /dashboard.
// Pourquoi on utilise un layout ici (bénéfices)
// Réutilisation : éviter de répéter la même barre de navigation / sidebar sur chaque page.
// Rendu persistent : les composants placés dans le layout restent montés entre les navigations internes (meilleure UX).
// Organisation : permettre des structures différentes par section (ex. site public vs espace dashboard).
// Autorisation / Guards : pratique pour vérifier l’authentification et rediriger si nécessaire avant d’afficher les pages enfants.
// Ce que vous trouverez typiquement dedans
// Import de styles locaux ou classes CSS/Tailwind.
// Structure JSX avec header/sidebar + <main>{children}</main>.
// Possiblement un wrapper d’auth (server component ou client component) qui checke la session.
// Métadonnées ou providers spécifiques à cette section (context API, theme provider).
// Parfois du code asynchrone (server component) pour charger des données communes (ex. info utilisateur) via fetch.
// Où regarder dans ce repo
// layout.tsx — layout global racine.
// page.tsx — la page d’accueil du dashboard (montré à l’intérieur du layout).
// layout.tsx — le fichier ouvert : son rôle est d’envelopper les pages du dashboard.
// app/api/... ou utilities d’auth (route.js) si le layout contient des vérifs d’auth.
// Petits conseils / modifications courantes
// Si vous ajoutez une sidebar persistante, placez-la dans ce layout.tsx.
// Pour vérifier l’auth, effectuez la vérification ici (ou appelez un provider) afin que toutes les pages héritent du contrôle.
// Préférez les server components pour le layout si vous fetcher des données côté serveur (meilleure perf), et marquez en client component ("use client") seulement les parties qui utilisent d’état local ou effets.
// Si vous voulez des comportements différents pour certaines sous-routes, vous pouvez ajouter des layouts imbriqués (ex. app/dashboard/settings/layout.tsx).
// Cas limites / choses à surveiller
// Composants client dans un layout server : devez explicitement déclarer "use client" en haut du fichier client.
// Chargement de données lourdes dans le layout peut ralentir toutes les sous-pages.
// Si vous mettez la logique d’auth dans le layout, faites attention aux redirections côté serveur vs client (SSR/SSG implications).