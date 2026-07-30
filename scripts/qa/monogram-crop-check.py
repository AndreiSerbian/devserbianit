import asyncio, json
from pathlib import Path
from playwright.async_api import async_playwright

OUT = Path("/tmp/browser/monogram/screenshots"); OUT.mkdir(parents=True, exist_ok=True)
URL = "http://localhost:8080/__brand-check"

MEASURE = """() => {
  const res = [];
  document.querySelectorAll('[data-monogram-cell]').forEach(cell => {
    const svg = cell.querySelector('svg');
    const cb = cell.getBoundingClientRect(), sb = svg.getBoundingClientRect();
    let bbox = null; try { bbox = svg.getBBox(); } catch(e) {}
    res.push({
      id: cell.dataset.monogramCell,
      cell: [Math.round(cb.width), Math.round(cb.height)],
      svg: [Math.round(sb.width), Math.round(sb.height)],
      overflow: +(Math.max(sb.width - cb.width, sb.height - cb.height)).toFixed(2),
      bboxOutside: bbox ? (bbox.x < -0.01 || bbox.y < -0.01 || bbox.x + bbox.width > 64.01 || bbox.y + bbox.height > 64.01) : null,
      painted: bbox ? bbox.width > 0 && bbox.height > 0 : null,
    });
  });
  return { cells: res, docOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
}"""

async def run(pw, name, browser_type, ctx_kwargs):
    b = await browser_type.launch(headless=True)
    c = await b.new_context(**ctx_kwargs)
    p = await c.new_page()
    errs = []
    p.on("console", lambda m: m.type == "error" and errs.append(m.text))
    await p.goto(URL, wait_until="networkidle")
    await p.wait_for_selector("[data-monogram-cell]")
    data = await p.evaluate(MEASURE)
    await p.screenshot(path=str(OUT / f"{name}.png"))
    for cid in ["brand-full-16","brand-full-96","light-compact-32","brand-micro-16","brand-micro-48"]:
        el = p.locator(f'[data-monogram-cell="{cid}"]')
        if await el.count():
            await el.screenshot(path=str(OUT / f"{name}_{cid}.png"))
    bad = [c for c in data["cells"] if c["overflow"] > 0.5 or c["bboxOutside"] or not c["painted"]]
    print(f"== {name}: cells={len(data['cells'])} docOverflow={data['docOverflow']} problems={len(bad)} consoleErrors={len(errs)}")
    for x in bad: print("   !", json.dumps(x))
    await b.close()

async def main():
    async with async_playwright() as pw:
        await run(pw, "webkit-desktop", pw.webkit, {"viewport": {"width": 1280, "height": 1800}})
        await run(pw, "webkit-iphone", pw.webkit, {**pw.devices["iPhone 13"]})
        await run(pw, "webkit-ipad", pw.webkit, {**pw.devices["iPad Mini"]})
        await run(pw, "chromium-pixel", pw.chromium, {**pw.devices["Pixel 5"]})
        await run(pw, "chromium-small360", pw.chromium, {"viewport": {"width": 360, "height": 800}, "device_scale_factor": 3, "is_mobile": True, "has_touch": True})
asyncio.run(main())
