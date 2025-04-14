import React from "react";
import { AlertTriangleIcon, HomeIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // You can also log the error to an error reporting service here
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-12"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="mx-auto w-32 h-32 bg-red-50 rounded-full flex items-center justify-center mb-8"
            >
              <AlertTriangleIcon className="w-16 h-16 text-red-500" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-gray-900 mb-6 text-center"
            >
              Oops! Something went wrong
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2 mb-8 text-amber-600 bg-amber-50 rounded-lg p-4"
            >
              <AlertTriangleIcon className="w-5 h-5" />
              <p className="text-lg text-center">
                We've encountered an unexpected error
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 text-lg mb-10 text-center"
            >
              Don't worry! Our team has been notified. You can try refreshing the page or return to the home page.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Button
                onClick={this.handleRefresh}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto flex items-center gap-3"
              >
                <RefreshCwIcon className="w-5 h-5" />
                Try Again
              </Button>

              <Button
                onClick={this.handleGoHome}
                size="lg"
                className="w-full sm:w-auto flex items-center gap-3"
              >
                <HomeIcon className="w-5 h-5" />
                Go Home
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 pt-8 border-t border-gray-100 text-center"
            >
              <p className="text-base text-gray-500">
                If the problem persists, please contact our support team at{" "}
                <a href="mailto:support@arriveforvision.com" className="text-primary hover:underline">
                  support@arriveforvision.site
                </a>
              </p>
            </motion.div>

            {process.env.NODE_ENV === 'development' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-8 p-4 bg-gray-50 rounded-lg overflow-auto"
              >
                <details className="text-sm text-gray-700">
                  <summary className="cursor-pointer mb-2 font-medium">Error Details (Development Only)</summary>
                  <pre className="whitespace-pre-wrap">
                    {this.state.error && this.state.error.toString()}
                    <br />
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </details>
              </motion.div>
            )}
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
