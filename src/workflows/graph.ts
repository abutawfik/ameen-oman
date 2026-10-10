export function fitGraph(nodes: { x: number; y: number }[], width: number, height: number, padding = 60) {
  if (!nodes.length || width <= 0 || height <= 0) return { x: 0, y: 0, scale: 1 };
  const minX = Math.min(...nodes.map(n => n.x)), maxX = Math.max(...nodes.map(n => n.x));
  const minY = Math.min(...nodes.map(n => n.y)), maxY = Math.max(...nodes.map(n => n.y));
  const scale = Math.max(0.001, Math.min(1, Math.max(1, width - padding * 2) / Math.max(1, maxX - minX), Math.max(1, height - padding * 2) / Math.max(1, maxY - minY)));
  return { x: width / 2 - (minX + maxX) / 2 * scale, y: height / 2 - (minY + maxY) / 2 * scale, scale };
}
