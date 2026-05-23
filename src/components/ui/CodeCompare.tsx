'use client';

import React from 'react';
import { Copy, FileCode, Check, ShieldAlert } from 'lucide-react';

interface CodeCompareProps {
  similarity: number;
  candidateFile?: string;
  sourceRepo?: string;
}

export default function CodeCompare({ similarity, candidateFile = "components/ProductCard.tsx", sourceRepo = "github.com/react-native-community/ecommerce-showcase-app" }: CodeCompareProps) {
  
  // Sample code snippets with similarities
  const candidateCode = `import React from 'react';
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
}`;

  const sourceCode = `import React from 'react';
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
}`;

  return (
    <div className="border border-danger/30 rounded-xl overflow-hidden bg-slate-950 glow-red">
      {/* Header */}
      <div className="bg-danger/5 border-b border-danger/20 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-danger" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-200">
            Source Code Plagiarism Details
          </span>
        </div>
        <span className="px-2 py-0.5 bg-danger/10 text-danger border border-danger/20 rounded text-xs font-mono font-bold">
          {similarity}% SIMILARITY MATCH
        </span>
      </div>

      {/* Info bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 text-xs font-mono border-b border-slate-800 text-slate-400 bg-slate-900/50">
        <div className="p-3 border-r border-slate-800 flex items-center space-x-2">
          <FileCode className="w-4 h-4 text-primary" />
          <span className="truncate text-slate-300">{candidateFile} (Candidate Upload)</span>
        </div>
        <div className="p-3 flex items-center space-x-2">
          <Copy className="w-4 h-4 text-danger" />
          <span className="truncate text-slate-300">matched: {sourceRepo}</span>
        </div>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 font-mono text-[11px] overflow-x-auto">
        {/* Left Side: Candidate Code */}
        <div className="border-r border-slate-800 p-4 bg-slate-950/80">
          <div className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest flex justify-between">
            <span>Candidate Code Submission</span>
            <span className="text-danger">Tampered matches highlighted</span>
          </div>
          <pre className="text-slate-300 leading-5">
            {candidateCode.split('\n').map((line, i) => {
              // Highlight matches (almost all except specific lines)
              const isMatch = !line.includes('Renamed item') && !line.includes('Shopping');
              return (
                <div key={i} className={`flex ${isMatch ? 'bg-danger/10 border-l-2 border-l-danger px-1' : 'px-1'}`}>
                  <span className="w-6 text-slate-600 select-none mr-2 text-right">{i+1}</span>
                  <span className={isMatch ? 'text-danger' : 'text-slate-400'}>{line}</span>
                </div>
              );
            })}
          </pre>
        </div>

        {/* Right Side: Source Code */}
        <div className="p-4 bg-slate-900/20">
          <div className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest flex justify-between">
            <span>Repository Source (ecommerce-showcase-app)</span>
            <span className="text-success">Verified Original</span>
          </div>
          <pre className="text-slate-300 leading-5">
            {sourceCode.split('\n').map((line, i) => {
              const isMatch = !line.includes('Add to Cart'); // highlight matching structure
              return (
                <div key={i} className={`flex ${isMatch ? 'bg-danger/10 border-l-2 border-l-danger px-1' : 'px-1'}`}>
                  <span className="w-6 text-slate-600 select-none mr-2 text-right">{i+1}</span>
                  <span className={isMatch ? 'text-slate-500' : 'text-slate-400'}>{line}</span>
                </div>
              );
            })}
          </pre>
        </div>
      </div>
    </div>
  );
}
