import React from 'react';
import {useCurrentFrame} from 'remotion';
import {chapters, colors, cta, fonts, safe} from '../config';
import {Shell} from '../components/Shell';
import {BigTitle, Glass, Pill} from '../components/Glass';
import {IconCheck} from '../components/Icons';
import {bounce, prog, rise, vis} from '../lib/anim';

const C = chapters[4];
const B = C.beats;
const T = C.text;
const W = safe.right - safe.left;

export const Ch5NextStep: React.FC = () => {
  const f = useCurrentFrame();
  const itemStarts = [B.checklist, B.item2, B.item3];
  return (
    <Shell chapter={C} holdEnd>
      {/* checklist */}
      <div style={{position: 'absolute', top: 400, left: safe.left, width: W, opacity: vis(f, B.checklist + 0.2, B.end - 0.3), transform: `scale(${0.9 + 0.1 * bounce(f, B.checklist + 0.2, 14)})`}}>
        <Glass strong style={{padding: '30px 36px 20px'}}>
          <Pill>{T.checklistTitle}</Pill>
          {T.checklist.map((item, i) => {
            const s = itemStarts[i];
            const done = prog(f, s + 0.4, 0.5);
            return (
              <div key={item} style={{display: 'flex', alignItems: 'center', gap: 24, height: 128, borderTop: i ? '2px dashed rgba(255,255,255,0.18)' : 'none', opacity: 0.4 + 0.6 * vis(f, s, undefined, 0.3)}}>
                <IconCheck size={70} done={done} color={colors.captionHighlight} />
                <div style={{fontSize: 44, fontWeight: 800}}>
                  <span style={{color: colors.captionHighlight}}>{i + 1}.</span> {item}
                </div>
              </div>
            );
          })}
        </Glass>
      </div>

      {/* calm end card — holds to the final frame */}
      <div style={{position: 'absolute', inset: 0, opacity: vis(f, B.end + 0.2, undefined, 0.8)}}>
        <BigTitle size={108} style={{position: 'absolute', top: 480, whiteSpace: 'nowrap', left: safe.left, width: W, textAlign: 'center', ...rise(f, B.end + 0.2)}}>
          {cta.line1}
        </BigTitle>
        <BigTitle size={108} color={colors.captionHighlight} style={{position: 'absolute', top: 600, whiteSpace: 'nowrap', left: safe.left, width: W, textAlign: 'center', ...rise(f, B.end + 0.6)}}>
          {cta.line2}
        </BigTitle>
        <div style={{position: 'absolute', top: 820, left: safe.left, width: W, textAlign: 'center', transform: `scale(${bounce(f, B.end + 1.1, 12)})`}}>
          <Pill style={{fontSize: 42, padding: '18px 40px', boxShadow: '0 12px 30px rgba(0,0,0,0.4)'}}>{cta.action}</Pill>
        </div>
        <div style={{position: 'absolute', top: 950, left: safe.left, width: W, textAlign: 'center', fontFamily: fonts.body, fontWeight: 700, fontSize: 34, letterSpacing: 6, textTransform: 'uppercase', color: '#FFFFFF', textShadow: '0 2px 10px rgba(0,0,0,0.7)', ...rise(f, B.end + 1.4)}}>
          {cta.name}
        </div>
      </div>
    </Shell>
  );
};
