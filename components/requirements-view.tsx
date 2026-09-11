'use client';

import {
  BookOpenCheck,
  Check,
  CheckCircle2,
  CircleDashed,
  ExternalLink,
  Layers3,
  Plus,
  Sparkles,
} from 'lucide-react';

import { CourseSelect } from '@/components/course-select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import {
  COURSE_CATALOG,
  SOURCES,
  type Course,
  type FocusArea,
  type RequirementTag,
} from '@/lib/curriculum';
import type {
  DegreeEvaluation,
  PlanItem,
  PlannerSettings,
  RuleProgress,
} from '@/lib/planner';

type RequirementsViewProps = {
  items: PlanItem[];
  evaluation: DegreeEvaluation;
  settings: PlannerSettings;
  onAdd: (code: string, semester?: string) => void;
  onUpdateSettings: (settings: Partial<PlannerSettings>) => void;
  onOpenCustom: (semester?: string) => void;
};

const geRules: Array<{ id: string; tag: RequirementTag; description: string }> = [
  { id: 'ge-digital', tag: 'ge-digital', description: 'CS1101S is the prescribed Digital Literacy pillar.' },
  { id: 'ge-expression', tag: 'ge-expression', description: 'ES2660 is the prescribed Critique & Expression pillar.' },
  { id: 'ge-culture', tag: 'ge-culture', description: 'Choose an approved GEC course, or HSA1000 for GEC + ID credit.' },
  { id: 'ge-data', tag: 'ge-data', description: 'Choose GEA1000, BT1101, ST1131, or DSA1101.' },
  { id: 'ge-singapore', tag: 'ge-singapore', description: 'Choose an approved GESS course, or an eligible interdisciplinary equivalent.' },
  { id: 'ge-community', tag: 'ge-community', description: 'Choose an approved GEN course; CP3107/CP3110 also carry Industry Experience credit.' },
];

const eligible = (tag: RequirementTag) =>
  COURSE_CATALOG.filter((course) => course.tags.includes(tag));

