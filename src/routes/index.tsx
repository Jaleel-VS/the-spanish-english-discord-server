import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { Closing } from "@/components/home/Closing";
import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { Questions } from "@/components/home/Questions";
import { ResourcesBand } from "@/components/home/ResourcesBand";
import { Steps } from "@/components/home/Steps";
import { WorldClock } from "@/components/home/WorldClock";
import { getCatalogueCounts } from "@/server/catalog.functions";

export const Route = createFileRoute("/")({
	loader: () => getCatalogueCounts(),
	component: HomePage,
});

const rootApi = getRouteApi("__root__");

function HomePage() {
	const community = rootApi.useLoaderData();
	const counts = Route.useLoaderData();

	return (
		<>
			<Hero community={community} />
			<Intro />
			<Steps />
			<ResourcesBand counts={counts} />
			<WorldClock online={community?.online} />
			<Questions />
			<Closing community={community} />
		</>
	);
}
