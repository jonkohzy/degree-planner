import {
  COURSE_BY_CODE,
  FOCUS_AREAS,
  TAG_LABELS,
  type Course,
  type FocusArea,
  type RequirementTag,
} from '@/lib/curriculum';

export type CourseStatus = 'planned' | 'completed';

export type PlanItem = {
  id: string;
  code: string;
  semester: string;
  status: CourseStatus;
  custom?: Course;
};

export type PlannerSettings = {
  dissertationReplacesIndustry: boolean;
  aimingHighestDistinction: boolean;
};

export type StoredPlan = {
  version: 1;
  items: PlanItem[];
  settings: PlannerSettings;
};

export const EMPTY_PLAN: StoredPlan = {
  version: 1,
  items: [],
  settings: {
    dissertationReplacesIndustry: false,
    aimingHighestDistinction: false,
  },
};

export type RuleProgress = {
  id: string;
  label: string;
  group: 'Common Curriculum' | 'Programme Requirements' | 'Unrestricted Electives' | 'Degree Total';
  current: number;
  required: number;
  suffix: string;
  planned: boolean;
  completed: boolean;
  contributors: string[];
  missing: string[];
};

export type FocusProgress = {
  area: FocusArea;
  primaryCount: number;
  hasLevel4000: boolean;
  complete: boolean;
  contributors: string[];
};

export type DegreeEvaluation = {
  uniqueUnits: number;
  completedUnits: number;
  plannedOnlyUnits: number;
  commonCredit: number;
  programmeCredit: number;
  ueCredit: number;
  rules: RuleProgress[];
  focusAreas: FocusProgress[];
  plannedRules: number;
  completedRules: number;
  warnings: string[];
  overlapMessages: string[];
};

export function resolveCourse(item: PlanItem): Course | undefined {
  return item.custom ?? COURSE_BY_CODE.get(item.code);
}

export function courseLevel(code: string) {
  const match = code.match(/[A-Z]+(\d)/i);
  return match ? Number(match[1]) : 0;
}

function entries(items: PlanItem[]) {
  return items.flatMap((item) => {
    const course = resolveCourse(item);
    return course ? [{ item, course }] : [];
  });
}

function tagEntries(items: PlanItem[], tag: RequirementTag) {
  return entries(items).filter(({ course }) => course.tags.includes(tag));
}

function codesFor(items: PlanItem[]) {
  return [...new Set(items.map((item) => item.code))];
}

function unitsFor(course: Course, tag: RequirementTag) {
  return course.requirementUnits?.[tag] ?? course.units;
}

function simpleTagRule(
  items: PlanItem[],
  id: string,
  label: string,
  tag: RequirementTag,
  group: RuleProgress['group'],
): RuleProgress {
  const all = tagEntries(items, tag);
  const done = all.filter(({ item }) => item.status === 'completed');
  return {
    id,
    label,
    group,
    current: all.length ? 4 : 0,
    required: 4,
    suffix: 'units',
    planned: all.length > 0,
    completed: done.length > 0,
    contributors: codesFor(all.map(({ item }) => item)),
    missing: all.length ? [] : [`Choose one eligible ${label} course.`],
  };
}

function focusProgress(items: PlanItem[]) {
  const all = entries(items);
  return FOCUS_AREAS.map((area): FocusProgress => {
    const primary = all.filter(({ course }) => course.focusPrimary?.includes(area));
    const primaryCodes = [...new Set(primary.map(({ course }) => course.code))];
    return {
      area,
      primaryCount: primaryCodes.length,
      hasLevel4000: primaryCodes.some((code) => courseLevel(code) >= 4),
      complete: primaryCodes.length >= 3 && primaryCodes.some((code) => courseLevel(code) >= 4),
      contributors: primaryCodes,
    };
  });
}

