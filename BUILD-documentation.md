# GitHub Copilot Prompts Reference

This file contains ready-to-use prompts for GitHub Copilot to accelerate development of the Student Study Companion application.

---

## API Routes

### Chat API Route
```typescript
// app/api/chat/route.ts

// @copilot: Create a Next.js 14 API route handler that:
// - Accepts POST requests with { messages: Array<{role: string, content: string}>, temperature?: number }
// - Initializes Groq client with API key from environment variable GROQ_API_KEY
// - Sends messages to Groq API using llama-3.3-70b-versatile model
// - Includes a system prompt that makes the AI act as a patient, helpful tutor for students
// - Limits conversation context to last 10 messages to avoid token limits
// - Implements streaming response support
// - Handles errors gracefully with appropriate HTTP status codes
// - Returns JSON with { response: string, usage: object }
// - Includes rate limit error handling (status 429)
```

### Quiz Generation API Route
```typescript
// app/api/quiz/route.ts

// @copilot: Create an API route that generates quiz questions with:
// - POST endpoint accepting { topic: string, difficulty: 'easy' | 'medium' | 'hard', numQuestions: number }
// - Input validation for all parameters
// - Groq API call with a detailed prompt that generates structured quiz data
// - Response format: { questions: Array<{ id: number, question: string, options: string[], correctAnswer: number, explanation: string }> }
// - Different question types based on difficulty level
// - Ensures no duplicate questions
// - Error handling for invalid inputs and API failures
// - Token limit management for large quiz requests
```

### Document Summarizer API Route
```typescript
// app/api/summarize/route.ts

// @copilot: Create a document summarization API that:
// - Accepts POST with { text: string, summaryType: 'brief' | 'detailed' | 'comprehensive' }
// - Validates text length (max 50,000 characters)
// - Chunks large text into manageable pieces if needed
// - Creates summary using Groq with appropriate prompt
// - Returns { summary: string, keyPoints: string[], wordCount: number, readingTime: number }
// - Handles different summary lengths based on summaryType
// - Includes extraction of main themes and important facts
// - Error handling for oversized documents
```

### Study Plan Generator API Route
```typescript
// app/api/study-plan/route.ts

// @copilot: Create a study plan generation API with:
// - POST accepting { subject: string, examDate: string, currentLevel: string, hoursPerDay: number, topics: string[] }
// - Validation of exam date (must be future date)
// - Calculation of total days until exam
// - Groq API call generating week-by-week study schedule
// - Response format: { plan: { weeks: Array<{ weekNumber: number, days: Array<{ day: number, topics: string[], tasks: string[], duration: number }> }>, tips: string[] } }
// - Adaptive scheduling based on available time
// - Includes review sessions and practice tests
// - Handles short and long-term study periods differently
```

---

## Page Components

### Landing Page
```typescript
// app/page.tsx

// @copilot: Create a modern landing page for Student Study Companion with:
// - Hero section with gradient background and main heading
// - Feature cards showcasing 4 main features (Chat, Quiz, Summarizer, Study Plan)
// - Each card with icon, title, description, and "Try Now" button
// - How It Works section with 3 steps
// - Benefits section highlighting social impact
// - Call-to-action section
// - Responsive design using Tailwind CSS
// - Smooth animations on scroll using CSS
// - Navigation links to all features
// - TypeScript with proper types
```

### Chat Interface Page
```typescript
// app/chat/page.tsx

// @copilot: Create an interactive chat interface with:
// - State management for messages array and loading state
// - Message display area with auto-scroll to bottom
// - User messages aligned right with blue background
// - AI messages aligned left with gray background
// - Input area with textarea that auto-expands
// - Send button that disables during loading
// - Typing indicator (3 animated dots) while waiting for response
// - Welcome message with example prompts
// - Clear chat button
// - localStorage integration to persist chat history
// - Error display component for failed requests
// - Keyboard shortcut (Cmd/Ctrl + Enter) to send message
// - Responsive mobile design
```

### Quiz Page
```typescript
// app/quiz/page.tsx

// @copilot: Create an interactive quiz interface with:
// - Initial form to configure quiz (topic, difficulty, number of questions)
// - Question display showing one question at a time
// - Multiple choice options as clickable cards
// - Visual feedback on selection (highlight selected option)
// - Next/Previous navigation buttons
// - Progress bar showing question number
// - Timer showing elapsed time
// - Submit quiz button on last question
// - Results screen showing score, correct/incorrect breakdown
// - Review mode to see all questions with explanations
// - Retry and Generate New Quiz buttons
// - Loading state during generation
// - Responsive design
```

