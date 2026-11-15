import {existsSync, readdirSync} from 'node:fs';
import {lookup} from 'node:dns/promises';
import {join} from 'node:path';
import {bundle} from '@remotion/bundler';
import {ensureBrowser, renderMedia, renderStill, selectComposition} from '@remotion/renderer';

const findPreinstalled = () => {
  const base = '/opt/pw-browsers';
  if (!existsSync(base)) return null;
  for (const dir of readdirSync(base).filter((d) => d.startsWith('chromium_headless_shell')).sort().reverse()) {
    for (const sub of readdirSync(join(base, dir))) {
      const bin = join(base, dir, sub, 'chrome-headless-shell');
      if (existsSync(bin)) return bin;
    }
  }
  return null;
};

let browserCache;
/** Remotion's own browser first; REMOTION_BROWSER overrides; a preinstalled headless shell is the fallback. */
export const resolveBrowser = async () => {
  if (browserCache !== undefined) return browserCache;
  if (process.env.REMOTION_BROWSER) {
    browserCache = process.env.REMOTION_BROWSER;
    console.log(`[browser] using REMOTION_BROWSER=${browserCache}`);
    return browserCache;
  }
  try {
    // ensureBrowser() can crash the process on a DNS failure, so check the download host first.
    await lookup('remotion.media').catch((err) => {
      throw Object.assign(new Error('remotion.media is not reachable'), {code: err.code});
    });
    await ensureBrowser({logLevel: 'error'});
    browserCache = null;
    return null;
  } catch (e) {
    const fallback = findPreinstalled();
    if (!fallback) throw new Error(`Remotion could not download its browser (${e.message}) and no local Chrome was found. Set REMOTION_BROWSER to a Chrome/Chromium binary.`);
    console.log(`[browser] Remotion's browser download failed (${e.code || e.message}). Falling back to ${fallback}`);
    browserCache = fallback;
    return fallback;
  }
};

export const makeBundle = async (root) => {
  process.stdout.write('[bundle] building Remotion bundle… ');
  const url = await bundle({entryPoint: join(root, 'src', 'index.ts'), publicDir: join(root, 'public'), onProgress: () => {}});
  console.log('done');
  return url;
};

const license = () => process.env.REMOTION_LICENSE_KEY || null;

const bar = (label) => {
  let last = -1;
  return ({progress}) => {
    const pct = Math.floor(progress * 100);
    if (pct !== last && pct % 10 === 0) {
      last = pct;
      process.stdout.write(`\r[${label}] ${pct}%`);
      if (pct === 100) process.stdout.write('\n');
    }
  };
};

export const renderReel = async ({serveUrl, inputProps, output, preview = false}) => {
  const browserExecutable = await resolveBrowser();
  const composition = await selectComposition({serveUrl, id: 'Reel', inputProps, browserExecutable});
  await renderMedia({
    serveUrl,
    composition,
    inputProps,
    outputLocation: output,
    codec: 'h264',
    audioCodec: 'aac',
    pixelFormat: 'yuv420p',
    imageFormat: 'jpeg',
    jpegQuality: preview ? 80 : 92,
    crf: preview ? 26 : 18,
    scale: preview ? 0.5 : 1,
    enforceAudioTrack: true,
    colorSpace: 'bt709',
    browserExecutable,
    licenseKey: license(),
    isProduction: !preview,
    onProgress: bar(preview ? 'preview' : 'render'),
    logLevel: 'error',
  });
  return composition;
};

export const renderFrame = async ({serveUrl, inputProps, id, frame = 0, output, scale = 1}) => {
  const browserExecutable = await resolveBrowser();
  const composition = await selectComposition({serveUrl, id, inputProps, browserExecutable});
  await renderStill({
    serveUrl,
    composition,
    inputProps,
    frame,
    output,
    imageFormat: 'png',
    scale,
    browserExecutable,
    licenseKey: license(),
    logLevel: 'error',
  });
};
