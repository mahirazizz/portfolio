import Head from "next/head";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};
type Project = {
  title: string;
  description: string;
  tags: string[];
  category: string;
  accent: string;
  href: string;
  demo: string;
};

const navItems = ["About", "Experience", "Projects", "Leadership", "Contact"];
const skills = {
  Backend: ["Node.js", "Express.js", "REST APIs", "JWT", "RBAC", "MVC"],
  Databases: [
    "PostgreSQL",
    "MongoDB",
    "Prisma",
    "PostGIS",
    "Indexing",
    "Aggregation",
  ],
  Frontend: [
    "React.js",
    "Next.js",
    "TypeScript",
    "Redux Toolkit",
    "Tailwind CSS",
    "shadcn/ui",
  ],
  "Cloud & Tools": [
    "AWS EC2",
    "AWS S3",
    "Docker",
    "Linux",
    "Vercel",
    "Git",
    "Postman",
    "Cloudinary",
  ],
};
const projects: Project[] = [
  {
    title: "Rental Management System",
    description:
      "Production-style property operations platform with secure workflows, geospatial search, and a PostgreSQL data model.",
    tags: ["25+ REST APIs", "RBAC", "PostGIS", "Prisma"],
    category: "Next.js",
    accent: "from-indigo-500/30 to-cyan-400/10",
    href: "https://github.com/mahirazizz/Rental_Management_Application",
    demo: "https://rental-management-application-git-main-mahiraziz.vercel.app/",
  },
  {
    title: "Full-Stack E-Commerce Platform",
    description:
      "Secure commerce platform with catalog, cart, orders, admin workflows, and cloud media storage.",
    tags: ["Redux Toolkit", "JWT", "MongoDB", "Cloudinary"],
    category: "React",
    accent: "from-fuchsia-500/25 to-indigo-500/10",
    href: "https://github.com/mahirazizz/Full_Stack_E-Commerce_Platform",
    demo: "https://full-stack-e-commerce-platform-bz8i.vercel.app/",
  },
  {
    title: "Weather Application",
    description:
      "Focused React dashboard consuming live weather APIs with fast search and a responsive interface.",
    tags: ["React", "APIs"],
    category: "API",
    accent: "from-cyan-400/25 to-emerald-400/10",
    href: "https://github.com/mahirazizz/weather-app",
    demo: "https://weather-app-mahiraziz.vercel.app/",
  },
];
const metrics = [
  ["500+", "DSA problems solved"],
  ["40+", "REST APIs built"],
  ["30%", "API response improvement"],
  ["3★", "CodeChef · 1666 max"],
];
const initialForm: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65 } },
};

