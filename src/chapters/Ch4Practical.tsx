import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {chapters, colors, fonts, safe} from '../config';
import {Shell} from '../components/Shell';
import {Chip, Headline, Note} from '../components/Text';
import {IconCritical, IconHibah, IconMedical} from '../components/Icons';
import {easeInOut, formatRM, prog, rise, sec, vis} from '../lib/anim';

const C = chapters[3];
const B = C.beats;
const T = C.text;
const PCT = Math.round((T.budget / T.salary) * 1000) / 10; // 300 / 5000 = 6
const CARD_ICONS = [IconMedical, IconHibah, IconCritical];

const BAR = {x: safe.left, y: 700, w: safe.right - safe.left, h: 96};

export const Ch4Practical: React.FC = () => {
  const f = useCurrentFrame();
  const phaseA = 1 - prog(f, B.cards - 0.3, 0.6, easeInOut);
  const salary = interpolate(f, [sec(B.salary + 0.2), sec(B.salary + 1.6)], [0, T.salary], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (x) => 1 - Math.pow(1 - x, 3),
  });
  const barFill = prog(f, B.salary + 0.2, 1.4);
  const slice = prog(f, B.slice, 0.9, easeInOut);
  const sliceW = (BAR.w * T.budget) / T.salary;
  const budgetCount = interpolate(f, [sec(B.slice + 0.5), sec(B.slice + 1.4)], [0, T.budget], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Shell chapter={C}>
      {/* Phase A — the example */}
      <div style={{opacity: phaseA}}>
        <div style={{position: 'absolute', top: 375, width: 1080, textAlign: 'center', ...rise(f, B.salary)}}>
          <Chip>{T.tag}</Chip>
        </div>
        <Headline top={455} size={44} color={colors.creamDim} style={{fontFamily: fonts.body, fontWeight: 600, letterSpacing: 0, ...rise(f, B.salary + 0.1)}}>
          {T.salaryLabel}
        </Headline>
        <Headline top={500} size={150} style={{letterSpacing: -4, fontVariantNumeric: 'tabular-nums', opacity: vis(f, B.salary + 0.1)}}>
          {formatRM(salary)}
        </Headline>

        {/* salary bar with a 6% slice */}
        <div style={{position: 'absolute', left: BAR.x, top: BAR.y, width: BAR.w * barFill, height: BAR.h, borderRadius: 20, background: 'rgba(245,238,223,0.3)', border: `2px solid rgba(245,238,223,0.45)`}} />
        <div
          style={{
            position: 'absolute',
            left: BAR.x + BAR.w - sliceW,
            top: BAR.y + slice * 120,
            width: sliceW,
            height: BAR.h,
            borderRadius: 12,
            background: colors.gold,
            opacity: barFill >= 1 ? 1 : 0,
            boxShadow: `0 0 ${30 * slice}px ${colors.gold}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: BAR.x + BAR.w - sliceW / 2 - 1,
            top: BAR.y + BAR.h,
            width: 2,
            height: 120 * slice - 4,
            background: colors.gold,
            opacity: slice,
          }}
        />

        <div style={{position: 'absolute', top: 930, left: safe.left, width: BAR.w - sliceW - 30, ...rise(f, B.slice + 0.4)}}>
          <div style={{fontFamily: fonts.body, fontWeight: 600, fontSize: 40, color: colors.creamDim}}>{T.budgetLabel}</div>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 26, fontFamily: fonts.display, fontWeight: 600, letterSpacing: -2}}>
            <span style={{fontSize: 116, color: colors.cream, fontVariantNumeric: 'tabular-nums'}}>{formatRM(budgetCount)}</span>
            <span style={{fontSize: 96, color: colors.gold, ...rise(f, B.percent)}}>= {PCT}%</span>
          </div>
        </div>

        <div style={{position: 'absolute', top: 1128, width: 1080, textAlign: 'center', ...rise(f, B.notGuarantee)}}>
          <Chip color={colors.red} style={{fontSize: 26, letterSpacing: 1.5, textTransform: 'none'}}>
            {T.notGuarantee}
          </Chip>
        </div>
      </div>

      {/* Phase C — what to review */}
      <div style={{position: 'absolute', top: 375, width: 1080, textAlign: 'center', ...rise(f, B.cards)}}>
        <Chip style={{textTransform: 'none', letterSpacing: 1, fontSize: 28}}>
          {formatRM(T.budget)} / {formatRM(T.salary)} = {PCT}%
        </Chip>
      </div>
      {T.cards.map((card, i) => {
        const Icon = CARD_ICONS[i];
        const start = B.cards + i * B.cardStagger;
        const p = prog(f, start, 0.7);
        return (
          <div
            key={card.title}
            style={{
              position: 'absolute',
              top: 465 + i * 205,
              left: safe.left,
              width: safe.right - safe.left,
              height: 185,
              boxSizing: 'border-box',
              borderRadius: 30,
              background: colors.navySoft,
              border: `2px solid ${i === 0 ? colors.gold : colors.navyLine}`,
              borderColor: f >= sec(start) && f < sec(start + B.cardStagger) ? colors.gold : colors.navyLine,
              display: 'flex',
              alignItems: 'center',
              gap: 28,
              padding: '0 32px',
              opacity: p,
              transform: `translateX(${(1 - p) * 80}px)`,
            }}
          >
            <div style={{width: 120, height: 120, borderRadius: 26, background: colors.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
              <Icon size={96} />
            </div>
            <div>
              <div style={{fontFamily: fonts.display, fontWeight: 600, fontSize: 48, color: colors.cream, lineHeight: 1.1}}>{card.title}</div>
              <div style={{fontFamily: fonts.body, fontWeight: 500, fontSize: 30, color: colors.creamDim, marginTop: 8, lineHeight: 1.25}}>{card.label}</div>
            </div>
          </div>
        );
      })}
      <Note top={1090} style={{...rise(f, B.checkFactors), fontSize: 30, fontWeight: 600, color: colors.gold}}>
        {T.factors}
      </Note>

      {/* Supporting note, visible from the "not a guarantee" beat to the end */}
      <Note top={1222} style={{...rise(f, B.notGuarantee + 0.3), fontSize: 25, lineHeight: 1.4}}>
        {T.note}
      </Note>
    </Shell>
  );
};
