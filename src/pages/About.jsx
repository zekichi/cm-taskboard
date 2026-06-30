import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Database,
  Github,
  Globe2,
  KanbanSquare,
  Layers3,
  LockKeyhole,
  Rocket,
  Server,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const content = {
  es: {
    badge: "Informe del sistema",
    title: "CM Taskboard",
    subtitle:
      "Una plataforma web para organizar tareas, equipos y publicaciones de community management con una experiencia clara, segura y disponible online.",
    executive:
      "CM Taskboard centraliza el trabajo diario de un equipo de contenidos: permite iniciar sesión, elegir organización y equipo, crear tareas, asignar responsables, seguir estados, filtrar entregas y operar desde un tablero o una lista. El sistema combina frontend, backend, base de datos, autenticación, roles y deploy en la nube.",
    sections: [
      {
        icon: Sparkles,
        title: "Presentación general",
        text:
          "CM Taskboard fue creado para equipos de community management que necesitan coordinar publicaciones, piezas creativas y entregas sin depender de mensajes sueltos o planillas difíciles de mantener.",
        bullets: [
          "Ordena tareas por estado, prioridad, plataforma y fecha.",
          "Permite trabajar con organizaciones, equipos y responsables.",
          "Funciona como una herramienta real de gestión, no solo como una maqueta visual.",
        ],
      },
      {
        icon: Layers3,
        title: "Problema detectado",
        text:
          "En equipos de contenido es común perder claridad sobre qué tarea está pendiente, quién debe resolverla, cuándo vence y en qué etapa del flujo se encuentra.",
        bullets: [
          "Desorganización de tareas y entregas.",
          "Falta de claridad sobre responsables.",
          "Dificultad para seguir estados, equipos y prioridades.",
        ],
      },
      {
        icon: KanbanSquare,
        title: "Solución propuesta",
        text:
          "La solución integra dashboard, tablero kanban, lista de tareas, gestión de equipos, roles y asignaciones para que el equipo tenga una única fuente de verdad.",
        bullets: [
          "Dashboard para visión rápida del estado general.",
          "Kanban para mover tareas por pendiente, en diseño, aprobado y publicado.",
          "Lista con filtros por plataforma, estado y responsable.",
          "Roles y permisos para ordenar acciones según el usuario.",
        ],
      },
      {
        icon: ShieldCheck,
        title: "Seguridad y validaciones",
        text:
          "El sistema protege el acceso y valida la información tanto en cliente como en servidor para reducir errores operativos.",
        bullets: [
          "Contraseñas protegidas con bcrypt.",
          "Sesión con JWT y token Bearer.",
          "Validaciones con Zod.",
          "Control de acceso por roles y variables de entorno.",
        ],
      },
    ],
    featuresTitle: "Funcionalidades principales",
    features: [
      "Inicio de sesión",
      "Gestión de tareas",
      "Estados editoriales",
      "Prioridades",
      "Plataformas sociales",
      "Equipos de trabajo",
      "Responsables",
      "Filtros",
      "Diseño responsive",
      "Deploy online",
    ],
    techTitle: "Tecnologías utilizadas",
    techGroups: [
      {
        title: "Frontend",
        items: ["React", "Vite", "Tailwind CSS", "React Router", "React Query", "Axios", "Radix UI", "Lucide React"],
      },
      {
        title: "Backend",
        items: ["Node.js", "Express", "Prisma", "JWT", "bcrypt", "Zod", "CORS", "Helmet"],
      },
      {
        title: "Base de datos y deploy",
        items: ["PostgreSQL", "Neon", "Vercel", "Render", "GitHub"],
      },
    ],
    architectureTitle: "Arquitectura general",
    architectureText:
      "El usuario interactúa con el frontend publicado en Vercel. La interfaz consume la API de Render, que valida permisos, procesa la lógica de negocio y persiste datos en PostgreSQL sobre Neon.",
    architecture: [
      { icon: UsersRound, label: "Usuario", detail: "Navegador / dispositivo" },
      { icon: Globe2, label: "Vercel", detail: "Frontend React" },
      { icon: Server, label: "Render", detail: "API Express" },
      { icon: Database, label: "Neon", detail: "PostgreSQL" },
    ],
    demoTitle: "Demo CTS",
    demoText:
      "La demo incluye una organización y un equipo CTS con usuarios de prueba para presentar el flujo completo sin crear cuentas reales.",
    credentialsLabel: "Credenciales demo",
    credentialsNote: "Estas credenciales son solo para presentación y pruebas controladas.",
    demoUsers: [
      ["Valentina Ríos", "valentina.rios@cts-demo.local", "Administradora principal"],
      ["Mateo Silva", "mateo.silva@cts-demo.local", "Administrador"],
      ["Lara Gómez", "lara.gomez@cts-demo.local", "Administradora"],
    ],
    demoPassword: "CtsDemo2026!",
    futureTitle: "Aprendizajes y mejoras futuras",
    future: [
      "Permisos avanzados más granulares.",
      "Cambio y recuperación de contraseña.",
      "Notificaciones internas.",
      "Estadísticas más completas.",
      "Tests automatizados.",
      "Optimización de performance y bundle.",
    ],
    conclusionTitle: "Conclusión",
    conclusion:
      "CM Taskboard demuestra cómo una necesidad operativa concreta puede convertirse en un sistema completo: interfaz usable, autenticación, API, base de datos, permisos, seed demo y deploy online. Su valor está en unir organización, claridad y trazabilidad para equipos que producen contenido todos los días.",
  },
  en: {
    badge: "System overview",
    title: "CM Taskboard",
    subtitle:
      "A web platform for organizing community management tasks, teams and publishing workflows through a clear, secure and cloud-ready experience.",
    executive:
      "CM Taskboard centralizes day-to-day content work: users can sign in, select an organization and team, create tasks, assign owners, track statuses, filter deliverables and operate from either a kanban board or a list. The system combines frontend, backend, database, authentication, roles and cloud deployment.",
    sections: [
      {
        icon: Sparkles,
        title: "General presentation",
        text:
          "CM Taskboard was created for community management teams that need to coordinate posts, creative assets and deadlines without relying on scattered messages or hard-to-maintain spreadsheets.",
        bullets: [
          "Organizes tasks by status, priority, platform and due date.",
          "Supports organizations, teams and task owners.",
          "Works as a real management tool, not just a visual prototype.",
        ],
      },
      {
        icon: Layers3,
        title: "Detected problem",
        text:
          "Content teams often lose clarity about which task is pending, who owns it, when it is due and where it stands in the workflow.",
        bullets: [
          "Unorganized tasks and deliveries.",
          "Unclear responsibilities.",
          "Difficulty tracking statuses, teams and priorities.",
        ],
      },
      {
        icon: KanbanSquare,
        title: "Proposed solution",
        text:
          "The solution brings together a dashboard, kanban board, task list, team management, roles and assignments so the team has a single source of truth.",
        bullets: [
          "Dashboard for a quick operational overview.",
          "Kanban board for pending, in design, approved and published tasks.",
          "Task list with filters by platform, status and owner.",
          "Roles and permissions to control actions by user.",
        ],
      },
      {
        icon: ShieldCheck,
        title: "Security and validation",
        text:
          "The system protects access and validates information on the server side to reduce operational mistakes.",
        bullets: [
          "Passwords protected with bcrypt.",
          "JWT session and Bearer token authentication.",
          "Zod validations.",
          "Role-based access control and environment variables.",
        ],
      },
    ],
    featuresTitle: "Main features",
    features: [
      "Sign in",
      "Task management",
      "Editorial statuses",
      "Priorities",
      "Social platforms",
      "Work teams",
      "Owners",
      "Filters",
      "Responsive design",
      "Online deployment",
    ],
    techTitle: "Technologies used",
    techGroups: [
      {
        title: "Frontend",
        items: ["React", "Vite", "Tailwind CSS", "React Router", "React Query", "Axios", "Radix UI", "Lucide React"],
      },
      {
        title: "Backend",
        items: ["Node.js", "Express", "Prisma", "JWT", "bcrypt", "Zod", "CORS", "Helmet"],
      },
      {
        title: "Database and deploy",
        items: ["PostgreSQL", "Neon", "Vercel", "Render", "GitHub"],
      },
    ],
    architectureTitle: "General architecture",
    architectureText:
      "The user interacts with the frontend hosted on Vercel. The interface consumes the Render API, which validates permissions, handles business logic and persists data in PostgreSQL on Neon.",
    architecture: [
      { icon: UsersRound, label: "User", detail: "Browser / device" },
      { icon: Globe2, label: "Vercel", detail: "React frontend" },
      { icon: Server, label: "Render", detail: "Express API" },
      { icon: Database, label: "Neon", detail: "PostgreSQL" },
    ],
    demoTitle: "CTS demo",
    demoText:
      "The demo includes a CTS organization and team with sample users to present the complete workflow without creating real accounts.",
    credentialsLabel: "Demo credentials",
    credentialsNote: "These credentials are intended only for presentation and controlled testing.",
    demoUsers: [
      ["Valentina Ríos", "valentina.rios@cts-demo.local", "Main administrator"],
      ["Mateo Silva", "mateo.silva@cts-demo.local", "Administrator"],
      ["Lara Gómez", "lara.gomez@cts-demo.local", "Administrator"],
    ],
    demoPassword: "CtsDemo2026!",
    futureTitle: "Learnings and future improvements",
    future: [
      "More granular advanced permissions.",
      "Password change and recovery.",
      "Internal notifications.",
      "More complete analytics.",
      "Automated tests.",
      "Performance and bundle optimization.",
    ],
    conclusionTitle: "Conclusion",
    conclusion:
      "CM Taskboard shows how a concrete operational need can become a complete system: usable interface, authentication, API, database, permissions, demo seed and online deployment. Its value is bringing organization, clarity and traceability to teams that produce content every day.",
  },
};

