import { createFileRoute } from "@tanstack/react-router";
import { CollectionIndex } from "@/components/documents/CollectionIndex";
import { resources } from "@/i18n";
import { listCollection } from "@/server/documents.functions";

export const Route = createFileRoute("/bots/")({
	loader: ({ context }) =>
		listCollection({
			data: { collection: "bots", language: context.language },
		}),
	head: ({ match }) => ({
		meta: [{ title: resources[match.context.language].bots.meta.index }],
	}),
	component: () => (
		<CollectionIndex collection="bots" documents={Route.useLoaderData()} />
	),
});
