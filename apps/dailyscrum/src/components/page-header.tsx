import React from "react";

type Props = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

const PageHeader = ({ title, description, actions }: Props) => {
  return (
    <div className="flex justify-between items-start">
      <div className="space-y-0.5">
        <h1 className="text-xl font-bold leading-8">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex gap-x-2">{actions}</div>}
    </div>
  );
};

export default PageHeader;
