import dagre from 'dagre';

/**
 * Clean and unescape markdown content if needed
 */
function cleanContent(raw) {
  if (!raw) return '';
  let text = raw.trim();
  if (text.startsWith('{') && text.endsWith('}')) {
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed.content === 'string') text = parsed.content;
    } catch {}
  }
  return text
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"');
}

/**
 * Apply Dagre graph auto-layout to nodes and edges
 * @param {Array} nodes
 * @param {Array} edges
 * @param {'TB' | 'LR'} direction - 'TB' (Top-to-Bottom) or 'LR' (Left-to-Right)
 */
export function getLayoutedElements(nodes, edges, direction = 'TB') {
  if (!nodes || nodes.length === 0) return { nodes: [], edges: [] };

  const isHorizontal = direction === 'LR';
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: isHorizontal ? 50 : 60,
    ranksep: isHorizontal ? 100 : 80,
    marginx: 40,
    marginy: 40,
  });

  const nodeWidth = 240;
  const nodeHeight = 90;

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  const validNodeIds = new Set(nodes.map((n) => n.id));
  const safeEdges = (edges || []).filter(
    (edge) => edge && edge.source && edge.target && validNodeIds.has(edge.source) && validNodeIds.has(edge.target)
  );

  safeEdges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const x = nodeWithPosition ? nodeWithPosition.x - nodeWidth / 2 : 0;
    const y = nodeWithPosition ? nodeWithPosition.y - nodeHeight / 2 : 0;

    return {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: { x, y },
    };
  });

  const layoutedEdges = safeEdges.map((edge, idx) => ({
    ...edge,
    id: edge.id || `e-${edge.source}-${edge.target}-${idx}`,
    type: 'smoothstep',
    animated: true,
    sourceHandle: isHorizontal ? 'source-right' : 'source-bottom',
    targetHandle: isHorizontal ? 'target-left' : 'target-top',
    style: {
      stroke: '#10b981',
      strokeWidth: 2,
      strokeDasharray: '5, 5',
    },
    labelStyle: {
      fill: '#a7f3d0',
      fontWeight: 600,
      fontSize: 10,
      fontFamily: 'monospace',
    },
    labelBgStyle: {
      fill: '#081c13',
      fillOpacity: 0.9,
      stroke: 'rgba(16, 185, 129, 0.4)',
      strokeWidth: 1,
      rx: 6,
      ry: 6,
    },
    labelBgPadding: [6, 4],
  }));

  return { nodes: layoutedNodes, edges: layoutedEdges };
}

/**
 * Parse a Mermaid diagram definition string into React Flow nodes & edges
 */
