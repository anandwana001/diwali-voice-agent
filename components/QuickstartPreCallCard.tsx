'use client';
import { useState } from 'react';
import { Mic, ArrowUpRight, Loader2, Sparkles } from 'lucide-react';
import { DiwaliDiya } from './DiwaliScene';
type QuickstartPreCallCardProps = { isLoading: boolean; error: string | null; onStartConversation: () => void; };
const ideas = ['Pune ka muhurat?', 'Ek easy rangoli idea?', 'Diwali wish likh do!'];
export function QuickstartPreCallCard({isLoading,error,onStartConversation}: QuickstartPreCallCardProps) {
 const [idea,setIdea]=useState<string | null>(null);
 return <main className="festival-welcome">
   <p className="festival-eyebrow">A LITTLE LIGHT. A LITTLE CONVERSATION.</p>
   <h1 className="festival-title"><span>Thodi roshni,</span><span>thodi <em>baatein.</em><Sparkles aria-hidden="true" /></span></h1>
   <p className="festival-subtitle">Your Diwali dost. Dil se, Hinglish mein.</p>
   <DiwaliDiya state={isLoading ? 'connecting' : 'idle'}/>
   <div className="festival-invite"><span className="tiny-star">✦</span><p key={idea} className="invite-text">{idea ? `Baat shuru karke poochho: “${idea}”` : 'Muhurat se mithai tak. Bas bol ke dekho.'}</p></div>
   <button className="festival-start" onClick={onStartConversation} disabled={isLoading}>{isLoading ? <Loader2 className="animate-spin"/> : <Mic/>}{isLoading ? 'Diya jal raha hai…' : 'Baat karein'}<ArrowUpRight/></button>
   <p className="festival-hint">{isLoading ? 'Getting your conversation ready' : 'Mic on karo. Apna sa feel karo.'}</p>
   <div className="festival-suggestions">{ideas.map((text,i)=><button key={text} disabled={isLoading} onClick={()=>setIdea(text)} style={{animationDelay:`${i*100+450}ms`}}><span aria-hidden="true">{['✧','❋','♡'][i]}</span>{text}</button>)}</div>
   {error && <p role="alert" className="festival-error">{error}</p>}
 </main>;
}
