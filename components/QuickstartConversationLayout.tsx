'use client';
import { useState, type ReactNode } from 'react';
import { MessageCircle, PhoneOff, Sparkles, X } from 'lucide-react';
type Props = {activityPanel: ReactNode;statusPanel: ReactNode; transcriptPanel: ReactNode; visualizer: ReactNode; controls: ReactNode; state: string; onEndConversation: () => void;};
export function QuickstartConversationLayout({activityPanel,statusPanel,transcriptPanel,visualizer,controls,state,onEndConversation}: Props) {
 const [showTranscript,setShowTranscript]=useState(true);
 const label=state==='talking' ? 'Diwali Dost bol rahi hai…' : state==='analyzing' ? 'Ek pal, soch rahi hoon…' : state==='joining'||state==='not-joined' ? 'Tumhari dost aa rahi hai…' : state==='disconnected' ? 'Connection ruk gaya' : 'Haan bolo, sun rahi hoon…';
 return <section className="courtyard-call">
   <header className="courtyard-toolbar"><span className="call-live"><i/> A little heart-to-heart</span><div>{statusPanel}<button className="transcript-toggle" onClick={()=>setShowTranscript(v=>!v)} aria-expanded={showTranscript} aria-controls="call-transcript"><MessageCircle size={17}/> Hamari baatein</button></div></header>
   <main className="courtyard-main"><p className="festival-eyebrow"><Sparkles size={13}/> YOUR FESTIVE CORNER</p><h1 className="call-heading">Dil ki baat <em>bolo.</em></h1><p className="call-subheading">Aaj ki shaam, thodi aur roshan karte hain.</p>{visualizer}<div className="call-state" key={label} role="status"><span className="voice-dots"><i/><i/><i/><i/><i/></span>{label}</div><p className="call-interrupt">Beech mein bolo. Main ruk ke sunungi.</p><div className="call-actions">{controls}<button className="call-end" onClick={onEndConversation}><PhoneOff size={18}/><span>Phir milenge</span></button></div></main>
   {activityPanel}
   {showTranscript && <aside id="call-transcript" className="courtyard-transcript"><button className="transcript-close" aria-label="Close transcript" onClick={()=>setShowTranscript(false)}><X size={17}/></button>{transcriptPanel}</aside>}
 </section>;
}
