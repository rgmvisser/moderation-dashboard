export function CustomerLogo({
  name,
  logoURL,
}: {
  name: string;
  logoURL: string;
}) {
  return (
    <div className="flex gap-2 text-lg font-bold">
      <img height={16} width={16} alt={`${name} logo`} src={logoURL} /> {name}{" "}
    </div>
  );
}

export function LassoLogo() {
  return (
    <div className="flex gap-2 text-lg font-bold">
      <img
        src="/images/lasso-logo.svg"
        height={30}
        width={30}
        alt="Lasso logo"
      />
      Lasso Moderation Dashboard
    </div>
  );
}
