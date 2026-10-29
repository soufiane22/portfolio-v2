/// <reference types="node" />
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { caseStudies } from './case-studies';
import { experience } from './experience';
import { notes } from './notes';
import { projects } from './projects';
import { skills } from './skills';
import { about } from './about';
import { profile } from './profile';
import { LANGS } from '../i18n';
import { dictionaries } from '../i18n';

/** Collects every string in a value, recursively. */
function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings);
  return [];
}

const allContent = [profile, about, experience, projects, skills, notes, caseStudies, dictionaries];

describe('content', () => {
  it('never mentions technologies the owner excluded', () => {
    const banned = /kotlin|kubernetes|microservice/i;
    expect(strings(allContent).filter((s) => banned.test(s))).toEqual([]);
  });

  it('keeps both languages filled for every localized string', () => {
    const missing: string[] = [];
    const walk = (value: unknown): void => {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const keys = Object.keys(value);
        if (keys.includes('en') && keys.includes('fr')) {
          for (const lang of LANGS) {
            if (!(value as Record<string, string>)[lang].trim()) missing.push(JSON.stringify(value));
          }
          return;
        }
        Object.values(value).forEach(walk);
      } else if (Array.isArray(value)) {
        value.forEach(walk);
      }
    };
    [about, experience, projects, skills, notes, caseStudies].forEach(walk);
    expect(missing).toEqual([]);
  });

  it('points every CV link at a file that exists in public/', () => {
    // Tests run from the workspace root; a renamed PDF would otherwise only show up as a 404 in production.
    const missing = LANGS.map((lang) => profile.cv[lang]).filter((href) => !existsSync(join(process.cwd(), 'public', href)));
    expect(missing).toEqual([]);
  });

  it('never leaks internal names from private employer codebases', () => {
    // Sanford brand names, Matys class/service names and Matys release counts.
    const confidential = /trioma|fargov|talon|tefs|\w+Service\b|\b\d+ (production releases|versions en production)/i;
    expect(strings(allContent).filter((s) => confidential.test(s))).toEqual([]);
  });

  it('gives every job a real summary and its technologies (no TODO placeholder left)', () => {
    for (const job of experience) {
      expect(job.summary, job.id).not.toBeNull();
      expect(job.stack?.length, job.id).toBeGreaterThan(0);
    }
  });

  it('points every project case-study link at an existing case study', () => {
    const slugs = new Set(caseStudies.map((c) => c.slug));
    for (const project of projects) {
      if (project.caseStudy) expect(slugs.has(project.caseStudy)).toBe(true);
    }
  });

  it('uses unique, URL-safe case-study slugs', () => {
    const slugs = caseStudies.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/);
  });

  it('only links to https GitHub repositories', () => {
    const repos = [...projects.flatMap((p) => p.repos), ...caseStudies.flatMap((c) => c.repos)];
    for (const repo of repos) expect(repo.href).toMatch(/^https:\/\/github\.com\/soufiane22(\/[\w.-]+)?$/);
  });

  it('keeps the PREMO project card and its case study in sync', () => {
    const project = projects.find((p) => p.id === 'premo');
    const study = caseStudies.find((c) => c.slug === 'premo');
    expect(project?.caseStudy).toBe('premo');
    expect(project?.repos.map((r) => r.href)).toEqual(study?.repos.map((r) => r.href));
    expect(project?.repos).toHaveLength(3);
  });

  it('has the same dictionary keys in every language', () => {
    const keys = (value: unknown, prefix = ''): string[] =>
      value && typeof value === 'object'
        ? Object.entries(value).flatMap(([k, v]) => keys(v, `${prefix}${k}.`))
        : [prefix];
    expect(keys(dictionaries.fr)).toEqual(keys(dictionaries.en));
  });
});
