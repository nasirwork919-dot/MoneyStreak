import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PremiumButton } from "@/components/ui/premium-button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { CheckCircle, XCircle, Clock, AlertTriangle, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Confetti from 'react-confetti';

const questions = [
  {
    id: 1,
    question: "What is the smallest prime number greater than 100?",
    options: ["101", "103", "107", "109"],
    correct: 0,
    explanation: "101 is the smallest prime number greater than 100."
  },
  {
    id: 2,
    question: "In which year did the Treaty of Westphalia end the Thirty Years' War?",
    options: ["1646", "1648", "1650", "1652"],
    correct: 1,
    explanation: "The Treaty of Westphalia was signed in 1648, ending the Thirty Years' War."
  },
  {
    id: 3,
    question: "What is the chemical formula for sulfuric acid?",
    options: ["H2SO3", "H2SO4", "HSO4", "H3SO4"],
    correct: 1,
    explanation: "Sulfuric acid has the chemical formula H2SO4."
  },
  {
    id: 4,
    question: "Which planet has the most moons in our solar system?",
    options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
    correct: 1,
    explanation: "Saturn has the most moons with over 80 confirmed natural satellites."
  },
  {
    id: 5,
    question: "What is the capital of Bhutan?",
    options: ["Paro", "Punakha", "Thimphu", "Jakar"],
    correct: 2,
    explanation: "Thimphu is the capital and largest city of Bhutan."
  },
  {
    id: 6,
    question: "In mathematics, what does 'e' approximately equal?",
    options: ["2.618", "2.718", "3.141", "1.618"],
    correct: 1,
    explanation: "Euler's number (e) is approximately 2.718281828..."
  },
  {
    id: 7,
    question: "Which composer wrote 'The Four Seasons'?",
    options: ["Bach", "Vivaldi", "Mozart", "Beethoven"],
    correct: 1,
    explanation: "Antonio Vivaldi composed 'The Four Seasons' violin concertos."
  },
  {
    id: 8,
    question: "What is the deepest ocean trench on Earth?",
    options: ["Puerto Rico Trench", "Java Trench", "Mariana Trench", "Peru-Chile Trench"],
    correct: 2,
    explanation: "The Mariana Trench is the deepest known part of Earth's oceans."
  },
  {
    id: 9,
    question: "In which programming language was the Linux kernel primarily written?",
    options: ["Assembly", "C", "C++", "Rust"],
    correct: 1,
    explanation: "The Linux kernel is primarily written in the C programming language."
  },
  {
    id: 10,
    question: "What is the atomic number of gold?",
    options: ["77", "78", "79", "80"],
    correct: 2,
    explanation: "Gold has the atomic number 79 on the periodic table."
  }
];

