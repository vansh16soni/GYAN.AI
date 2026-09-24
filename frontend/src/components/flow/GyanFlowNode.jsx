import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  Cpu,
  Database,
  Sparkles,
  Workflow,
  Network,
  User,
  Layers,
  ArrowRightCircle,
  FileCode,
  Zap,
} from 'lucide-react';

const ICON_MAP = {
  user: User,
  cpu: Cpu,
  database: Database,
  sparkles: Sparkles,
  workflow: Workflow,
  network: Network,
  layers: Layers,
  code: FileCode,
  zap: Zap,
};

function GyanFlowNode({ data, selected, isConnectable = true }) {
  const {
    label = 'Neural Node',
    badge = 'PROCESS',
    icon = 'cpu',
    desc = '',
    nodeType = 'default',
  } = data || {};

  const IconComponent = ICON_MAP[icon] || Workflow;

  // Badge tone mapping with bioluminescent emerald / mint / teal palettes
  const getBadgeStyles = () => {
    switch (badge.toUpperCase()) {
      case 'INPUT SOURCE':
      case 'ENTRY':
        return 'bg-teal-500/15 text-teal-300 border-teal-500/30';
      case 'AI CORE':
      case 'SYNTHESIS':
      case 'TOPIC ROOT':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-[0_0_10px_rgba(16,185,129,0.25)]';
      case 'DATASTORE':
      case 'STORAGE':
        return 'bg-emerald-600/15 text-emerald-400 border-emerald-600/30';
      case 'OUTPUT':
      case 'INSIGHT':
        return 'bg-green-500/15 text-green-300 border-green-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-300/90 border-emerald-500/25';
    }
  };

  return (
    <div
      className={`group relative w-64 rounded-2xl border p-3.5 backdrop-blur-xl transition-all duration-300 cursor-pointer select-none ${
        selected
          ? 'border-emerald-400 ring-2 ring-emerald-400/50 bg-[#0c261b] shadow-[0_0_30px_rgba(16,185,129,0.4)] dark:bg-[#0c261b] light:bg-white light:border-emerald-600'
          : 'border-emerald-500/25 bg-[#081c13]/90 hover:border-emerald-400/70 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] dark:bg-[#081c13]/90 light:bg-[#eef8f2]/95 light:border-emerald-300'
      }`}
    >
      {/* Target Handles (Top for Vertical layout, Left for Horizontal layout) */}
      <Handle
        type="target"
        position={Position.Top}
        id="target-top"
        isConnectable={isConnectable}
        className="!w-2.5 !h-2.5 !bg-emerald-400 !border-2 !border-[#030a07] !rounded-full shadow-[0_0_8px_#10b981] transition-transform hover:!scale-150"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="target-left"
        isConnectable={isConnectable}
        className="!w-2.5 !h-2.5 !bg-emerald-400 !border-2 !border-[#030a07] !rounded-full shadow-[0_0_8px_#10b981] transition-transform hover:!scale-150"
      />

      {/* Source Handles (Bottom for Vertical layout, Right for Horizontal layout) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="source-bottom"
        isConnectable={isConnectable}
        className="!w-2.5 !h-2.5 !bg-emerald-400 !border-2 !border-[#030a07] !rounded-full shadow-[0_0_8px_#10b981] transition-transform hover:!scale-150"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="source-right"
        isConnectable={isConnectable}
        className="!w-2.5 !h-2.5 !bg-emerald-400 !border-2 !border-[#030a07] !rounded-full shadow-[0_0_8px_#10b981] transition-transform hover:!scale-150"
      />

      {/* Card Header: Icon & Badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-sm shadow-emerald-500/20 group-hover:scale-110 transition-transform">
            <IconComponent className="h-4 w-4" />
          </div>
          <span
            className={`truncate px-2 py-0.5 rounded-full border text-[10px] font-mono font-bold uppercase tracking-wider ${getBadgeStyles()}`}
          >
            {badge}
          </span>
        </div>

        {/* Pulse status indicator */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
        </div>
      </div>

      {/* Card Body: Title & Content Description */}
      <div className="space-y-1">
        <h4 className="text-xs font-bold font-display tracking-tight text-white dark:text-white light:text-emerald-950 leading-tight line-clamp-2">
          {label}
        </h4>
        {desc ? (
          <p className="text-[11px] text-emerald-200/70 dark:text-emerald-200/70 light:text-emerald-800/80 font-sans leading-relaxed line-clamp-2">
            {desc}
          </p>
        ) : (
          <p className="text-[10px] text-emerald-400/50 font-mono">
            node::{data?.rawId || 'active'}
          </p>
        )}
      </div>

      {/* Subtle Bottom Accent Glow Bar */}
      <div
        className={`mt-2.5 h-0.5 w-full rounded-full transition-all duration-300 ${
          selected
            ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 shadow-[0_0_10px_#10b981]'
            : 'bg-emerald-500/20 group-hover:bg-emerald-500/40'
        }`}
      />
    </div>
  );
}

export default memo(GyanFlowNode);
