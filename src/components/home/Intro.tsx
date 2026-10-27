import { useTranslation } from "react-i18next";
import { stagger } from "@/lib/motion";

const columns = ["who", "what", "where", "how"] as const;

/** A heading on the axis, a lead paragraph, then four run-in columns: who, what, where, how. */
export function Intro() {
	const { t } = useTranslation("home");

	return (
		<section aria-labelledby="intro-title" className="frame pt-section">
			<h2
				id="intro-title"
				className="col-span-12 text-head lg:col-start-6 lg:col-span-7"
				data-reveal
			>
				{t("intro.title")}
			</h2>
			<p
				className="col-span-12 mt-10 max-w-[52ch] text-lead leading-[1.25] lg:col-start-6 lg:col-span-7 lg:mt-12"
				data-reveal
			>
				{t("intro.lead")}
			</p>
			<div className="col-span-12 mt-[72px] grid grid-cols-1 gap-x-gutter gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
				{columns.map((key, index) => (
					<p
						key={key}
						className="leading-[1.5]"
						style={stagger(index)}
						data-reveal
					>
						<strong className="font-semibold">{t(`intro.${key}.title`)}</strong>{" "}
						{t(`intro.${key}.body`)}
					</p>
				))}
			</div>
		</section>
	);
}
