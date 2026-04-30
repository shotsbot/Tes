/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Plus, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  MoreVertical, 
  Download, 
  Shield, 
  ShieldCheck, 
  Ghost, 
  Settings, 
  Bookmark as BookmarkIcon, 
  History as HistoryIcon,
  Globe,
  LayoutGrid,
  Menu,
  DownloadCloud,
  FileVideo,
  Image as FileImage,
  ArrowDownToLine,
  SearchCode,
  Smartphone,
  Cpu,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Tab, DownloadItem, BrowserHistory, Bookmark, SearchEngine } from './types';

// Mock Data
const INITIAL_SEARCH_ENGINES: SearchEngine[] = [
  { id: 'google', name: 'Google', urlTemplate: 'https://www.google.com/search?q=%s', isDefault: true },
  { id: 'bing', name: 'Bing', urlTemplate: 'https://www.bing.com/search?q=%s', isDefault: false },
  { id: 'duckduckgo', name: 'DuckDuckGo', urlTemplate: 'https://duckduckgo.com/?q=%s', isDefault: false },
];
const INITIAL_TABS: Tab[] = [
  { id: '1', title: 'Google', url: 'https://www.google.com', isActive: true },
];

const MOCK_DOWNLOADS: DownloadItem[] = [
  { id: 'd1', filename: 'Video_Viral_2026.mp4', size: '24.5 MB', progress: 45, status: 'downloading', type: 'video', date: 'Today' },
  { id: 'd2', filename: 'Photography_Collection_HD.zip', size: '156 MB', progress: 100, status: 'completed', type: 'other', date: 'Yesterday' },
];

const MOCK_HISTORY: BrowserHistory[] = [
  { id: 'h1', title: 'GitHub - AI Coding', url: 'https://github.com', time: '10:30 AM' },
  { id: 'h2', title: 'Stack Overflow', url: 'https://stackoverflow.com', time: '09:15 AM' },
];

