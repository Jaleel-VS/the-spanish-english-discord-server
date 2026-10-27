import type { CSSProperties } from "react";

/** Entrance order within a section: `[data-reveal]` and `[data-line]` delay by `--i` steps. */
export function stagger(index: number): CSSProperties {
	return { "--i": index } as CSSProperties;
}