### Document Summarizer Page
```typescript
// app/summarize/page.tsx

// @copilot: Create a document summarizer interface with:
// - File upload area with drag-and-drop support
// - Accept .pdf, .docx, .txt files
// - Text paste area as alternative input
// - Radio buttons to select summary type (brief/detailed/comprehensive)
// - Character counter showing text length
// - Summarize button with loading state
// - Results display with formatted summary
// - Key points section as bullet list
// - Reading time estimate
// - Copy to clipboard button
// - Download summary as .txt button
// - Clear/Reset functionality
// - Error handling for large files
```

### Study Plan Page
```typescript
// app/study-plan/page.tsx

// @copilot: Create a study plan generator interface with:
// - Multi-step form with subject, exam date picker, current level dropdown, hours per day input
// - Topics checklist or input field
// - Generate Plan button
// - Calendar view showing week-by-week breakdown
// - Daily task cards showing topics and estimated duration
// - Color-coded tasks by type (learning, practice, review)
// - Progress tracking checkboxes
// - Study tips sidebar
// - Export plan as PDF or JSON
// - Edit plan functionality
// - Responsive layout
```

---

## Reusable Components

### Button Component
```typescript
// components/ui/Button.tsx

// @copilot: Create a reusable Button component with:
// - Props: children, variant ('primary' | 'secondary' | 'outline' | 'ghost'), size ('sm' | 'md' | 'lg'), isLoading, disabled, leftIcon, rightIcon, onClick, className
// - Conditional styling based on variant using Tailwind CSS
// - Loading spinner that replaces content when isLoading=true
// - Disabled state with opacity and cursor-not-allowed
// - Hover and focus states
// - Icon rendering on left or right side
// - Proper TypeScript types including React.ButtonHTMLAttributes
// - forwardRef support
// - Accessibility attributes (aria-disabled, aria-busy)
```

### Input Component
```typescript
// components/ui/Input.tsx

// @copilot: Create a flexible Input component with:
// - Props: label, error, helperText, leftIcon, rightIcon, type, placeholder, value, onChange, maxLength, showCharCount
// - Label rendering with optional required indicator
// - Error state with red border and error message below
// - Helper text in gray below input
// - Icons positioned inside input with proper spacing
// - Character counter for text inputs with maxLength
// - Focus ring in primary color
// - Different styles for text, email, password, number types
// - Full TypeScript support
// - Accessibility (aria-label, aria-invalid, aria-describedby)
```

### Card Component
```typescript
// components/ui/Card.tsx

// @copilot: Create a Card component with:
// - Props: header, children, footer, className, padding, hover, onClick
// - White background with border and shadow
// - Optional header section with bottom border
// - Body section with customizable padding
// - Optional footer section with top border
// - Hover effect when hover=true (lift and shadow increase)
// - Clickable variant with cursor pointer
// - Responsive padding
// - TypeScript types
```

### LoadingSpinner Component
```typescript
// components/ui/LoadingSpinner.tsx

// @copilot: Create a LoadingSpinner component with:
// - Props: size ('sm' | 'md' | 'lg'), color, className
// - Animated spinning circle using CSS or SVG
// - Size variants (16px, 24px, 40px)
// - Color customization (default: primary-500)
// - Smooth rotation animation
// - Accessible with aria-label="Loading"
// - Inline and block display options
```

### ChatMessage Component
```typescript
// components/Chat/ChatMessage.tsx

// @copilot: Create a ChatMessage component with:
// - Props: message { role: 'user' | 'assistant', content: string, timestamp?: Date }
// - Different styling for user vs assistant messages
// - User messages: right-aligned, blue background
// - Assistant messages: left-aligned, gray background, avatar icon
// - Markdown rendering for assistant responses
// - Timestamp display in small gray text
// - Copy message button on hover
// - Avatar/icon for assistant messages
// - Code block syntax highlighting
// - Responsive width constraints
```

### QuizCard Component
```typescript
// components/Quiz/QuizCard.tsx

// @copilot: Create a QuizCard component with:
// - Props: question { id, question, options, correctAnswer, explanation }, selectedAnswer, onSelectAnswer, showResult, questionNumber, totalQuestions
// - Question number display (e.g., "Question 3 of 10")
// - Question text in large, readable font
// - Options as clickable cards in grid layout
// - Visual states: default, selected, correct (green), incorrect (red)
// - Show explanation section when showResult=true
// - Disabled state after answer submission
// - Smooth transitions between states
// - Responsive grid (1 column mobile, 2 columns desktop)
```

---

## Custom Hooks

