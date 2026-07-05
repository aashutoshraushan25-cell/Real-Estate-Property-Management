/* Agents directory & About page */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../data/db';
import type { Agent, User } from '../types';
import { Icon, Reveal, Stars } from '../components/ui';

export function AgentsPage() {
  const [agents, setAgents] = useState<(Agent & { user: User })[] | null>(null);
  useEffect(() => { api.getAgents().then(setAgents); }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Reveal className="mb-10 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-500">Our experts</p>
        <h1 className="section-title mt-1.5">Featured Agents</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500 dark:text-slate-400">
          A curated network of top-rated professionals, each verified and reviewed by real clients.
        </p>
      </Reveal>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {(agents ?? []).map((a, i) => (
          <Reveal key={a.id} delay={i * 80} className="card group p-6 text-center transition hover:-translate-y-1.5 hover:shadow-2xl">
            <img src={a.user.profileImage} alt={a.user.name} className="mx-auto h-24 w-24 rounded-3xl object-cover ring-4 ring-brand-500/10 transition group-hover:ring-brand-500/40" />
            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{a.user.name}</h2>
            <p className="mt-0.5 text-xs font-semibold text-brand-500">{a.specialization}</p>
            <div className="mt-2 flex items-center justify-center gap-1.5"><Stars rating={a.rating} /><span className="text-xs font-bold text-amber-500">{a.rating}</span></div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{a.bio}</p>
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
              {[['Years', a.experience], ['Listings', a.listings], ['Deals', a.deals]].map(([k, v]) => (
                <div key={k as string}><p className="font-extrabold text-slate-900 dark:text-white">{v}</p><p className="text-[10px] uppercase text-slate-400">{k}</p></div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <a href={`tel:${a.user.phone.replace(/\s/g, '')}`} className="btn-ghost flex-1 !px-2 !py-2 text-xs"><Icon name="phone" className="h-3.5 w-3.5" /> Call</a>
              <a href={`mailto:${a.user.email}`} className="btn-primary flex-1 !px-2 !py-2 text-xs"><Icon name="mail" className="h-3.5 w-3.5" /> Email</a>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <Reveal className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-500">About EstateHub</p>
        <h1 className="section-title mt-1.5">Real estate, reimagined for the modern mover</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
          EstateHub is a full-stack property management platform built with React, TypeScript, Tailwind CSS,
          Node.js, Express, Prisma and PostgreSQL. It brings verified listings, instant visit scheduling
          and real market analytics under one roof.
        </p>
      </Reveal>
      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {[
          { icon: 'shield', t: 'Trust first', d: 'Verified listings, vetted agents and transparent pricing — no surprises, ever.' },
          { icon: 'spark', t: 'Delightful UX', d: 'Glassmorphism UI, dark mode, skeleton loading and buttery-smooth animations.' },
          { icon: 'chart', t: 'Data driven', d: 'Role-based dashboards with revenue analytics, booking trends and reports.' },
        ].map((c, i) => (
          <Reveal key={c.t} delay={i * 90} className="card p-6 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-500 text-white shadow-lg"><Icon name={c.icon} className="h-6 w-6" /></span>
            <h2 className="mt-4 font-bold text-slate-900 dark:text-white">{c.t}</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{c.d}</p>
          </Reveal>
        ))}
      </div>
      <Reveal delay={150} className="card mt-12 overflow-hidden">
        <div className="grid sm:grid-cols-2">
          <img src="https://images.pexels.com/photos/8082328/pexels-photo-8082328.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200" alt="Modern villa" className="h-64 w-full object-cover sm:h-full" />
          <div className="p-8">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Built as a portfolio-grade project</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              This portal demonstrates a production-style architecture: JWT auth with refresh tokens,
              role-based access control (Admin / Agent / Customer), REST APIs, Prisma-modeled PostgreSQL
              schema, Cloudinary image pipeline, and a fully responsive component system.
            </p>
            <Link to="/properties" className="btn-primary mt-6">Explore listings</Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
