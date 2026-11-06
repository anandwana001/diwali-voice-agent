export function detectVisualIntent(text: string): 'rangoli' | 'puja' | null {
  if (/रंगोली|रंगोळी|rangoli|rangooli|rangoly|rangoli/i.test(text)) return 'rangoli';
  if (/पूजा|पूजन|\bpuja\b|\bpooja\b/i.test(text) && /कैसे|विधि|सामग्री|कैसी|kaise|kese|vidhi|vidi|विधी|steps|samagri|करते|दिखा|खोल|dikha|khol|show|open/i.test(text)) return 'puja';
  return null;
}

export function isMoreImagesRequest(text: string): boolean {
 return /(?:और|ज्यादा|ज़्यादा|अधिक|more|aur|or|dusri|दूसरी).*(?:तस्वीर|चित्र|फोटो|इमेज|डिज़ाइन|रंगोली|image|photo|design|rangoli)|(?:show|दिखा|दिखाओ|दिखाइए).*(?:more|और)|(?:कुछ और|और दिखाओ|aur dikhao|show more)/i.test(text);
}