### useChat Hook
```typescript
// hooks/useChat.ts

// @copilot: Create a useChat custom hook that:
// - Manages messages state as array of { role, content, timestamp }
// - Provides sendMessage function that calls /api/chat endpoint
// - Handles loading state during API call
// - Manages error state with error message
// - Implements retry logic for failed requests
// - Persists messages to localStorage with key 'chat-history'
// - Provides clearChat function to reset conversation
// - Returns { messages, sendMessage, isLoading, error, clearChat, retryLastMessage }
// - Uses useCallback for optimized functions
// - Includes TypeScript types for all return values
```

### useQuiz Hook
```typescript
// hooks/useQuiz.ts

// @copilot: Create a useQuiz custom hook that:
// - State: questions, currentQuestionIndex, selectedAnswers, score, isComplete, isLoading, error
// - generateQuiz function that calls /api/quiz with topic, difficulty, numQuestions
// - selectAnswer function to record user's choice
// - nextQuestion and previousQuestion navigation functions
// - submitQuiz function to calculate final score
// - reviewQuestion function to navigate in review mode
// - resetQuiz function to start over
// - Returns all state and functions with proper TypeScript types
// - Implements localStorage to save in-progress quiz
```

### useLocalStorage Hook
```typescript
// hooks/useLocalStorage.ts

// @copilot: Create a generic useLocalStorage hook that:
// - Takes key and initialValue parameters with TypeScript generics
// - Returns [storedValue, setValue] tuple like useState
// - Syncs state with localStorage on mount
// - Updates localStorage when value changes
// - Handles JSON serialization/deserialization
// - Catches and handles localStorage errors gracefully
// - Supports any serializable type through generics
// - Implements useEffect for initialization
// - Handles storage events for cross-tab synchronization
```

### useDebounce Hook
```typescript
// hooks/useDebounce.ts

// @copilot: Create a useDebounce hook that:
// - Takes value and delay parameters
// - Returns debounced value
// - Uses useEffect and setTimeout
// - Cleans up timeout on unmount or value change
// - Generic type support for any value type
// - Default delay of 500ms
// - Useful for search inputs and API calls
```

---

## Utility Functions

### Groq Client Configuration
```typescript
// lib/groq-client.ts

// @copilot: Create a Groq client utility with:
// - Initialize Groq SDK with API key from environment
// - Export configured client instance
// - Helper function: streamChatCompletion(messages, model, options)
// - Helper function: generateCompletion(prompt, options)
// - Error handling wrapper for all API calls
// - Retry logic with exponential backoff
// - Type definitions for all function parameters and returns
// - Constants for model names and default parameters
```

### Prompt Templates
```typescript
// lib/prompts.ts

// @copilot: Create a prompt templates library with:
// - SYSTEM_PROMPT_TUTOR: Comprehensive system prompt for AI tutor
// - SYSTEM_PROMPT_QUIZ: Prompt for generating quiz questions with examples
// - SYSTEM_PROMPT_SUMMARIZER: Prompt for document summarization
// - SYSTEM_PROMPT_STUDY_PLAN: Prompt for study plan generation
// - Helper functions to format prompts with variables
// - Template string functions with TypeScript types
// - Examples of good responses in each prompt
// - Guidelines for output format and structure
```

### Date & Time Utilities
```typescript
// lib/utils/date.ts

// @copilot: Create date utility functions:
// - formatDate(date: Date): string - formats as "Jan 15, 2025"
// - formatTime(date: Date): string - formats as "2:30 PM"
// - formatRelativeTime(date: Date): string - formats as "2 hours ago"
// - getDaysBetween(start: Date, end: Date): number
// - addDays(date: Date, days: number): Date
// - isValidDate(dateString: string): boolean
// - parseDate(dateString: string): Date | null
// - All functions with error handling
```

### Text Processing Utilities
```typescript
// lib/utils/text.ts

// @copilot: Create text processing utilities:
// - truncate(text: string, maxLength: number): string - truncates with ellipsis
// - countWords(text: string): number
// - estimateReadingTime(text: string, wpm?: number): number - default 200 wpm
// - highlightText(text: string, query: string): string - wraps matches in <mark>
// - sanitizeInput(text: string): string - removes potentially harmful content
// - extractKeywords(text: string): string[] - simple keyword extraction
// - capitalize(text: string): string
```

### API Error Handler
```typescript
// lib/utils/error-handler.ts

// @copilot: Create API error handling utility:
// - Class: APIError extends Error with statusCode and details properties
// - handleAPIError(error: unknown): APIError - converts any error to APIError
// - isRateLimitError(error: Error): boolean
// - getErrorMessage(error: unknown): string - user-friendly error messages
// - retryWithBackoff(fn: Function, maxRetries: number): Promise
// - Type guards for different error types
```

---

## Layout Components

