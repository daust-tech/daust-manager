import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface Breadcrumb {
  text: string;
  href?: string;
}

interface PageProps {
  title: string;
  breadcrumbs?: Breadcrumb[];
  children: ReactNode;
}

export function Page({
  title,
  breadcrumbs = [],
  children,
}: PageProps): JSX.Element {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{title}</h1>
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <div key={crumb.text} className="flex items-center">
                  {index > 0 && <span className="mx-2">/</span>}
                  {isLast ? (
                    <span className="font-medium">{crumb.text}</span>
                  ) : (
                    <Link
                      to={crumb.href || "#"}
                      className="hover:text-foreground transition-colors"
                    >
                      {crumb.text}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>
        )}
      </div>
      {children}
    </div>
  );
}
