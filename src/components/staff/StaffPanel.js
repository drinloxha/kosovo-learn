import { useMemo, useState } from 'react';
import AddLessonForm from './AddLessonForm';
import AddSubjectForm from './AddSubjectForm';
import CurriculumPlanner from './CurriculumPlanner';
import LessonEditorModal from './LessonEditorModal';
import StaffLessons from './StaffLessons';
import StaffOverview from './StaffOverview';

function StaffPanel({
  section,
  library,
  grade,
  modules = [],
  plan,
  customModules = [],
  onAddSubject,
  onAddLesson,
  onUpdateModuleWeek,
  onUpdateModuleOutcomes,
  onUpdateCustomModule,
}) {
  const [editingModuleId, setEditingModuleId] = useState(null);
  const [editingSubjectId, setEditingSubjectId] = useState(null);

  const editingModule = useMemo(
    () => customModules.find((module) => module.id === editingModuleId) ?? null,
    [customModules, editingModuleId]
  );

  const editingPlanEntry = useMemo(() => {
    if (!editingModule) {
      return null;
    }
    return plan?.[editingModule.grade]?.modules?.[editingModule.id] ?? null;
  }, [editingModule, plan]);

  const handleCloseEditor = () => {
    setEditingModuleId(null);
    setEditingSubjectId(null);
  };

  const handleSaveEditor = (payload) => {
    onUpdateCustomModule?.(payload);
    handleCloseEditor();
  };

  if (section === 'add-subject') {
    return <AddSubjectForm onSubmit={onAddSubject} />;
  }
  if (section === 'add-lesson') {
    return <AddLessonForm library={library} onSubmit={onAddLesson} />;
  }
  if (section === 'plan') {
    return (
      <CurriculumPlanner
        grade={grade}
        modules={modules}
        plan={plan}
        onChangeWeek={onUpdateModuleWeek}
        onChangeOutcomes={onUpdateModuleOutcomes}
      />
    );
  }
  if (section === 'lessons') {
    return (
      <>
        <StaffLessons
          library={library}
          customModules={customModules}
          onEditModule={(moduleId, subjectId) => {
            setEditingModuleId(moduleId);
            setEditingSubjectId(subjectId);
          }}
        />
        {editingModule && (
          <LessonEditorModal
            module={editingModule}
            subjectId={editingSubjectId}
            planEntry={editingPlanEntry}
            onClose={handleCloseEditor}
            onSave={handleSaveEditor}
          />
        )}
      </>
    );
  }
  return <StaffOverview library={library} />;
}

export default StaffPanel;
