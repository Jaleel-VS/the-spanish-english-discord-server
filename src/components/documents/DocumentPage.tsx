import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import type { Collection, Document } from "@/lib/documents";

/**
 * One guide or bot page: title and summary on the axis, the rendered Markdown
 * in a reading measure, facts (prefix, repository, updated) in the left column.
 */
export function DocumentPage({
	collection,
	document,
}: {
	collection: Collection;
	document: Document;
}) {
	const { t, i18n } = useTranslation([collection, "common"]);
	const foreign = document.language !== i18n.language;
	const updated = document.updated
		? new Date(document.updated).toLocaleDateString(i18n.language, {
				dateStyle: "long",
			})
		: null;

	return (
		<article
			className="pb-section"
			lang={foreign ? document.language : undefined}
		>
			<div className="frame gap-y-10 pt-[10vh] md:pt-[14vh]">
				<header className="col-span-12 lg:col-start-6 lg:col-span-7">
					<h1 className="lines text-head">
						<span className="line">
							<span data-line>{document.title}</span>
						</span>
					</h1>
					<p className="mt-8 max-w-[44ch] text-lead leading-[1.25]" data-load>
						{document.summary}
					</p>
					{foreign && (
						<p
							className="mt-6 max-w-[44ch] text-muted"
							lang={i18n.language}
							data-load
						>
							{t("onlyIn", {
								language: t(`common:languages.${document.language}`),
							})}
						</p>
					)}
				</header>

				<aside
					className="col-span-12 flex flex-col gap-2 text-small [--d:520ms] lg:col-span-4 lg:row-start-2"
					data-load
				>
					{document.prefix && (
						<p>
							<span className="text-muted">{t("facts.prefix")} </span>
							<code className="font-sans font-semibold">{document.prefix}</code>
						</p>
					)}
					{document.repository && (
						<p>
							<a href={document.repository} rel="noopener" className="link">
								{t("facts.repository")}
							</a>
						</p>
					)}
					{updated && (
						<p className="text-muted">
							{t("facts.updated", { date: updated })}
						</p>
					)}
					<p className="mt-4">
						<Link
							to={collection === "guides" ? "/guides" : "/bots"}
							className="link"
						>
							{t("back")}
						</Link>
					</p>
				</aside>

				<div
					className="prose col-span-12 [--d:560ms] lg:col-start-6 lg:col-span-6 lg:row-start-2"
					data-load
					// biome-ignore lint/security/noDangerouslySetInnerHtml: Markdown from content/ in this repository, written by the maintainers and rendered at build time; no user input.
					dangerouslySetInnerHTML={{ __html: document.html }}
				/>
			</div>
		</article>
	);
}
