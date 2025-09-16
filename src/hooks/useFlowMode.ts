import { useState, useCallback } from 'react'
import { FlowQuestion, defaultFlowQuestions } from '../components/Prompt/FlowQuestionCard'

export interface FlowState {
  currentStep: number
  answers: string[]
  questions: FlowQuestion[]
  isComplete: boolean
  isActive: boolean
}

export function useFlowMode(questions: FlowQuestion[] = defaultFlowQuestions) {
  const [flowState, setFlowState] = useState<FlowState>({
    currentStep: 0,
    answers: new Array(questions.length).fill(''),
    questions,
    isComplete: false,
    isActive: false
  })

  const startFlow = useCallback(() => {
    setFlowState(prev => ({
      ...prev,
      currentStep: 0,
      answers: new Array(questions.length).fill(''),
      isComplete: false,
      isActive: true
    }))
  }, [questions.length])

  const updateAnswer = useCallback((stepIndex: number, answer: string) => {
    setFlowState(prev => {
      const newAnswers = [...prev.answers]
      newAnswers[stepIndex] = answer
      return {
        ...prev,
        answers: newAnswers
      }
    })
  }, [])

  const nextStep = useCallback(() => {
    setFlowState(prev => {
      const nextStep = prev.currentStep + 1
      const isComplete = nextStep >= prev.questions.length
      
      return {
        ...prev,
        currentStep: nextStep,
        isComplete,
        isActive: !isComplete
      }
    })
  }, [])

  const previousStep = useCallback(() => {
    setFlowState(prev => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1),
      isComplete: false,
      isActive: true
    }))
  }, [])

  const goToStep = useCallback((stepIndex: number) => {
    setFlowState(prev => ({
      ...prev,
      currentStep: Math.max(0, Math.min(stepIndex, prev.questions.length - 1)),
      isComplete: false,
      isActive: true
    }))
  }, [])

  const skipCurrentStep = useCallback(() => {
    setFlowState(prev => {
      const newAnswers = [...prev.answers]
      newAnswers[prev.currentStep] = '[Skipped]'
      const nextStep = prev.currentStep + 1
      const isComplete = nextStep >= prev.questions.length
      
      return {
        ...prev,
        answers: newAnswers,
        currentStep: nextStep,
        isComplete,
        isActive: !isComplete
      }
    })
  }, [])

  const completeFlow = useCallback(() => {
    setFlowState(prev => ({
      ...prev,
      isComplete: true,
      isActive: false
    }))
  }, [])

  const resetFlow = useCallback(() => {
    setFlowState({
      currentStep: 0,
      answers: new Array(questions.length).fill(''),
      questions,
      isComplete: false,
      isActive: false
    })
  }, [questions])

  const getStructuredPrompt = useCallback(() => {
    return flowState.questions
      .map((question, index) => {
        const answer = flowState.answers[index]
        if (!answer || answer === '[Skipped]') return null
        return `${question.category}: ${answer}`
      })
      .filter(Boolean)
      .join('\n\n')
  }, [flowState.questions, flowState.answers])

  const getCurrentQuestion = useCallback(() => {
    return flowState.questions[flowState.currentStep] || null
  }, [flowState.questions, flowState.currentStep])

  const getCurrentAnswer = useCallback(() => {
    return flowState.answers[flowState.currentStep] || ''
  }, [flowState.answers, flowState.currentStep])

  const getProgress = useCallback(() => {
    const answeredQuestions = flowState.answers.filter(answer => 
      answer && answer !== '[Skipped]'
    ).length
    return (answeredQuestions / flowState.questions.length) * 100
  }, [flowState.answers, flowState.questions.length])

  const canProceed = useCallback(() => {
    const currentAnswer = getCurrentAnswer()
    const currentQuestion = getCurrentQuestion()
    
    if (!currentQuestion) return false
    
    return currentAnswer.trim().length >= 3 || currentQuestion.optional
  }, [getCurrentAnswer, getCurrentQuestion])

  return {
    flowState,
    startFlow,
    updateAnswer,
    nextStep,
    previousStep,
    goToStep,
    skipCurrentStep,
    completeFlow,
    resetFlow,
    getStructuredPrompt,
    getCurrentQuestion,
    getCurrentAnswer,
    getProgress,
    canProceed
  }
}