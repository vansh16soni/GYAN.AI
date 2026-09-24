import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Gyan.AI Caught Render Error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#030a07] text-[#e1f5ec] select-none">
          <div className="max-w-md w-full rounded-3xl border border-emerald-500/40 bg-[#081c13]/95 p-8 shadow-2xl backdrop-blur-2xl text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-lg">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold font-display text-white mb-2">
              Neural Interface Safeguard
            </h2>
            <p className="text-xs text-emerald-200/70 mb-5 leading-relaxed">
              An unexpected render issue was safely intercepted. Your generated notes and synthesis archive remain completely safe.
            </p>
            {this.state.error && (
              <div className="mb-6 p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-[11px] font-mono text-rose-300 text-left overflow-x-auto max-h-24">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="btn-primary w-full text-xs font-bold py-2.5"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Recover Workspace</span>
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