export default function App() {
  const [tabs, setTabs] = useState<Tab[]>(INITIAL_TABS);
  const [url, setUrl] = useState('https://www.google.com');
  const [isIncognito, setIsIncognito] = useState(false);
  const [adGuardEnabled, setAdGuardEnabled] = useState(true);
  const [showDownloads, setShowDownloads] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [downloads] = useState<DownloadItem[]>(MOCK_DOWNLOADS);
  const [searchEngines, setSearchEngines] = useState<SearchEngine[]>(INITIAL_SEARCH_ENGINES);
  const [showSearchSettings, setShowSearchSettings] = useState(false);
  const [activeTabId, setActiveTabId] = useState('1');
  const [isUrlFocused, setIsUrlFocused] = useState(false);
  const [mediaDetected, setMediaDetected] = useState(false);
  const [isMediaPanelExpanded, setIsMediaPanelExpanded] = useState(false);

  const activeTab = tabs.find(t => t.id === activeTabId);

  useEffect(() => {
    if (activeTab?.url) {
      setMediaDetected(true);
    } else {
      setMediaDetected(false);
      setIsMediaPanelExpanded(false);
    }
  }, [activeTab?.url]);

  const handleStartDownload = (filename: string, size: string, type: 'video' | 'image' | 'other' = 'video') => {
    // In a real app, this would trigger the native Android downloader
    setIsMediaPanelExpanded(false);
    setShowDownloads(true);
  };

  const handleAddTab = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newTab: Tab = { id: newId, title: 'New Tab', url: '', isActive: true };
    setTabs([...tabs.map(t => ({ ...t, isActive: false })), newTab]);
    setActiveTabId(newId);
    setUrl('');
  };

  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const newTabs = tabs.filter(t => t.id !== id);
    if (activeTabId === id) {
      const lastTab = newTabs[newTabs.length - 1];
      setActiveTabId(lastTab.id);
      setUrl(lastTab.url);
    }
    setTabs(newTabs);
  };

  const handleTabClick = (id: string) => {
    setActiveTabId(id);
    const targetTab = tabs.find(t => t.id === id);
    if (targetTab) setUrl(targetTab.url);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = url;
    if (!url.startsWith('http') && !url.includes('.')) {
      const defaultEngine = searchEngines.find(e => e.isDefault) || searchEngines[0];
      finalUrl = defaultEngine.urlTemplate.replace('%s', encodeURIComponent(url));
    } else if (!url.startsWith('http')) {
      finalUrl = `https://${url}`;
    }
    const updatedTabs = tabs.map(t => 
      t.id === activeTabId ? { ...t, url: finalUrl, title: extractDomain(finalUrl) } : t
    );
    setTabs(updatedTabs);
    setUrl(finalUrl);
    setIsUrlFocused(false);
  };

  const handleSetDefaultSearch = (id: string) => {
    setSearchEngines(searchEngines.map(se => ({
      ...se,
      isDefault: se.id === id
    })));
  };

  const handleAddSearchEngine = (name: string, template: string) => {
    const newEngine: SearchEngine = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      urlTemplate: template,
      isDefault: false
    };
    setSearchEngines([...searchEngines, newEngine]);
  };

  const handleDeleteSearchEngine = (id: string) => {
    if (searchEngines.length <= 1) return;
    const engineToDelete = searchEngines.find(e => e.id === id);
    let newEngines = searchEngines.filter(e => e.id !== id);
    if (engineToDelete?.isDefault) {
      newEngines[0].isDefault = true;
    }
    setSearchEngines(newEngines);
  };

  const extractDomain = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <div className={`flex flex-col h-screen w-full overflow-hidden transition-colors duration-500 ${isIncognito ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>
      
      {/* --- Browser Top Bar (Tabs) --- */}
      <div className={`flex items-center gap-1 px-3 pt-2 h-12 overflow-x-auto no-scrollbar border-b ${isIncognito ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-zinc-100'}`}>
        <AnimatePresence mode="popLayout">
          {tabs.map((tab) => (
            <motion.div
              key={tab.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center min-w-[140px] max-w-[220px] px-3 py-1.5 rounded-t-xl cursor-default group relative overflow-hidden transition-all ${
                tab.id === activeTabId 
                  ? (isIncognito ? 'bg-zinc-800 text-white' : 'bg-white shadow-sm text-zinc-900') 
                  : 'hover:bg-zinc-200/50 opacity-70'
              }`}
            >
              {isIncognito && tab.id === activeTabId && (
                <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-500" />
              )}
              <Globe className="w-4 h-4 mr-2 shrink-0 text-zinc-400" />
              <span className="text-xs font-medium truncate flex-1">{tab.title || 'New Tab'}</span>
              <button 
                onClick={(e) => handleCloseTab(tab.id, e)}
                className="ml-1 p-0.5 rounded-full hover:bg-zinc-400/20 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        <button 
          onClick={handleAddTab}
          className="p-2 ml-1 rounded-full hover:bg-zinc-300/30 transition-colors"
        >
          <Plus className="w-5 h-5 text-zinc-500" />
        </button>
      </div>

      {/* --- Unified Toolbar (Chrome 2026 Design) --- */}
      <div className={`flex items-center gap-2 p-2 border-b ${isIncognito ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <div className="flex items-center gap-0.5 px-1">
          <button className="p-2 hover:bg-zinc-200/50 rounded-full transition-colors"><ChevronLeft className="w-5 h-5 opacity-60" /></button>
          <button className="p-2 hover:bg-zinc-200/50 rounded-full transition-colors"><ChevronRight className="w-5 h-5 opacity-40 " /></button>
          <button className="p-2 hover:bg-zinc-200/50 rounded-full transition-colors"><RotateCcw className="w-4 h-4" /></button>
        </div>

        {/* Address Bar */}
        <form onSubmit={handleUrlSubmit} className="flex-1 relative group">
          <div className={`flex items-center h-10 px-4 rounded-full transition-all duration-300 border ${
            isUrlFocused 
              ? 'ring-2 ring-indigo-500/20 shadow-lg border-indigo-400' 
              : (isIncognito ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-100 border-transparent hover:bg-zinc-200/70')
          }`}>
            {isIncognito ? <Ghost className="w-4 h-4 mr-2 text-indigo-400" /> : <Shield className={`w-4 h-4 mr-2 ${adGuardEnabled ? 'text-green-500' : 'text-zinc-400'}`} />}
            <input 
              type="text" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onFocus={() => setIsUrlFocused(true)}
              onBlur={() => setIsUrlFocused(false)}
              className="bg-transparent border-none outline-none w-full text-sm font-medium tracking-wide placeholder-zinc-500"
              placeholder="Search or enter URL"
            />
            <div className="flex items-center gap-2 ml-2">
              {adGuardEnabled && (
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  className="flex items-center text-[10px] bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded-full font-bold"
                >
                  <ShieldCheck className="w-3 h-3 mr-0.5" />
                  AD-BLOCK ON
                </motion.div>
              )}
              <BookmarkIcon className="w-4 h-4 text-zinc-400 hover:text-yellow-500 cursor-pointer transition-colors" />
            </div>
          </div>
        </form>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => setShowDownloads(!showDownloads)}
            className={`p-2.5 rounded-full transition-all relative ${showDownloads ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-zinc-200/50'}`}
          >
            <DownloadCloud className="w-5 h-5" />
            {downloads.filter(d => d.status === 'downloading').length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white animate-pulse" />
            )}
          </button>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className={`p-2.5 rounded-full transition-all ${showMenu ? 'bg-zinc-200/80 scale-95' : 'hover:bg-zinc-200/50'}`}
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* --- Main Content Area / Iframe Simulation --- */}
      <div className="flex-1 relative flex">
        {/* The Viewport */}
        <div className="flex-1 h-full bg-white relative overflow-hidden">
          {!activeTab?.url ? (
            <div className={`flex flex-col items-center justify-center h-full p-8 ${isIncognito ? 'bg-zinc-950' : 'bg-white'}`}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-lg"
              >
                <div className="flex justify-center mb-8">
                  {isIncognito ? (
                    <div className="p-6 bg-zinc-900 rounded-3xl border border-indigo-500/30 shadow-2xl">
                      <Ghost className="w-20 h-20 text-indigo-400" />
                    </div>
                  ) : (
                    <div className="p-6 bg-indigo-50 rounded-3xl shadow-xl border border-indigo-100">
                      <Smartphone className="w-20 h-20 text-indigo-600" />
                    </div>
                  )}
                </div>
                <h1 className="text-4xl font-black mb-4 tracking-tighter">RiSET Browser</h1>
                <p className="text-zinc-500 mb-8 font-medium">Experience the internet at the speed of thought. Secure, Ad-free, and Private by default.</p>
                
                <div className="grid grid-cols-4 gap-4 mb-8">
                  {[
                    { icon: Globe, label: 'Fastest' },
                    { icon: ShieldCheck, label: 'Ad-Block' },
                    { icon: Download, label: '1DM Pro' },
                    { icon: Cpu, label: 'AI Powered' }
                  ].map((feat, i) => (
                    <div key={i} className="flex flex-col items-center p-3 rounded-2xl bg-zinc-100/50 border border-zinc-100 hover:border-indigo-200 hover:bg-white transition-all cursor-pointer group">
                      <feat.icon className="w-6 h-6 mb-2 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-600">{feat.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  {['Google', 'Facebook', 'YouTube', 'GitHub', 'Reddit'].map(site => (
                    <button key={site} className="px-5 py-2.5 rounded-full bg-zinc-100 font-bold text-sm tracking-tight hover:bg-zinc-200 transition-all active:scale-95">
                      {site}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-400 p-12 text-center">
              <div className="max-w-md">
                <Globe className="w-24 h-24 mx-auto mb-6 opacity-10" />
                <h2 className="text-2xl font-bold mb-2">Simulated Viewport</h2>
                <p className="text-sm">In this preview, we simulate the browser environment for <b>{activeTab.url}</b>. In the full Android app, this space is powered by high-performance WebView with real-time Ad-Blocking injectors.</p>
                
                {/* Interactive Media Sniffer (1DM Feature) */}
                {mediaDetected && (
                  <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mt-8 overflow-hidden rounded-2xl shadow-2xl border border-indigo-200 bg-white"
                  >
                    {!isMediaPanelExpanded ? (
                      <div 
                        onClick={() => setIsMediaPanelExpanded(true)}
                        className="p-4 bg-indigo-600 text-white flex items-center cursor-pointer hover:bg-indigo-700 transition-all active:scale-[0.98]"
                      >
                        <ArrowDownToLine className="w-6 h-6 mr-3 animate-bounce" />
                        <div className="text-left flex-1">
                          <div className="text-[10px] font-black opacity-80 uppercase tracking-widest leading-none mb-1">RiSET Sniffer Pro</div>
                          <div className="text-sm font-black italic">Found: 4K Video Detected</div>
                        </div>
                        <div className="px-3 py-1 bg-white/20 rounded-lg text-[10px] font-black tracking-tighter">EXPAND</div>
                      </div>
                    ) : (
                      <motion.div 
                        initial={{ height: 0 }} 
                        animate={{ height: 'auto' }}
                        className="w-full bg-white text-zinc-900"
                      >
                        <div className="p-4 bg-zinc-900 text-white flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <FileVideo className="w-4 h-4 text-indigo-400" />
                             <span className="text-xs font-black uppercase">Select Quality</span>
                          </div>
                          <button onClick={() => setIsMediaPanelExpanded(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors"><X className="w-4 h-4"/></button>
                        </div>
                        <div className="p-2 grid grid-cols-1 gap-1">
                          {[
                            { label: '4K Ultra HD (2160p)', size: '1.2 GB', format: 'MP4' },
                            { label: 'Full HD (1080p)', size: '245 MB', format: 'MP4' },
                            { label: 'HD Ready (720p)', size: '89 MB', format: 'MP4' },
                            { label: 'Audio Only (M4A)', size: '4.5 MB', format: 'M4A' }
                          ].map((opt, i) => (
                            <button 
                              key={i}
                              onClick={() => handleStartDownload(`Video_${opt.label}.${opt.format.toLowerCase()}`, opt.size)}
                              className="flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all group"
                            >
                              <div className="text-left">
                                <div className="text-xs font-black group-hover:text-indigo-600 transition-colors">{opt.label}</div>
                                <div className="text-[10px] font-bold text-zinc-400 uppercase">{opt.format} • {opt.size}</div>
                              </div>
                              <ArrowDownToLine className="w-4 h-4 text-zinc-300 group-hover:text-indigo-500 transition-all" />
                            </button>
                          ))}
                        </div>
                        <div className="bg-zinc-50 p-2 border-t flex items-center justify-center">
                          <button className="text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-widest">More formats available...</button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* --- Side Panels: Downloads, Menu, etc --- */}
        <AnimatePresence>
          {showDownloads && (
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className={`absolute right-0 top-0 bottom-0 w-80 shadow-2xl border-l z-50 flex flex-col ${isIncognito ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}
            >
              <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DownloadCloud className="w-5 h-5 text-indigo-500" />
                  <h3 className="font-bold">Download Manager</h3>
                </div>
                <button onClick={() => setShowDownloads(false)} className="p-1 hover:bg-zinc-100 rounded-full"><X className="w-5 h-5"/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {downloads.map(item => (
                  <div key={item.id} className="p-3 rounded-xl border border-zinc-100 bg-zinc-50/50 group hover:border-indigo-200 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                       <div className={`p-2 rounded-lg ${item.type === 'video' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                         {item.type === 'video' ? <FileVideo className="w-4 h-4"/> : <FileImage className="w-4 h-4"/>}
                       </div>
                       <div className="flex-1 min-w-0">
                         <div className="text-xs font-black truncate">{item.filename}</div>
                         <div className="text-[10px] text-zinc-500 font-bold uppercase">{item.size} • {item.status}</div>
                       </div>
                    </div>
                    {item.status === 'downloading' ? (
                      <div className="space-y-1.5">
                        <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.progress}%` }}
                            className="h-full bg-indigo-500"
                          />
                        </div>
                        <div className="text-[9px] font-black text-right text-indigo-500">{item.progress}% - 2.4 MB/s</div>
                      </div>
                    ) : (
                      <button className="w-full py-1.5 text-[10px] font-black uppercase tracking-tighter bg-zinc-200/50 hover:bg-indigo-500 hover:text-white rounded-lg transition-all">Open File</button>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-zinc-100">
                <button className="w-full py-3 bg-zinc-900 text-white rounded-xl font-bold text-sm tracking-tight hover:bg-black transition-all">View All History</button>
              </div>
            </motion.div>
          )}

          {showMenu && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className={`absolute right-4 top-4 w-64 rounded-3xl shadow-2xl border z-50 p-2 ${isIncognito ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}
            >
              <div className="grid grid-cols-3 gap-1 p-1">
                {/* Search Engine Settings Panel */}
                {showSearchSettings && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`absolute inset-0 z-[60] flex flex-col ${isIncognito ? 'bg-zinc-950' : 'bg-white'}`}
                  >
                    <div className="p-4 border-b flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Search className="w-5 h-5 text-indigo-500" />
                        <h3 className="font-bold">Search Engines</h3>
                      </div>
                      <button onClick={() => setShowSearchSettings(false)} className="p-1 hover:bg-zinc-100 rounded-full"><X className="w-5 h-5"/></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      <div className="space-y-3">
                        {searchEngines.map(engine => (
                          <div key={engine.id} className={`p-4 rounded-2xl border transition-all ${engine.isDefault ? 'border-indigo-500 bg-indigo-50/30' : 'border-zinc-100 bg-zinc-50/50'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="font-black text-sm">{engine.name}</div>
                                <div className="text-[10px] text-zinc-400 font-mono truncate max-w-[150px]">{engine.urlTemplate}</div>
                              </div>
                              <div className="flex items-center gap-1">
                                {!engine.isDefault && (
                                  <button 
                                    onClick={() => handleSetDefaultSearch(engine.id)}
                                    className="px-2 py-1 bg-white border border-zinc-200 rounded-lg text-[10px] font-bold hover:border-indigo-500 transition-colors"
                                  >
                                    Set Default
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleDeleteSearchEngine(engine.id)}
                                  className="p-2 hover:text-red-500 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            {engine.isDefault && (
                              <div className="text-[10px] font-black text-indigo-600 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> DEFAULT ENGINE
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-8 p-4 rounded-3xl border-2 border-dashed border-zinc-200">
                        <h4 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Plus className="w-4 h-4" /> Add Custom Engine
                        </h4>
                        <div className="space-y-4">
                          <input 
                            id="search-name"
                            type="text" 
                            placeholder="Name" 
                            className="w-full p-3 rounded-xl bg-zinc-100 border-none outline-none text-sm font-bold"
                          />
                          <input 
                            id="search-url"
                            type="text" 
                            placeholder="URL Template" 
                            className="w-full p-3 rounded-xl bg-zinc-100 border-none outline-none text-sm font-mono"
                          />
                          <button 
                            onClick={() => {
                              const nameInput = document.getElementById('search-name') as HTMLInputElement;
                              const urlInput = document.getElementById('search-url') as HTMLInputElement;
                              if (nameInput.value && urlInput.value) {
                                handleAddSearchEngine(nameInput.value, urlInput.value);
                                nameInput.value = '';
                                urlInput.value = '';
                              }
                            }}
                            className="w-full py-3 bg-zinc-900 text-white rounded-xl font-bold text-sm tracking-tight hover:bg-black transition-all"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {[
                  { icon: Ghost, label: 'Incognito', active: isIncognito, onClick: () => setIsIncognito(!isIncognito) },
                  { icon: Shield, label: 'Ad-Guard', active: adGuardEnabled, onClick: () => setAdGuardEnabled(!adGuardEnabled) },
                  { icon: HistoryIcon, label: 'History', onClick: () => {} },
                  { icon: BookmarkIcon, label: 'Bookmarks', onClick: () => {} },
                  { icon: Download, label: 'Downloads', onClick: () => setShowDownloads(true) },
                  { icon: Search, label: 'Engines', onClick: () => setShowSearchSettings(true) },
                  { icon: Smartphone, label: 'Desktop', onClick: () => {} },
                  { icon: Cpu, label: 'Data Save', active: false, onClick: () => {} },
                  { icon: Settings, label: 'Settings', onClick: () => {} },
                ].map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={() => { item.onClick(); if(item.label !== 'Downloads') setShowMenu(false); }}
                    className={`flex flex-col items-center p-3 rounded-2xl transition-all ${
                      item.active 
                        ? 'bg-indigo-500 text-white' 
                        : (isIncognito ? 'hover:bg-zinc-800 text-zinc-100' : 'hover:bg-zinc-100 text-zinc-900')
                    }`}
                  >
                    <item.icon className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
                  </button>
                ))}
              </div>
              <div className={`mt-2 pt-2 border-t flex flex-col gap-1 ${isIncognito ? 'border-zinc-800' : 'border-zinc-100'}`}>
                <button className="px-4 py-2 text-left text-xs font-bold hover:bg-zinc-100 rounded-xl transition-all mx-1 flex items-center justify-between">
                   Reading Mode <Layers className="w-3 h-3 opacity-40" />
                </button>
                <button className="px-4 py-2 text-left text-xs font-bold hover:bg-zinc-100 rounded-xl transition-all mx-1 flex items-center justify-between">
                   Desktop Side <LayoutGrid className="w-3 h-3 opacity-40" />
                </button>
                <button className="px-4 py-2 text-left text-xs font-bold hover:ring-2 hover:ring-indigo-500/10 rounded-xl transition-all mx-1 mt-2 text-indigo-500 bg-indigo-500/5">
                   Check for Updates
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- Mobile Bottom Navigation (Simulated Android Feel) --- */}
      <div className={`flex items-center justify-around h-16 border-t px-4 ${isIncognito ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
         <button className="p-3 transition-transform active:scale-90"><Menu className="w-6 h-6 opacity-60" /></button>
         <button className="p-3 transition-transform active:scale-90"><HistoryIcon className="w-5 h-5 opacity-40" /></button>
         <button 
           onClick={handleAddTab}
           className="relative group flex items-center justify-center"
         >
           <div className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center font-black text-sm group-hover:border-indigo-500 ${isIncognito ? 'border-zinc-700 bg-zinc-900 text-indigo-400' : 'border-zinc-400 bg-white text-zinc-900'}`}>
             {tabs.length}
           </div>
           <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-white rounded-full text-[10px] flex items-center justify-center font-black border-2 border-zinc-50">+</div>
         </button>
         <button className="p-3 transition-transform active:scale-90" onClick={() => setIsUrlFocused(true)}><Search className="w-5 h-5 opacity-40" /></button>
         <button className="p-3 transition-transform active:scale-90" onClick={() => setShowMenu(true)}><MoreVertical className="w-6 h-6 opacity-60" /></button>
      </div>

      {/* --- Floating "Source View" Button for AIDE/Java users --- */}
      <div className="fixed bottom-24 right-6 group">
        <div className="absolute bottom-full right-0 mb-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[10px] p-2 rounded-lg whitespace-nowrap shadow-xl">
           Java 7 Source for AIDE
        </div>
        <button className="w-14 h-14 bg-indigo-600 text-white rounded-3xl shadow-2xl flex items-center justify-center hover:bg-indigo-700 transition-all hover:scale-110 active:scale-95 group">
           <SearchCode className="w-7 h-7" />
        </button>
      </div>

    </div>
  );
}
