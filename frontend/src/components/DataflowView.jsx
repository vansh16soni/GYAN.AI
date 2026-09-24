import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  Panel,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useTheme } from '../context/ThemeContext.jsx';
import GyanFlowNode from './flow/GyanFlowNode.jsx';
import {
  extractFlowFromNote,
  getDefaultSampleFlow,
  getLayoutedElements,
} from '../utils/flowParser.js';
import { fetchNote } from '../api.js';
import {
  Workflow,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  LayoutGrid,
  Columns,
  Rows,
  Layers,
  Info,
  X,
  FileText,
  ChevronDown,
  Maximize2,
  Share2,
  ExternalLink,
} from 'lucide-react';

const nodeTypes = {
  gyanNode: GyanFlowNode,
};

export default function DataflowView({
  activeNote = null,
  notes = [],
  onSelectNote = () => {},
  onBack = () => {},
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Layout orientation state ('TB' = Top to Bottom, 'LR' = Left to Right)
  const [direction, setDirection] = useState('TB');
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(() => {
    if (activeNote?._id) return activeNote._id;
    if (notes.length > 0) return notes[0]._id;
    return 'sample';
  });
  const [fetchedNote, setFetchedNote] = useState(activeNote?.content ? activeNote : null);
  const [sourceType, setSourceType] = useState('sample');

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Sync selectedNoteId when activeNote changes
  useEffect(() => {
    if (activeNote?._id) {
      setSelectedNoteId(activeNote._id);
      if (activeNote.content) {
        setFetchedNote(activeNote);
      }
    } else if (notes.length > 0 && selectedNoteId === 'sample') {
      setSelectedNoteId(notes[0]._id);
    }
  }, [activeNote, notes]);

  // Fetch full note content if current selectedNoteId does not have full content
  useEffect(() => {
    if (!selectedNoteId || selectedNoteId === 'sample') {
      setFetchedNote(null);
      return;
    }

    if (activeNote && activeNote._id === selectedNoteId && activeNote.content) {
      setFetchedNote(activeNote);
      return;
    }

    let isCancelled = false;
    fetchNote(selectedNoteId)
      .then((data) => {
        if (!isCancelled && data) {
          setFetchedNote(data);
        }
      })
      .catch((err) => {
        console.error('DataflowView fetch note error:', err);
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedNoteId, activeNote]);

  // Determine current active note data source (prioritizing full content)
  const currentNote = useMemo(() => {
    if (selectedNoteId === 'sample') return null;
    if (fetchedNote && fetchedNote._id === selectedNoteId && fetchedNote.content) {
      return fetchedNote;
    }
    if (activeNote && activeNote._id === selectedNoteId && activeNote.content) {
      return activeNote;
    }
    return notes.find((n) => n._id === selectedNoteId) || null;
  }, [selectedNoteId, fetchedNote, activeNote, notes]);

  // Generate and layout graph whenever currentNote or direction changes
  useEffect(() => {
    let rawFlow;
    if (currentNote) {
      rawFlow = extractFlowFromNote(currentNote.title, currentNote.content);
    } else {
      rawFlow = getDefaultSampleFlow();
    }

    setSourceType(rawFlow.source || 'default');
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      rawFlow.nodes,
      rawFlow.edges,
      direction
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    setSelectedNode(null);
  }, [currentNote, direction, setNodes, setEdges]);

  // Switch direction and re-layout
  const handleToggleDirection = useCallback(() => {
    const nextDir = direction === 'TB' ? 'LR' : 'TB';
    setDirection(nextDir);
  }, [direction]);

  // Handle clicking a node to show details in the Inspector Panel
  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Compute incoming and outgoing edges for the selected node
  const nodeConnections = useMemo(() => {
    if (!selectedNode) return { inbound: [], outbound: [] };
    const inbound = edges
      .filter((e) => e.target === selectedNode.id)
      .map((e) => ({
        edgeId: e.id,
        source: e.source,
        label: e.label || 'connected',
      }));
    const outbound = edges
      .filter((e) => e.source === selectedNode.id)
      .map((e) => ({
        edgeId: e.id,
        target: e.target,
        label: e.label || 'connected',
      }));
    return { inbound, outbound };
  }, [selectedNode, edges]);

  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden select-none">
      {/* Top Header / Action Bar */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b z-20 backdrop-blur-xl transition-colors duration-300 ${
          isDark
            ? 'border-emerald-900/60 bg-space-sidebar/95 text-slate-200'
            : 'border-emerald-200 bg-[#d8ece0]/95 text-emerald-950'
        }`}
      >
        {/* Left Side: Back button + Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className={`btn-secondary !p-2 !rounded-xl transition-transform active:scale-95`}
            title="Return to Tree Synthesis Notes"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 text-white shadow-md shadow-emerald-500/25">
              <Workflow className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold font-display tracking-tight leading-tight">
                  Interactive Dataflow Architecture
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-semibold">
                  <Sparkles className="h-3 w-3" />
                  React Flow
                </span>
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                {currentNote
                  ? `Active Note: ${currentNote.title}`
                  : 'Gyan.AI Neural Synthesis Architecture'}
              </p>
            </div>
          </div>
        </div>

        {/* Center / Right Controls: Source Note Selector & Layout Switcher */}
        <div className="flex items-center gap-2">
          {/* Note Switcher Dropdown */}
          <div className="relative">
            <select
              value={selectedNoteId}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedNoteId(val);
                if (val !== 'sample') {
                  onSelectNote(val);
                }
              }}
              className={`text-xs font-medium py-1.5 pl-3 pr-8 rounded-xl border outline-none appearance-none cursor-pointer transition ${
                isDark
                  ? 'bg-space-card border-emerald-900/80 text-white focus:border-emerald-500'
                  : 'bg-white border-emerald-200 text-emerald-950 focus:border-emerald-500 shadow-sm'
              }`}
            >
              <option value="sample">🌿 Gyan.AI Neural Pipeline (Sample)</option>
              {notes.map((n) => (
                <option key={n._id} value={n._id}>
                  📄 {n.title || n.input}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-emerald-500" />
          </div>

          {/* Orientation Switcher: Vertical (TB) vs Horizontal (LR) */}
          <button
            type="button"
            onClick={handleToggleDirection}
            className="btn-secondary !text-xs !py-1.5 !px-2.5 flex items-center gap-1.5 shadow-sm"
            title={`Switch to ${direction === 'TB' ? 'Horizontal (Left to Right)' : 'Vertical (Top to Bottom)'} layout`}
          >
            {direction === 'TB' ? (
              <>
                <Rows className="h-3.5 w-3.5 text-emerald-400" />
                <span className="hidden md:inline font-mono">Top-Down</span>
              </>
            ) : (
              <>
                <Columns className="h-3.5 w-3.5 text-emerald-400" />
                <span className="hidden md:inline font-mono">Left-Right</span>
              </>
            )}
          </button>

          {/* Source indicator pill */}
          <div
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-mono ${
              isDark
                ? 'bg-space-card/70 border-emerald-900/60 text-emerald-300'
                : 'bg-white/80 border-emerald-200 text-emerald-800'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {sourceType === 'mermaid'
                ? 'Parsed from Mermaid Diagram'
                : sourceType === 'json'
                ? 'Parsed from Flow JSON'
                : sourceType === 'concept'
                ? 'Synthesized from Note Headings'
                : 'Neural System Blueprint'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative flex-1 w-full h-full bg-[#030a07] dark:bg-[#030a07] light:bg-[#d8ece0]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          minZoom={0.2}
          maxZoom={2}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#10b981', strokeWidth: 2 },
          }}
          className="transition-opacity duration-300"
        >
          {/* Glowing Bioluminescent Grid Background */}
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1.5}
            color={isDark ? 'rgba(16, 185, 129, 0.22)' : 'rgba(16, 185, 129, 0.45)'}
          />

          {/* Themed Controls */}
          <Controls
            showInteractive={true}
            className={`!rounded-2xl !p-1 !border shadow-2xl overflow-hidden backdrop-blur-xl ${
              isDark
                ? '!bg-space-sidebar/90 !border-emerald-900/70 !fill-emerald-400 [&>button]:!border-emerald-900/50 [&>button]:!bg-space-card/70 [&>button]:!text-emerald-300 hover:[&>button]:!bg-emerald-800/40'
                : '!bg-white/95 !border-emerald-200 !fill-emerald-700 [&>button]:!border-emerald-100 [&>button]:!bg-emerald-50/70 [&>button]:!text-emerald-800 hover:[&>button]:!bg-emerald-100'
            }`}
          />

          {/* Themed MiniMap */}
          <MiniMap
            zoomable
            pannable
            nodeColor={(node) => {
              if (node.data?.badge === 'AI CORE') return '#10b981';
              if (node.data?.badge === 'INPUT SOURCE') return '#06b6d4';
              if (node.data?.badge === 'DATASTORE') return '#059669';
              if (node.data?.badge === 'OUTPUT') return '#34d399';
              return '#10b98188';
            }}
            maskColor={isDark ? 'rgba(3, 10, 7, 0.75)' : 'rgba(216, 236, 224, 0.75)'}
            className={`!rounded-2xl !border shadow-2xl backdrop-blur-md overflow-hidden ${
              isDark
                ? '!bg-space-sidebar/80 !border-emerald-900/70'
                : '!bg-white/90 !border-emerald-200'
            }`}
          />

          {/* Helpful Canvas Overlay Hint */}
          <Panel position="bottom-left" className="pointer-events-none">
            <div
              className={`rounded-xl px-3 py-1.5 border text-[11px] font-mono backdrop-blur-md shadow-lg ${
                isDark
                  ? 'bg-space-card/80 border-emerald-900/60 text-emerald-300/80'
                  : 'bg-white/90 border-emerald-200 text-emerald-800'
              }`}
            >
              💡 Drag canvas to pan · Scroll to zoom · Click node to inspect details
            </div>
          </Panel>
        </ReactFlow>

        {/* Selected Node Details Drawer / Inspector Panel */}
        {selectedNode && (
          <div
            className={`absolute bottom-5 right-5 z-30 w-80 max-w-[calc(100vw-2.5rem)] rounded-2xl border p-4 shadow-2xl backdrop-blur-2xl animate-fade-in-up transition-all ${
              isDark
                ? 'border-emerald-500/40 bg-space-sidebar/95 text-slate-200 shadow-[0_0_35px_rgba(16,185,129,0.3)]'
                : 'border-emerald-300 bg-white/95 text-emerald-950 shadow-xl'
            }`}
          >
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-emerald-900/40 dark:border-emerald-900/40 light:border-emerald-200">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-emerald-400" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                  Node Inspector
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="rounded-lg p-1 hover:bg-emerald-500/20 text-emerald-400 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-wider">
                  Title
                </span>
                <p className="text-sm font-bold font-display text-white dark:text-white light:text-emerald-950">
                  {selectedNode.data?.label || selectedNode.id}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-wider">
                  Type / Badge:
                </span>
                <span className="px-2 py-0.5 rounded-full border border-emerald-400/40 bg-emerald-500/15 text-emerald-300 text-[10px] font-mono font-bold">
                  {selectedNode.data?.badge || 'PROCESS'}
                </span>
              </div>

              {selectedNode.data?.desc && (
                <div>
                  <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-wider">
                    Description & Context
                  </span>
                  <p className="text-xs text-emerald-200/80 dark:text-emerald-200/80 light:text-emerald-800 leading-relaxed mt-0.5">
                    {selectedNode.data.desc}
                  </p>
                </div>
              )}

              {/* Connections Breakdown */}
              <div className="pt-2 border-t border-emerald-900/30 dark:border-emerald-900/30 light:border-emerald-100">
                <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-wider block mb-1">
                  Active Connections
                </span>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div
                    className={`p-2 rounded-xl border ${
                      isDark
                        ? 'bg-space-card border-emerald-900/50'
                        : 'bg-emerald-50 border-emerald-200'
                    }`}
                  >
                    <span className="text-base font-bold font-mono text-emerald-400">
                      {nodeConnections.inbound.length}
                    </span>
                    <span className="block text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                      Inbound
                    </span>
                  </div>
                  <div
                    className={`p-2 rounded-xl border ${
                      isDark
                        ? 'bg-space-card border-emerald-900/50'
                        : 'bg-emerald-50 border-emerald-200'
                    }`}
                  >
                    <span className="text-base font-bold font-mono text-emerald-400">
                      {nodeConnections.outbound.length}
                    </span>
                    <span className="block text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                      Outbound
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-1 text-[10px] font-mono text-emerald-500/60 truncate">
                Internal ID: {selectedNode.id}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
