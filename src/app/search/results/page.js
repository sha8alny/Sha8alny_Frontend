"use client";

import ResultsPageContainer from "@/app/components/modules/search/container/ResultsPageContainer";
import { Suspense } from "react";
const ResultPage = () => {
  return(
    <Suspense fallback={<div className="flex items-center justify-center h-full w-full">Loading...</div>}>
      <ResultsPageContainer />
    </Suspense>
  )
};

export default ResultPage;
