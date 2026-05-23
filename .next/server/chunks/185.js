"use strict";exports.id=185,exports.ids=[185],exports.modules={41291:(e,t,a)=>{a.d(t,{Z:()=>s});let s=(0,a(62881).Z)("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]])},25880:(e,t,a)=>{a.d(t,{Z:()=>s});let s=(0,a(62881).Z)("FileCode",[["path",{d:"M10 12.5 8 15l2 2.5",key:"1tg20x"}],["path",{d:"m14 12.5 2 2.5-2 2.5",key:"yinavb"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z",key:"1mlx9k"}]])},81194:(e,t,a)=>{a.d(t,{Z:()=>n});var s=a(10326);a(17577);var r=a(15601),l=a(25880);let d=(0,a(62881).Z)("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]]);function n({similarity:e,candidateFile:t="components/ProductCard.tsx",sourceRepo:a="github.com/react-native-community/ecommerce-showcase-app"}){let n=`import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useCart } from '../hooks/useCart';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  // Renamed item to product item, but kept identical styles
  const handlePress = () => {
    addToCart(product);
  };

  return (
    <View className="p-4 border rounded-xl bg-slate-900 border-slate-800">
      <Image source={{ uri: product.thumbnail }} className="w-full h-40 rounded" />
      <Text className="text-lg font-bold text-white mt-2">{product.title}</Text>
      <Text className="text-slate-400 font-mono mt-1">\${product.price}</Text>
      <TouchableOpacity 
        onPress={handlePress}
        className="mt-3 bg-cyan-500 py-2 rounded-lg items-center"
      >
        <Text className="text-white font-bold">Add to Shopping Cart</Text>
      </TouchableOpacity>
    </View>
  );
}`,c=`import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useCart } from '../hooks/useCart';

