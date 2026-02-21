import type { ReviewPayload, ReviewResult, AggregatedResult } from '../types';

const generateMockBugs = (language: string) => [
    {
        id: 'bug-1',
        line: 12,
        severity: 'critical' as const,
        message: `Potential null reference error in ${language} code at line 12`,
        suggestion: 'Add null check before accessing object properties',
    },
    {
        id: 'bug-2',
        line: 25,
        severity: 'warning' as const,
        message: 'Unused variable declaration may cause memory overhead',
        suggestion: 'Remove unused variable or use underscore prefix',
    },
    {
        id: 'bug-3',
        line: 38,
        severity: 'info' as const,
        message: 'Consider using const instead of let for immutable values',
        suggestion: 'Replace let with const for variables that are not reassigned',
    },
];

const generateMockSecurity = () => [
    {
        id: 'sec-1',
        type: 'Injection',
        severity: 'high' as const,
        description: 'Potential SQL/NoSQL injection vulnerability detected',
        recommendation: 'Use parameterized queries or prepared statements',
    },
    {
        id: 'sec-2',
        type: 'XSS',
        severity: 'medium' as const,
        description: 'Unsanitized user input rendered in DOM',
        recommendation: 'Apply proper input sanitization and output encoding',
    },
];

const generateMockPerformance = () => [
    {
        id: 'perf-1',
        area: 'Memory',
        impact: 'high' as const,
        description: 'Large array created inside loop causing excessive memory allocation',
        suggestion: 'Move array initialization outside the loop or use streaming',
    },
    {
        id: 'perf-2',
        area: 'Complexity',
        impact: 'medium' as const,
        description: 'Nested loops resulting in O(n²) time complexity',
        suggestion: 'Consider using a hash map for O(n) lookup',
    },
    {
        id: 'perf-3',
        area: 'I/O',
        impact: 'low' as const,
        description: 'Synchronous file operations blocking the event loop',
        suggestion: 'Use async/await with non-blocking I/O operations',
    },
];

const generateRefactoredCode = (language: string): string => {
    const samples: Record<string, string> = {
        javascript: `// Refactored code with improvements
function processData(items) {
  if (!items?.length) {
    return { data: [], error: null };
  }

  const results = items
    .filter(item => item != null && item.isValid)
    .map(item => ({
      ...item,
      processed: true,
      timestamp: Date.now(),
    }));

  return { data: results, error: null };
}`,
        typescript: `// Refactored code with type safety
interface DataItem {
  id: string;
  isValid: boolean;
  processed?: boolean;
  timestamp?: number;
}

function processData(items: DataItem[] | null): { data: DataItem[]; error: string | null } {
  if (!items?.length) {
    return { data: [], error: null };
  }

  const results = items
    .filter((item): item is DataItem => item != null && item.isValid)
    .map(item => ({
      ...item,
      processed: true,
      timestamp: Date.now(),
    }));

  return { data: results, error: null };
}`,
        python: `# Refactored code with improvements
from typing import Optional, List, Dict, Any

def process_data(items: Optional[List[Dict[str, Any]]]) -> Dict[str, Any]:
    if not items:
        return {"data": [], "error": None}

    results = [
        {**item, "processed": True}
        for item in items
        if item is not None and item.get("is_valid")
    ]

    return {"data": results, "error": None}`,
        java: `// Refactored code with null safety
public class DataProcessor {
    public ProcessResult processData(List<DataItem> items) {
        if (items == null || items.isEmpty()) {
            return new ProcessResult(Collections.emptyList(), null);
        }

        List<DataItem> results = items.stream()
            .filter(Objects::nonNull)
            .filter(DataItem::isValid)
            .map(item -> item.withProcessed(true))
            .collect(Collectors.toList());

        return new ProcessResult(results, null);
    }
}`,
        kotlin: `// Refactored code with Kotlin idioms
data class DataItem(
    val id: String,
    val isValid: Boolean,
    val processed: Boolean = false
)

fun processData(items: List<DataItem>?): Result<List<DataItem>> {
    if (items.isNullOrEmpty()) {
        return Result.success(emptyList())
    }

    val results = items
        .filter { it.isValid }
        .map { it.copy(processed = true) }

    return Result.success(results)
}`,
    };

    return samples[language] || samples.javascript;
};

const simulateDelay = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

const generateModelResult = (language: string): ReviewResult => ({
    bugs: generateMockBugs(language),
    security_issues: generateMockSecurity(),
    performance_issues: generateMockPerformance(),
    refactored_code: generateRefactoredCode(language),
    score: Math.floor(Math.random() * 3) + 6,
    confidence: (['High', 'Medium'] as const)[Math.floor(Math.random() * 2)],
});

const generateAggregatedResult = (
    openai: ReviewResult,
    claude: ReviewResult
): AggregatedResult => {
    const avgScore = Math.round((openai.score + claude.score) / 2);
    const totalBugs = openai.bugs.length + claude.bugs.length;
    const totalSecurity = openai.security_issues.length + claude.security_issues.length;

    return {
        overall_score: avgScore,
        critical_issues: [
            `${totalBugs} bug(s) detected across both models`,
            `${totalSecurity} security concern(s) identified`,
            'Potential performance bottlenecks in core logic',
        ],
        recommendations: [
            'Add comprehensive null checks throughout the codebase',
            'Implement input validation and sanitization',
            'Optimize loop operations for better performance',
            'Add error boundaries and graceful error handling',
            'Consider adding unit tests for critical paths',
        ],
        executive_summary: `Analysis by two AI models reveals a codebase with a quality score of ${avgScore}/10. While the core logic is functional, there are ${totalBugs} potential bugs and ${totalSecurity} security concerns that should be addressed. Performance optimizations are recommended for production readiness.`,
        risk_level: avgScore >= 7 ? 'Low' : avgScore >= 5 ? 'Medium' : 'High',
        score_breakdown: {
            bugs: Math.round((10 - totalBugs) * 10) / 10,
            security: Math.round((10 - totalSecurity * 1.5) * 10) / 10,
            performance: Math.round((avgScore + Math.random() * 2) * 10) / 10,
        },
    };
};

export const submitReview = async (
    payload: ReviewPayload
): Promise<{
    openaiResult: ReviewResult;
    claudeResult: ReviewResult;
    aggregatedResult: AggregatedResult;
}> => {
    if (!payload.code.trim()) {
        throw new Error('Code content cannot be empty');
    }

    if (payload.code.length < 10) {
        throw new Error('Code must be at least 10 characters long');
    }

    // Simulate network delay
    await simulateDelay(2000 + Math.random() * 1000);

    // Simulate random failure (5% chance)
    if (Math.random() < 0.05) {
        throw new Error('API request failed. Please try again.');
    }

    const openaiResult = generateModelResult(payload.language);
    const claudeResult = generateModelResult(payload.language);
    const aggregatedResult = generateAggregatedResult(openaiResult, claudeResult);

    return { openaiResult, claudeResult, aggregatedResult };
};
