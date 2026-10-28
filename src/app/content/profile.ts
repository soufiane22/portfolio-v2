// Single source of truth for portfolio facts. Never add anything not stated by the owner.
// Source: design/Portfolio.html. Unknown values stay as TODO placeholders.
export interface ProfileLink {
  readonly label: string;
  readonly href: string;
}

export const profile = {
  name: 'Soufiane Aloui El Idrissi',
  email: 'soufiane.alouielidrissi@gmail.com',
  // International format with country code. Change it here only: the WhatsApp link is derived from it.
  phone: '+212 6 41 18 56 80',
  links: {
    github: { label: 'github.com/soufiane22', href: 'https://github.com/soufiane22' },
    linkedin: {
      label: 'soufiane-aloui-el-idrissi',
      href: 'https://linkedin.com/in/soufiane-aloui-el-idrissi',
    },
  },
  // PDFs live in public/cv/ and are served from /cv/.
  cv: {
    en: '/cv/Soufiane_Aloui_El_Idrissi_Full_Stack_Engeneer_EN.pdf',
    fr: '/cv/Soufiane_Aloui_El_Idrissi_CV_Full_Stack_Engineer_FR.pdf',
  },
  stack: ['Angular', 'TypeScript', 'RxJS', 'Nx', 'Node.js', 'Spring Boot', 'MongoDB', 'Azure DevOps'],
} as const;
