import type { GeneratedDesign, Zone } from "@/lib/designEngine";

export default function BagDiagram({ design }: { design: GeneratedDesign }) {
  const isActive = (zone: Zone) => design.zones[zone].length > 0;

  const zoneStyle = (zone: Zone) => ({
    fill: isActive(zone) ? "var(--accent)" : "#ffffff",
    fillOpacity: isActive(zone) ? 0.18 : 1,
    stroke: isActive(zone) ? "var(--accent)" : "var(--border)",
    strokeWidth: isActive(zone) ? 2 : 1.5,
  });

  return (
    <svg
      viewBox="0 0 240 260"
      role="img"
      aria-label="Diagram of the generated bag design"
      className="mx-auto w-full max-w-[260px]"
    >
      {/* handles */}
      <path
        d="M85 60 C85 25, 155 25, 155 60"
        fill="none"
        stroke="var(--border)"
        strokeWidth={4}
      />
      {/* main body */}
      <rect
        x={40}
        y={60}
        width={160}
        height={170}
        rx={20}
        style={zoneStyle("main")}
      />
      {/* inner organizer (dashed) */}
      <rect
        x={60}
        y={75}
        width={120}
        height={35}
        rx={8}
        style={zoneStyle("inner")}
        strokeDasharray="5 4"
      />
      {/* front pocket */}
      <rect
        x={60}
        y={165}
        width={120}
        height={50}
        rx={10}
        style={zoneStyle("front")}
      />
      {/* side pocket */}
      <rect
        x={188}
        y={95}
        width={26}
        height={100}
        rx={10}
        style={zoneStyle("side")}
      />
    </svg>
  );
}
