import { DegreeApp } from '@/components/degree-app';

export default function Home() {
  return (
    <>
      <DegreeApp />
      <noscript>
        <p style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
          Degree Compass needs JavaScript to save your plan and update requirement progress.
        </p>
      </noscript>
    </>
  );
}
