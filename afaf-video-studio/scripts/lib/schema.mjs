import {z} from 'zod';

const text = (max) => z.string().trim().min(1, 'cannot be empty').max(max, `must be ${max} characters or fewer`);

export const briefSchema = z
  .object({
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'use lowercase letters, numbers and single hyphens, e.g. "couples-money-talk"')
      .max(60),
    topic: text(160),
    seriesLabel: text(24).default('Money Talk'),
    hook: text(160),
    mainMessage: text(180),
    tip: text(180),
    tipItems: z.array(text(40)).max(4, 'use at most 4 checklist items').default([]),
    tipFigure: z.object({value: text(6), unit: text(14)}).nullable().optional(),
    reinforce: text(160).optional(),
    closing: text(160),
    narration: z
      .object({
        hook: text(400).optional(),
        message: text(400).optional(),
        tip: text(400).optional(),
        reinforce: text(400).optional(),
        closing: text(400).optional(),
      })
      .prefault({}),
    kickers: z
      .object({
        hook: z.string().max(40).optional(),
        message: z.string().max(40).optional(),
        tip: z.string().max(40).optional(),
        reinforce: z.string().max(40).optional(),
        closing: z.string().max(40).optional(),
      })
      .prefault({}),
    caption: z.string().trim().max(2200, 'Instagram captions are limited to 2,200 characters').optional(),
    hashtags: z.array(z.string().regex(/^#[\p{L}\p{N}_]+$/u, 'hashtags must start with # and have no spaces')).max(8).default([]),
    cover: z.object({title: text(90).optional(), kicker: text(30).optional()}).prefault({}),
    signoff: text(40).default('Afaf Ismail'),
    media: z
      .object({
        portrait: z
          .object({
            path: z.string().min(1),
            focus: z.string().default('50% 30%'),
            useIn: z.array(z.enum(['hook', 'closing', 'cover'])).default(['hook', 'cover']),
            consent: z.literal(true, {error: 'set "consent": true to confirm this is your own photo or you have permission to use it'}),
          })
          .nullable()
          .default(null),
        voiceover: z
          .object({
            path: z.string().min(1),
            srt: z.string().min(1).optional(),
            realRecording: z.literal(true, {error: 'set "realRecording": true to confirm this is a real human recording (no voice clones)'}),
          })
          .nullable()
          .default(null),
        music: z
          .union([
            z.literal('none'),
            z.literal('generated'),
            z.object({path: z.string().min(1), volume: z.number().min(0).max(1).default(0.2), license: text(300)}),
          ])
          .default('none'),
      })
      .prefault({}),
    captions: z.object({allowEstimated: z.boolean().default(false)}).prefault({}),
    allowTakaful: z.boolean().default(false),
  })
  .strict();

export const formatZodError = (err) =>
  err.issues.map((i) => `  • ${i.path.join('.') || '(root)'}: ${i.message}`).join('\n');
