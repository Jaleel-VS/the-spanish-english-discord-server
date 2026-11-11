import { useEffect, useRef } from "react";
import { currentTheme, onThemeChange } from "@/lib/theme";

/**
 * A dithered pixel sky: slow value-noise clouds, quantised to four tones with
 * a 4×4 Bayer matrix on a coarse grid of square cells, plus a sun (or, in
 * dark mode, a moon and a few stars). Day uses the splash art's sky blue and
 * the paper colour, night the page's dark blue, so it is the site's own
 * palette rather than a new one. It fades into the page colour at the bottom.
 *
 * The canvas is drawn at one pixel per cell and scaled up with
 * `image-rendering: pixelated`; each cell is a whole number of CSS pixels, so
 * the dots stay crisp. It runs at a stop-motion 12 fps, stops while `paused`,
 * off screen or in a background tab, and draws one still frame under reduced
 * motion. Without WebGL it renders nothing and the page keeps its plain ground.
 */

const FRAGMENT = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uTone0, uTone1, uTone2, uTone3, uSun;
uniform float uDark;
uniform vec2 uSunAt;
uniform float uSunR;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
	vec2 i = floor(p), f = fract(p);
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
	float v = 0.0, a = 0.5;
	for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 17.0; a *= 0.5; }
	return v;
}
float bayer2(vec2 a) { a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }

vec3 tone(float i) {
	if (i < 0.5) return uTone0;
	if (i < 1.5) return uTone1;
	if (i < 2.5) return uTone2;
	return uTone3;
}

