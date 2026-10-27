import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import type { Collection, DocumentSummary } from "@/lib/documents";
import { stagger } from "@/lib/motion";
import { INVITE_URL } from "@/lib/site";

/**
 * The index of a documents collection (guides, bots): title and lead on the
 * axis, then one row per document. Empty collections say so.
 */
export function CollectionIndex({
	collection,
	documents,
}: {
	collection: Collection;
	documents: DocumentSummary[];
}) {
	const { t, i18n } = useTranslation(collection);

	return (
		<article className="pb-section">
			<div className="frame items-end gap-y-8 pt-[10vh] md:pt-[14vh]">
				<div className="col-span-12 lg:col-start-6 lg:col-span-7 lg:row-start-1">
					<h1 className="lines text-head">
						<span className="line">
							<span data-line>{t("index.title")}</span>
						</span>
					</h1>
					<p className="mt-8 max-w-[44ch] text-lead leading-[1.25]" data-load>
						{t("index.lead")}
					</p>
				</div>
				<div
					className="col-span-12 max-w-[32ch] [--d:480ms] lg:col-span-4 lg:row-start-1 lg:mb-[0.3em]"
					data-load
				>
					<p className="font-medium">
						{t("index.summary", { count: documents.length })}
					</p>
					<p className="mt-3">
						<a href={INVITE_URL} rel="noopener" className="link">
							{t("index.suggest")}
						</a>
					</p>
				</div>
			</div>

			{documents.length === 0 ? (
				<p className="frame mt-16 md:mt-20">
					<span className="col-span-12 max-w-[44ch] lg:col-start-6 lg:col-span-7">
						{t("index.empty")}
					</span>
				</p>
			) : (
				<ol className="frame mt-16 gap-y-gutter md:mt-20">
					{documents.map((document, index) => (
						<li
							key={document.slug}
							className="col-span-12 md:col-span-6"
							style={stagger(index)}
							data-reveal
						>
							<Link
								to={collection === "guides" ? "/guides/$slug" : "/bots/$slug"}
								params={{ slug: document.slug }}
								className="group flex h-full flex-col gap-2 bg-surface p-5 transition-colors duration-200 hover:bg-[color-mix(in_oklab,var(--surface)_85%,var(--ink))]"
							>
								<span className="flex items-baseline justify-between gap-4">
									<span
										className="text-lead font-semibold tracking-[-0.02em] group-hover:underline"
										lang={
											document.language !== i18n.language
												? document.language
												: undefined
										}
									>
										{document.title}
									</span>
									<span
										aria-hidden="true"
										className="inline-block transition-transform duration-300 group-hover:translate-x-1"
									>
										→
									</span>
								</span>
								<span
									className="text-muted"
									lang={
										document.language !== i18n.language
											? document.language
											: undefined
									}
								>
									{document.summary}
								</span>
							</Link>
						</li>
					))}
				</ol>
			)}
		</article>
	);
}