export default function Home() {
  const [light, setLight] = useState(false);
  const [category, setCategory] = useState("All");
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const theme = light
    ? "bg-[#f7f8fc] text-slate-950"
    : "bg-[#070910] text-slate-100";
  const panel = light
    ? "border-slate-200/80 bg-white/75"
    : "border-white/10 bg-white/[0.045]";
  const muted = light ? "text-slate-600" : "text-slate-400";
  const field = light
    ? "border-slate-200 bg-white"
    : "border-white/10 bg-black/20";

  async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name || !form.email || !form.message)
      return setStatus("Name, email, and message are required.");
    setSending(true);
    setStatus("Sending your message...");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok || !data.success)
        throw new Error(data.message || "Message could not be sent.");
      setForm(initialForm);
      setStatus("Message sent successfully.");
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={`min-h-screen overflow-hidden ${theme}`}>
      <Head>
        <title>Mahir Aziz | Software Engineer</title>
        <meta
          name="description"
          content="Mahir Aziz is a software engineer and full-stack developer."
        />
      </Head>
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_15%_15%,rgba(99,102,241,.16),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(6,182,212,.11),transparent_26%)]" />
      <nav
        className={`sticky top-0 z-30 border-b backdrop-blur-2xl ${light ? "border-slate-200 bg-white/75" : "border-white/10 bg-[#070910]/75"}`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="#home" className="text-lg font-black tracking-tight">
            Mahir<span className="text-indigo-500">.</span>
          </a>
          <div className="hidden items-center gap-7 text-sm md:flex">
            {navItems.map((item) => (
              <a
                className={`${muted} transition hover:text-indigo-500`}
                href={`#${item.toLowerCase()}`}
                key={item}
              >
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLight(!light)}
              className={`rounded-full border px-3 py-2 text-xs font-bold ${panel}`}
            >
              {light ? "Dark mode" : "Light mode"}
            </button>
            <a
              href="https://drive.google.com/file/d/1QiMruuUmu2Q65KgX0o-ffTlNn27leXkf/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-500/20"
            >
              Download resume
            </a>
          </div>
        </div>
      </nav>
      <main id="home" className="relative z-10 mx-auto max-w-6xl px-6">
        <section className="grid min-h-[82vh] items-center gap-16 py-24 lg:grid-cols-[1.05fr_.95fr]">
          <motion.div initial="hidden" animate="visible" variants={reveal}>
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/25 bg-indigo-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-indigo-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Available for opportunities
            </p>
            <h1 className="max-w-4xl text-6xl font-black leading-[.95] tracking-[-.06em] sm:text-8xl">
              Software Engineer <span className="text-indigo-500">&</span>{" "}
              Full-Stack Developer
            </h1>
            <p className={`mt-8 max-w-2xl text-lg leading-8 ${muted}`}>
              I design reliable backend systems, secure APIs, and thoughtful
              products with Node.js, PostgreSQL, MongoDB, AWS, React, and
              Next.js.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-indigo-600/20 transition hover:-translate-y-1 hover:bg-indigo-500"
              >
                View projects <span className="ml-2">↗</span>
              </a>
              <a
                href="#contact"
                className={`rounded-full border px-6 py-3 text-sm font-bold transition hover:-translate-y-1 ${panel}`}
              >
                Contact me
              </a>
              <a
                href="https://github.com/mahirazizz"
                target="_blank"
                rel="noreferrer"
                className={`rounded-full border px-6 py-3 text-sm font-bold transition hover:-translate-y-1 ${panel}`}
              >
                GitHub ↗
              </a>
              <a
                href="https://www.linkedin.com/in/mahirazizz"
                target="_blank"
                rel="noreferrer"
                className={`rounded-full border px-6 py-3 text-sm font-bold transition hover:-translate-y-1 ${panel}`}
              >
                LinkedIn ↗
              </a>
              <a
                href="https://leetcode.com/mahirazizz"
                target="_blank"
                rel="noreferrer"
                className={`rounded-full border px-6 py-3 text-sm font-bold transition hover:-translate-y-1 ${panel}`}
              >
                LeetCode ↗
              </a>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative mx-auto w-full max-w-md"
          >
            <div className="absolute -inset-6 rounded-[3rem] bg-indigo-500/15 blur-3xl" />
            <div className="relative aspect-square overflow-hidden rounded-4xl border border-white/10 bg-linear-to-br from-indigo-500/25 via-slate-900 to-cyan-400/10 p-5 shadow-2xl">
              <div className="flex h-full flex-col justify-between rounded-4xl border border-white/10 bg-black/20 p-7">
                <div className="flex justify-between text-xs font-bold uppercase tracking-[.25em] text-indigo-300">
                  <span>MA / SDE</span>
                  <span>01</span>
                </div>
                <div>
                  <div className="mb-6 text-8xl font-black tracking-[-.12em] text-white/90">
                    &lt;/&gt;
                  </div>
                  <p className="text-2xl font-bold">
                    Turning complex problems into simple systems.
                  </p>
                  <div className="mt-5 h-px bg-white/10" />
                  <p className="mt-4 text-sm text-slate-400">
                    Full-stack engineering · Product thinking · Continuous
                    learning
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
        <motion.section
          id="about"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={reveal}
          className="border-t border-white/10 py-24"
        >
          <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              A builder with <span className="text-indigo-500">range.</span>
            </h2>
            <div>
              <p className={`max-w-3xl text-xl leading-9 ${muted}`}>
                Final-year B.Tech CSE student at IIIT Bhopal with hands-on
                experience shipping backend systems, inventory workflows,
                product variants, and notification systems during my Full Stack
                Developer internship at NAVRobotec.
              </p>
              <p className={`mt-5 max-w-3xl leading-8 ${muted}`}>
                B.Tech Computer Science and Engineering · CGPA 8.29 · 500+ DSA
                problems solved.
              </p>
              <p className={`mt-5 max-w-3xl leading-8 ${muted}`}>
                I care about clear architecture, measurable performance, and
                interfaces that make people feel capable.
              </p>
            </div>
          </div>
        </motion.section>
        <section id="skills" className="py-16">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[.25em] text-indigo-500">
                Toolkit
              </p>
              <h2 className="text-4xl font-black">Built for the stack.</h2>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(skills).map(([title, list], index) => (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={reveal}
                transition={{ delay: index * 0.08 }}
                className={`rounded-3xl border p-6 ${panel}`}
                key={title}
              >
                <span className="text-xs font-bold text-indigo-500">
                  0{index + 1}
                </span>
                <h3 className="mt-8 text-xl font-bold">{title}</h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {list.map((skill) => (
                    <span
                      className={`rounded-lg px-3 py-2 text-xs font-semibold ${light ? "bg-slate-100" : "bg-white/5"}`}
                      key={skill}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        <section id="experience" className="py-24">
          <p className="mb-3 text-xs font-bold uppercase tracking-[.25em] text-indigo-500">
            Experience
          </p>
          <h2 className="mb-10 text-4xl font-black">
            Where I&apos;ve made impact.
          </h2>
          <div className={`border-l-2 border-indigo-500/40 pl-7 ${muted}`}>
            <div className={`rounded-3xl border p-8 ${panel}`}>
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold">NAVRobotec</h3>
                  <p className="mt-2 font-semibold text-indigo-500">
                    Full Stack Developer Intern
                  </p>
                </div>
                <span className="text-sm">Oct 2025 — Dec 2025</span>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ["40+", "REST APIs"],
                  ["30%", "faster responses"],
                  ["3", "client platforms"],
                ].map(([value, label]) => (
                  <div
                    className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4"
                    key={label}
                  >
                    <div className="text-2xl font-black text-indigo-400">
                      {value}
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-widest text-slate-400">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
              <ul className="mt-7 list-disc space-y-3 pl-5 leading-7">
                <li>
                  Built backend modules and customer-order workflows for web and
                  mobile applications.
                </li>
                <li>
                  Implemented inventory, product variants, notifications, and
                  database performance improvements.
                </li>
                <li>
                  Worked across Node.js, Express.js, MongoDB, PostgreSQL, and
                  Next.js.
                </li>
                <li>
                  Used Docker-based development, MVC architecture, AWS S3, and
                  deployment debugging with frontend and mobile teams.
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section id="projects" className="py-16">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[.25em] text-indigo-500">
                Selected work
              </p>
              <h2 className="text-4xl font-black">Things I&apos;ve shipped.</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {["All", "Next.js", "React", "API"].map((item) => (
                <button
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`rounded-full border px-4 py-2 text-xs font-bold ${category === item ? "border-indigo-500 bg-indigo-500 text-white" : panel}`}
                  key={item}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {projects
                .filter(
                  (project) =>
                    category === "All" || project.category === category,
                )
                .map((project) => (
                  <motion.article
                    layout
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`group rounded-3xl border p-4 ${panel}`}
                    key={project.title}
                  >
                    <div
                      className={`grid h-48 place-items-center rounded-2xl bg-linear-to-br ${project.accent} text-4xl font-black text-white/80 transition group-hover:scale-[.98]`}
                    >
                      0{projects.indexOf(project) + 1}
                    </div>
                    <div className="p-3 pt-6">
                      <h3 className="text-xl font-bold">{project.title}</h3>
                      <p className={`mt-3 text-sm leading-7 ${muted}`}>
                        {project.description}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            className={`rounded-full px-3 py-1 text-xs ${light ? "bg-slate-100" : "bg-white/5"}`}
                            key={tag}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-7 flex gap-5 text-sm font-bold">
                        <a
                          className="text-indigo-500 hover:text-indigo-400"
                          href={project.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          GitHub ↗
                        </a>
                        <a
                          className={muted}
                          href={project.demo}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Live demo ↗
                        </a>
                      </div>
                    </div>
                  </motion.article>
                ))}
            </AnimatePresence>
          </div>
        </section>
        <section className="grid gap-4 py-24 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map(([value, label], index) => (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={reveal}
              transition={{ delay: index * 0.08 }}
              className={`rounded-3xl border p-6 ${panel}`}
              key={label}
            >
              <div className="text-4xl font-black text-indigo-500">{value}</div>
              <div className={`mt-3 text-sm ${muted}`}>{label}</div>
            </motion.div>
          ))}
        </section>
        <section
          id="leadership"
          className="grid gap-6 border-t border-white/10 py-24 lg:grid-cols-[.8fr_1.2fr]"
        >
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[.25em] text-indigo-500">
              Beyond the code
            </p>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              Leading with intent.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className={`rounded-3xl border p-6 ${panel}`}>
              <div className="text-3xl font-black text-indigo-500">500+</div>
              <h3 className="mt-4 text-lg font-bold">Alumni Cell Lead</h3>
              <p className={`mt-3 text-sm leading-7 ${muted}`}>
                Led outreach and management initiatives, coordinating events for
                students and alumni.
              </p>
            </div>
            <div className={`rounded-3xl border p-6 ${panel}`}>
              <div className="text-3xl font-black text-indigo-500">200+</div>
              <h3 className="mt-4 text-lg font-bold">Arunoday Club</h3>
              <p className={`mt-3 text-sm leading-7 ${muted}`}>
                Organized community and social welfare activities with a
                student-led team.
              </p>
            </div>
          </div>
        </section>
        <section id="contact" className="py-20">
          <div
            className={`relative overflow-hidden rounded-4xl border p-7 sm:p-12 ${panel}`}
          >
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="relative grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[.25em] text-indigo-500">
                  Let&apos;s talk
                </p>
                <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
                  Have a problem worth solving?
                </h2>
                <p className={`mt-6 leading-8 ${muted}`}>
                  Reach me at{" "}
                  <a
                    className="font-semibold text-indigo-500"
                    href="mailto:mahiraziz007@gmail.com"
                  >
                    mahiraziz007@gmail.com
                  </a>{" "}
                  or send a message.
                </p>
              </div>
              <form
                onSubmit={sendMessage}
                className="grid gap-4 sm:grid-cols-2"
              >
                {(
                  [
                    ["name", "Your name"],
                    ["email", "Email address"],
                    ["subject", "Subject (optional)"],
                  ] as [keyof FormState, string][]
                ).map(([key, placeholder]) => (
                  <input
                    key={key}
                    type={key === "email" ? "email" : "text"}
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    className={`rounded-2xl border px-4 py-3 text-sm outline-none transition focus:border-indigo-500 ${key === "subject" ? "sm:col-span-2" : ""} ${field}`}
                  />
                ))}
                <textarea
                  placeholder="Your message"
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className={`min-h-36 rounded-2xl border px-4 py-3 text-sm outline-none transition focus:border-indigo-500 sm:col-span-2 ${field}`}
                />
                <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
                  <button
                    type="submit"
                    disabled={sending}
                    className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-500 disabled:opacity-60"
                  >
                    {sending ? "Sending..." : "Send message"}
                  </button>
                  {status && (
                    <span
                      className={
                        status.includes("successfully")
                          ? "text-sm text-emerald-500"
                          : "text-sm text-rose-500"
                      }
                    >
                      {status}
                    </span>
                  )}
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <footer className={`border-t px-6 py-10 text-center text-sm ${muted}`}>
        © 2026 Mahir Aziz · IIIT Bhopal
      </footer>
    </div>
  );
}
