// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// Minimal canvas mock for Vitest + jsdom
// Ensures `getContext('2d')` returns a simple object with properties like `fillStyle`
// so libraries that assume a 2D context don't throw during tests.
if (typeof window !== 'undefined') {
  const proto = (window as unknown as { HTMLCanvasElement?: { prototype: unknown } })
    .HTMLCanvasElement?.prototype as unknown as CanvasRenderingContext2D;
  if (proto && !proto.__getContextMocked) {
    proto.getContext = function (type: string) {
      if (type === '2d') {
        const ctx = {
          // common properties used by drawing code
          fillStyle: '#000',
          strokeStyle: '#000',
          globalAlpha: 1,
          lineWidth: 1,
          // no-op methods
          beginPath: () => {},
          moveTo: () => {},
          lineTo: () => {},
          arc: () => {},
          rect: () => {},
          fill: () => {},
          stroke: () => {},
          clearRect: () => {},
          fillRect: () => {},
          measureText: () => ({ width: 0 }),
          drawImage: () => {},
          setTransform: () => {},
          getImageData: () => ({ data: new Uint8ClampedArray(0), width: 0, height: 0 }),
          putImageData: () => {},
        };

        // Cast via unknown first to satisfy TypeScript structural checks
        return ctx as unknown as CanvasRenderingContext2D;
      }
      return null;
    };
    proto.__getContextMocked = true;
  }
}

// Provide a basic requestAnimationFrame for libraries that use it
if (typeof globalThis.requestAnimationFrame === 'undefined') {
  globalThis.requestAnimationFrame = (cb: FrameRequestCallback) =>
    setTimeout(() => cb(Date.now()), 16) as unknown as number;
  globalThis.cancelAnimationFrame = (id: number) =>
    clearTimeout(id as unknown as ReturnType<typeof setTimeout>);
}