void main() {
	vec2 cell = floor(gl_FragCoord.xy);
	vec2 uv = cell / uRes.y;
	float y = cell.y / uRes.y;
	float t = uTime;

	// Two decks: a slow, wide one and a faster band of wisps; the shapes warp slowly.
	vec2 warp = vec2(fbm(uv * 1.3 + t * 0.004), fbm(uv * 1.3 + 9.0 - t * 0.003));
	float deck = fbm(uv * vec2(1.6, 3.4) + warp * 0.9 + vec2(t * 0.012, 0.0));
	float wisps = fbm(uv * vec2(3.0, 7.0) + vec2(t * 0.03, 3.0));
	float cloud = smoothstep(0.44, 0.72, deck) + 0.45 * smoothstep(0.58, 0.8, wisps);
	cloud = clamp(cloud, 0.0, 1.0);

	// Brightness on the tone ladder: 0 is open sky, 1 is cloud. Light mode
	// lightens towards the horizon; both fade to the page colour at the bottom.
	float sky = mix(0.3, 0.0, y) * (1.0 - uDark);
	float b = mix(sky, 1.0, cloud * mix(1.0, 0.8, uDark));
	float fade = smoothstep(0.42, 0.0, y);
	b = mix(b, 1.0 - uDark, fade);

	float threshold = bayer4(cell);
	float level = b * 3.0;
	float index = clamp(floor(level) + step(threshold, fract(level)), 0.0, 3.0);
	vec3 colour = tone(index);

	// Stars: single cells in clear night sky, twinkling slowly.
	if (uDark > 0.5) {
		float h = hash(cell);
		if (h > 0.9965 && cloud < 0.15 && fade < 0.5 && sin(t * 0.8 + h * 900.0) > -0.4) colour = uTone2;
	}

	// The sun (or moon) is a fixed shape: a disc and a halo of dots in a set
	// pattern. Clouds pass in front of it with a crisp edge, so it is the
	// cloud that is seen moving; near the disc they are lit by it.
	vec2 sunAt = vec2(uSunAt.x * uRes.x / uRes.y, uSunAt.y);
	float d = distance(uv, sunAt);
	float r = uSunR;
	if (r > 0.0 && d < r * 2.6) {
		// A hard edge: only cells the cloud's outline crosses change, never a dithered band.
		bool inFront = cloud > 0.5;
		if (inFront) {
			float lit = smoothstep(r * 2.6, r * 0.8, d) * 0.6;
			float litLevel = clamp(b + lit, 0.0, 1.0) * 3.0;
			colour = tone(clamp(floor(litLevel) + step(threshold, fract(litLevel)), 0.0, 3.0));
		} else if (d < r) {
			colour = uSun;
		} else if (d < r * 2.2) {
			float halo = (1.0 - (d - r) / (r * 1.2)) * mix(0.4, 0.22, uDark);
			if (halo > threshold) colour = uSun;
		}
	}

	gl_FragColor = vec4(colour, 1.0);
}`;

const VERTEX =
	"attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }";

type Rgb = [number, number, number];

function cssColour(name: string): Rgb {
	const value = getComputedStyle(document.documentElement)
		.getPropertyValue(name)
		.trim();
	const hex = value.replace("#", "");
	return [0, 2, 4].map(
		(i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255,
	) as Rgb;
}
const mix = (a: Rgb, b: Rgb, k: number): Rgb =>
	a.map((v, i) => v + (b[i] - v) * k) as Rgb;

/** The sky blue of the server's splash art (sampled from splash.jpg), so the cut-out's edges meet the same blue. */
const ART_SKY: Rgb = [148 / 255, 204 / 255, 255 / 255];

/**
 * Four tones from open sky (0) to cloud (3), plus the sun. Day: the art's sky
 * blue to paper. Night: the dark page colour (so the bottom fade has no seam)
 * to a faint lift of the ink, with a pale moon.
 */
function palette(dark: boolean) {
	const ground = cssColour("--ground");
	const ink = cssColour("--ink");
	const sky = dark ? ground : ART_SKY;
	const cloud = dark ? mix(ground, ink, 0.2) : ground;
	return {
		tones: [0, 1, 2, 3].map((k) => mix(sky, cloud, k / 3)),
		sun: dark ? mix(ground, ink, 0.8) : cssColour("--accent"),
	};
}

export function PixelSky({
	cell = 4,
	// Right of the art and below the header, clear of the yellow Join button.
	sunX = 0.9,
	sunY = 0.6,
	paused = false,
	onAnimates,
	className = "",
}: {
	/** Side of one dot, in CSS pixels. */
	cell?: number;
	/** Sun position as fractions of width and height, from the bottom left. Portrait screens get no sun. */
	sunX?: number;
	sunY?: number;
	paused?: boolean;
	/** Called with whether the sky can move: false without WebGL or under reduced motion. */
	onAnimates?: (animates: boolean) => void;
	className?: string;
}) {
	const ref = useRef<HTMLCanvasElement>(null);
	const pausedRef = useRef(paused);
	const runRef = useRef<() => void>(undefined);
	const onAnimatesRef = useRef(onAnimates);
	onAnimatesRef.current = onAnimates;

	useEffect(() => {
		pausedRef.current = paused;
		runRef.current?.();
	}, [paused]);

	useEffect(() => {
		const canvas = ref.current;
		const gl = canvas?.getContext("webgl", {
			antialias: false,
			alpha: false,
			preserveDrawingBuffer: false,
		});
		if (!canvas || !gl) {
			onAnimatesRef.current?.(false);
			return;
		}

		const compile = (type: number, source: string) => {
			const shader = gl.createShader(type) as WebGLShader;
			gl.shaderSource(shader, source);
			gl.compileShader(shader);
			return shader;
		};
		const program = gl.createProgram() as WebGLProgram;
		gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
		gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			onAnimatesRef.current?.(false);
			return;
		}
		// biome-ignore lint/correctness/useHookAtTopLevel: WebGL's useProgram, not a React hook.
		gl.useProgram(program);
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([-1, -1, 3, -1, -1, 3]),
			gl.STATIC_DRAW,
		);
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
		const u = (name: string) => gl.getUniformLocation(program, name);

		const still = matchMedia("(prefers-reduced-motion: reduce)");
		const applyPalette = () => {
			const dark = currentTheme() === "dark";
			const { tones, sun } = palette(dark);
			for (const [i, rgb] of tones.entries())
				gl.uniform3fv(u(`uTone${i}`), rgb);
			gl.uniform3fv(u("uSun"), sun);
			gl.uniform1f(u("uDark"), dark ? 1 : 0);
		};
		applyPalette();
		gl.uniform2f(u("uSunAt"), sunX, sunY);

		// Sky time only advances while the sky is moving, so pausing freezes it
		// and resuming carries on from the same frame. It starts at 40 s so the
		// first frame already has formed clouds.
		let clock = 40;
		const draw = () => {
			gl.uniform1f(u("uTime"), clock);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
		};
		const resize = () => {
			const box = canvas.parentElement?.getBoundingClientRect();
			if (!box) return;
			const columns = Math.ceil(box.width / cell);
			const rows = Math.ceil(box.height / cell);
			canvas.width = columns;
			canvas.height = rows;
			canvas.style.width = `${columns * cell}px`;
			canvas.style.height = `${rows * cell}px`;
			gl.viewport(0, 0, columns, rows);
			gl.uniform2f(u("uRes"), columns, rows);
			// Below a wide sky (phones, portrait tablets) the art fills the width
			// and the sun would sit under the header, so there is none.
			gl.uniform1f(u("uSunR"), columns > rows * 1.4 ? 0.055 : 0);
			draw();
		};
		resize();
		canvas.dataset.ready = "";

		let frame = 0;
		let last = 0;
		let visible = true;
		const tick = (now: number) => {
			frame = requestAnimationFrame(tick);
			if (now - last < 1000 / 12) return;
			// A long gap (the first tick, or after a stall) counts as one frame.
			clock += last && now - last < 250 ? (now - last) / 1000 : 1 / 12;
			last = now;
			draw();
		};
		const run = () => {
			cancelAnimationFrame(frame);
			last = 0;
			if (visible && !document.hidden && !still.matches && !pausedRef.current)
				frame = requestAnimationFrame(tick);
		};
		runRef.current = run;
		const onStill = () => {
			onAnimatesRef.current?.(!still.matches);
			run();
		};
		onAnimatesRef.current?.(!still.matches);

		const sizes = new ResizeObserver(resize);
		if (canvas.parentElement) sizes.observe(canvas.parentElement);
		const seen = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			run();
		});
		seen.observe(canvas);
		const stopTheme = onThemeChange(() => {
			applyPalette();
			draw();
		});
		still.addEventListener("change", onStill);
		document.addEventListener("visibilitychange", run);
		run();

		return () => {
			cancelAnimationFrame(frame);
			runRef.current = undefined;
			sizes.disconnect();
			seen.disconnect();
			stopTheme();
			still.removeEventListener("change", onStill);
			document.removeEventListener("visibilitychange", run);
		};
	}, [cell, sunX, sunY]);

	return (
		<div
			aria-hidden="true"
			className={`pointer-events-none overflow-hidden ${className}`}
		>
			{/* Hidden until the first frame is drawn, then faded in, so a slow load shows plain paper rather than an empty canvas. */}
			<canvas
				ref={ref}
				className="block opacity-0 [image-rendering:pixelated] data-ready:opacity-100 motion-safe:transition-opacity motion-safe:duration-700"
			/>
		</div>
	);
}
