import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "@/pages/Index";
import CaseStudyDetail from "@/pages/CaseStudyDetail";
import CalculatorPage from "@/pages/CalculatorPage";
import NotFound from "@/pages/NotFound";
import { PageTransition } from "./PageTransition";
import { SUPPORTED_LANGS, type Lang } from "@/data/translations";

const preferredLang = (): Lang => {
  const stored = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
  if (stored && SUPPORTED_LANGS.includes(stored as Lang)) return stored as Lang;
  const nav = typeof navigator !== "undefined" ? navigator.language.slice(0, 2) : "ru";
  return SUPPORTED_LANGS.includes(nav as Lang) ? (nav as Lang) : "ru";
};

export const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to={`/${preferredLang()}`} replace />} />
        <Route path="/cases/:id" element={<Navigate to={`/${preferredLang()}${location.pathname}`} replace />} />
        <Route path="/calculator" element={<Navigate to={`/${preferredLang()}/calculator`} replace />} />
        <Route
          path="/:lang"
          element={
            <PageTransition>
              <Index />
            </PageTransition>
          }
        />
        <Route
          path="/:lang/calculator"
          element={
            <PageTransition>
              <CalculatorPage />
            </PageTransition>
          }
        />
        <Route
          path="/:lang/cases/:id"
          element={
            <PageTransition>
              <CaseStudyDetail />
            </PageTransition>
          }
        />
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};
