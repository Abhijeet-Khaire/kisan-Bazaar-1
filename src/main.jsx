import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

// Patch Node.prototype.removeChild and Node.prototype.insertBefore to prevent
// DOM crashes (NotFoundError: Failed to execute 'removeChild' on 'Node')
// caused by external DOM manipulators such as Google Translate or browser extensions.
if (typeof window !== "undefined" && typeof Node === "function" && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (child) {
    if (child.parentNode !== this) {
      if (console && console.warn) {
        console.warn("Node.removeChild patched: child is not a direct child of parent, cleaning up safely", child, this);
      }
      if (child.parentNode) {
        child.parentNode.removeChild(child);
      }
      return child;
    }
    return originalRemoveChild.apply(this, arguments);
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (console && console.warn) {
        console.warn("Node.insertBefore patched: referenceNode is not a child of parent, appending to parent", referenceNode, this);
      }
      if (referenceNode.parentNode) {
        return referenceNode.parentNode.insertBefore(newNode, referenceNode);
      }
      return this.appendChild(newNode);
    }
    return originalInsertBefore.apply(this, arguments);
  };
}

// Import App - if this import fails, the script dies here.
import App from "./App";

console.log("Debug: App module imported successfully");

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: 20, color: 'red', border: '2px solid red', margin: 20 }}>
                    <h1>Something went wrong in the App component.</h1>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

const rootElement = document.getElementById("root");
if (rootElement) {
    const root = createRoot(rootElement);
    console.log("Debug: Attempting to render App via ErrorBoundary");
    root.render(
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    );
}