export default function Quiz() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(40);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasAttemptedToday, setHasAttemptedToday] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    checkTodayAttempt();
  }, [user]);

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted && !hasAttemptedToday) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizCompleted) {
      // Auto-advance when time runs out
      handleTimeUp();
    }
  }, [timeLeft, quizCompleted, hasAttemptedToday]);

  const checkTodayAttempt = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', today)
        .lt('created_at', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      if (data && data.length > 0) {
        setHasAttemptedToday(true);
        const attempt = data[0];
        setQuizCompleted(true);
        setQuizPassed(attempt.passed);
        if (!attempt.passed) {
          setShowAnswers(true);
        }
      }
    } catch (error) {
      console.error('Error checking today attempt:', error);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleTimeUp = () => {
    // If no answer selected, mark as incorrect (index -1)
    if (selectedAnswers[currentQuestion] === undefined) {
      const newAnswers = [...selectedAnswers];
      newAnswers[currentQuestion] = -1;
      setSelectedAnswers(newAnswers);
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(40);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleNext = () => {
    if (selectedAnswers[currentQuestion] !== undefined) {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setTimeLeft(40);
      } else {
        handleSubmitQuiz();
      }
    }
  };

  const handleSubmitQuiz = async () => {
    setIsVerifying(true);
    
    // Check if all answers are correct
    const correctAnswers = selectedAnswers.filter((answer, index) => 
      answer === questions[index].correct
    ).length;
    
    const allCorrect = correctAnswers === questions.length;
    
    try {
      // Record quiz attempt
      const { error: attemptError } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user?.id,
          questions_answered: questions.length,
          correct_answers: correctAnswers,
          passed: allCorrect
        });

      if (attemptError) throw attemptError;

      // If passed, create free ticket
      if (allCorrect && user) {
        const nextDraw = new Date();
        nextDraw.setDate(20); // Next 20th for $700 draw
        if (nextDraw < new Date()) {
          nextDraw.setMonth(nextDraw.getMonth() + 1);
        }

        const { error: ticketError } = await supabase
          .from('tickets')
          .insert({
            user_id: user.id,
            ticket_type: 'free_quiz',
            amount: 0,
            draw_type: '700',
            draw_date: nextDraw.toISOString().split('T')[0]
          });

        if (ticketError) throw ticketError;
      }

      setTimeout(() => {
        setIsVerifying(false);
        setQuizCompleted(true);
        setQuizPassed(allCorrect);
        if (allCorrect) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        } else {
          setShowAnswers(true);
        }
      }, 3000);
    } catch (error: any) {
      console.error('Error submitting quiz:', error);
      toast({
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive"
      });
      setIsVerifying(false);
    }
  };

  if (hasAttemptedToday && !isVerifying) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-24 flex items-center justify-center min-h-[80vh]">
          <div className="container-premium text-center">
            <div className="max-w-lg mx-auto glass rounded-lg p-12">
              <Clock className="w-16 h-16 text-warning mx-auto mb-6" />
              <h2 className="text-2xl font-display font-semibold mb-4">
                Quiz Already Taken Today
              </h2>
              <p className="text-secondary-foreground mb-6">
                You can only take the quiz once per day. Come back tomorrow for another chance!
              </p>
              <div className="space-y-3">
                <Link to="/buy" onClick={() => window.scrollTo(0, 0)}>
                  <PremiumButton variant="gold" className="w-full">
                    Buy Tickets Instead
                  </PremiumButton>
                </Link>
                <Link to="/rules" onClick={() => window.scrollTo(0, 0)}>
                  <PremiumButton variant="outline" className="w-full">
                    Read Official Rules
                  </PremiumButton>
                </Link>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-24 flex items-center justify-center min-h-[80vh]">
          <div className="container-premium text-center">
            <div className="max-w-lg mx-auto glass rounded-lg p-12">
              <div className="animate-spin w-16 h-16 border-4 border-accent/30 border-t-primary rounded-full mx-auto mb-6"></div>
              <h2 className="text-2xl font-display font-semibold mb-4">
                Verifying Your Answers
              </h2>
              <p className="text-secondary-foreground mb-4">
                Checking your responses and processing your entry...
              </p>
              <div className="text-sm text-secondary-foreground">
                This process ensures fairness and prevents automated submissions.
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-background">
        {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
        <Header />
        
        <main className="pt-24 flex items-center justify-center min-h-[80vh]">
          <div className="container-premium text-center">
            <div className="max-w-lg mx-auto glass rounded-lg p-12">
              {quizPassed ? (
                <>
                  <CheckCircle className="w-16 h-16 text-success mx-auto mb-6" />
                  <h2 className="text-2xl font-display font-semibold mb-4 text-success">
                    Congratulations! 🎉
                  </h2>
                  <p className="text-secondary-foreground mb-6">
                    Perfect score! Your free $5 ticket has been added to your account for the next $700 draw.
                  </p>
                  <div className="space-y-3">
                    <Link to="/dashboard" onClick={() => window.scrollTo(0, 0)}>
                      <PremiumButton variant="gold" className="w-full">
                        View Your Dashboard
                      </PremiumButton>
                    </Link>
                    <Link to="/rules" onClick={() => window.scrollTo(0, 0)}>
                      <PremiumButton variant="outline" className="w-full">
                        Read Official Rules
                      </PremiumButton>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-16 h-16 text-destructive mx-auto mb-6" />
                  <h2 className="text-2xl font-display font-semibold mb-4 text-destructive">
                    Not Quite There
                  </h2>
                  <p className="text-secondary-foreground mb-6">
                    You got {selectedAnswers.filter((answer, index) => answer === questions[index].correct).length} out of {questions.length} correct. 
                    All answers must be correct to earn a free ticket.
                  </p>
                  
                  {showAnswers && (
                    <div className="text-left mb-6 max-h-60 overflow-y-auto">
                      <h3 className="font-semibold mb-3 text-center">Correct Answers:</h3>
                      <div className="space-y-3">
                        {questions.map((q, index) => (
                          <div key={q.id} className="p-3 bg-surface/50 rounded-lg">
                            <div className="text-sm font-medium mb-1">Q{index + 1}: {q.question}</div>
                            <div className="text-sm text-success">✓ {q.options[q.correct]}</div>
                            <div className="text-xs text-secondary-foreground mt-1">{q.explanation}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <PremiumButton variant="outline" className="w-full" disabled>
                      Try Again Tomorrow
                    </PremiumButton>
                    <Link to="/buy" onClick={() => window.scrollTo(0, 0)}>
                      <PremiumButton variant="gold" className="w-full">
                        Buy Tickets Instead
                      </PremiumButton>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-premium text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Free Entry Quiz Challenge
            </h1>
            <p className="text-xl text-secondary-foreground max-w-3xl mx-auto mb-8">
              Answer all 10 extremely difficult questions correctly to earn a FREE $5 ticket. 
              40 seconds per question. No going back. One attempt per day.
            </p>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-secondary-foreground mb-8">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-primary" />
                <span>10 Difficult Questions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-warning" />
                <span>40 Seconds Each</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span>100% Required to Win</span>
              </div>
            </div>

            <div className="glass rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-display font-semibold mb-3">Quiz Rules:</h3>
              <ul className="text-sm text-secondary-foreground space-y-2">
                <li>• All 10 questions must be answered correctly</li>
                <li>• 40-second time limit per question</li>
                <li>• No previous/back button - forward progress only</li>
                <li>• One attempt per 24-hour period</li>
                <li>• Earn a FREE $5 ticket for the $700 draw if you pass</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Quiz Section */}
        <section className="pb-24">
          <div className="container-premium">
            <div className="max-w-2xl mx-auto">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-secondary-foreground">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-warning" />
                    <span className={`text-sm font-bold ${timeLeft <= 10 ? 'text-destructive' : 'text-warning'}`}>
                      {timeLeft}s
                    </span>
                  </div>
                </div>
                <div className="w-full bg-surface/50 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
                <div className="w-full bg-surface/50 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full transition-all duration-1000 ${
                      timeLeft <= 10 ? 'bg-destructive' : 'bg-warning'
                    }`}
                    style={{ width: `${(timeLeft / 40) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Question Card */}
              <div className="glass rounded-lg p-8 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-secondary-foreground">Difficulty: Expert</span>
                  <span className="text-sm text-primary font-medium">Worth: $5 Ticket</span>
                </div>
                
                <h3 className="text-xl font-display font-semibold mb-6 text-center">
                  {questions[currentQuestion].question}
                </h3>

                <div className="space-y-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={timeLeft === 0}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                        selectedAnswers[currentQuestion] === index
                          ? 'border-primary bg-primary/20 text-primary'
                          : 'border-accent/30 hover:border-accent/60 hover:bg-accent/10'
                      } ${timeLeft === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswers[currentQuestion] === index
                            ? 'border-primary bg-primary'
                            : 'border-accent/50'
                        }`}>
                          {selectedAnswers[currentQuestion] === index && (
                            <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                          )}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-end">
                <PremiumButton
                  variant="gold"
                  onClick={handleNext}
                  disabled={selectedAnswers[currentQuestion] === undefined || timeLeft === 0}
                >
                  {currentQuestion === questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
                </PremiumButton>
              </div>

              {/* Warning */}
              <div className="mt-8 p-4 glass rounded-lg border border-warning/30">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-secondary-foreground">
                    <p className="font-medium text-warning mb-1">Important:</p>
                    <p>You cannot go back to previous questions. Make sure of your answer before proceeding. 
                    Time will auto-advance if you don't select an answer.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}