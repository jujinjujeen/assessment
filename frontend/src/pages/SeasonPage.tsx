import { useParams, useNavigate } from "react-router";
import { usePageTitle } from "../hooks/usePageTitle";

export const SeasonPage = () => {
  const { seasonId } = useParams();
  const navigate = useNavigate();
  usePageTitle(`F1 Season ${seasonId}`);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button onClick={() => {
        navigate(-1);
      }}>back</button>
      <h1 className="text-4xl font-bold mb-4">F1 Season {seasonId}</h1>
    </div>
  );
};
