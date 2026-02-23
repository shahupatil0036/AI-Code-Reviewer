import React, { useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useReview } from '../../context/ReviewContext';
import { useTheme } from '../../context/ThemeContext';
import type { Language } from '../../types';

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

    // Initialize code with default sample when language changes or on first mount
    useEffect(() => {
        if (!state.code) {
            setCode(defaultCode[state.language]);
        }
    }, [state.language, setCode]);

    const handleEditorChange = (value: string | undefined) => {
        setCode(value || '');
    };

    return (
        <div className="glass-card overflow-hidden" style={{ minHeight: '400px' }}>
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-danger/70" />
                        <span className="w-3 h-3 rounded-full bg-warning/70" />
                        <span className="w-3 h-3 rounded-full bg-success/70" />
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
