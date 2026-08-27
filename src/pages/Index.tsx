import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ElectiveType } from '@/types';
import { useProgramState } from '@/hooks/useProgramState';
import { buildYear1, buildYear2, buildYear3, flattenPeriods } from '@/utils/program';
import { calculateStats } from '@/utils/calculations';
import { AppHeader } from '@/components/AppHeader';
import { GpaSummary } from '@/components/GpaSummary';
import { YearCard } from '@/components/YearCard';
import { Year2Options } from '@/components/Year2Options';
import { Year3Options } from '@/components/Year3Options';
import { ElectiveSelect } from '@/components/ElectiveSelect';
import { OptionField, OptionGroup } from '@/components/OptionGroup';
import { SiteFooter } from '@/components/SiteFooter';
import { Hero } from '@/components/Hero';
import { ProgrammeSelect } from '@/components/ProgrammeSelect';
import { ProgrammeView } from '@/components/ProgrammeView';
import { programmeByKey } from '@/data/programmes';
import {
  buildProgrammeTerms,
  flattenTerms,
  groupProgrammeYears,
} from '@/utils/programmeModel';

const Index = () => {
  const {
    config,
    grades,
    setGrade,
    setSpecialization,
    setSecondSpecialization,
    setYear2Elective,
    setYear3Elective,
    setExchange,
    setInternship,
    setThesis,
    setProgramme,
    setProgrammeElective,
    setProgrammeElectiveCourse,
    toggleProgrammeChoice,
    setMscThesis,
    setMscExchange,
    reset,
    hasProgress,
  } = useProgramState();

  // The programme is shareable as a link, and the link wins on first load.
  const [params, setParams] = useSearchParams();
  const requested = params.get('programme');
  useEffect(() => {
    if (requested && requested !== config.programme) setProgramme(requested);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requested]);

  const programme = programmeByKey(config.programme);

  const chooseProgramme = (key: string) => {
    setProgramme(key);
    const next = new URLSearchParams(params);
    if (key === 'bsc-business-economics') next.delete('programme');
    else next.set('programme', key);
    setParams(next, { replace: true });
  };

  // Course lists are derived from the configuration, never stored, so no
  // reconfiguration path can leave stale or half-updated courses behind.
  const year1 = useMemo(() => buildYear1(), []);
  const year2 = useMemo(() => buildYear2(config), [config]);
  const year3 = useMemo(() => buildYear3(config), [config]);

  const programmeCourses = useMemo(
    () => (programme.custom ? [] : flattenTerms(buildProgrammeTerms(programme, config))),
    [programme, config],
  );

  const year1Courses = useMemo(() => flattenPeriods(year1), [year1]);
  const year2Courses = useMemo(() => flattenPeriods(year2), [year2]);
  const year3Courses = useMemo(() => flattenPeriods(year3.periods), [year3]);
  const allCourses = useMemo(
    () =>
      programme.custom
        ? [...year1Courses, ...year2Courses, ...year3Courses]
        : programmeCourses,
    [programme, programmeCourses, year1Courses, year2Courses, year3Courses],
  );

  const perYear = useMemo(() => {
    const groups = programme.custom
      ? [year1Courses, year2Courses, year3Courses]
      : groupProgrammeYears(programme, config);
    return groups.map((courses, index) => {
      const stats = calculateStats(courses, grades);
      return { year: index + 1, gpa: stats.gpa, graded: stats.gradedCredits > 0 };
    });
  }, [programme, config, year1Courses, year2Courses, year3Courses, grades]);

  const year2ElectiveControls = useMemo(() => {
    const controls: Record<number, JSX.Element> = {};
    if (!config.specialization || config.secondSpecialization) return controls;

    [3, 4].forEach((period) => {
      controls[period] = (
        <div className="mb-3">
          <OptionGroup>
            <OptionField label="Elective slot">
              <ElectiveSelect
                label={`Elective for period ${period}`}
                value={config.year2Electives[`p${period}`] ?? null}
                onChange={(type: ElectiveType | null) =>
                  setYear2Elective(`p${period}`, type)
                }
              />
            </OptionField>
          </OptionGroup>
        </div>
      );
    });
    return controls;
  }, [config, setYear2Elective]);

  const year3ElectiveControls = useMemo(() => {
    const controls: Record<number, JSX.Element> = {};
    [1, 2, 3, 4].forEach((period) => {
      const slots = year3.electiveSlots[period];
      if (!slots.length) return;

      controls[period] = (
        <div className="mb-3">
          <OptionGroup>
            {slots.map((key, index) => (
              <OptionField key={key} label={`Elective slot ${index + 1}`}>
                <ElectiveSelect
                  label={`Elective ${index + 1} for period ${period}`}
                  value={config.year3Electives[key] ?? null}
                  onChange={(type: ElectiveType | null) => setYear3Elective(key, type)}
                />
              </OptionField>
            ))}
          </OptionGroup>
        </div>
      );
    });
    return controls;
  }, [config, year3, setYear3Elective]);

  const year2Empty = config.specialization
    ? undefined
    : 'Choose a specialisation to fill this period.';

  return (
    <div className="min-h-screen bg-background">
      <AppHeader onReset={reset} canReset={hasProgress} />
      <Hero />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <div className="mb-8">
          <GpaSummary courses={allCourses} grades={grades} perYear={perYear} />
        </div>

        <div className="mb-8">
          <span className="field-label">Programme</span>
          <ProgrammeSelect value={config.programme} onChange={chooseProgramme} />
          <p className="mt-2 text-xs text-muted-foreground">
            {programme.name} · {programme.degreeCredits} ECTS
          </p>
        </div>

        {programme.custom ? (
          <div className="space-y-8">
            <YearCard year={1} periods={year1} grades={grades} onGradeChange={setGrade} />

            <YearCard
              year={2}
              periods={year2}
              grades={grades}
              onGradeChange={setGrade}
              beforePeriod={{
                // Sits with the periods it fills, rather than at the top of the
                // year where you would have to scroll to see the effect.
                3: (
                  <Year2Options
                    config={config}
                    onSpecializationChange={setSpecialization}
                    onSecondSpecializationChange={setSecondSpecialization}
                  />
                ),
              }}
              periodControls={year2ElectiveControls}
              emptyMessages={{ 3: year2Empty, 4: year2Empty }}
            />

            <YearCard
              year={3}
              periods={year3.periods}
              grades={grades}
              onGradeChange={setGrade}
              headerControls={
                <Year3Options
                  config={config}
                  onExchangeChange={setExchange}
                  onInternshipChange={setInternship}
                  onThesisChange={setThesis}
                />
              }
              periodControls={year3ElectiveControls}
            />
          </div>
        ) : (
          <ProgrammeView
            programme={programme}
            config={config}
            grades={grades}
            onGradeChange={setGrade}
            onElectiveChange={setProgrammeElective}
            onChoiceToggle={toggleProgrammeChoice}
            onElectiveCourseChange={setProgrammeElectiveCourse}
            onThesisChange={setMscThesis}
            onExchangeChange={setMscExchange}
          />
        )}
      </main>

      <SiteFooter />
    </div>
  );
};

export default Index;
