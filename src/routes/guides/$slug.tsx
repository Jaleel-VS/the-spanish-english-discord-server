import { createFileRoute, notFound } from "@tanstack/react-router";
import { DocumentPage } from "@/components/documents/DocumentPage";
import { resources } from "@/i18n";
import { readDocument } from "@/server/documents.functions";

export const Route = createFileRoute("/guides/$slug")({
	loader: async ({ context, params }) => {
		const document = await readDocument({
			data: {
				collection: "guides",
				slug: params.slug,
				language: context.language,
			},
		});
		if (!document) throw notFound();
		return document;
	},
	head: ({ match, loaderData }) => ({
		meta: [
			{
				title: `${loaderData?.title} · ${resources[match.context.language].guides.meta.suffix}`,
			},
			{ name: "description", content: loaderData?.summary },
		],
	}),
	component: () => (
		<DocumentPage collection="guides" document={Route.useLoaderData()} />
	),
});
