import { createFileRoute, redirect } from "@tanstack/react-router";

/** The catalogue hub is the resources band on the home page; keep old links working. */
export const Route = createFileRoute("/resources/")({
	beforeLoad: () => {
		throw redirect({ to: "/", hash: "resources", statusCode: 301 });
	},
});
