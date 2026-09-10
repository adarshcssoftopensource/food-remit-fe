"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="border-destructive/20 bg-destructive/5 flex min-h-[350px] w-full flex-col items-center justify-center rounded-2xl border p-6 text-center shadow-sm">
          <div className="bg-destructive/10 text-destructive mb-4 flex h-14 w-14 items-center justify-center rounded-full">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h2 className="text-foreground text-xl font-semibold tracking-tight">
            Something went wrong
          </h2>
          <p className="text-muted-foreground mt-2 max-w-md text-sm">
            An unexpected error occurred while loading this view. You can reload or try again.
          </p>
          {this.state.error?.message && (
            <p className="bg-muted/60 text-muted-foreground mt-2 max-w-md rounded px-3 py-1.5 font-mono text-xs break-words">
              {this.state.error.message}
            </p>
          )}
          <Button
            onClick={this.handleReset}
            className="mt-6 flex items-center gap-2"
            variant="default"
          >
            <RefreshCw className="h-4 w-4" />
            Reload Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
