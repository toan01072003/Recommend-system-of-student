import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  gradeData,
  classesData,
  studentsInClass,
  careerInterestDist,
  heatmapData,
} from "../data";
import { fetchAppData } from "../api/client";

export const fallbackAppData = {
  gradeData,
  classesData,
  studentsInClass,
  careerInterestDist,
  heatmapData,
};

export type AppDataSnapshot = typeof fallbackAppData;
type AppDataStudent = AppDataSnapshot["studentsInClass"][number] & {
  currentExploredCareer?: string;
  latestRecommendCareer?: string;
  recommendHistory?: unknown[];
};

type AppDataContextValue = AppDataSnapshot & {
  updateStudentInAppData: (
    studentId: string,
    updates: Partial<AppDataStudent>,
  ) => void;
};

const AppDataContext = createContext<AppDataContextValue>({
  ...fallbackAppData,
  updateStudentInAppData: () => undefined,
});

export const useAppData = () => useContext(AppDataContext);

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const [appData, setAppData] = useState<AppDataSnapshot>(fallbackAppData);
  const updateStudentInAppData = useCallback(
    (studentId: string, updates: Partial<AppDataStudent>) => {
      setAppData((current) => ({
        ...current,
        studentsInClass: current.studentsInClass.map((student) =>
          student.id === studentId ? { ...student, ...updates } : student,
        ),
      }));
    },
    [],
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchAppData<Partial<AppDataSnapshot>>(controller.signal)
      .then((payload) => {
        setAppData((current) => ({
          ...current,
          gradeData: payload.gradeData ?? current.gradeData,
          classesData: payload.classesData ?? current.classesData,
          studentsInClass: payload.studentsInClass ?? current.studentsInClass,
          careerInterestDist:
            payload.careerInterestDist ?? current.careerInterestDist,
          heatmapData: payload.heatmapData ?? current.heatmapData,
        }));
      })
      .catch((error) => {
        if (error.name !== "AbortError") console.warn(error.message);
      });

    return () => controller.abort();
  }, []);

  return (
    <AppDataContext.Provider value={{ ...appData, updateStudentInAppData }}>
      {children}
    </AppDataContext.Provider>
  );
};
