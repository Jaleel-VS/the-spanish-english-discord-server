import { createFileRoute } from "@tanstack/react-router";
import { CollectionIndex } from "@/components/documents/CollectionIndex";
import { resources } from "@/i18n";
import { pageMeta } from "@/lib/seo";
import { listCollection } from "@/server/documents.functions";

export const Route = createFileRoute("/guides/")({
	loader: ({ context }) =>
		listCollection({
			data: { collection: "guides", language: context.language },
		}),
	head: ({ match }) => {
		const copy = resources[match.context.language].guides;
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
		<CollectionIndex collection="guides" documents={Route.useLoaderData()} />
	),
});