### Header Component
```typescript
// components/Header.tsx

// @copilot: Create a Header component with:
// - Logo/title on the left
// - Navigation links in center (Chat, Quiz, Summarize, Study Plan)
// - Dark mode toggle on right
// - Mobile hamburger menu
// - Active link highlighting
// - Sticky positioning with backdrop blur
// - Responsive design with collapsible menu on mobile
// - TypeScript with Link from next/link
```

### Sidebar Component
```typescript
// components/Sidebar.tsx

// @copilot: Create a Sidebar component with:
// - Props: isOpen, onClose, children
// - Slide-in animation from left
// - Overlay background on mobile
// - Close button in top right
// - Navigation menu items with icons
// - Active state highlighting
// - Responsive (full width on mobile, fixed width on desktop)
// - Smooth transitions
// - Accessibility (focus trap, ESC to close)
```

### Footer Component
```typescript
// components/Footer.tsx

// @copilot: Create a Footer component with:
// - Three columns: About, Features, Resources
// - Social media icons
// - Copyright notice
// - Links with hover effects
// - Responsive layout (stacks on mobile)
// - Dark background with light text
// - Separator line at top
```

---

## Type Definitions

### Main Types File
```typescript
// lib/types.ts

// @copilot: Create TypeScript type definitions for:
// - Message type: { id: string, role: 'user' | 'assistant', content: string, timestamp: Date }
// - Question type: { id: number, question: string, options: string[], correctAnswer: number, explanation: string }
// - Quiz type: { id: string, topic: string, difficulty: 'easy' | 'medium' | 'hard', questions: Question[], createdAt: Date }
// - StudyPlan type: { subject: string, examDate: Date, weeks: Week[], tips: string[] }
// - Week type: { weekNumber: number, days: Day[] }
// - Day type: { day: number, date: Date, topics: string[], tasks: string[], duration: number, completed: boolean }
// - ChatState type: { messages: Message[], isLoading: boolean, error: string | null }
// - API response types for all endpoints
// - Form input types
// - Export all types
```

---

## Testing Prompts

### Unit Tests
```typescript
// __tests__/hooks/useChat.test.ts

// @copilot: Create Jest unit tests for useChat hook testing:
// - Initial state is empty array
// - sendMessage adds message to array
// - API call is made with correct parameters
// - Loading state toggles correctly
// - Error handling works
// - localStorage persistence
// - clearChat resets state
// - Use @testing-library/react-hooks
```

### Integration Tests
```typescript
// __tests__/pages/chat.test.tsx

// @copilot: Create integration tests for chat page:
// - Page renders correctly
// - Can type and send message
// - Response appears in chat
// - Error message displays on API failure
// - Loading indicator shows during request
// - Use @testing-library/react
// - Mock fetch for API calls
```

---

## Configuration Files

### TypeScript Config
```json
// tsconfig.json

// @copilot: Create optimal tsconfig.json for Next.js 14 with:
// - Strict mode enabled
// - Module resolution: bundler
// - Target: ES2020
// - Lib: ES2020, DOM, DOM.Iterable
// - JSX: preserve
// - Paths alias for @ pointing to root
// - Include: next-env.d.ts, app, components, lib, hooks
// - Exclude: node_modules, .next, out
```

### ESLint Config
```json
// .eslintrc.json

// @copilot: Create ESLint configuration with:
// - Extend: next/core-web-vitals, typescript-eslint recommended
// - Rules for: no-console (warn), no-unused-vars (error), prefer-const (error)
// - React hooks rules
// - TypeScript specific rules
// - Prettier integration
```

---

## Quick Start Scripts

### Package.json Scripts
```json
// @copilot: Add these scripts to package.json:
// "dev": "next dev",
// "build": "next build",
// "start": "next start",
// "lint": "next lint",
// "type-check": "tsc --noEmit",
// "format": "prettier --write .",
// "test": "jest",
// "test:watch": "jest --watch"
```

---

## Environment Setup

### Environment Variables
```bash
# .env.example

# @copilot: Create environment variable template with:
# - GROQ_API_KEY with description and link to get key
# - NEXT_PUBLIC_APP_NAME with default value
# - NEXT_PUBLIC_APP_VERSION
# - NODE_ENV
# - Comments explaining each variable
# - Instructions to copy to .env.local
```

---

## Best Practices Reminder

When using these prompts with GitHub Copilot:

1. **Context**: Include the prompt at the top of the file before any code
2. **Specificity**: The more detailed the prompt, the better the output
3. **Iteration**: Start with the prompt, review generated code, refine as needed
4. **Testing**: Always test generated code before committing
5. **Types**: Ensure TypeScript types are properly defined
6. **Error Handling**: Check that error cases are covered
7. **Accessibility**: Verify ARIA attributes and keyboard navigation
8. **Performance**: Review for unnecessary re-renders and optimize

---

**Happy Coding! 🚀**