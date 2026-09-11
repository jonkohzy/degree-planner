# Degree Compass — NUS Computer Science AY2022/23

Degree Compass is a personal, browser-local planner for the NUS **Bachelor of Computing (Honours) in Computer Science**, AY2022/23 cohort.

It includes only the two views needed for degree planning:

- **Planner:** place courses across eight semesters, move them, and mark them completed.
- **Requirements:** see live progress for the Common Curriculum, CS Programme Requirements, focus areas, Industry Experience, Unrestricted Electives, and the 160-unit minimum.

The mappings that commonly disappear in generic planners are explicit here:

- `CDE2501`, `EG2501`, and `HSS1000`: Singapore Studies + Interdisciplinary.
- `HSA1000`: Cultures & Connections + Interdisciplinary.
- `CP3107` and `CP3110`: Communities & Engagement + 6 units of Industry Experience + Breadth & Depth.

Overlapping requirements receive credit together, while each course's actual units count only once toward the 160-unit total.

## Publish on GitHub Pages

1. Create an empty GitHub repository.
2. Copy **the contents of this folder** into the repository and push the `main` branch.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to **GitHub Actions**.
5. The included workflow builds and publishes the site after every push to `main`.

It works for both a normal project repository (`username.github.io/repository-name`) and a root Pages repository (`username.github.io`).

## Run locally

Use Node.js 22.13 or newer and pnpm 11:

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Create the same static bundle used by GitHub Pages with:

```bash
pnpm build
```

The exported site is written to `dist/client`.

## Where your data lives

There is no login or server database. Your plan is stored in this browser's `localStorage` only. Use **Export** to save a JSON backup, and **Import** to restore it. Clearing browser storage or using another browser will not carry the plan across automatically.

## Official sources

- [Computer Science AY2022/23 cohort requirements](https://www.comp.nus.edu.sg/cug/per-cohort/cs/cs-22-23/)
- [School of Computing Common Curriculum AY2022/23](https://www.comp.nus.edu.sg/cug/soc-22-23/)
- [General Education pillar course lists](https://www.nus.edu.sg/registrar/academic-information-policies/undergraduate-students/general-education/list-of-courses-approved-under-the-ge-pillars)
- [Computer Science focus areas](https://www.comp.nus.edu.sg/programmes/ug/focus/)

This is an unofficial planning aid. Confirm module availability, prerequisites, exemptions, mappings, and graduation eligibility against the official handbook or with an academic adviser.
