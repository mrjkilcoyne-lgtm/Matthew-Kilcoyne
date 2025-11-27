import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot } from 'lucide-react';
import { Message, Question, InterviewAnswers } from '../types';

interface InterviewProps {
  onComplete: (answers: InterviewAnswers) => void;
}

const QUESTIONS: Question[] = [
  // CHAPTER 1: THE ORIGIN
  { id: 'origin', text: "Let's start at the beginning. Where did you start in life (geographically or culturally), and what was the first 'world' you felt you truly belonged to?" },
  { id: 'pivot', text: "Most careers have a strange turn. Tell me about a time you made a decision that seemed illogical to others but felt right to you." },
  { id: 'struggle', text: "Resilience is data. What is the hardest professional challenge you've overcome, and what specific skill did you build to survive it?" },
  
  // CHAPTER 2: THE ARSENAL
  { id: 'superpower', text: "Chapter 2: Your Arsenal. If we stripped away your job title, what is the one 'Hard Skill' you possess that you could perform in your sleep? (e.g. negotiation, system architecture, writing)" },
  { id: 'soft_heart', text: "Now the 'Soft Heart'. What is a topic—completely unrelated to work—that you find yourself reading about, watching, or doing when nobody is paying you?" },
  { id: 'compliment', text: "What is the specific thing people constantly compliment you on, which you tend to dismiss as 'easy' or 'nothing special'?" },
  
  // CHAPTER 3: THE CONFLUATION
  { id: 'friction', text: "Chapter 3: The Opportunity. In that area you love (your soft heart), what is something that is broken, frustrating, or archaic? What makes you angry?" },
  { id: 'customer', text: "If you were to solve that problem, who exactly are you helping? Describe the specific person who would thank you with tears in their eyes." },
  { id: 'forefront', text: "Right now, today, what is at the absolute forefront of your mind? What idea or feeling is occupying your mental RAM?" },
  { id: 'legacy', text: "Final question. Fast forward 10 years. You built something that combined your skill and your passion. What does the headline say?" }
];

export const Interview: React.FC<InterviewProps> = ({ onComplete }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<InterviewAnswers>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initial greeting
  useEffect(() => {
    const init = async () => {
      setIsTyping(true);
      await new Promise(r => setTimeout(r, 1000));
      setMessages([{ sender: 'bot', text: "Welcome to the deep dive. We have 10 questions to uncover your narrative arc. Take your time." }]);
      setIsTyping(false);
      
      await new Promise(r => setTimeout(r, 1500));
      addBotMessage(QUESTIONS[0].text);
    };
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addBotMessage = (text: string) => {
    setIsTyping(true);
    // Simulate thinking time based on text length, but capped for UX
    const delay = Math.min(1000 + (text.length * 10), 2500); 
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text }]);
      setIsTyping(false);
    }, delay);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const userText = inputValue;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputValue('');

    const currentKey = QUESTIONS[questionIndex].id;
    const updatedAnswers = { ...answers, [currentKey]: userText };
    setAnswers(updatedAnswers);

    if (questionIndex < QUESTIONS.length - 1) {
      setQuestionIndex(prev => prev + 1);
      
      // Artificial pause before bot responds
      setTimeout(() => {
        // Interstitial encouragement
        if (questionIndex === 2) {
           addBotMessage("Excellent context. Now, let's look at your capabilities.");
           setTimeout(() => addBotMessage(QUESTIONS[questionIndex + 1].text), 2000);
        } else if (questionIndex === 5) {
           addBotMessage("I see the pattern forming. Now let's look for the market gap.");
           setTimeout(() => addBotMessage(QUESTIONS[questionIndex + 1].text), 2000);
        } else {
           addBotMessage(QUESTIONS[questionIndex + 1].text);
        }
      }, 500);
    } else {
      setIsTyping(true);
      setTimeout(() => {
        onComplete(updatedAnswers);
      }, 1500);
    }
  };

  const progressPercentage = ((questionIndex) / QUESTIONS.length) * 100;

  return (
    <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full bg-white border-x border-stone-100 shadow-2xl shadow-stone-200/50 relative">
      {/* Progress Bar (Mobile/Desktop overlap) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-stone-100 z-10">
        <div className="h-full bg-stone-800 transition-all duration-700" style={{ width: `${progressPercentage}%` }} />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide pb-32">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex items-start gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : 'animate-in slide-in-from-left-4 duration-500'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${msg.sender === 'bot' ? 'bg-[#FDFBF7] border-stone-200 text-stone-600' : 'bg-stone-800 border-stone-800 text-white'}`}>
              {msg.sender === 'bot' ? <span className="font-serif italic text-xs">AI</span> : <User size={14} />}
            </div>
            <div className={`max-w-[85%] rounded-lg px-6 py-4 text-base leading-relaxed ${
              msg.sender === 'bot' 
                ? 'bg-transparent text-stone-800' 
                : 'bg-stone-50 text-stone-800 border border-stone-100 shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex items-start gap-4 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-[#FDFBF7] border border-stone-200 flex items-center justify-center">
              <Bot size={14} className="text-stone-400" />
            </div>
            <div className="px-4 py-3">
              <span className="text-stone-400 text-sm italic">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 bg-white/90 backdrop-blur border-t border-stone-100 absolute bottom-0 w-full">
        <div className="relative flex items-center shadow-lg rounded-xl">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your reflection..."
            autoFocus
            className="w-full pl-6 pr-14 py-4 bg-[#FDFBF7] border-0 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-300 transition-all placeholder:text-stone-400 resize-none min-h-[60px]"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="absolute right-3 bottom-3 p-2 bg-stone-800 text-white rounded-lg hover:bg-black disabled:opacity-30 disabled:hover:bg-stone-800 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="text-center mt-2 text-xs text-stone-400">
          Question {questionIndex + 1} of {QUESTIONS.length} • Press Enter to send
        </div>
      </div>
    </div>
  );
};
