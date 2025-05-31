import { usePageTitle } from "../hooks/usePageTitle";


export const HomePage = () => {
  usePageTitle("F1 Seasons");

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">F1 Seasons</h1>
    </div>
  );
};
