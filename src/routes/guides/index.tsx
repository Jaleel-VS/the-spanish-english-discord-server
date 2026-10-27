import { createFileRoute } from "@tanstack/react-router";
import { CollectionIndex } from "@/components/documents/CollectionIndex";
import { resources } from "@/i18n";
import { listCollection } from "@/server/documents.functions";

export const Route = createFileRoute("/guides/")({
	loader: ({ context }) =>
		listCollection({
			data: { collection: "guides", language: context.language },
		}),
	head: ({ match }) => ({
		meta: [{ title: resources[match.context.language].guides.meta.index }],
	}),
	component: () => (
		<CollectionIndex collection="guides" documents={Route.useLoaderData()} />
	),
});
