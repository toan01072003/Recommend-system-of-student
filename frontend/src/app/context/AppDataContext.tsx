import {
  createContext,
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

const AppDataContext = createContext<AppDataSnapshot>(fallbackAppData);

export const useAppData = () => useContext(AppDataContext);

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const [appData, setAppData] = useState<AppDataSnapshot>(fallbackAppData);

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
    <AppDataContext.Provider value={appData}>
      {children}
    </AppDataContext.Provider>
  );
};
