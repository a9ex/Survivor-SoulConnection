export interface HeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function Header(props: HeaderProps) {
  return (
    <header className="flex items-center mb-8">
      <div className="flex-grow">
        <h2 className="font-bold text-3xl">{props.title}</h2>
        {props.subtitle && <p className="mt-2 text-foreground-500">{props.subtitle}</p>}
      </div>
      {props.children}
    </header>
  );
}