export function parseMermaidToFlow(mermaidCode) {
  const lines = mermaidCode
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('%%'));

  const nodesMap = new Map();
  const edges = [];

  // Helper to register node
  function addNode(rawId, rawLabel, shape = 'box') {
    const id = rawId.trim();
    if (!id) return;

    let label = (rawLabel || id).trim();
    // remove quotes if wrapped
    if ((label.startsWith('"') && label.endsWith('"')) || (label.startsWith("'") && label.endsWith("'"))) {
      label = label.slice(1, -1);
    }

    if (!nodesMap.has(id)) {
      let type = 'default';
      let badge = 'PROCESS';
      let icon = 'workflow';

      if (id.toLowerCase().includes('client') || id.toLowerCase().includes('user') || id.toLowerCase().includes('input')) {
        type = 'input';
        badge = 'ENTRY';
        icon = 'user';
      } else if (id.toLowerCase().includes('db') || id.toLowerCase().includes('database') || id.toLowerCase().includes('store')) {
        badge = 'DATASTORE';
        icon = 'database';
      } else if (id.toLowerCase().includes('out') || id.toLowerCase().includes('response') || id.toLowerCase().includes('result')) {
        type = 'output';
        badge = 'OUTPUT';
        icon = 'sparkles';
      } else if (id.toLowerCase().includes('api') || id.toLowerCase().includes('gateway') || id.toLowerCase().includes('server')) {
        badge = 'SERVICE';
        icon = 'cpu';
      }

      nodesMap.set(id, {
        id,
        type: 'gyanNode',
        data: {
          label,
          rawId: id,
          nodeType: type,
          badge,
          icon,
          shape,
        },
      });
    }
  }

  // Regex for nodes with labels like A[Client Request], B(Processing), C[(Database)]
  const nodeDefRegex = /([a-zA-Z0-9_-]+)\s*(?:\[\s*([^\]]+?)\s*\]|\(\s*([^)]+?)\s*\)|\{\s*([^}]+?)\s*\}|\[\(\s*([^)]+?)\s*\)\])/g;

  // First pass: extract all defined nodes
  for (const line of lines) {
    if (line.startsWith('graph') || line.startsWith('flowchart') || line.startsWith('subgraph') || line.startsWith('end')) {
      continue;
    }

    let match;
    while ((match = nodeDefRegex.exec(line)) !== null) {
      const id = match[1];
      const label = match[2] || match[3] || match[4] || match[5] || id;
      addNode(id, label);
    }
  }

  // Second pass: extract relationships / connections
  // Matches A --> B, A -->|label| B, A -.-> B, A ==> B, A -- label --> B
  const edgeRegex = /([a-zA-Z0-9_-]+)\s*(?:\[[^\]]*\]|\([^)]*\))?\s*(?:--\s*\|([^|]+)\|\s*-->|-->\s*\|([^|]+)\|\s*|--\s*([^->\s]+)\s*-->|-->|-\.->|==>)\s*([a-zA-Z0-9_-]+)/g;

  for (const line of lines) {
    if (line.startsWith('graph') || line.startsWith('flowchart') || line.startsWith('subgraph') || line.startsWith('end')) {
      continue;
    }

    let match;
    while ((match = edgeRegex.exec(line)) !== null) {
      const source = match[1].trim();
      const edgeLabel = (match[2] || match[3] || match[4] || '').trim();
      const target = match[5].trim();

      addNode(source, source);
      addNode(target, target);

      edges.push({
        id: `e-${source}-${target}-${edges.length}`,
        source,
        target,
        label: edgeLabel || undefined,
      });
    }
  }

  // If simple sequence diagram format:
  if (edges.length === 0 && (lines[0]?.includes('sequenceDiagram') || mermaidCode.includes('->>'))) {
    lines.forEach((line) => {
      const seqMatch = line.match(/([a-zA-Z0-9_-]+)\s*->>\s*([a-zA-Z0-9_-]+)\s*:\s*(.*)/);
      if (seqMatch) {
        const source = seqMatch[1].trim();
        const target = seqMatch[2].trim();
        const label = seqMatch[3].trim();
        addNode(source, source);
        addNode(target, target);
        edges.push({
          id: `e-${source}-${target}-${edges.length}`,
          source,
          target,
          label,
        });
      }
    });
  }

  const nodes = Array.from(nodesMap.values());
  return { nodes, edges };
}

/**
 * Generate a rich conceptual architecture graph from markdown content structure
 */
