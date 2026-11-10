import { createFileRoute, notFound } from "@tanstack/react-router";
import { DocumentPage } from "@/components/documents/DocumentPage";
import { resources } from "@/i18n";
import { pageMeta } from "@/lib/seo";
import { readDocument } from "@/server/documents.functions";

export const Route = createFileRoute("/bots/$slug")({
	loader: async ({ context, params }) => {
		const document = await readDocument({
			data: {
				collection: "bots",
				slug: params.slug,
				language: context.language,
			},
		});
		if (!document) throw notFound();
		return document;
	},
	head: ({ match, loaderData }) => ({
		meta: pageMeta({
			title: loaderData?.title ?? "",
			documentTitle: `${loaderData?.title} · ${resources[match.context.language].bots.meta.suffix}`,
			description: loaderData?.summary,
			path: match.pathname,
		}),
	}),
	component: () => (
		<DocumentPage collection="bots" document={Route.useLoaderData()} />
	),
});
