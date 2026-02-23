import React, { createContext, useContext, useReducer, useCallback, useRef } from 'react';
import type {
    ReviewState,
    ReviewActionType,
    Language,
    ReviewType,
    ReviewResult,
    AggregatedResult,
} from '../types';
import { submitReview } from '../services/api';

const initialState: ReviewState = {
    loading: false,
    language: 'javascript',
    reviewType: 'full_review',
    code: '',
    openaiResult: null,
    claudeResult: null,
    aggregatedResult: null,
    error: null,
};

function reviewReducer(state: ReviewState, action: ReviewActionType): ReviewState {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_LANGUAGE':
            return { ...state, language: action.payload };
        case 'SET_REVIEW_TYPE':
            return { ...state, reviewType: action.payload };
        case 'SET_CODE':
            return { ...state, code: action.payload };
        case 'SET_OPENAI_RESULT':
            return { ...state, openaiResult: action.payload };
        case 'SET_CLAUDE_RESULT':
            return { ...state, claudeResult: action.payload };
        case 'SET_AGGREGATED_RESULT':
            return { ...state, aggregatedResult: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'CLEAR_RESULTS':
            return {
                ...state,
                openaiResult: null,
                claudeResult: null,
                aggregatedResult: null,
                error: null,
                code: '',
            };
        default:
            return state;
    }
}

interface ReviewContextValue {
    state: ReviewState;
    setLanguage: (lang: Language) => void;
    setReviewType: (type: ReviewType) => void;
    setCode: (code: string) => void;
    analyzeCode: () => Promise<void>;
    clearResults: () => void;
    setResults: (
        openai: ReviewResult,
        claude: ReviewResult,
        aggregated: AggregatedResult
    ) => void;
}

const ReviewContext = createContext<ReviewContextValue | undefined>(undefined);

export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(reviewReducer, initialState);

    const setLanguage = useCallback((lang: Language) => {
        dispatch({ type: 'SET_LANGUAGE', payload: lang });
    }, []);

    const setReviewType = useCallback((type: ReviewType) => {
        dispatch({ type: 'SET_REVIEW_TYPE', payload: type });
    }, []);

    const setCode = useCallback((code: string) => {
        dispatch({ type: 'SET_CODE', payload: code });
    }, []);

    const clearResults = useCallback(() => {
        dispatch({ type: 'CLEAR_RESULTS' });
    }, []);

    const setResults = useCallback(
        (openai: ReviewResult, claude: ReviewResult, aggregated: AggregatedResult) => {
            dispatch({ type: 'SET_OPENAI_RESULT', payload: openai });
            dispatch({ type: 'SET_CLAUDE_RESULT', payload: claude });
            dispatch({ type: 'SET_AGGREGATED_RESULT', payload: aggregated });
        },
        []
    );

    // Keep a ref to the latest state for the analyzeCode callback
    const stateRef = useRef(state);
    stateRef.current = state;

    // AbortController ref for cancelling in-flight requests
    const abortRef = useRef<AbortController | null>(null);

    const analyzeCode = useCallback(async () => {
        // Cancel any previous in-flight request
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        dispatch({ type: 'SET_ERROR', payload: null });
        dispatch({ type: 'SET_LOADING', payload: true });

        try {
            const { code, language, reviewType } = stateRef.current;
            const result = await submitReview(
                {
                    code,
                    language,
                    review_type: reviewType,
                },
                controller.signal
            );

            dispatch({ type: 'SET_OPENAI_RESULT', payload: result.openaiResult });
            dispatch({ type: 'SET_CLAUDE_RESULT', payload: result.claudeResult });
            dispatch({ type: 'SET_AGGREGATED_RESULT', payload: result.aggregatedResult });
        } catch (err) {
            // Ignore abort errors (user cancelled or started a new request)
            if (err instanceof DOMException && err.name === 'AbortError') return;
            const message = err instanceof Error ? err.message : 'An unexpected error occurred';
            dispatch({ type: 'SET_ERROR', payload: message });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    return (
        <ReviewContext.Provider
            value={{
                state,
                setLanguage,
                setReviewType,
                setCode,
                analyzeCode,
                clearResults,
                setResults,
            }}
        >
            {children}
        </ReviewContext.Provider>
    );
};

export const useReview = (): ReviewContextValue => {
    const context = useContext(ReviewContext);
    if (!context) {
        throw new Error('useReview must be used within a ReviewProvider');
    }
    return context;
};
