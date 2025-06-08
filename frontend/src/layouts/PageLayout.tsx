interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const PageLayout = ({
  children,
  title,
  showBackButton = false,
  onBack,
}: PageLayoutProps) => {
  return (
    <div className="min-h-screen min-w-[100vw] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50"
        >
          Skip to main content
        </a>
        <header className="mb-8">
          {showBackButton && (
            <button
              onClick={onBack}
              className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors curser:pointer"
              aria-label="Go back to previous page"
            >
              <span className="text-xl" aria-hidden="true">
                ⬅️
              </span>
              <span className="font-medium">Back</span>
            </button>
          )}
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
            <span className="text-3xl" aria-hidden="true">
              🏎️
            </span>
            {title}
          </h1>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
};
