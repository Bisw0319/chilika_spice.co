import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const ContentContext = createContext(null);

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = useCallback(async () => {
    try {
      const res = await api.getHomepageContent();
      if (res.success && res.content) {
        setContent(res.content);
      }
    } catch (err) {
      console.warn('Failed to fetch website content:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const updateContentLocally = (newContent) => {
    setContent(newContent);
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        loading,
        error,
        refreshContent: fetchContent,
        updateContentLocally
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    return {
      content: null,
      loading: false,
      refreshContent: () => {},
      updateContentLocally: () => {}
    };
  }
  return context;
};
