import React from 'react';
import {useCurrentFrame} from 'remotion';
import {chapters, colors, cta, fonts, safe} from '../config';
import {Shell} from '../components/Shell';
import {Chip, Headline, Note} from '../components/Text';
import {Family, IconCheck} from '../components/Icons';
import {prog, rise, vis} from '../lib/anim';

const C = chapters[4];
const B = C.beats;
const T = C.text;

export const Ch5NextStep: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const itemStarts = [B.checklist, B.item2, B.item3];
  const familyIn = prog(f, B.family, 0.9);

  return (
    <Shell chapter={C} holdEnd>
      {/* Phase A — family question */}
      <div style={{opacity: vis(f, B.family, B.checklist - 0.4)}}>
        <Headline top={365} size={62}>
          <div style={rise(f, B.family + 0.1)}>{T.question1}</div>
          <div style={{...rise(f, B.question), color: colors.gold, fontStyle: 'italic'}}>{T.question2}</div>
        </Headline>
        <div
          style={{
            position: 'absolute',
            top: 600,
            left: 540 - 300,
            opacity: familyIn,
            transform: `translateY(${(1 - familyIn) * 40}px) scale(${0.94 + 0.06 * familyIn})`,
          }}
        >
          <Family width={600} t={t} />
        </div>
        <Note top={1110} style={{...rise(f, B.crowd), fontSize: 34, color: colors.cream}}>
          {T.crowd}
        </Note>
      </div>

      {/* Phase B — checklist */}
      <div style={{opacity: vis(f, B.checklist, B.end - 0.2)}}>
        <div style={{position: 'absolute', top: 380, width: 1080, textAlign: 'center', ...rise(f, B.checklist)}}>
          <Chip>{T.checklistTitle}</Chip>
        </div>
        <div
          style={{
            position: 'absolute',
            top: 480,
            left: safe.left,
            width: safe.right - safe.left,
            boxSizing: 'border-box',
            borderRadius: 34,
            background: colors.navySoft,
            border: `2px solid ${colors.navyLine}`,
            padding: '30px 34px',
            ...rise(f, B.checklist + 0.1),
          }}
        >
          {T.checklist.map((item, i) => {
            const s = itemStarts[i];
            const done = prog(f, s + 0.5, 0.5);
            const active = vis(f, s);
            return (
              <div
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 28,
                  height: 150,
                  borderTop: i === 0 ? 'none' : `1px solid ${colors.navyLine}`,
                  opacity: 0.35 + 0.65 * active,
                }}
              >
                <IconCheck size={72} done={done} />
                <div style={{fontFamily: fonts.display, fontWeight: 600, fontSize: 48, color: colors.cream, lineHeight: 1.1}}>
                  <span style={{color: colors.gold}}>{i + 1}.</span> {item}
                </div>
              </div>
            );
          })}
        </div>
        <Headline top={1060} size={62} color={colors.gold} italic style={rise(f, B.wise)}>
          {T.wise}
        </Headline>
      </div>

      {/* Phase C — calm end card (held to the final frame) */}
      <div style={{opacity: vis(f, B.end, undefined, 0.8)}}>
        <Headline top={610} size={98} style={{whiteSpace: 'nowrap'}}>
          <div style={rise(f, B.end)}>{cta.line1}</div>
          <div style={{...rise(f, B.end + 0.5), color: colors.gold, fontStyle: 'italic', marginTop: 10}}>{cta.line2}</div>
        </Headline>
        <div
          style={{
            position: 'absolute',
            top: 920,
            left: 540 - 120 * prog(f, B.end + 0.9, 0.8),
            width: 240 * prog(f, B.end + 0.9, 0.8),
            height: 3,
            background: colors.goldSoft,
          }}
        />
        <div style={{position: 'absolute', top: 975, width: 1080, display: 'flex', justifyContent: 'center', ...rise(f, B.end + 1.1)}}>
          <div
            style={{
              fontFamily: fonts.body,
              fontWeight: 700,
              fontSize: 42,
              color: colors.navy,
              background: colors.gold,
              borderRadius: 999,
              padding: '22px 44px',
            }}
          >
            {cta.action}
          </div>
        </div>
        <Note top={1110} style={{...rise(f, B.end + 1.4), fontSize: 32, letterSpacing: 6, textTransform: 'uppercase', fontWeight: 600, color: colors.cream}}>
          {cta.name}
        </Note>
      </div>
    </Shell>
  );
};
