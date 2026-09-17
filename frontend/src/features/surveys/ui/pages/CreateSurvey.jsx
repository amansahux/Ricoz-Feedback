import { useCreateSurveyBuilder } from "../../hooks/useSurvay.jsx";
import BuilderHeader from "../components/CreateSurvey/BuilderHeader.jsx";
import SurveyDetailsForm from "../components/CreateSurvey/SurveyDetailsForm.jsx";
import QuestionCard from "../components/CreateSurvey/QuestionCard.jsx";
import QuestionTypeSelector from "../components/CreateSurvey/QuestionTypeSelector.jsx";
import LivePreviewPhone from "../components/CreateSurvey/LivePreviewPhone.jsx";
import PublishSurveyModal from "../components/CreateSurvey/PublishSurveyModal.jsx";
import ToastNotification from "../components/shared/ToastNotification.jsx";

export default function CreateSurvey() {
  const {
    title,
    setTitle,
    description,
    setDescription,
    questions,
    hasValidationError,
    lastSavedAt,
    isSaving,
    isPublishing,
    isPublishModalOpen,
    openPublishModal,
    closePublishModal,
    handleSaveDraft,
    handlePublishConfirm,
    handleUpdateQuestion,
    handleMoveUp,
    handleMoveDown,
    handleDuplicate,
    handleDelete,
    handleAddQuestion,
    toast,
    hideToast,
  } = useCreateSurveyBuilder();

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#FFFAF3]">
      <ToastNotification toast={toast} onClose={hideToast} />

      {/* Sticky Top Global Builder Header */}
      <BuilderHeader
        onSaveDraft={handleSaveDraft}
        onPublish={openPublishModal}
        isSaving={isSaving}
        isPublishing={isPublishing}
        lastSavedAt={lastSavedAt}
      />

      {/* Main Dual-Column Builder Container */}
      <div className="w-full overflow-hidden grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start pb-16 px-1">
        {/* LEFT COLUMN: EDITOR & QUESTIONS */}
        <div className="min-w-0 flex flex-col gap-6">
          {/* Section Intro Banner */}
          <div className="bg-white rounded-2xl p-5 border border-[#EFE4D6] shadow-2xs">
            <p className="text-xs sm:text-sm text-[#7d7461] font-inter leading-relaxed">
              Create a feedback experience your customers will actually want to complete. Design
              questions, reorder logic, and verify customer perception in real-time.
            </p>
          </div>

          {/* 1. Survey Details Card */}
          <SurveyDetailsForm
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            hasError={hasValidationError}
          />

          {/* 2. Questions List */}
          <div className="flex flex-col gap-4">
            {questions.map((q, idx) => (
              <QuestionCard
                key={q._id || `card_${idx}`}
                question={q}
                index={idx}
                totalQuestions={questions.length}
                onUpdate={(upd) => handleUpdateQuestion(idx, upd)}
                onMoveUp={() => handleMoveUp(idx)}
                onMoveDown={() => handleMoveDown(idx)}
                onDuplicate={() => handleDuplicate(idx)}
                onDelete={() => handleDelete(idx)}
              />
            ))}
          </div>

          {/* 3. Add Question Type Selector */}
          <QuestionTypeSelector onAddQuestion={handleAddQuestion} />
        </div>

        {/* RIGHT COLUMN: STICKY PHONE PREVIEW */}
        <div className="min-w-0 hidden lg:block">
          <LivePreviewPhone
            title={title}
            description={description}
            questions={questions}
          />
        </div>
      </div>

      {/* Launch Confirmation Modal */}
      <PublishSurveyModal
        isOpen={isPublishModalOpen}
        onClose={closePublishModal}
        onConfirm={handlePublishConfirm}
        surveyTitle={title}
        questionCount={questions.length}
        isPublishing={isPublishing}
      />
    </div>
  );
}
