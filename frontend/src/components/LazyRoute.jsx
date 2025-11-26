import React, { Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';
import ErrorBoundary from './ErrorBoundary';

// کامپوننت برای lazy loading صفحات
const LazyRoute = ({ 
  component: Component, 
  fallback = <LoadingSpinner size="large" />,
  errorFallback = null,
  ...props 
}) => {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

// HOC برای lazy loading کامپوننت‌ها
export const withLazyLoading = (importFunc, options = {}) => {
  const LazyComponent = React.lazy(importFunc);
  
  return function LazyWrapper(props) {
    return (
      <LazyRoute 
        component={LazyComponent} 
        {...options}
        {...props} 
      />
    );
  };
};

export default LazyRoute;