import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { languages } from "@/i18n";
import { collections } from "@/lib/documents";
import { getDocument, listDocuments } from "./documents.server";

const collection = z.enum(collections);
const language = z.enum(languages);

export const listCollection = createServerFn({ method: "GET" })
	.validator(z.object({ collection, language }))
	.handler(({ data }) => listDocuments(data.collection, data.language));

export const readDocument = createServerFn({ method: "GET" })
	.validator(z.object({ collection, slug: z.string().max(100), language }))
	.handler(({ data }) =>
		getDocument(data.collection, data.slug, data.language),
	);
