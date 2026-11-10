import { createFileRoute } from "@tanstack/react-router";
import { CollectionIndex } from "@/components/documents/CollectionIndex";
import { resources } from "@/i18n";
import { pageMeta } from "@/lib/seo";
import { listCollection } from "@/server/documents.functions";

export const Route = createFileRoute("/bots/")({
	loader: ({ context }) =>
		listCollection({
			data: { collection: "bots", language: context.language },
		}),
	head: ({ match }) => {
		const copy = resources[match.context.language].bots;
		return {
			meta: pageMeta({
				title: copy.index.title,
				documentTitle: copy.meta.index,
				description: copy.index.lead,
				path: match.pathname,
			}),
		};
	},
	component: () => (
		<CollectionIndex collection="bots" documents={Route.useLoaderData()} />
	),
});
