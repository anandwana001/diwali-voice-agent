import type { CSSProperties } from 'react';

export function DiwaliSky() {
  return <div className="diwali-sky" aria-hidden="true">
    {Array.from({ length: 14 }, (_, i) => <i key={i} className="sky-lantern" style={{ left: `${(i * 29 + 3) % 100}%`, top: `${15 + (i * 17) % 65}%`, animationDelay: `${-i * 1.7}s` } as CSSProperties} />)}
    {[12, 82, 65].map((x, i) => <div className="firework" key={x} style={{ left: `${x}%`, top: `${16 + i * 9}%`, animationDelay: `${i * -2}s` }}>{Array.from({length: 20}, (_, n) => <b key={n} style={{transform: `rotate(${n * 18}deg) translateY(-65px)`}} />)}</div>)}
    <svg className="temple-city" viewBox="0 0 1440 320" preserveAspectRatio="xMidYMax slice">
      {Array.from({length: 25}, (_, i) => { const x=i*62; const h=65+(i*47)%160; return <g key={i}><path d={`M${x} 320V${320-h}h52v${h}Z`} fill={i%2 ? '#172A38' : '#203C4D'}/><path d={`M${x+5} ${320-h}L${x+26} ${255-h}L${x+47} ${320-h}Z`} fill="#172A38"/><path d={`M${x+26} ${257-h}v-22l20 7-20 7`} fill="#E8B654"/>{[0,1,2,3].map(n=><ellipse key={n} cx={x+7+n*12} cy={315-h} rx="2" ry="4" fill="#E8B654"/>)}<rect x={x+22} y={345-h} width="9" height="18" rx="5" fill="#E8B654"/></g>; })}
    </svg>
  </div>;
}

export function DiwaliDiya({ state = 'idle' }: { state?: string }) {
  return <div className="diya-stage" data-state={state} role="img" aria-label={`Diwali diya — ${state}`}>
    <div className="diya-halo" />
    <svg viewBox="0 0 600 350" className="diya-art">
      <ellipse cx="300" cy="277" rx="240" ry="62" fill="none" stroke="#F6F2E9" strokeDasharray="2 9" opacity=".5"/>
      {[0,1,2,3].map(r => <g key={r}>{Array.from({length: 24},(_,i)=>{const a=i*Math.PI/12;return <ellipse key={i} cx={300+Math.cos(a)*(125+r*34)} cy={277+Math.sin(a)*(29+r*11)} rx="10" ry="3.5" fill={['#E8B654','#D75D45','#F6F2E9','#E8B654'][(i+r)%4]} transform={`rotate(${Math.sin(a)*22} ${300+Math.cos(a)*(125+r*34)} ${277+Math.sin(a)*(29+r*11)})`}/>;})}</g>)}
      <ellipse cx="300" cy="269" rx="100" ry="15" fill="#172A38" opacity=".5"/>
      <path d="M192 210Q300 354 408 210Z" fill="#D75D45" stroke="#172A38" strokeWidth="5"/>
      <ellipse cx="300" cy="210" rx="108" ry="27" fill="#E8B654" stroke="#172A38" strokeWidth="5"/>
      <ellipse cx="300" cy="211" rx="91" ry="16" fill="#D75D45"/>
      <ellipse cx="317" cy="207" rx="39" ry="6" fill="#F6F2E9"/>
      <path d="M216 241Q300 274 384 241" fill="none" stroke="#E8B654" strokeWidth="7"/>
      {[240,270,300,330,360].map((x,i)=><circle key={x} cx={x} cy={261+Math.sin(i*Math.PI/4)*12} r="3" fill="#F6F2E9"/>)}
      <g className="diya-flame"><path d="M394 65C382 114 346 147 356 181C364 212 407 217 422 185C437 156 407 115 394 65Z" fill="#E8B654" stroke="#D75D45" strokeWidth="4"/><path d="M394 106C388 146 367 164 372 184C378 203 403 206 412 185C418 167 400 143 394 106Z" fill="#F6F2E9"/><ellipse cx="392" cy="189" rx="13" ry="10" fill="#172A38"/></g>
    </svg>
  </div>;
}

export function DiwaliBanderwal() {
  return <div className="diwali-banderwal" aria-hidden="true"><svg viewBox="0 0 1440 94" preserveAspectRatio="xMidYMin slice"><path d="M0 8Q180 75 360 8Q540 75 720 8Q900 75 1080 8Q1260 75 1440 8" fill="none" stroke="#E8B654" strokeWidth="3"/>{Array.from({length:49},(_,i)=>{const x=i*30;const local=(x%360)/360;const y=8+132*local*(1-local);return <g key={i}><path d={`M${x} ${y}q-12 15 0 32q12-17 0-32`} fill={i%3===0?'#D75D45':'#E8B654'} stroke="#172A38" strokeWidth="1.5"/><circle cx={x} cy={y+3} r="4" fill="#F6F2E9"/>{i%6===0&&<><path d={`M${x} ${y+30}v13`} stroke="#E8B654" strokeWidth="2"/><circle cx={x} cy={y+48} r="6" fill="#D75D45"/><path d={`M${x-4} ${y+52}l-3 10m7-10v12m4-12l3 10`} stroke="#E8B654" strokeWidth="2"/></>}</g>;})}</svg></div>;
}
