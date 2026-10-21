import type { Localized } from '../i18n/lang';

export const about: { readonly lead: Localized; readonly rest: Localized } = {
  lead: {
    en: 'I’m Soufiane, a full-stack engineer in Tangier. For four years I’ve worked on software people open every morning: ledgers, invoices, purchase orders, timesheets.',
    fr: 'Je suis Soufiane, ingénieur full-stack à Tanger. Depuis quatre ans, je travaille sur des logiciels que les gens ouvrent chaque matin : grands livres, factures, bons de commande, feuilles de temps.',
  },
  rest: {
    en: 'Mistakes in that kind of software are visible and expensive, so I like code that is predictable and easy to read. Most days I’m in Angular and TypeScript, and when the problem lives on the server I’m comfortable in Node.js and Spring Boot.',
    fr: 'Dans ce type de logiciel, les erreurs se voient et coûtent cher : j’aime donc le code prévisible et facile à lire. Au quotidien, je suis dans Angular et TypeScript, et quand le problème se trouve côté serveur, je suis à l’aise avec Node.js et Spring Boot.',
  },
};
