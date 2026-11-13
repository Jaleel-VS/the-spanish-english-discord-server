import { createFileRoute, notFound } from "@tanstack/react-router";
import { z } from "zod";
import { DocumentPage } from "@/components/documents/DocumentPage";
import { resources } from "@/i18n";
import { pageMeta } from "@/lib/seo";
import { readDocument } from "@/server/documents.functions";

export const Route = createFileRoute("/bots/$slug")({
	/** The open command (`?cmd=hardcore`) and the command tab; unknown values are ignored. */
	validateSearch: z.object({
		cmd: z.string().max(60).optional().catch(undefined),
		cat: z.string().max(60).optional().catch(undefined),
	}),
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
	head: ({ match, loaderData }) => {
		// A shared ?cmd= link previews as that command.
		const command = loaderData?.commands?.commands.find(
			(c) => c.id === match.search.cmd,
		);
		const title = command
			? `${command.name} · ${loaderData?.title}`
			: (loaderData?.title ?? "");
		return {
			meta: pageMeta({
				title,
				documentTitle: `${title} · ${resources[match.context.language].bots.meta.suffix}`,
				description: command?.summary ?? loaderData?.summary,
				path: match.pathname,
			}),
		};
	},
	component: () => (
		<DocumentPage collection="bots" document={Route.useLoaderData()} />
	),
});