export function parseMarkdownToConceptFlow(title, content) {
  const nodes = [];
  const edges = [];
  const cleanTitle = (title || 'Synthesized Concept').trim();

  const rootId = 'node-root';
  nodes.push({
    id: rootId,
    type: 'gyanNode',
    data: {
      label: cleanTitle,
      badge: 'TOPIC ROOT',
      icon: 'sparkles',
      nodeType: 'input',
      desc: `Core subject: ${cleanTitle}`,
    },
  });

  const rawText = cleanContent(content);
  const lines = rawText.split('\n').map((l) => l.trim());

  const sections = [];
  let currentSection = null;

  for (const line of lines) {
    if (!line) continue;

    // Detect Markdown Headings (# Heading, ## Heading, ### Heading)
    const headingMatch = line.match(/^#{1,4}\s+(.+)$/);
    if (headingMatch) {
      const hText = headingMatch[1].replace(/[*_`#]/g, '').trim();
      // Skip diagram code block markers or redundant title
      if (!hText.toLowerCase().includes('mermaid') && !hText.toLowerCase().includes('diagram') && hText !== cleanTitle) {
        currentSection = { title: hText, points: [] };
        sections.push(currentSection);
      }
      continue;
    }

    // Detect Bullet Points or Numbered Lists
    const bulletMatch = line.match(/^(?:[-*+]|\d+\.)\s+(.+)$/);
    if (bulletMatch && currentSection) {
      const pText = bulletMatch[1].replace(/[*_`]/g, '').trim();
      if (pText.length > 3 && currentSection.points.length < 3) {
        currentSection.points.push(pText);
      }
      continue;
    }

    // Detect bold terms (e.g., **State**: description)
    const boldTermMatch = line.match(/^\*\*([^*]+)\*\*[:\s]+(.+)$/);
    if (boldTermMatch && currentSection && currentSection.points.length < 3) {
      currentSection.points.push(`${boldTermMatch[1]}: ${boldTermMatch[2]}`);
    }
  }

  // If no sections were detected from headings, split by paragraphs
  if (sections.length === 0) {
    const paragraphs = rawText
      .split(/\n\s*\n/)
      .map((p) => p.replace(/[*_`#]/g, '').trim())
      .filter((p) => p.length > 20 && !p.startsWith('```'));

    paragraphs.slice(0, 4).forEach((para, idx) => {
      const firstSentence = para.split(/[.!?]\s+/)[0] || para;
      sections.push({
        title: firstSentence.length > 40 ? firstSentence.slice(0, 38) + '...' : firstSentence,
        points: [para.length > 70 ? para.slice(0, 68) + '...' : para],
      });
    });
  }

  // Use up to 5 main sections
  const selectedSections = sections.slice(0, 5);

  selectedSections.forEach((sec, idx) => {
    const secId = `section-${idx + 1}`;
    nodes.push({
      id: secId,
      type: 'gyanNode',
      data: {
        label: sec.title,
        badge: `MODULE 0${idx + 1}`,
        icon: idx % 2 === 0 ? 'cpu' : 'workflow',
        nodeType: 'default',
        desc: sec.points[0] || 'Core structural module',
      },
    });

    edges.push({
      id: `e-root-${secId}`,
      source: rootId,
      target: secId,
      label: `branch 0${idx + 1}`,
    });

    sec.points.slice(1, 3).forEach((point, pIdx) => {
      const pointId = `point-${idx + 1}-${pIdx + 1}`;
      nodes.push({
        id: pointId,
        type: 'gyanNode',
        data: {
          label: point.length > 36 ? point.slice(0, 33) + '...' : point,
          badge: 'INSIGHT',
          icon: 'database',
          nodeType: 'output',
          desc: point,
        },
      });

      edges.push({
        id: `e-${secId}-${pointId}`,
        source: secId,
        target: pointId,
      });
    });
  });

  return { nodes, edges };
}

/**
 * High-level extractor: extracts interactive flow from any note content
 */
export function extractFlowFromNote(title, content) {
  const text = cleanContent(content);

  // 1. Check for explicit ```flow or ```dataflow JSON
  const flowJsonMatch = text.match(/```(?:flow|dataflow)\s*([\s\S]*?)\s*```/);
  if (flowJsonMatch) {
    try {
      const parsed = JSON.parse(flowJsonMatch[1]);
      if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
        const formattedNodes = parsed.nodes.map((n) => ({
          ...n,
          type: 'gyanNode',
          data: {
            label: n.data?.label || n.label || n.id,
            badge: n.data?.badge || n.badge || 'NODE',
            icon: n.data?.icon || n.icon || 'cpu',
            desc: n.data?.desc || n.desc || '',
            nodeType: n.type || 'default',
          },
        }));
        return { nodes: formattedNodes, edges: parsed.edges, source: 'json' };
      }
    } catch {}
  }

  // 2. Check for Mermaid codeblock (with or without ```mermaid fence)
  const mermaidMatch =
    text.match(/```(?:mermaid)?\s*([\s\S]*?)\s*```/i) ||
    text.match(/(?:flowchart|graph)\s+(?:TD|TB|LR|RL|BT)[\s\S]*?(?=\n#{1,3}\s|\n```|$)/i) ||
    text.match(/sequenceDiagram[\s\S]*?(?=\n#{1,3}\s|\n```|$)/i);

  if (mermaidMatch) {
    const rawCode = mermaidMatch[1] || mermaidMatch[0];
    if (rawCode.includes('-->') || rawCode.includes('->>') || rawCode.includes('graph') || rawCode.includes('flowchart')) {
      const { nodes, edges } = parseMermaidToFlow(rawCode);
      if (nodes.length > 1) {
        return { nodes, edges, source: 'mermaid' };
      }
    }
  }

  // 3. Synthesize structural concept tree from the note's headings & content
  const { nodes, edges } = parseMarkdownToConceptFlow(title, text);
  return { nodes, edges, source: 'concept' };
}

/**
 * Default sample dataflow demonstrating Gyan.AI neural pipeline
 */
export function getDefaultSampleFlow() {
  const nodes = [
    {
      id: 'client',
      type: 'gyanNode',
      data: {
        label: 'Client Prompt / URL',
        badge: 'INPUT SOURCE',
        icon: 'user',
        nodeType: 'input',
        desc: 'YouTube video link, topic query, or lecture concept',
      },
    },
    {
      id: 'extract',
      type: 'gyanNode',
      data: {
        label: 'Transcript Extraction',
        badge: 'PRE-PROCESSOR',
        icon: 'workflow',
        nodeType: 'default',
        desc: 'YouTube transcript API & metadata parser',
      },
    },
    {
      id: 'llm',
      type: 'gyanNode',
      data: {
        label: 'Gyan Neural Synthesis Engine',
        badge: 'AI CORE',
        icon: 'cpu',
        nodeType: 'default',
        desc: 'Multi-tiered prompt builder & structured extraction',
      },
    },
    {
      id: 'tree',
      type: 'gyanNode',
      data: {
        label: '3D Forest Canvas',
        badge: 'VISUAL CORE',
        icon: 'sparkles',
        nodeType: 'default',
        desc: 'Three.js interactive bioluminescent knowledge tree',
      },
    },
    {
      id: 'dataflow',
      type: 'gyanNode',
      data: {
        label: 'Interactive Dataflow Graph',
        badge: 'REACT FLOW',
        icon: 'network',
        nodeType: 'output',
        desc: 'Dynamic 2D draggable architecture graph with Dagre layout',
      },
    },
    {
      id: 'export',
      type: 'gyanNode',
      data: {
        label: 'Multi-Format Export',
        badge: 'STORAGE',
        icon: 'database',
        nodeType: 'output',
        desc: 'PDF, Word, Markdown, and Obsidian export formats',
      },
    },
  ];

  const edges = [
    { id: 'e1', source: 'client', target: 'extract', label: 'Raw URL' },
    { id: 'e2', source: 'extract', target: 'llm', label: 'Cleaned Captions' },
    { id: 'e3', source: 'llm', target: 'tree', label: 'Neural Branches' },
    { id: 'e4', source: 'llm', target: 'dataflow', label: 'Flow Pipeline' },
    { id: 'e5', source: 'llm', target: 'export', label: 'Formatted Notes' },
  ];

  return { nodes, edges, source: 'sample' };
}
