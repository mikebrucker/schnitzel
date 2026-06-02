import { Chip } from "@/components/Chip";
import { Header } from "@/components/Header";
import { ChevronRightIcon } from "@/components/icons";
import { HOBBIES } from "@/lib/curriculum";
import { Link, createFileRoute } from "@tanstack/react-router";

function HobbiesRoute() {
  return (
    <>
      <Header title="Hobbys" subtitle="Meine Hobbys" />
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="space-y-4">
          {HOBBIES.map((hobby) => (
            <Link
              key={hobby.id}
              to="/hobbies/$hobbySlug"
              params={{ hobbySlug: hobby.slug }}
              className="block border-2 bd-default bg-surface hover:bd-accent transition-colors"
            >
              <div className="p-5 flex items-start gap-4">
                <span className="text-3xl leading-none mt-0.5">{hobby.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-serif text-xl font-bold tx-text">{hobby.name}</span>
                    <Chip label={hobby.level} />
                  </div>
                  <div className="tx-muted text-sm font-mono mb-2">{hobby.nameDe}</div>
                  <div className="tx-body text-sm">{hobby.blurb}</div>
                  <div className="mt-3 text-xs font-mono tx-accent">
                    {hobby.subdomains.length} subdomains
                  </div>
                </div>
                <ChevronRightIcon className="tx-muted mt-1 shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export const Route = createFileRoute("/hobbies/")({
  component: HobbiesRoute,
});
