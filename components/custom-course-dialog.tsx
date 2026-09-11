'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { SEMESTERS, type Course, type RequirementTag } from '@/lib/curriculum';

type Classification = 'ue' | 'breadth' | 'cd' | 'industry';

type CustomCourseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultSemester: string;
  onAdd: (course: Course, semester: string) => 'added' | 'exists' | 'invalid';
};

const classificationDetails: Record<Classification, { label: string; group: string; tags: RequirementTag[] }> = {
  ue: { label: 'Unrestricted Elective', group: 'Custom · Unrestricted Elective', tags: ['ue'] },
  breadth: { label: 'Approved CS Breadth & Depth', group: 'Custom · CS Breadth & Depth', tags: ['breadth'] },
  cd: { label: 'Approved Cross-disciplinary course', group: 'Custom · Cross-disciplinary', tags: ['cd'] },
  industry: { label: 'Approved Industry Experience', group: 'Custom · Industry Experience', tags: ['breadth', 'industry'] },
};

export function CustomCourseDialog({
  open,
  onOpenChange,
  defaultSemester,
  onAdd,
}: CustomCourseDialogProps) {
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [units, setUnits] = useState('4');
  const [classification, setClassification] = useState<Classification>('ue');
  const [semester, setSemester] = useState(defaultSemester);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setSemester(defaultSemester);
      setError('');
    }
  }, [defaultSemester, open]);

  const reset = () => {
    setCode('');
    setTitle('');
    setUnits('4');
    setClassification('ue');
    setError('');
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) reset();
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            const numericUnits = Number(units);
            if (!code.trim() || !title.trim() || !Number.isFinite(numericUnits) || numericUnits <= 0) {
              setError('Enter a course code, title, and a positive unit value.');
              return;
            }
            const details = classificationDetails[classification];
            const result = onAdd({
              code: code.trim().toUpperCase(),
              title: title.trim(),
              units: numericUnits,
              tags: details.tags,
              group: details.group,
              note: 'Manually added course; confirm its official mapping before relying on it.',
            }, semester);
            if (result === 'exists') {
              setError(`${code.trim().toUpperCase()} is already in your plan.`);
              return;
            }
            if (result === 'invalid') {
              setError('This course could not be added. Check the code and try again.');
              return;
            }
            onOpenChange(false);
            reset();
          }}
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">Add another approved course</DialogTitle>
            <DialogDescription>
              Use this for electives or approved mappings not included in the curated AY2022/23 lists. Manual classifications are saved in your browser backup.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="custom-code">Course code</Label>
              <Input
                id="custom-code"
                autoComplete="off"
                placeholder="e.g. CSxxxx"
                value={code}
                onChange={(event) => setCode(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom-units">Units</Label>
              <Input
                id="custom-units"
                type="number"
                min="1"
                step="1"
                value={units}
                onChange={(event) => setUnits(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-title">Course title</Label>
            <Input
              id="custom-title"
              autoComplete="off"
              placeholder="Course title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-classification">Count this course toward</Label>
            <NativeSelect
              id="custom-classification"
              aria-label="Custom course classification"
              value={classification}
              className="w-full [&_select]:h-10 [&_select]:w-full"
              onChange={(event) => setClassification(event.target.value as Classification)}
            >
              {Object.entries(classificationDetails).map(([value, details]) => (
                <NativeSelectOption key={value} value={value}>{details.label}</NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-semester">Semester</Label>
            <NativeSelect
              id="custom-semester"
              value={semester}
              className="w-full [&_select]:h-10 [&_select]:w-full"
              onChange={(event) => setSemester(event.target.value)}
            >
              {SEMESTERS.map((entry) => (
                <NativeSelectOption key={entry.key} value={entry.key}>{entry.year} · {entry.label}</NativeSelectOption>
              ))}
            </NativeSelect>
          </div>

          {error && <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
            <Button type="submit">Add course</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
