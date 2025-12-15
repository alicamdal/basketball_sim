"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
	{ label: "Calendar", image: "/ui/btn-calendar.png", href: "/" },
	{ label: "Tasks", image: "/ui/btn-tasks.png", href: "/arena" },
	{ label: "Inventory", image: "/ui/btn-inventory.png", href: "/inventory" },
	{ label: "Settings", image: "/ui/btn-setting.png", href: "/setting" },
];

export function NavBar({ onFirstButtonClick }: { onFirstButtonClick?: () => void } = {}) {
	const router = useRouter();
	const pathname = usePathname();
	const [hovered, setHovered] = useState<string | null>(null);

	return (
		<div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 flex items-end justify-center">
			<div className="flex gap-8 rounded-xl bg-black/40 px-10 py-4 shadow-xl border border-white/20 backdrop-blur-md">
				{navItems.map((item, idx) => (
					<button
						key={item.label}
						onClick={() => {
							if (idx === 0 && onFirstButtonClick) onFirstButtonClick();
							else router.push(item.href);
						}}
						className={`flex flex-col items-center transition-all duration-200
							${pathname === item.href ? "opacity-100" : "opacity-70"}
							hover:-translate-y-2 hover:scale-150 hover:opacity-100
							focus:outline-none`}
						aria-label={item.label}
						type="button"
						style={{ WebkitTapHighlightColor: "transparent" }}
						onMouseEnter={() => setHovered(item.label)}
						onMouseLeave={() => setHovered(null)}
					>
						<span className="relative flex items-center justify-center">
							<Image
								src={item.image}
								alt={item.label}
								width={72}
								height={72}
								className={`object-contain mb-0.5 select-none pointer-events-none rounded-full transition-all duration-200
									${hovered === item.label ? "shadow-[0_0_16px_4px_rgba(80,200,255,0.55)]" : ""}`}
								priority
							/>
						</span>
					</button>
				))}
			</div>
		</div>
	);
}