function idCdRule(items: PlanItem[]): RuleProgress {
  const all = entries(items).filter(({ course }) => course.tags.includes('id') || course.tags.includes('cd'));
  const doneItems = all.filter(({ item }) => item.status === 'completed').map(({ item }) => item);
  const build = (subset: PlanItem[]) => {
    const subsetEntries = entries(subset).filter(({ course }) => course.tags.includes('id') || course.tags.includes('cd'));
    const units = subsetEntries.reduce(
      (sum, { course }) => sum + unitsFor(course, course.tags.includes('id') ? 'id' : 'cd'),
      0,
    );
    const idCount = subsetEntries.filter(({ course }) => course.tags.includes('id')).length;
    const cdCount = subsetEntries.filter(({ course }) => course.tags.includes('cd')).length;
    return { units, idCount, cdCount, valid: units >= 12 && idCount >= 2 && cdCount <= 1 };
  };
  const planned = build(all.map(({ item }) => item));
  const completed = build(doneItems);
  const missing: string[] = [];
  if (planned.units < 12) missing.push(`${12 - planned.units} more ID/CD units needed.`);
  if (planned.idCount < 2) missing.push(`${2 - planned.idCount} more interdisciplinary course${planned.idCount === 1 ? '' : 's'} needed.`);
  if (planned.cdCount > 1) missing.push('Only one cross-disciplinary course may count here.');
  return {
    id: 'id-cd',
    label: 'Interdisciplinary / Cross-disciplinary',
    group: 'Common Curriculum',
    current: Math.min(planned.units, 12),
    required: 12,
    suffix: `units · ${planned.idCount} ID · ${planned.cdCount} CD`,
    planned: planned.valid,
    completed: completed.valid,
    contributors: codesFor(all.map(({ item }) => item),),
    missing,
  };
}

function foundationRule(items: PlanItem[]): RuleProgress {
  const all = tagEntries(items, 'foundation');
  const done = all.filter(({ item }) => item.status === 'completed');
  const requiredCodes = ['CS1231S', 'CS2030S', 'CS2040S', 'CS2100', 'CS2101', 'CS2103T', 'CS2106', 'CS2109S', 'CS3230'];
  const present = new Set(all.map(({ course }) => course.code));
  const completed = new Set(done.map(({ course }) => course.code));
  return {
    id: 'foundation',
    label: 'Computer Science Foundation',
    group: 'Programme Requirements',
    current: present.size * 4,
    required: 36,
    suffix: 'units',
    planned: requiredCodes.every((code) => present.has(code)),
    completed: requiredCodes.every((code) => completed.has(code)),
    contributors: [...present],
    missing: requiredCodes.filter((code) => !present.has(code)).map((code) => `${code} is not planned.`),
  };
}

function mathRule(items: PlanItem[]): RuleProgress {
  const byTag = (tag: RequirementTag, subset = items) => tagEntries(subset, tag);
  const has = (tag: RequirementTag, subset = items) => byTag(tag, subset).length > 0;
  const doneItems = items.filter((item) => item.status === 'completed');
  const plannedCount = Number(has('math-calculus')) + Number(has('math-linear')) + Number(has('math-statistics'));
  const doneCount = Number(has('math-calculus', doneItems)) + Number(has('math-linear', doneItems)) + Number(has('math-statistics', doneItems));
  const all = entries(items).filter(({ course }) => course.tags.some((tag) => tag.startsWith('math-')));
  const missing: string[] = [];
  if (!has('math-calculus')) missing.push('Add MA1521 Calculus for Computing.');
  if (!has('math-linear')) missing.push('Choose MA1522 or MA2001.');
  if (!has('math-statistics')) missing.push('Add ST2334 Probability and Statistics.');
  return {
    id: 'math-science',
    label: 'Mathematics & Sciences',
    group: 'Programme Requirements',
    current: plannedCount * 4,
    required: 12,
    suffix: 'units',
    planned: plannedCount === 3,
    completed: doneCount === 3,
    contributors: codesFor(all.map(({ item }) => item)),
    missing,
  };
}