export default function ProductCard({ item }) {
  const { addToCart } = useCart();

  const handlePress = () => {
    addToCart(item);
  };

  return (
    <View className="p-4 border rounded-xl bg-slate-900 border-slate-800">
      <Image source={{ uri: item.thumbnail }} className="w-full h-40 rounded" />
      <Text className="text-lg font-bold text-white mt-2">{item.title}</Text>
      <Text className="text-slate-400 font-mono mt-1">\${item.price}</Text>
      <TouchableOpacity 
        onPress={handlePress}
        className="mt-3 bg-cyan-500 py-2 rounded-lg items-center"
      >
        <Text className="text-white font-bold">Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
}`;return(0,s.jsxs)("div",{className:"border border-danger/30 rounded-xl overflow-hidden bg-slate-950 glow-red",children:[(0,s.jsxs)("div",{className:"bg-danger/5 border-b border-danger/20 p-4 flex items-center justify-between",children:[(0,s.jsxs)("div",{className:"flex items-center space-x-2",children:[s.jsx(r.Z,{className:"w-5 h-5 text-danger"}),s.jsx("span",{className:"font-mono text-xs font-bold uppercase tracking-widest text-slate-200",children:"Source Code Plagiarism Details"})]}),(0,s.jsxs)("span",{className:"px-2 py-0.5 bg-danger/10 text-danger border border-danger/20 rounded text-xs font-mono font-bold",children:[e,"% SIMILARITY MATCH"]})]}),(0,s.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 text-xs font-mono border-b border-slate-800 text-slate-400 bg-slate-900/50",children:[(0,s.jsxs)("div",{className:"p-3 border-r border-slate-800 flex items-center space-x-2",children:[s.jsx(l.Z,{className:"w-4 h-4 text-primary"}),(0,s.jsxs)("span",{className:"truncate text-slate-300",children:[t," (Candidate Upload)"]})]}),(0,s.jsxs)("div",{className:"p-3 flex items-center space-x-2",children:[s.jsx(d,{className:"w-4 h-4 text-danger"}),(0,s.jsxs)("span",{className:"truncate text-slate-300",children:["matched: ",a]})]})]}),(0,s.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-2 font-mono text-[11px] overflow-x-auto",children:[(0,s.jsxs)("div",{className:"border-r border-slate-800 p-4 bg-slate-950/80",children:[(0,s.jsxs)("div",{className:"text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest flex justify-between",children:[s.jsx("span",{children:"Candidate Code Submission"}),s.jsx("span",{className:"text-danger",children:"Tampered matches highlighted"})]}),s.jsx("pre",{className:"text-slate-300 leading-5",children:n.split("\n").map((e,t)=>{let a=!e.includes("Renamed item")&&!e.includes("Shopping");return(0,s.jsxs)("div",{className:`flex ${a?"bg-danger/10 border-l-2 border-l-danger px-1":"px-1"}`,children:[s.jsx("span",{className:"w-6 text-slate-600 select-none mr-2 text-right",children:t+1}),s.jsx("span",{className:a?"text-danger":"text-slate-400",children:e})]},t)})})]}),(0,s.jsxs)("div",{className:"p-4 bg-slate-900/20",children:[(0,s.jsxs)("div",{className:"text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest flex justify-between",children:[s.jsx("span",{children:"Repository Source (ecommerce-showcase-app)"}),s.jsx("span",{className:"text-success",children:"Verified Original"})]}),s.jsx("pre",{className:"text-slate-300 leading-5",children:c.split("\n").map((e,t)=>{let a=!e.includes("Add to Cart");return(0,s.jsxs)("div",{className:`flex ${a?"bg-danger/10 border-l-2 border-l-danger px-1":"px-1"}`,children:[s.jsx("span",{className:"w-6 text-slate-600 select-none mr-2 text-right",children:t+1}),s.jsx("span",{className:a?"text-slate-500":"text-slate-400",children:e})]},t)})})]})]})]})}},8696:(e,t,a)=>{a.d(t,{Z:()=>x});var s=a(10326),r=a(17577),l=a(62881);let d=(0,l.Z)("OctagonAlert",[["path",{d:"M12 16h.01",key:"1drbdi"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z",key:"1fd625"}]]),n=(0,l.Z)("TriangleAlert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]),c=(0,l.Z)("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]),i=(0,l.Z)("ChevronUp",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]);var o=a(941);function x({flag:e}){let[t,a]=(0,r.useState)(!1),l={critical:{border:"border-danger/30 hover:border-danger/70",bg:"bg-danger/5",glow:"glow-red",text:"text-danger",icon:s.jsx(d,{className:"w-5 h-5 text-danger"}),badge:"bg-danger/10 text-danger border-danger/20"},warning:{border:"border-warning/30 hover:border-warning/70",bg:"bg-warning/5",glow:"glow-amber",text:"text-warning",icon:s.jsx(n,{className:"w-5 h-5 text-warning"}),badge:"bg-warning/10 text-warning border-warning/20"},info:{border:"border-primary/30 hover:border-primary/70",bg:"bg-primary/5",glow:"glow-cyan",text:"text-primary",icon:s.jsx(c,{className:"w-5 h-5 text-primary"}),badge:"bg-primary/10 text-primary border-primary/20"}},x=l[e.severity]||l.info;return(0,s.jsxs)("div",{className:`border rounded-xl transition-all duration-300 ${x.border} ${x.bg} overflow-hidden`,children:[(0,s.jsxs)("div",{className:"p-4 flex items-start justify-between cursor-pointer select-none",onClick:()=>a(!t),children:[(0,s.jsxs)("div",{className:"flex items-start space-x-3",children:[s.jsx("div",{className:"mt-0.5",children:x.icon}),(0,s.jsxs)("div",{children:[(0,s.jsxs)("div",{className:"flex items-center space-x-2",children:[s.jsx("span",{className:"font-mono text-xs font-bold uppercase tracking-wider text-slate-300",children:e.type.replace(/_/g," ")}),s.jsx("span",{className:`px-2 py-0.5 rounded border text-[10px] font-mono font-bold uppercase tracking-widest ${x.badge}`,children:e.severity})]}),(0,s.jsxs)("p",{className:"text-sm text-slate-300 mt-1 line-clamp-1 font-mono",children:['"',e.excerpt,'"']})]})]}),s.jsx("button",{className:"text-slate-400 hover:text-slate-200",children:t?s.jsx(i,{className:"w-4 h-4"}):s.jsx(o.Z,{className:"w-4 h-4"})})]}),t&&s.jsx("div",{className:"px-4 pb-4 pt-1 border-t border-slate-800 bg-slate-950/40",children:(0,s.jsxs)("div",{className:"space-y-3 font-sans text-sm",children:[(0,s.jsxs)("div",{children:[s.jsx("span",{className:"text-xs font-mono text-slate-500 uppercase tracking-widest block mb-1",children:"Affected Segment"}),(0,s.jsxs)("div",{className:"bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-slate-300 font-mono text-xs break-words border-l-2 border-l-primary",children:['"',e.excerpt,'"']})]}),(0,s.jsxs)("div",{children:[s.jsx("span",{className:"text-xs font-mono text-slate-500 uppercase tracking-widest block mb-1",children:"Intelligence Assessment"}),s.jsx("p",{className:"text-slate-300 leading-relaxed text-xs",children:e.explanation})]})]})})]})}}};