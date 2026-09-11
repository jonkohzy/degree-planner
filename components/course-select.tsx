'use client';

import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { TAG_LABELS, type Course } from '@/lib/curriculum';

type CourseSelectProps = {
  courses: Course[];
  plannedCodes: Set<string>;
  placeholder: string;
  ariaLabel: string;
  onSelect: (code: string) => void;
  className?: string;
};

const visibleEffects = new Set([
  'ge-culture',
  'ge-singapore',
  'ge-community',
  'id',
  'cd',
  'industry',
  'foundation',
  'breadth',
  'ue',
]);

export function courseOptionLabel(course: Course) {
  const effects = course.tags
    .filter((tag) => visibleEffects.has(tag))
    .map((tag) => TAG_LABELS[tag]);
  return `${course.code} · ${course.title}${effects.length > 1 ? ` · ${effects.join(' + ')}` : ''}`;
}

export function CourseSelect({
  courses,
  plannedCodes,
  placeholder,
  ariaLabel,
  onSelect,
  className,
}: CourseSelectProps) {
  const available = courses.filter((item) => !plannedCodes.has(item.code));
  const grouped = available.reduce<Record<string, Course[]>>((groups, item) => {
    (groups[item.group] ??= []).push(item);
    return groups;
  }, {});

  return (
    <NativeSelect
      aria-label={ariaLabel}
      value=""
      className={className ?? 'w-full [&_select]:h-10 [&_select]:w-full'}
      onChange={(event) => {
        if (event.target.value) onSelect(event.target.value);
      }}
    >
      <NativeSelectOption value="">{available.length ? placeholder : 'All eligible courses are already planned'}</NativeSelectOption>
      {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([group, values]) => (
        <NativeSelectOptGroup key={group} label={group}>
          {values.sort((a, b) => a.code.localeCompare(b.code)).map((item) => (
            <NativeSelectOption key={item.code} value={item.code}>
              {courseOptionLabel(item)}
            </NativeSelectOption>
          ))}
        </NativeSelectOptGroup>
      ))}
    </NativeSelect>
  );
}
