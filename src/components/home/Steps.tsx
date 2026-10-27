import { useTranslation } from "react-i18next";
import { stagger } from "@/lib/motion";

const steps = ["one", "two", "three", "four"] as const;
/** Each stage starts two columns further right, so the list descends as a staircase. */
const desktopStart = [
	"lg:col-start-1",
	"lg:col-start-3",
	"lg:col-start-5",
	"lg:col-start-7",
];
const phoneIndent = ["pl-0", "pl-[6vw]", "pl-[12vw]", "pl-[18vw]"];

export function Steps() {
	const { t } = useTranslation("home");

	return (
		<section
			aria-labelledby="steps-title"
			className="mt-band bg-surface py-band"
		>
			<div className="frame">
				<h2
					id="steps-title"
					className="col-span-12 text-lead tracking-[-0.02em]"
					data-reveal
				>
					{t("steps.title")}
				</h2>
				<ol className="col-span-12 mt-14 grid grid-cols-subgrid gap-y-10 lg:gap-y-14">
					{steps.map((step, index) => (
						<li
							key={step}
							className={`col-span-12 lg:col-end-13 lg:pl-0 ${desktopStart[index]} ${phoneIndent[index]}`}
							style={stagger(index)}
							data-reveal
						>
							<h3 className="text-head leading-none">
								{t(`steps.${step}.line`)}
							</h3>
							<p className="mt-3 max-w-[34ch]">{t(`steps.${step}.body`)}</p>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}
