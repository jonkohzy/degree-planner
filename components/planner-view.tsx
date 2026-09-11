'use client';

import {
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  Layers3,
  Plus,
  Trash2,
} from 'lucide-react';

import { CourseSelect } from '@/components/course-select';
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
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { COURSE_CATALOG, SEMESTERS, TAG_LABELS } from '@/lib/curriculum';
import { resolveCourse, type DegreeEvaluation, type PlanItem } from '@/lib/planner';

type PlannerViewProps = {
  items: PlanItem[];
  evaluation: DegreeEvaluation;
  onAdd: (code: string, semester?: string) => void;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
  onMove: (id: string, semester: string) => void;
  onOpenCustom: (semester?: string) => void;
};

export function PlannerView({
  items,
  evaluation,
  onAdd,
  onRemove,
  onToggle,
  onMove,
  onOpenCustom,
}: PlannerViewProps) {
  const plannedCodes = new Set(items.map((item) => item.code));

  return (
    <section aria-labelledby="planner-heading" className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-sm font-bold uppercase tracking-[0.14em] text-accent-foreground">Your timeline</p>
          <h1 id="planner-heading" className="font-display text-3xl font-bold tracking-[-0.035em]">Module planner</h1>
          <p className="mt-2 max-w-2xl text-base leading-7 text-muted-foreground">
            Add a course directly to a semester, then tick it off when completed. Requirement overlaps update everywhere automatically.
          </p>
        </div>
        <Button variant="outline" onClick={() => onOpenCustom()}>
          <Plus data-icon="inline-start" /> Add a course manually
        </Button>
      </div>

      {(evaluation.overlapMessages.length > 0 || evaluation.warnings.length > 0) && (
        <div className="grid gap-3 lg:grid-cols-2">
          {evaluation.overlapMessages.length > 0 && (
            <div className="rounded-2xl border border-amber-300/60 bg-amber-100/65 p-4 text-sm text-amber-950">
              <div className="mb-2 flex items-center gap-2 font-bold"><Layers3 className="size-4" /> Multi-requirement credit</div>
              {evaluation.overlapMessages.map((message) => <p key={message} className="leading-6">{message}</p>)}
            </div>
          )}
          {evaluation.warnings.length > 0 && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-950">
              <p className="mb-2 font-bold">Planning checks</p>
              <ul className="space-y-1.5 leading-5">
                {evaluation.warnings.map((warning) => <li key={warning}>• {warning}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {SEMESTERS.map((semester) => {
          const semesterItems = items.filter((item) => item.semester === semester.key);
          return (
            <SemesterCard
              key={semester.key}
              semester={semester}
              items={semesterItems}
              plannedCodes={plannedCodes}
              onAdd={onAdd}
              onRemove={onRemove}
              onToggle={onToggle}
              onMove={onMove}
              onOpenCustom={onOpenCustom}
            />
          );
        })}
      </div>
    </section>
  );
}

function SemesterCard({
  semester,
  items,
  plannedCodes,
  onAdd,
  onRemove,
  onToggle,
  onMove,
  onOpenCustom,
}: {
  semester: (typeof SEMESTERS)[number];
  items: PlanItem[];
  plannedCodes: Set<string>;
  onAdd: (code: string, semester?: string) => void;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
  onMove: (id: string, semester: string) => void;
  onOpenCustom: (semester?: string) => void;
}) {
  const units = items.reduce((sum, item) => sum + (resolveCourse(item)?.units ?? 0), 0);
  const isBacklog = semester.key === 'unscheduled';
  return (
    <Card className={`min-h-[390px] rounded-2xl ${isBacklog ? 'ring-2 ring-accent' : ''}`}>
      <CardHeader className="border-b">
        <CardDescription className="flex items-center gap-1.5">
          {isBacklog ? <Clock3 className="size-3.5" /> : null}{semester.year}
        </CardDescription>
        <CardTitle className="font-display text-lg font-bold">{semester.label}</CardTitle>
        <CardAction><Badge variant="secondary">{units} units</Badge></CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {items.length === 0 ? (
          <div className="flex min-h-32 flex-1 flex-col items-center justify-center py-5 text-center">
            <Circle className="mb-3 size-7 text-border" strokeWidth={1.5} />
            <p className="text-sm font-semibold">Nothing here yet</p>
            <p className="mt-1 max-w-48 text-sm leading-5 text-muted-foreground">
              {isBacklog ? 'Courses added from Requirements will wait here.' : 'Choose a course below to start this semester.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <ModuleCard key={item.id} item={item} onRemove={onRemove} onToggle={onToggle} onMove={onMove} />
            ))}
          </div>
        )}

        <div className="mt-auto space-y-2 border-t border-dashed pt-3">
          <CourseSelect
            courses={COURSE_CATALOG}
            plannedCodes={plannedCodes}
            ariaLabel={`Add a course to ${semester.year} ${semester.label}`}
            placeholder="+ Add an approved course…"
            onSelect={(code) => onAdd(code, semester.key)}
          />
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={() => onOpenCustom(semester.key)}>
            <Plus data-icon="inline-start" /> Other / approved course
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ModuleCard({
  item,
  onRemove,
  onToggle,
  onMove,
}: {
  item: PlanItem;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
  onMove: (id: string, semester: string) => void;
}) {
  const course = resolveCourse(item);
  if (!course) return null;
  const visibleTags = course.tags.filter((tag) => !['breadth'].includes(tag)).slice(0, 3);
  const hasOverlap = course.tags.filter((tag) => ['ge-singapore', 'ge-culture', 'ge-community', 'id', 'industry'].includes(tag)).length > 1;
  return (
    <article className={`rounded-xl border bg-background p-3 shadow-sm transition ${hasOverlap ? 'border-amber-300 shadow-amber-900/5' : 'border-border'}`}>
      <div className="flex items-start gap-2.5">
        <Button
          aria-label={item.status === 'completed' ? `Mark ${course.code} as planned` : `Mark ${course.code} completed`}
          title={item.status === 'completed' ? 'Completed' : 'Mark completed'}
          variant="ghost"
          size="icon-sm"
          className={item.status === 'completed' ? 'mt-0.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'mt-0.5 text-muted-foreground'}
          onClick={() => onToggle(item.id)}
        >
          {item.status === 'completed' ? <Check className="size-4" /> : <Circle className="size-4" />}
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-mono text-base font-bold text-primary">{course.code}</p>
              <p className="mt-0.5 text-sm leading-5 text-muted-foreground">{course.title}</p>
            </div>
            <span className="shrink-0 text-xs font-bold text-muted-foreground">{course.units}u</span>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {visibleTags.map((tag) => (
              <Badge key={tag} variant="outline" className="h-5 max-w-full text-xs">{TAG_LABELS[tag]}</Badge>
            ))}
            {course.tags.length > visibleTags.length + Number(course.tags.includes('breadth')) && (
              <Badge variant="secondary" className="h-5 text-xs">+{course.tags.length - visibleTags.length - Number(course.tags.includes('breadth'))}</Badge>
            )}
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <NativeSelect
          aria-label={`Move ${course.code} to another semester`}
          size="sm"
          value={item.semester}
          className="min-w-0 flex-1 [&_select]:w-full [&_select]:text-sm"
          onChange={(event) => onMove(item.id, event.target.value)}
        >
          {SEMESTERS.map((semester) => (
            <NativeSelectOption key={semester.key} value={semester.key}>{semester.year} · {semester.label}</NativeSelectOption>
          ))}
        </NativeSelect>
        <Button aria-label={`Remove ${course.code}`} title="Remove course" variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-destructive" onClick={() => onRemove(item.id)}>
          <Trash2 className="size-3.5" />
        </Button>
      </div>
      {item.status === 'completed' && (
        <p className="mt-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
          <CheckCircle2 className="size-3" /> Completed
        </p>
      )}
    </article>
  );
}