const languages = [
  { key: "es", label: "ES", name: "Español" },
  { key: "en", label: "EN", name: "English" },
];

function InfoCard({ icon: Icon, title, text, bullets }) {
  return (
    <article className="motion-card min-w-0 rounded-lg border border-white/10 bg-card/75 p-5 shadow-lg shadow-black/15 backdrop-blur">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
      <ul className="mt-4 space-y-2">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function BadgeList({ items }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="badge-shimmer rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export default function About() {
  const [language, setLanguage] = useState("es");
  const t = content[language];
  const passwordLabel = useMemo(
    () => (language === "es" ? "Contraseña compartida" : "Shared password"),
    [language]
  );

  return (
    <div className="min-w-0 space-y-8 pb-10">
      <section className="ambient-panel motion-card relative overflow-hidden rounded-xl border border-white/10 bg-card/75 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 max-w-3xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              {t.badge}
            </p>
            <h1 className="break-words text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              {t.title}
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              {t.subtitle}
            </p>
          </div>

          <div className="flex w-full rounded-lg border border-white/10 bg-background/70 p-1 sm:w-auto">
            {languages.map((item) => (
              <Button
                key={item.key}
                type="button"
                variant={language === item.key ? "default" : "ghost"}
                size="sm"
                className="flex-1 gap-2 sm:flex-none"
                onClick={() => setLanguage(item.key)}
                aria-pressed={language === item.key}
              >
                <Globe2 className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Rocket className="h-4 w-4 text-primary" />
            {language === "es" ? "Resumen ejecutivo" : "Executive summary"}
          </div>
          <p className="text-sm leading-6 text-muted-foreground">{t.executive}</p>
        </div>
      </section>

      <section className="grid min-w-0 gap-4 md:grid-cols-2">
        {t.sections.map((section) => (
          <InfoCard key={section.title} {...section} />
        ))}
      </section>

      <section className="grid min-w-0 gap-6 lg:grid-cols-[1fr_0.95fr]">
        <article className="motion-card min-w-0 rounded-lg border border-white/10 bg-card/75 p-5 shadow-lg shadow-black/15 backdrop-blur">
          <h2 className="text-xl font-semibold text-foreground">
            {t.featuresTitle}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {language === "es"
              ? "El sistema cubre el flujo principal de trabajo desde la autenticación hasta la publicación."
              : "The system covers the core workflow from authentication to publishing."}
          </p>
          <div className="mt-5">
            <BadgeList items={t.features} />
          </div>
        </article>

        <article className="motion-card min-w-0 rounded-lg border border-white/10 bg-card/75 p-5 shadow-lg shadow-black/15 backdrop-blur">
          <h2 className="text-xl font-semibold text-foreground">{t.techTitle}</h2>
          <div className="mt-5 space-y-4">
            {t.techGroups.map((group) => (
              <div key={group.title}>
                <p className="mb-2 text-sm font-semibold text-foreground">
                  {group.title}
                </p>
                <BadgeList items={group.items} />
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="ambient-panel rounded-xl border border-white/10 bg-card/75 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-foreground">
            {t.architectureTitle}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            {t.architectureText}
          </p>
        </div>

        <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-center">
          {t.architecture.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="min-w-0 contents">
                <div className="motion-card min-w-0 rounded-lg border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="font-semibold text-foreground">{item.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.detail}</p>
                </div>
                {index < t.architecture.length - 1 && (
                  <div className="hidden text-primary lg:block">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid min-w-0 gap-6 lg:grid-cols-[0.95fr_1fr]">
        <article className="motion-card min-w-0 rounded-lg border border-white/10 bg-card/75 p-5 shadow-lg shadow-black/15 backdrop-blur">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-accent/25 bg-accent/10 text-accent">
            <UsersRound className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">{t.demoTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {t.demoText}
          </p>

          <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <LockKeyhole className="h-4 w-4 text-primary" />
              {t.credentialsLabel}
            </div>
            <div className="space-y-3">
              {t.demoUsers.map(([name, email, role]) => (
                <div key={email} className="rounded-md border border-white/10 bg-background/45 p-3">
                  <p className="text-sm font-semibold text-foreground">{name}</p>
                  <p className="mt-1 break-all text-xs text-muted-foreground">{email}</p>
                  <p className="mt-1 text-xs text-primary">{role}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">{passwordLabel}</p>
            <code className="mt-1 block rounded-md border border-white/10 bg-background/70 px-3 py-2 text-sm text-foreground">
              {t.demoPassword}
            </code>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              {t.credentialsNote}
            </p>
          </div>
        </article>

        <article className="motion-card min-w-0 rounded-lg border border-white/10 bg-card/75 p-5 shadow-lg shadow-black/15 backdrop-blur">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
            <Github className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">{t.futureTitle}</h2>
          <ul className="mt-4 space-y-3">
            {t.future.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-lg border border-primary/20 bg-primary/10 p-4">
            <h2 className="text-base font-semibold text-foreground">
              {t.conclusionTitle}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {t.conclusion}
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
