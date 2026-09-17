import { useState, useMemo } from "react";
import useSurveys from "../../hooks/useSurvay.jsx";
import SurveyHeader from "../components/Survey/SurveyHeader.jsx";
import SurveyToolbar from "../components/Survey/SurveyToolbar.jsx";
import SurveyTable from "../components/Survey/SurveyTable.jsx";
import SurveySkeleton from "../components/Survey/SurveySkeleton.jsx";
import SurveyEmptyState from "../components/Survey/SurveyEmptyState.jsx";
import SurveyErrorState from "../components/Survey/SurveyErrorState.jsx";
import ShareSurveyModal from "../components/Survey/ShareSurveyModal.jsx";
import DeleteSurveyModal from "../components/Survey/DeleteSurveyModal.jsx";
import ToastNotification from "../components/shared/ToastNotification.jsx";

// Initial fallback mock data matching Stitch visual fidelity if backend database is fresh
const SAMPLE_SURVEYS = [
  {
    _id: "srv_sample_1",
    title: "Product Onboarding CSAT",
    slug: "onb-csat-v2",
    description: "Onboarding CSAT",
    status: "published",
    questions: [{}, {}, {}, {}, {}],
    responseCount: 542,
    createdAt: new Date("2026-09-15T10:00:00Z").toISOString(),
  },
  {
    _id: "srv_sample_2",
    title: "Executive Experience NPS",
    slug: "exec-experience",
    description: "Post-Purchase NPS",
    status: "published",
    questions: [{}, {}, {}],
    responseCount: 1142,
    createdAt: new Date("2026-09-12T10:00:00Z").toISOString(),
  },
  {
    _id: "srv_sample_3",
    title: "Quarterly Feature Feedback",
    slug: "q3-feedback",
    description: "Experience",
    status: "draft",
    questions: [{}, {}, {}, {}, {}, {}],
    responseCount: 0,
    createdAt: new Date("2026-09-02T10:00:00Z").toISOString(),
  },
  {
    _id: "srv_sample_4",
    title: "Churn Exit Interview",
    slug: "churn-exit",
    description: "Detractor Flow",
    status: "published",
    questions: [{}, {}, {}, {}],
    responseCount: 158,
    createdAt: new Date("2026-08-28T10:00:00Z").toISOString(),
  },
  {
    _id: "srv_sample_5",
    title: "Beta Tester Pulse v1.0",
    slug: "beta-v1-archive",
    description: "Archived",
    status: "archived",
    questions: [{}, {}, {}, {}, {}, {}, {}, {}],
    responseCount: 210,
    createdAt: new Date("2026-07-14T10:00:00Z").toISOString(),
  },
];

export default function Survey() {
  const { useGetAllSurveys, useDeleteSurvey } = useSurveys();
  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllSurveys();
  const deleteMutation = useDeleteSurvey();

  // Local Interactive Simulator & Filter States
  const [simState, setSimState] = useState("loaded"); // 'loaded' | 'loading' | 'empty' | 'error'
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  // Modals state
  const [shareModalSurvey, setShareModalSurvey] = useState(null);
  const [deleteModalSurvey, setDeleteModalSurvey] = useState(null);

  // Toast state
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: "", type: "success" });
    }, 3500);
  };

  // Raw surveys from API or fallback sample data
  const rawSurveys = useMemo(() => {
    if (apiResponse?.data && Array.isArray(apiResponse.data) && apiResponse.data.length > 0) {
      return apiResponse.data;
    }
    return SAMPLE_SURVEYS;
  }, [apiResponse]);

  // Filter and sort calculations
  const filterCounts = useMemo(() => {
    return {
      all: rawSurveys.length,
      published: rawSurveys.filter((s) => s.status === "published").length,
      draft: rawSurveys.filter((s) => s.status === "draft").length,
      archived: rawSurveys.filter((s) => s.status === "archived").length,
    };
  }, [rawSurveys]);

  const displayedSurveys = useMemo(() => {
    let list = [...rawSurveys];

    // Filter by status tab
    if (activeFilter !== "all") {
      list = list.filter((s) => s.status === activeFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.title?.toLowerCase().includes(q) ||
          s.slug?.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === "recent") {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "responses") {
      list.sort((a, b) => (b.responseCount || 0) - (a.responseCount || 0));
    } else if (sortBy === "name") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [rawSurveys, activeFilter, searchQuery, sortBy]);

  // Handle Delete Confirmation
  const handleDeleteConfirm = async (surveyId) => {
    try {
      if (surveyId.startsWith("srv_sample_")) {
        showToast("Survey deleted from overview.");
      } else {
        await deleteMutation.mutateAsync(surveyId);
        showToast("Survey deleted successfully.");
      }
      setDeleteModalSurvey(null);
    } catch (err) {
      showToast(err.message || "Failed to delete survey", "error");
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-6 py-2">
      {/* Toast Feedback */}
      <ToastNotification toast={toast} onClose={() => setToast({ visible: false, message: "" })} />

      {/* Header Block with quick metrics */}
      <SurveyHeader
        totalSurveys={filterCounts.published}
        totalResponses={rawSurveys.reduce((acc, curr) => acc + (curr.responseCount || 0), 0)}
        avgCsat="94.2%"
      />

      {/* Filter and Search Toolbar */}
      <SurveyToolbar
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        filterCounts={filterCounts}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* MAIN STATE RENDERING */}
      {simState === "loading" || (isLoading && simState === "loaded" && !rawSurveys.length) ? (
        <SurveySkeleton />
      ) : simState === "error" || (isError && simState === "loaded") ? (
        <SurveyErrorState error={error} onRetry={() => refetch()} />
      ) : simState === "empty" || displayedSurveys.length === 0 ? (
        <SurveyEmptyState
          onSelectTemplate={() => {
            setSimState("loaded");
            showToast("Template chosen: Executive NPS");
          }}
        />
      ) : (
        <SurveyTable
          surveys={displayedSurveys}
          onShare={(survey) => setShareModalSurvey(survey)}
          onDelete={(survey) => setDeleteModalSurvey(survey)}
        />
      )}

      {/* Modals */}
      <ShareSurveyModal
        survey={shareModalSurvey}
        isOpen={Boolean(shareModalSurvey)}
        onClose={() => setShareModalSurvey(null)}
        onCopySuccess={(msg) => showToast(msg)}
      />

      <DeleteSurveyModal
        survey={deleteModalSurvey}
        isOpen={Boolean(deleteModalSurvey)}
        onClose={() => setDeleteModalSurvey(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
      />

      {/* UI State Simulator Pill (Docked Bottom Left) */}
      <div className="fixed bottom-4 left-6 z-40 bg-white/95 backdrop-blur-md border border-[#EFE4D6] px-3.5 py-2 rounded-full shadow-lg flex items-center gap-2">
        <span className="text-[10px] font-semibold text-[#7d7461] uppercase tracking-wider">
          State Simulator:
        </span>
        <div className="flex items-center gap-1">
          {["loaded", "empty", "loading", "error"].map((stateKey) => (
            <button
              key={stateKey}
              onClick={() => setSimState(stateKey)}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all cursor-pointer capitalize ${
                simState === stateKey
                  ? "bg-[#bb0028] text-white shadow-xs font-semibold"
                  : "text-[#7d7461] hover:text-[#1f1b18] hover:bg-[#FBF2EC]"
              }`}
            >
              {stateKey === "loading" ? "Skeleton" : stateKey}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
