export default function Logo({
  name,
  logoURL,
}: {
  name: string;
  logoURL: string;
}) {
  return (
    <div className="flex gap-2 text-lg font-bold">
      <img height={30} width={30} alt={`${name} logo`} src={logoURL} /> {name}{" "}
      Content Moderation
    </div>
  );
}
