'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Download,
  FileUp,
  GraduationCap,
  HardDrive,
  LayoutGrid,
  ListChecks,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';

import { CustomCourseDialog } from '@/components/custom-course-dialog';
import { PlannerView } from '@/components/planner-view';
import { RequirementsView } from '@/components/requirements-view';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useDegreePlan } from '@/hooks/use-degree-plan';
import { COURSE_BY_CODE, SEMESTERS, type Course } from '@/lib/curriculum';

type View = 'planner' | 'requirements';

type WebMcpTool = {
  name: string;
  title?: string;
  description: string;
  inputSchema: object;
  annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean };
  execute(input: unknown): unknown | Promise<unknown>;
};

type WebMcpContext = {
  registerTool(tool: WebMcpTool, options?: { signal?: AbortSignal }): void | Promise<void>;
};

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

export function DegreeApp() {
  const {
    plan,
    hydrated,
    evaluation,
    addCourse,
    addCustomCourse,
    removeCourse,
    toggleCompleted,
    moveCourse,
    updateSettings,
    resetPlan,
    importPlan,
  } = useDegreePlan();
  const [view, setViewState] = useState<View>('planner');
  const [customOpen, setCustomOpen] = useState(false);
  const [customSemester, setCustomSemester] = useState('unscheduled');
  const [notice, setNotice] = useState('Your progress is saved only in this browser.');
  const importInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const readHash = () => setViewState(window.location.hash === '#/requirements' ? 'requirements' : 'planner');
    readHash();
    window.addEventListener('hashchange', readHash);
    return () => window.removeEventListener('hashchange', readHash);
  }, []);

  const setView = (nextView: View) => {
    window.location.hash = nextView === 'requirements' ? '/requirements' : '/planner';
    setViewState(nextView);
  };

  const announceAdd = (code: string, semester = 'unscheduled') => {
    const result = addCourse(code, semester);
    if (result === 'added') setNotice(`${code} added to ${semester === 'unscheduled' ? 'Unscheduled' : 'your semester plan'}.`);
    if (result === 'exists') setNotice(`${code} is already in your plan.`);
    if (result === 'unknown') setNotice(`${code} is not in the curated course list. Use “Add a course manually” instead.`);
  };

  const openCustom = (semester = 'unscheduled') => {
    setCustomSemester(semester);
    setCustomOpen(true);
  };

  useEffect(() => {
    const context = (document as Document & { modelContext?: WebMcpContext }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = (tool: WebMcpTool) => {
      try {
        void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => undefined);
      } catch {
        // WebMCP is optional; unsupported or partial implementations must not affect the planner.
      }
    };

    register({
      name: 'read_degree_progress',
      title: 'Read degree progress',
      description: 'Read the visible NUS Computer Science AY2022/23 progress summary without changing the plan.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute() {
        return {
          completedUnits: evaluation.completedUnits,
          plannedUnits: evaluation.uniqueUnits,
          remainingUnits: Math.max(0, 160 - evaluation.uniqueUnits),
          plannedRequirements: evaluation.plannedRules,
          completedRequirements: evaluation.completedRules,
        };
      },
    });

    register({
      name: 'add_course_to_plan',
      title: 'Add course to plan',
      description: 'Add one curated course to a specified semester in the visible degree plan.',
      inputSchema: {
        type: 'object',
        properties: {
          code: { type: 'string', description: 'NUS course code, for example CDE2501 or CP3107.' },
          semester: { type: 'string', enum: SEMESTERS.map((semester) => semester.key) },
        },
        required: ['code', 'semester'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      async execute(input) {
        if (!input || typeof input !== 'object') throw new Error('Expected a course code and semester.');
        const data = input as { code?: unknown; semester?: unknown };
        const code = typeof data.code === 'string' ? data.code.trim().toUpperCase() : '';
        const semester = typeof data.semester === 'string' ? data.semester : '';
        if (!COURSE_BY_CODE.has(code)) throw new Error(`${code || 'Course'} is not in the curated catalog.`);
        if (!SEMESTERS.some((entry) => entry.key === semester)) throw new Error('Semester is not valid.');
        const result = addCourse(code, semester);
        if (result !== 'added') throw new Error(result === 'exists' ? `${code} is already planned.` : `${code} could not be added.`);
        setNotice(`${code} added through a browser tool.`);
        await nextFrame();
        return { code, semester, status: 'planned' };
      },
    });

    register({
      name: 'set_course_completion',
      title: 'Set course completion',
      description: 'Mark a course already in the visible plan as completed or planned.',
      inputSchema: {
        type: 'object',
        properties: {
          code: { type: 'string' },
          completed: { type: 'boolean' },
        },
        required: ['code', 'completed'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      async execute(input) {
        if (!input || typeof input !== 'object') throw new Error('Expected a course code and completed value.');
        const data = input as { code?: unknown; completed?: unknown };
        const code = typeof data.code === 'string' ? data.code.trim().toUpperCase() : '';
        if (typeof data.completed !== 'boolean') throw new Error('completed must be true or false.');
        const item = plan.items.find((entry) => entry.code === code);
        if (!item) throw new Error(`${code || 'Course'} is not in the plan.`);
        const desired = data.completed ? 'completed' : 'planned';
        if (item.status !== desired) toggleCompleted(item.id);
        setNotice(`${code} marked ${desired}.`);
        await nextFrame();
        return { code, status: desired };
      },
    });

    return () => lifecycle.abort();
  }, [addCourse, evaluation, plan.items, toggleCompleted]);

  const plannedPercent = Math.min(100, Math.round((evaluation.uniqueUnits / 160) * 100));
  const completedPercent = Math.min(100, Math.round((evaluation.completedUnits / 160) * 100));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/94 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-[1500px] flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
          <a href="#/planner" className="flex items-center gap-3" onClick={() => setView('planner')}>
            <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[0_8px_24px_oklch(0.29_0.09_250/20%)]">
              <GraduationCap className="size-5" />
            </span>
            <span>
              <span className="block font-display text-base font-bold leading-tight">Degree Compass</span>
              <span className="block text-xs font-medium text-muted-foreground">NUS CS · AY2022/23</span>
            </span>
          </a>
          <nav aria-label="Primary navigation" className="flex items-center rounded-xl bg-secondary p-1">
            <Button
              variant={view === 'planner' ? 'default' : 'ghost'}
              size="sm"
              aria-current={view === 'planner' ? 'page' : undefined}
              onClick={() => setView('planner')}
            >
              <LayoutGrid data-icon="inline-start" /> Planner
            </Button>
            <Button
              variant={view === 'requirements' ? 'default' : 'ghost'}
              size="sm"
              aria-current={view === 'requirements' ? 'page' : undefined}
              onClick={() => setView('requirements')}
            >
              <ListChecks data-icon="inline-start" /> Requirements
            </Button>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <section aria-label="Degree progress summary" className="mb-7 grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.75fr)]">
          <div className="rounded-3xl bg-primary p-5 text-primary-foreground shadow-[0_20px_54px_oklch(0.22_0.08_250/14%)] sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Badge className="border-white/15 bg-white/10 text-white" variant="outline">
                  <ShieldCheck className="size-3" /> Browser-local planning aid
                </Badge>
                <h2 className="mt-3 font-display text-2xl font-bold tracking-[-0.03em] sm:text-3xl">
                  BComp (Honours) in Computer Science
                </h2>
                <p className="mt-1 text-sm text-white/65">AY2022/23 cohort · minimum 160 unique units</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white" onClick={() => importInput.current?.click()}>
                  <FileUp data-icon="inline-start" /> Import
                </Button>
                <Button variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white" onClick={() => {
                  const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'degree-compass-backup.json';
                  link.click();
                  URL.revokeObjectURL(url);
                  setNotice('Backup exported as degree-compass-backup.json.');
                }}>
                  <Download data-icon="inline-start" /> Export
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger render={<Button variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white" />}>
                    <RotateCcw data-icon="inline-start" /> Reset
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogMedia><RotateCcw /></AlertDialogMedia>
                      <AlertDialogTitle>Reset the entire plan?</AlertDialogTitle>
                      <AlertDialogDescription>This removes every planned course and setting from this browser. Export a backup first if you may need it.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep my plan</AlertDialogCancel>
                      <AlertDialogCancel variant="destructive" onClick={() => {
                        resetPlan();
                        setNotice('Your plan has been reset.');
                      }}>Reset plan</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <input
                  ref={importInput}
                  className="sr-only"
                  type="file"
                  accept="application/json,.json"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    try {
                      importPlan(await file.text());
                      setNotice(`Imported ${file.name}.`);
                    } catch (error) {
                      setNotice(error instanceof Error ? error.message : 'That backup could not be imported.');
                    } finally {
                      event.target.value = '';
                    }
                  }}
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
              <SummaryStat label="Completed" value={evaluation.completedUnits} />
              <SummaryStat label="Planned total" value={evaluation.uniqueUnits} />
              <SummaryStat label="Still needed" value={Math.max(0, 160 - evaluation.uniqueUnits)} />
            </div>
          </div>

          <Card className="justify-center rounded-3xl">
            <CardContent className="space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Graduation progress</p>
                  <p className="mt-1 font-display text-3xl font-bold tracking-tight">{evaluation.uniqueUnits} / 160</p>
                  <p className="mt-1 text-sm text-muted-foreground">{evaluation.completedUnits} completed · {evaluation.plannedOnlyUnits} planned</p>
                </div>
                <span className="grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
                  <span className="font-display text-sm font-bold">{plannedPercent}%</span>
                </span>
              </div>
              <div className="space-y-2">
                <Progress value={plannedPercent} className="[&_[data-slot=progress-track]]:h-2.5 [&_[data-slot=progress-indicator]]:bg-accent-foreground" />
                <Progress value={completedPercent} className="[&_[data-slot=progress-track]]:h-1.5 [&_[data-slot=progress-indicator]]:bg-emerald-600" />
                <div className="flex justify-between text-xs text-muted-foreground"><span>Planned</span><span>Completed</span></div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <ProgressLine label="Common" value={`${evaluation.commonCredit}/40`} />
                <ProgressLine label="Programme" value={`${evaluation.programmeCredit}/80`} />
                <ProgressLine label="UE allocated" value={`${evaluation.ueCredit}/40`} />
                <ProgressLine label="Rules planned" value={`${evaluation.plannedRules}/${evaluation.rules.length}`} />
              </div>
            </CardContent>
          </Card>
        </section>

        <div role="status" aria-live="polite" className="mb-5 flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5 text-sm text-muted-foreground">
          <HardDrive className="size-4 shrink-0 text-primary" />
          <span>{hydrated ? notice : 'Loading your browser-saved plan…'}</span>
        </div>

        {view === 'planner' ? (
          <PlannerView
            items={plan.items}
            evaluation={evaluation}
            onAdd={announceAdd}
            onRemove={(id) => {
              const code = plan.items.find((item) => item.id === id)?.code;
              removeCourse(id);
              setNotice(code ? `${code} removed from your plan.` : 'Course removed from your plan.');
            }}
            onToggle={(id) => {
              const item = plan.items.find((entry) => entry.id === id);
              toggleCompleted(id);
              if (item) setNotice(`${item.code} marked ${item.status === 'completed' ? 'planned' : 'completed'}.`);
            }}
            onMove={(id, semester) => {
              moveCourse(id, semester);
              setNotice('Course moved to the selected semester.');
            }}
            onOpenCustom={openCustom}
          />
        ) : (
          <RequirementsView
            items={plan.items}
            evaluation={evaluation}
            settings={plan.settings}
            onAdd={announceAdd}
            onUpdateSettings={updateSettings}
            onOpenCustom={openCustom}
          />
        )}

        <footer className="mt-10 border-t py-6 text-sm leading-6 text-muted-foreground">
          Degree Compass is an unofficial personal planning aid. It stores no account data and sends no plan to a server; export JSON periodically as your backup.
        </footer>
      </div>

      <CustomCourseDialog
        open={customOpen}
        onOpenChange={setCustomOpen}
        defaultSemester={customSemester}
        onAdd={(course: Course, semester) => {
          const result = addCustomCourse(course, semester);
          if (result === 'added') setNotice(`${course.code} added as a manually classified course.`);
          return result;
        }}
      />
    </main>
  );
}

function SummaryStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-3 sm:p-4">
      <p className="text-xs font-semibold text-white/60">{label}</p>
      <p className="mt-1 font-display text-xl font-bold sm:text-2xl">{value} <span className="text-xs font-medium text-white/55">units</span></p>
    </div>
  );
}

function ProgressLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-border/70 pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  );
}
