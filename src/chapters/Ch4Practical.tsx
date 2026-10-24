import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {chapters, colors, fonts, safe} from '../config';
import {Shell} from '../components/Shell';
import {Glass, Pill} from '../components/Glass';
import {IconCritical, IconHibah, IconMedical} from '../components/Icons';
import {bounce, easeInOut, formatRM, prog, rise, sec, vis} from '../lib/anim';

const C = chapters[3];
const B = C.beats;
const T = C.text;
const W = safe.right - safe.left;
const PCT = Math.round((T.budget / T.salary) * 1000) / 10; // 300 / 5000 = 6
const CARD_ICONS = [IconMedical, IconHibah, IconCritical];

const noteStyle: React.CSSProperties = {
  position: 'absolute',
  left: safe.left,
  width: W,
  textAlign: 'center',
  fontFamily: fonts.body,
  fontWeight: 600,
  fontSize: 23,
  lineHeight: 1.4,
  color: colors.creamText,
  textShadow: '0 2px 8px rgba(0,0,0,0.85)',
};

export const Ch4Practical: React.FC = () => {
  const f = useCurrentFrame();
  const salary = interpolate(f, [sec(B.salary + 0.3), sec(B.salary + 1.6)], [0, T.salary], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (x) => 1 - Math.pow(1 - x, 3),
  });
  const budget = interpolate(f, [sec(B.slice + 0.4), sec(B.slice + 1.3)], [0, T.budget], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const bar = prog(f, B.salary + 0.3, 1.3);
  const slice = prog(f, B.slice, 0.8, easeInOut);
  const barW = W - 68;
  const sliceW = (barW * T.budget) / T.salary;

  return (
    <Shell chapter={C}>
      {/* ---------- the example ---------- */}
      <div style={{position: 'absolute', top: 380, left: safe.left, width: W, opacity: vis(f, B.salary, B.cards - 0.4)}}>
        <Glass strong style={{padding: '30px 34px 34px'}}>
          <Pill>{T.tag}</Pill>
          <div style={{marginTop: 14, fontSize: 32, fontWeight: 700, opacity: 0.85}}>{T.salaryLabel}</div>
          <div style={{fontFamily: fonts.caption, fontSize: 120, lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>{formatRM(salary)}</div>
          <div style={{position: 'relative', height: 130, marginTop: 20}}>
            <div style={{position: 'absolute', top: 0, left: 0, width: barW * bar, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.22)', border: '2px solid rgba(255,255,255,0.4)'}} />
            <div
              style={{
                position: 'absolute',
                left: barW - sliceW,
                top: slice * 86,
                width: sliceW,
                height: 56,
                borderRadius: 10,
                background: colors.captionHighlight,
                opacity: bar >= 1 ? 1 : 0,
                boxShadow: `0 0 ${30 * slice}px rgba(255,213,74,0.9)`,
              }}
            />
          </div>
          <div style={{display: 'flex', alignItems: 'flex-end', gap: 22, marginTop: -16, ...rise(f, B.slice + 0.3)}}>
            <div>
              <div style={{fontSize: 30, fontWeight: 700, opacity: 0.85}}>{T.budgetLabel}</div>
              <div style={{fontFamily: fonts.caption, fontSize: 110, lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>{formatRM(budget)}</div>
            </div>
            <div style={{fontFamily: fonts.caption, fontSize: 110, lineHeight: 1, color: colors.captionHighlight, ...rise(f, B.percent)}}>= {PCT}%</div>
          </div>
          <div style={{marginTop: 22, ...rise(f, B.notGuarantee)}}>
            <Pill tone="red" style={{fontSize: 26}}>
              {T.notGuarantee}
            </Pill>
          </div>
          <div style={{marginTop: 16, fontSize: 21, lineHeight: 1.4, opacity: 0.8 * vis(f, B.notGuarantee + 0.3)}}>{T.note}</div>
        </Glass>
      </div>

      {/* ---------- three things to review ---------- */}
      <div style={{position: 'absolute', top: 345, left: safe.left, width: W, textAlign: 'center', ...rise(f, B.cards)}}>
        <Pill style={{fontSize: 28}}>
          {formatRM(T.budget)} / {formatRM(T.salary)} = {PCT}%
        </Pill>
      </div>
      {T.cards.map((card, i) => {
        const Icon = CARD_ICONS[i];
        const start = B.cards + i * B.cardStagger;
        const p = bounce(f, start, 13);
        const active = f >= sec(start) && f < sec(start + B.cardStagger + 0.3);
        return (
          <div key={card.title} style={{position: 'absolute', top: 430 + i * 180, left: safe.left, width: W, opacity: Math.min(1, p * 2), transform: `translateX(${(1 - p) * 260}px)`}}>
            <Glass strong style={{height: 160, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 24, padding: '0 28px', border: `2px solid ${active ? colors.captionHighlight : colors.glassLine}`}}>
              <div style={{width: 112, height: 112, borderRadius: 24, background: 'rgba(255,213,74,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                <Icon size={92} color="#FFFFFF" accent={colors.captionHighlight} />
              </div>
              <div>
                <div style={{fontSize: 42, fontWeight: 800, lineHeight: 1.1}}>{card.title}</div>
                <div style={{fontSize: 27, fontWeight: 500, opacity: 0.85, marginTop: 4}}>{card.label}</div>
              </div>
            </Glass>
          </div>
        );
      })}
      <div style={{...noteStyle, top: 978, fontSize: 27, fontWeight: 800, color: colors.captionHighlight, ...rise(f, B.checkFactors)}}>{T.factors}</div>

      {/* supporting note under the benefit cards */}
      <div style={{...noteStyle, top: 1062, opacity: vis(f, B.cards + 0.4)}}>{T.note}</div>
    </Shell>
  );
};