export function RequirementsView({
  items,
  evaluation,
  settings,
  onAdd,
  onUpdateSettings,
  onOpenCustom,
}: RequirementsViewProps) {
  const plannedCodes = new Set(items.map((item) => item.code));
  const rule = (id: string) => evaluation.rules.find((item) => item.id === id)!;

  return (
    <section aria-labelledby="requirements-heading" className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-sm font-bold uppercase tracking-[0.14em] text-accent-foreground">
            Live degree audit
          </p>
          <h1 id="requirements-heading" className="font-display text-3xl font-bold tracking-[-0.035em]">
            Requirements checklist
          </h1>
          <p className="mt-2 max-w-3xl text-base leading-7 text-muted-foreground">
            Every dropdown is filtered to courses that can fulfil that slot. Adding one course updates all of its recognised requirements without adding its units twice.
          </p>
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Checklist status legend">
          <StatusPill status="completed" label="Completed" />
          <StatusPill status="planned" label="Planned" />
          <StatusPill status="missing" label="Needs planning" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <OverlapCard
          icon={<Layers3 className="size-5" />}
          title="CDE2501 belongs in two places"
          codes="CDE2501 · EG2501 · HSS1000"
          detail="Each may satisfy Singapore Studies and one Interdisciplinary course. HSA1000 similarly satisfies Cultures & Connections and Interdisciplinary."
        />
        <OverlapCard
          icon={<Sparkles className="size-5" />}
          title="CP3107 and CP3110 are pillar courses"
          codes="CP3107 · CP3110"
          detail="Each may satisfy Communities & Engagement, 6 units of Industry Experience, and Breadth & Depth. Actual units still count once toward 160."
        />
      </div>

      <RequirementSection
        eyebrow="40 units"
        title="Common Curriculum"
        description="Six University Pillars, Computing Ethics, and 12 units of Interdisciplinary / Cross-disciplinary study."
        progress={evaluation.commonCredit}
        required={40}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {geRules.map((entry) => (
            <RuleCard
              key={entry.id}
              rule={rule(entry.id)}
              items={items}
              description={entry.description}
              courses={eligible(entry.tag)}
              plannedCodes={plannedCodes}
              onAdd={onAdd}
            />
          ))}
          <RuleCard
            rule={rule('ethics')}
            items={items}
            description="IS1108 Digital and AI Ethics is prescribed for this cohort."
            courses={eligible('ethics')}
            plannedCodes={plannedCodes}
            onAdd={onAdd}
          />
        </div>

        <RuleCard
          rule={rule('id-cd')}
          items={items}
          description="Plan 12 units: at least two ID courses, with no more than one CD course counting in this requirement."
          plannedCodes={plannedCodes}
          onAdd={onAdd}
          wide
        >
          <div className="grid gap-3 md:grid-cols-2">
            <SlotPicker
              title="Interdisciplinary course"
              note="At least two must come from this list."
              courses={eligible('id')}
              plannedCodes={plannedCodes}
              onAdd={onAdd}
            />
            <SlotPicker
              title="Cross-disciplinary course"
              note="At most one may count toward the 12 units."
              courses={eligible('cd')}
              plannedCodes={plannedCodes}
              onAdd={onAdd}
            />
          </div>
        </RuleCard>
      </RequirementSection>

      <RequirementSection
        eyebrow="80 units"
        title="Programme Requirements"
        description="CS Foundation, Mathematics & Sciences, and CS Breadth & Depth including a focus area and Industry Experience."
        progress={evaluation.programmeCredit}
        required={80}
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <RuleCard
            rule={rule('foundation')}
            items={items}
            description="All nine prescribed foundation courses are required. CS2101 and CS2103T must be taken in the same semester."
            courses={eligible('foundation')}
            plannedCodes={plannedCodes}
            onAdd={onAdd}
            wide
          />

          <RuleCard
            rule={rule('math-science')}
            items={items}
            description="Complete Calculus, Linear Algebra, and Probability & Statistics."
            plannedCodes={plannedCodes}
            onAdd={onAdd}
            wide
          >
            <div className="grid gap-3 sm:grid-cols-3">
              <SlotPicker title="Calculus" courses={eligible('math-calculus')} plannedCodes={plannedCodes} onAdd={onAdd} />
              <SlotPicker title="Linear algebra" courses={eligible('math-linear')} plannedCodes={plannedCodes} onAdd={onAdd} />
              <SlotPicker title="Statistics" courses={eligible('math-statistics')} plannedCodes={plannedCodes} onAdd={onAdd} />
            </div>
          </RuleCard>
        </div>

        <RuleCard
          rule={rule('breadth')}
          items={items}
          description="Plan at least 32 units, including 12 units at level 4000+, one completed focus area, and 6–12 units of Industry Experience."
          plannedCodes={plannedCodes}
          onAdd={onAdd}
          wide
        >
          <div className="grid gap-3 lg:grid-cols-2">
            <SlotPicker
              title="Any approved Breadth & Depth course"
              note="Includes Area Primaries, focus electives, Industry Experience, and CP4101."
              courses={eligible('breadth')}
              plannedCodes={plannedCodes}
              onAdd={onAdd}
            />
            <SlotPicker
              title="Industry Experience"
              note="CP3107 and CP3110 appear here and under Communities & Engagement."
              courses={eligible('industry')}
              plannedCodes={plannedCodes}
              onAdd={onAdd}
            />
          </div>

          <div className="mt-4 rounded-xl border bg-muted/30 px-4">
            <Accordion multiple>
              {evaluation.focusAreas.map((focus) => (
                <FocusAreaRow
                  key={focus.area}
                  area={focus.area}
                  focus={focus}
                  plannedCodes={plannedCodes}
                  onAdd={onAdd}
                />
              ))}
            </Accordion>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <SettingRow
              checked={settings.dissertationReplacesIndustry}
              onCheckedChange={(checked) => onUpdateSettings({ dissertationReplacesIndustry: checked })}
              title="Use CP4101 as the Industry Experience replacement"
              description="Only rely on this with GPA 4.00+ after at least 112 completed units and the required approval."
            />
            <SettingRow
              checked={settings.aimingHighestDistinction}
              onCheckedChange={(checked) => onUpdateSettings({ aimingHighestDistinction: checked })}
              title="I am aiming for Highest Distinction"
              description="CP4101 is required for the Highest Distinction pathway."
            />
          </div>
        </RuleCard>
      </RequirementSection>

      <RequirementSection
        eyebrow="40 units"
        title="Unrestricted Electives"
        description="Use these units for a minor, second major, additional CS courses, or other approved electives."
        progress={evaluation.ueCredit}
        required={40}
      >
        <RuleCard
          rule={rule('ue')}
          items={items}
          description="The planner treats UE allocation explicitly so overlaps never make the 160-unit total look complete too early."
          courses={eligible('ue')}
          plannedCodes={plannedCodes}
          onAdd={onAdd}
          wide
        >
          <Button variant="outline" onClick={() => onOpenCustom('unscheduled')}>
            <Plus data-icon="inline-start" /> Add another approved elective
          </Button>
        </RuleCard>
      </RequirementSection>

      <Card className="rounded-2xl border-dashed bg-card/70">
        <CardHeader>
          <CardDescription>Reference and responsibility</CardDescription>
          <CardTitle className="font-display text-xl font-bold">Official AY2022/23 sources</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
          <SourceLink href={SOURCES.cohort}>CS cohort requirements</SourceLink>
          <SourceLink href={SOURCES.common}>SoC Common Curriculum</SourceLink>
          <SourceLink href={SOURCES.generalEducation}>General Education lists</SourceLink>
          <SourceLink href={SOURCES.focus}>Focus-area lists</SourceLink>
          <p className="w-full leading-6 text-muted-foreground">
            This is a personal planning aid, not an official degree audit. Module availability, prerequisites, mappings, and policy interpretations should be confirmed with the official handbook or your academic adviser.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

function RequirementSection({
  eyebrow,
  title,
  description,
  progress,
  required,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  progress: number;
  required: number;
  children: React.ReactNode;
}) {
  const percent = Math.min(100, Math.round((progress / required) * 100));
  return (
    <section className="space-y-4" aria-labelledby={`section-${title.replaceAll(' ', '-').toLowerCase()}`}>
      <div className="grid gap-4 rounded-2xl border bg-card p-5 md:grid-cols-[1fr_260px] md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-foreground">{eyebrow}</p>
          <h2 id={`section-${title.replaceAll(' ', '-').toLowerCase()}`} className="mt-1 font-display text-2xl font-bold tracking-tight">{title}</h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold">Requirement credit</span>
            <span className="tabular-nums text-muted-foreground">{progress} / {required}</span>
          </div>
          <Progress value={percent} className="[&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-indicator]]:bg-accent-foreground" />
        </div>
      </div>
      {children}
    </section>
  );
}

function RuleCard({
  rule,
  items,
  description,
  courses,
  plannedCodes,
  onAdd,
  children,
  wide = false,
}: {
  rule: RuleProgress;
  items: PlanItem[];
  description: string;
  courses?: Course[];
  plannedCodes: Set<string>;
  onAdd: (code: string, semester?: string) => void;
  children?: React.ReactNode;
  wide?: boolean;
}) {
  const percent = Math.min(100, Math.round((rule.current / rule.required) * 100));
  const status = rule.completed ? 'completed' : rule.planned ? 'planned' : 'missing';
  return (
    <Card className={`rounded-2xl ${status === 'completed' ? 'ring-emerald-600/25' : status === 'planned' ? 'ring-amber-500/35' : ''} ${wide ? 'h-full' : ''}`}>
      <CardHeader>
        <CardDescription>{rule.group}</CardDescription>
        <CardTitle className="font-display text-lg font-bold">{rule.label}</CardTitle>
        <CardAction><StatusPill status={status} /></CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        <div>
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="font-semibold">{rule.current} / {rule.required}</span>
            <span className="text-right text-muted-foreground">{rule.suffix}</span>
          </div>
          <Progress value={percent} className="[&_[data-slot=progress-track]]:h-1.5" />
        </div>
        {rule.contributors.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-semibold">Satisfied or planned by</p>
            <div className="flex flex-wrap gap-2">
              {rule.contributors.map((code) => {
                const completed = items.find((item) => item.code === code)?.status === 'completed';
                return (
                  <Badge key={code} variant={completed ? 'default' : 'secondary'}>
                    {completed ? <Check className="size-3" /> : <CircleDashed className="size-3" />}
                    {code}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
        {rule.missing.length > 0 && (
          <ul className="space-y-1.5 rounded-xl bg-muted/55 p-3 text-sm leading-5 text-muted-foreground">
            {rule.missing.map((missing) => <li key={missing}>• {missing}</li>)}
          </ul>
        )}
        {courses && (
          <CourseSelect
            courses={courses}
            plannedCodes={plannedCodes}
            placeholder={`+ Add an eligible ${rule.label} course…`}
            ariaLabel={`Add a course for ${rule.label}`}
            onSelect={(code) => onAdd(code, 'unscheduled')}
          />
        )}
        {children}
      </CardContent>
    </Card>
  );
}

function SlotPicker({
  title,
  note,
  courses,
  plannedCodes,
  onAdd,
}: {
  title: string;
  note?: string;
  courses: Course[];
  plannedCodes: Set<string>;
  onAdd: (code: string, semester?: string) => void;
}) {
  return (
    <div className="rounded-xl border bg-background p-3">
      <p className="text-sm font-semibold">{title}</p>
      {note && <p className="mb-2 mt-1 text-xs leading-5 text-muted-foreground">{note}</p>}
      {!note && <div className="h-2" />}
      <CourseSelect
        courses={courses}
        plannedCodes={plannedCodes}
        placeholder="+ Choose a course…"
        ariaLabel={`Choose a course for ${title}`}
        onSelect={(code) => onAdd(code, 'unscheduled')}
      />
    </div>
  );
}

function FocusAreaRow({
  area,
  focus,
  plannedCodes,
  onAdd,
}: {
  area: FocusArea;
  focus: DegreeEvaluation['focusAreas'][number];
  plannedCodes: Set<string>;
  onAdd: (code: string, semester?: string) => void;
}) {
  const primaries = COURSE_CATALOG.filter((course) => course.focusPrimary?.includes(area));
  const electives = COURSE_CATALOG.filter((course) => course.focusElective?.includes(area));
  return (
    <AccordionItem value={area}>
      <AccordionTrigger className="py-3 no-underline hover:no-underline">
        <span className="flex min-w-0 flex-1 items-center gap-3 pr-3">
          <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${focus.complete ? 'bg-emerald-100 text-emerald-700' : 'bg-secondary text-muted-foreground'}`}>
            {focus.complete ? <CheckCircle2 className="size-4" /> : <BookOpenCheck className="size-4" />}
          </span>
          <span className="min-w-0">
            <span className="block font-semibold">{area}</span>
            <span className="block text-xs font-normal text-muted-foreground">
              {focus.primaryCount}/3 Area Primaries · {focus.hasLevel4000 ? '4000+ included' : 'needs a 4000+ primary'}
            </span>
          </span>
        </span>
      </AccordionTrigger>
      <AccordionContent className="pb-4">
        {focus.contributors.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {focus.contributors.map((code) => <Badge key={code} variant="secondary">{code}</Badge>)}
          </div>
        )}
        <div className="grid gap-3 md:grid-cols-2">
          <SlotPicker title={`${area} · Area Primary`} note="Three are needed, including one at level 4000+." courses={primaries} plannedCodes={plannedCodes} onAdd={onAdd} />
          <SlotPicker title={`${area} · Focus elective`} note="Counts toward Breadth & Depth, but not the three-primary rule." courses={electives} plannedCodes={plannedCodes} onAdd={onAdd} />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function SettingRow({
  checked,
  onCheckedChange,
  title,
  description,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  title: string;
  description: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border bg-background p-4">
      <Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={title} className="mt-0.5" />
      <span>
        <span className="block text-sm font-semibold">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-muted-foreground">{description}</span>
      </span>
    </label>
  );
}

function StatusPill({ status, label }: { status: 'completed' | 'planned' | 'missing'; label?: string }) {
  const text = label ?? (status === 'completed' ? 'Completed' : status === 'planned' ? 'Planned' : 'Needs planning');
  if (status === 'completed') return <Badge className="bg-emerald-700 text-white"><CheckCircle2 className="size-3" />{text}</Badge>;
  if (status === 'planned') return <Badge className="bg-amber-200 text-amber-950"><CircleDashed className="size-3" />{text}</Badge>;
  return <Badge variant="secondary"><CircleDashed className="size-3" />{text}</Badge>;
}

function OverlapCard({ icon, title, codes, detail }: { icon: React.ReactNode; title: string; codes: string; detail: string }) {
  return (
    <article className="rounded-2xl border border-amber-300/70 bg-amber-100/65 p-5 text-amber-950">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-900 text-amber-50">{icon}</span>
        <div>
          <h2 className="font-display text-lg font-bold">{title}</h2>
          <p className="mt-1 font-mono text-sm font-bold">{codes}</p>
          <p className="mt-2 text-sm leading-6 text-amber-950/80">{detail}</p>
        </div>
      </div>
    </article>
  );
}

function SourceLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-primary underline-offset-4 hover:underline">
      {children}<ExternalLink className="size-3.5" />
    </a>
  );
}