function breadthRule(items: PlanItem[], settings: PlannerSettings): RuleProgress {
  const all = tagEntries(items, 'breadth');
  const doneItems = items.filter((item) => item.status === 'completed');
  const done = tagEntries(doneItems, 'breadth');

  const build = (subset: PlanItem[]) => {
    const breadth = tagEntries(subset, 'breadth');
    const units = breadth.reduce((sum, { course }) => sum + unitsFor(course, 'breadth'), 0);
    const highLevelUnits = breadth
      .filter(({ course }) => courseLevel(course.code) >= 4)
      .reduce((sum, { course }) => sum + unitsFor(course, 'breadth'), 0);
    const industryUnits = settings.dissertationReplacesIndustry
      ? tagEntries(subset, 'dissertation').reduce((sum, { course }) => sum + unitsFor(course, 'dissertation'), 0)
      : tagEntries(subset, 'industry').reduce((sum, { course }) => sum + unitsFor(course, 'industry'), 0);
    const focus = focusProgress(subset);
    const cpNonIndustryUnits = breadth
      .filter(({ course }) => course.code.startsWith('CP') && !course.tags.includes('industry'))
      .reduce((sum, { course }) => sum + unitsFor(course, 'breadth'), 0);
    const invalidPrefixes = breadth.filter(({ course }) =>
      !course.tags.includes('industry') && !/^(CS|IFS|CP)/.test(course.code),
    );
    const valid =
      units >= 32 &&
      highLevelUnits >= 12 &&
      industryUnits >= 6 &&
      industryUnits <= 12 &&
      focus.some((area) => area.complete) &&
      cpNonIndustryUnits <= 12 &&
      invalidPrefixes.length === 0;
    return { units, highLevelUnits, industryUnits, focus, cpNonIndustryUnits, invalidPrefixes, valid };
  };

  const planned = build(items);
  const completed = build(doneItems);
  const missing: string[] = [];
  if (planned.units < 32) missing.push(`${32 - planned.units} more Breadth & Depth units needed.`);
  if (planned.highLevelUnits < 12) missing.push(`${12 - planned.highLevelUnits} more level-4000+ units needed.`);
  if (planned.industryUnits < 6) missing.push(settings.dissertationReplacesIndustry ? 'Add CP4101 as the approved Industry Experience replacement.' : `${6 - planned.industryUnits} more Industry Experience units needed.`);
  if (planned.industryUnits > 12) missing.push('Industry Experience may contribute at most 12 units.');
  if (!planned.focus.some((area) => area.complete)) missing.push('Complete one focus area: 3 Area Primaries, including one level-4000+ primary.');
  if (planned.cpNonIndustryUnits > 12) missing.push('Non-industry CP-coded courses may contribute at most 12 units.');
  if (planned.invalidPrefixes.length) missing.push('Non-industry Breadth & Depth courses must be CS-, IFS-, or CP-coded.');
  return {
    id: 'breadth',
    label: 'CS Breadth & Depth',
    group: 'Programme Requirements',
    current: Math.min(planned.units, 32),
    required: 32,
    suffix: `units · ${planned.highLevelUnits} at 4000+ · ${planned.industryUnits} IE`,
    planned: planned.valid,
    completed: completed.valid,
    contributors: codesFor(all.map(({ item }) => item)),
    missing,
  };
}

function ueRule(items: PlanItem[]): RuleProgress {
  const all = tagEntries(items, 'ue');
  const done = all.filter(({ item }) => item.status === 'completed');
  const units = all.reduce((sum, { course }) => sum + unitsFor(course, 'ue'), 0);
  const doneUnits = done.reduce((sum, { course }) => sum + unitsFor(course, 'ue'), 0);
  return {
    id: 'ue',
    label: 'Unrestricted Electives',
    group: 'Unrestricted Electives',
    current: Math.min(units, 40),
    required: 40,
    suffix: 'units',
    planned: units >= 40,
    completed: doneUnits >= 40,
    contributors: codesFor(all.map(({ item }) => item)),
    missing: units >= 40 ? [] : [`${40 - units} more UE units need explicit allocation.`],
  };
}

