export type Category = {
  id: string;
  slug: string;
  name: string;
  icon: string;
  sort_order: number;
  selection_type: 'single' | 'multi';
};

export type Pill = {
  id: string;
  category_id: string;
  label: string;
  prompt_snippet: string;
  color: string;
  icon: string;
  is_active: boolean;
};

export type Selections = Record<string, string[]>;

export function generatePrompt(
  selections: Selections,
  categories: Category[],
  pills: Pill[],
  customExtras: string
): string {
  const getPill = (slug: string) => {
    const ids = selections[slug] || [];
    return pills.filter(p => ids.includes(p.id));
  };

  const parts: string[] = [];

  // 1. Role — leads the prompt, framed as identity
  const role = getPill('role')[0];
  if (role) {
    parts.push(`You are an expert ${role.label}.`);
  }

  // 2. Project type — framed as the task
  const projectType = getPill('project_type')[0];
  if (projectType) {
    // strip a leading "Build this as" if the snippet already has it
    const cleaned = projectType.prompt_snippet.replace(/^Build this as /i, '');
    parts.push(`Your task is to build this as ${cleaned.charAt(0).toLowerCase() + cleaned.slice(1)}`);
  }

  // 3. Tech Stack — language, backend, database as a bulleted block, not prose
  const stackLines: string[] = [];
  const lang = getPill('language')[0];
  const backend = getPill('backend')[0];
  const database = getPill('database')[0];
  const uiLib = getPill('ui_library')[0];

  if (lang) stackLines.push(`- Frontend: ${lang.label}`);
  if (backend) stackLines.push(`- Backend: ${backend.label} (${lowercaseFirst(stripLeadingUse(backend.prompt_snippet))})`);
  if (database) stackLines.push(`- Database: ${database.label} (${lowercaseFirst(stripLeadingUse(database.prompt_snippet))})`);
  if (uiLib) stackLines.push(`- UI Components: ${uiLib.label}`);

  if (stackLines.length) {
    parts.push(`## Tech Stack\n${stackLines.join('\n')}`);
  }

  // 4. Animations — library + specific effects, bulleted
  const animLines: string[] = [];
  getPill('animation_library').forEach(p => animLines.push(`- ${p.prompt_snippet}`));
  getPill('animation_effects').forEach(p => animLines.push(`- ${p.prompt_snippet}`));

  if (animLines.length) {
    parts.push(`## Animations\n${animLines.join('\n')}`);
  }

  // 5. Everything else (any future categories not explicitly handled above)
  const handledSlugs = new Set(['role', 'project_type', 'language', 'backend', 'database', 'animation_library', 'animation_effects', 'ui_library']);
  
  // Sort them so they appear in narrative order defined by the DB
  const orderedCategories = [...categories].sort((a, b) => a.sort_order - b.sort_order);
  const otherCategories = orderedCategories.filter(c => !handledSlugs.has(c.slug) && c.slug !== 'extras');
  
  otherCategories.forEach(cat => {
    const catPills = getPill(cat.slug);
    if (catPills.length) {
      parts.push(`## ${cat.name}\n${catPills.map(p => `- ${p.prompt_snippet}`).join('\n')}`);
    }
  });

  // 6. Extras + custom text — always last, under one combined heading
  const extraLines: string[] = [];
  getPill('extras').forEach(p => extraLines.push(`- ${p.prompt_snippet}`));
  if (customExtras.trim()) extraLines.push(`- ${customExtras.trim()}`);

  if (extraLines.length) {
    parts.push(`## Additional Requirements\n${extraLines.join('\n')}`);
  }

  // 7. Standard reviewer footer, matching Umang's own agent-prompt convention
  parts.push(`Your output will be reviewed by another AI agent for bugs, consistency, and responsiveness before it goes to production.`);

  return parts.join('\n\n');
}

function lowercaseFirst(s: string): string {
  if (!s) return '';
  return s.charAt(0).toLowerCase() + s.slice(1);
}

function stripLeadingUse(s: string): string {
  if (!s) return '';
  return s.replace(/^Use /i, '').replace(/\.$/, '');
}
