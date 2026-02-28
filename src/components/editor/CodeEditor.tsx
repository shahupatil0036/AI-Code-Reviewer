import React, { useEffect, useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { useReview } from '../../context/ReviewContext';
import { useTheme } from '../../context/ThemeContext';
import type { Language } from '../../types';
import { Upload } from 'lucide-react';

const languageMap: Record<Language, string> = {
    javascript: 'javascript',
    typescript: 'typescript',
    python: 'python',
    java: 'java',
    kotlin: 'kotlin',
};

const defaultCode: Record<Language, string> = {
    javascript: `// Paste your JavaScript code here
function processData(data) {
  let result = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i] != null) {
      result.push(data[i].value);
    }
  }
  return result;
}`,
    typescript: `// Paste your TypeScript code here
interface DataItem {
  id: string;
  value: number;
}

function processData(data: DataItem[]): number[] {
  let result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i] != null) {
      result.push(data[i].value);
    }
  }
  return result;
}`,
    python: `# Paste your Python code here
def process_data(data):
    result = []
    for item in data:
        if item is not None:
            result.append(item['value'])
    return result`,
    java: `// Paste your Java code here
public class DataProcessor {
    public List<Integer> processData(List<DataItem> data) {
        List<Integer> result = new ArrayList<>();
        for (int i = 0; i < data.size(); i++) {
            if (data.get(i) != null) {
                result.add(data.get(i).getValue());
            }
        }
        return result;
    }
}`,
    kotlin: `// Paste your Kotlin code here
fun processData(data: List<DataItem?>): List<Int> {
    val result = mutableListOf<Int>()
    for (item in data) {
        if (item != null) {
            result.add(item.value)
        }
    }
    return result
}`,
};

const CodeEditor: React.FC = () => {
    const { state, setCode } = useReview();
    const { isDark } = useTheme();
    const [isDragging, setIsDragging] = useState(false);

    // Initialize code with default sample when language changes or on first mount
    useEffect(() => {
        if (!state.code) {
            setCode(defaultCode[state.language]);
        }
    }, [state.language, state.code, setCode]);

    const handleEditorChange = (value: string | undefined) => {
        setCode(value || '');
    };

    // Drag-and-drop handlers
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                // Only accept text-like files
                if (file.size > 500000) return; // 500KB limit
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const text = ev.target?.result;
                    if (typeof text === 'string') {
                        setCode(text);
                    }
                };
                reader.readAsText(file);
            }
        },
        [setCode]
    );

    return (
        <div
            className="glass-card overflow-hidden relative"
            style={{ minHeight: '400px' }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Drag overlay */}
            {isDragging && (
                <div className="file-drop-zone">
                    <div className="text-center">
                        <Upload size={32} className="mx-auto mb-2 text-primary-light" />
                        <p className="text-sm font-medium text-primary-light">Drop file to import code</p>
                        <p className="text-xs text-text-muted mt-1">Supports any text file</p>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-danger/70 transition-colors hover:bg-danger" />
                        <span className="w-3 h-3 rounded-full bg-warning/70 transition-colors hover:bg-warning" />
                        <span className="w-3 h-3 rounded-full bg-success/70 transition-colors hover:bg-success" />
                    </div>
                    <span className="text-xs text-text-muted ml-2 font-mono">
                        {state.language}.code
                    </span>
                </div>
                <span className="text-xs text-text-muted">
                    {state.code.split('\n').length} lines
                </span>
            </div>
            <Editor
                height="400px"
                language={languageMap[state.language]}
                value={state.code || defaultCode[state.language]}
                onChange={handleEditorChange}
                theme={isDark ? 'vs-dark' : 'light'}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 12, bottom: 12 },
                    roundedSelection: true,
                    cursorBlinking: 'smooth',
                    cursorSmoothCaretAnimation: 'on',
                    smoothScrolling: true,
                    renderLineHighlight: 'gutter',
                    bracketPairColorization: { enabled: true },
                    tabSize: 2,
                }}
            />
        </div>
    );
};

export default CodeEditor;
