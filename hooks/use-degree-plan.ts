'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { COURSE_BY_CODE, type Course } from '@/lib/curriculum';
import {
  EMPTY_PLAN,
  evaluatePlan,
  type PlanItem,
  type PlannerSettings,
  type StoredPlan,
} from '@/lib/planner';

const STORAGE_KEY = 'degree-compass:nus-cs-ay22-23:v1';

const makeId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function useDegreePlan() {
  const [plan, setPlan] = useState<StoredPlan>(EMPTY_PLAN);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<StoredPlan>;
        if (parsed.version === 1 && Array.isArray(parsed.items) && parsed.settings) {
          setPlan(parsed as StoredPlan);
        }
      }
    } catch {
      // A corrupt browser backup should never stop the planner from loading.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  }, [hydrated, plan]);

  const addCourse = useCallback((code: string, semester = 'unscheduled') => {
    const normalized = code.trim().toUpperCase();
    if (!COURSE_BY_CODE.has(normalized)) return 'unknown' as const;
    if (plan.items.some((item) => item.code === normalized)) return 'exists' as const;
    const item: PlanItem = { id: makeId(), code: normalized, semester, status: 'planned' };
    setPlan((current) => ({ ...current, items: [...current.items, item] }));
    return 'added' as const;
  }, [plan.items]);

  const addCustomCourse = useCallback((custom: Course, semester = 'unscheduled') => {
    const normalized = custom.code.trim().toUpperCase();
    if (!normalized) return 'invalid' as const;
    if (plan.items.some((item) => item.code === normalized)) return 'exists' as const;
    const item: PlanItem = {
      id: makeId(),
      code: normalized,
      semester,
      status: 'planned',
      custom: { ...custom, code: normalized },
    };
    setPlan((current) => ({ ...current, items: [...current.items, item] }));
    return 'added' as const;
  }, [plan.items]);

  const removeCourse = useCallback((id: string) => {
    setPlan((current) => ({ ...current, items: current.items.filter((item) => item.id !== id) }));
  }, []);

  const toggleCompleted = useCallback((id: string) => {
    setPlan((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'completed' ? 'planned' : 'completed' }
          : item,
      ),
    }));
  }, []);

  const moveCourse = useCallback((id: string, semester: string) => {
    setPlan((current) => ({
      ...current,
      items: current.items.map((item) => item.id === id ? { ...item, semester } : item),
    }));
  }, []);

  const updateSettings = useCallback((settings: Partial<PlannerSettings>) => {
    setPlan((current) => ({ ...current, settings: { ...current.settings, ...settings } }));
  }, []);

  const resetPlan = useCallback(() => setPlan(EMPTY_PLAN), []);

  const importPlan = useCallback((raw: string) => {
    const parsed = JSON.parse(raw) as Partial<StoredPlan>;
    if (parsed.version !== 1 || !Array.isArray(parsed.items) || !parsed.settings) {
      throw new Error('This is not a Degree Compass v1 backup.');
    }
    setPlan(parsed as StoredPlan);
  }, []);

  const evaluation = useMemo(
    () => evaluatePlan(plan.items, plan.settings),
    [plan.items, plan.settings],
  );

  return {
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
  };
}
