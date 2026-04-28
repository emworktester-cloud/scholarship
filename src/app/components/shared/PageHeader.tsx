import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../ui/breadcrumb';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  breadcrumbs?: { label: string; path?: string; href?: string }[];
  actions?: ReactNode;
}

export function PageHeader({ title, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="border-b bg-white">
      <div className="px-8 py-6">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb className="mb-3">
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="contents">
                  {index > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {(crumb.path || crumb.href) ? (
                      <BreadcrumbLink href={crumb.path || crumb.href}>{crumb.label}</BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#1e3a8a]">{title}</h1>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      </div>
    </div>
  );
}