export function evaluatePlan(items: PlanItem[], settings: PlannerSettings): DegreeEvaluation {
  const allEntries = entries(items);
  const completedEntries = allEntries.filter(({ item }) => item.status === 'completed');
  const uniqueUnits = allEntries.reduce((sum, { course }) => sum + course.units, 0);
  const completedUnits = completedEntries.reduce((sum, { course }) => sum + course.units, 0);

  const rules: RuleProgress[] = [
    simpleTagRule(items, 'ge-digital', 'Digital Literacy', 'ge-digital', 'Common Curriculum'),
    simpleTagRule(items, 'ge-expression', 'Critique & Expression', 'ge-expression', 'Common Curriculum'),
    simpleTagRule(items, 'ge-culture', 'Cultures & Connections', 'ge-culture', 'Common Curriculum'),
    simpleTagRule(items, 'ge-data', 'Data Literacy', 'ge-data', 'Common Curriculum'),
    simpleTagRule(items, 'ge-singapore', 'Singapore Studies', 'ge-singapore', 'Common Curriculum'),
    simpleTagRule(items, 'ge-community', 'Communities & Engagement', 'ge-community', 'Common Curriculum'),
    simpleTagRule(items, 'ethics', 'Computing Ethics', 'ethics', 'Common Curriculum'),
    idCdRule(items),
    foundationRule(items),
    mathRule(items),
    breadthRule(items, settings),
    ueRule(items),
  ];

  const totalRule: RuleProgress = {
    id: 'degree-total',
    label: 'Minimum unique degree units',
    group: 'Degree Total',
    current: Math.min(uniqueUnits, 160),
    required: 160,
    suffix: 'unique units',
    planned: uniqueUnits >= 160,
    completed: completedUnits >= 160,
    contributors: codesFor(items),
    missing: uniqueUnits >= 160 ? [] : [`${160 - uniqueUnits} more distinct units needed.`],
  };
  rules.push(totalRule);

  const commonRules = rules.filter((rule) => rule.group === 'Common Curriculum');
  const programmeRules = rules.filter((rule) => rule.group === 'Programme Requirements');
  const ue = rules.find((rule) => rule.id === 'ue')!;
  const commonCredit = commonRules.reduce((sum, rule) => sum + Math.min(rule.current, rule.required), 0);
  const programmeCredit = programmeRules.reduce((sum, rule) => sum + Math.min(rule.current, rule.required), 0);

  const warnings: string[] = [];
  const codes = new Set(items.map((item) => item.code));
  const course2101 = items.find((item) => item.code === 'CS2101');
  const course2103 = items.find((item) => item.code === 'CS2103T');
  if ((course2101 && !course2103) || (!course2101 && course2103)) warnings.push('CS2101 and CS2103T must be planned together in the same semester.');
  if (course2101 && course2103 && course2101.semester !== course2103.semester) warnings.push('Move CS2101 and CS2103T into the same semester.');
  const level1000Units = allEntries.filter(({ course }) => courseLevel(course.code) === 1).reduce((sum, { course }) => sum + course.units, 0);
  if (level1000Units > 60) warnings.push(`Level-1000 courses total ${level1000Units} units; the degree-wide maximum is normally 60.`);
  if (settings.aimingHighestDistinction && !codes.has('CP4101')) warnings.push('CP4101 is required when aiming for Honours (Highest Distinction).');
  if (settings.dissertationReplacesIndustry && !codes.has('CP4101')) warnings.push('The dissertation replacement is enabled, but CP4101 is not yet planned.');
  if (settings.dissertationReplacesIndustry) warnings.push('CP4101 may replace Industry Experience only with GPA 4.00+ after at least 112 completed units; confirm approval before relying on it.');

  const overlapMessages = allEntries.flatMap(({ course }) => {
    const recognised = course.tags.filter((tag) =>
      ['ge-singapore', 'ge-culture', 'ge-community', 'id', 'breadth', 'industry'].includes(tag),
    );
    if (recognised.length < 2) return [];
    return [`${course.code} fulfils ${recognised.map((tag) => TAG_LABELS[tag]).join(' + ')}; its ${course.units} actual units are counted once.`];
  });

  return {
    uniqueUnits,
    completedUnits,
    plannedOnlyUnits: uniqueUnits - completedUnits,
    commonCredit,
    programmeCredit,
    ueCredit: ue.current,
    rules,
    focusAreas: focusProgress(items),
    plannedRules: rules.filter((rule) => rule.planned).length,
    completedRules: rules.filter((rule) => rule.completed).length,
    warnings,
    overlapMessages,
  };
}
