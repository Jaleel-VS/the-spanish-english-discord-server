import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { resourceSearchSchema } from "@/lib/catalog";
import { resourceKindIds } from "@/lib/resource-kinds";
import { countCatalogue, findResources } from "./catalog.server";

export const listResources = createServerFn({ method: "GET" })
	.validator(
		z.object({ kind: z.enum(resourceKindIds), search: resourceSearchSchema }),
	)
	.handler(({ data }) => findResources(data.kind, data.search));

export const getCatalogueCounts = createServerFn({ method: "GET" }).handler(
	() => countCatalogue(),
);
