import { head, header, footer } from './layout.mjs';
import { renderIntroduction, renderExperience, renderProjects, renderSkills, renderEducation, renderContact } from './portfolio-sections.mjs';

export function renderPortfolio(context) {
  return `${head(context, false)}
<body>
  ${header(context, false)}
  <main id="main">
    ${renderIntroduction(context)}
    ${renderExperience(context)}
    ${renderProjects(context)}
    ${renderSkills(context)}
    ${renderEducation(context)}
    ${renderContact(context)}
  </main>
  ${footer(context)}
</body>
</html>
`;
}
