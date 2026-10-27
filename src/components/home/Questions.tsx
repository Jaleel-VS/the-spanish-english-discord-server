import { useTranslation } from "react-i18next";

const questions = ["free", "level", "variety", "wait", "voice", "age"] as const;

/** One full-bleed band per question, alternating two tones; every answer visible. */
export function Questions() {
	const { t } = useTranslation("home");

	return (
		<section
			id="questions"
			aria-labelledby="questions-title"
			className="mt-section"
		>
			<div className="flex min-h-[24svh] items-end bg-inverse px-margin pt-14 pb-10 text-inverse-ink md:min-h-[32svh]">
				<h2
					id="questions-title"
					className="text-[12.5vw] md:text-display"
					data-reveal
				>
					{t("faq.title")}
				</h2>
			</div>
			<dl>
				{questions.map((key, index) => (
					<div
						key={key}
						className={`frame gap-y-4 py-8 md:py-14 ${index % 2 === 0 ? "bg-ground" : "bg-surface"}`}
					>
						<dt
							className="col-span-12 text-lead font-semibold leading-[1.15] tracking-[-0.02em] md:col-span-5"
							data-reveal
						>
							{t(`faq.items.${key}.q`)}
						</dt>
						<dd
							className="col-span-12 max-w-[60ch] md:col-start-7 md:col-span-6"
							data-reveal
						>
							{t(`faq.items.${key}.a`)}
						</dd>
					</div>
				))}
			</dl>
		</section>
	);
}
