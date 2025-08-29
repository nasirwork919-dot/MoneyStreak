import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PremiumButton } from "@/components/ui/premium-button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { CheckCircle, XCircle, Clock, AlertTriangle, Brain, Trophy, Star, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Confetti from 'react-confetti';

const expertQuestions = [
  {
    id: 1,
    question: "In quantum mechanics, what is the exact value of Planck's constant in joule-seconds?",
    options: ["6.626 × 10⁻³⁴", "6.582 × 10⁻³⁴", "1.055 × 10⁻³⁴", "4.136 × 10⁻³⁴"],
    correct: 0,
    explanation: "Planck's constant (h) is exactly 6.62607015 × 10⁻³⁴ joule-seconds, a fundamental constant in quantum mechanics.",
    difficulty: "Physics/Chemistry"
  },
  {
    id: 2,
    question: "Which Byzantine Emperor issued the Ecloga, a legal code that influenced European law for centuries?",
    options: ["Justinian I", "Leo III", "Constantine V", "Basil I"],
    correct: 1,
    explanation: "Emperor Leo III issued the Ecloga in 726 CE, a legal code that simplified and reformed Byzantine law.",
    difficulty: "History"
  },
  {
    id: 3,
    question: "In topology, what is the Euler characteristic of a Klein bottle?",
    options: ["0", "1", "-1", "2"],
    correct: 0,
    explanation: "The Klein bottle has an Euler characteristic of 0, as it's a non-orientable surface with no boundary.",
    difficulty: "Mathematics"
  },
  {
    id: 4,
    question: "What is the capital of Kyrgyzstan?",
    options: ["Almaty", "Bishkek", "Tashkent", "Dushanbe"],
    correct: 1,
    explanation: "Bishkek is the capital and largest city of Kyrgyzstan, located in the Chuy Valley.",
    difficulty: "Geography"
  },
  {
    id: 5,
    question: "In organic chemistry, what is the IUPAC name for the compound C₆H₅COOH?",
    options: ["Phenylacetic acid", "Benzoic acid", "Salicylic acid", "Phthalic acid"],
    correct: 1,
    explanation: "C₆H₅COOH is benzoic acid, the simplest aromatic carboxylic acid with a benzene ring attached to a carboxyl group.",
    difficulty: "Chemistry"
  },
  {
    id: 6,
    question: "Who composed the opera 'The Rake's Progress' with libretto by W.H. Auden?",
    options: ["Benjamin Britten", "Igor Stravinsky", "Aaron Copland", "Leonard Bernstein"],
    correct: 1,
    explanation: "Igor Stravinsky composed 'The Rake's Progress' (1951) with libretto by W.H. Auden and Chester Kallman.",
    difficulty: "Arts/Music"
  },
  {
    id: 7,
    question: "In computer science, what is the time complexity of the best-known algorithm for matrix multiplication?",
    options: ["O(n³)", "O(n^2.807)", "O(n^2.373)", "O(n²)"],
    correct: 2,
    explanation: "The current best-known algorithm for matrix multiplication has time complexity O(n^2.373), achieved by Josh Alman and Virginia Vassilevska Williams in 2020.",
    difficulty: "Computer Science"
  },
  {
    id: 8,
    question: "Which moon of Jupiter has the most volcanic activity in the solar system?",
    options: ["Europa", "Ganymede", "Io", "Callisto"],
    correct: 2,
    explanation: "Io is the most volcanically active body in the solar system, with over 400 active volcanoes due to tidal heating from Jupiter.",
    difficulty: "Astronomy"
  },
  {
    id: 9,
    question: "In linguistics, what term describes the phenomenon where a word's meaning becomes more positive over time?",
    options: ["Amelioration", "Pejoration", "Semantic bleaching", "Grammaticalization"],
    correct: 0,
    explanation: "Amelioration (or semantic elevation) is when a word develops a more positive meaning over time, opposite of pejoration.",
    difficulty: "Linguistics"
  },
  {
    id: 10,
    question: "What is the molecular formula of the neurotransmitter dopamine?",
    options: ["C₈H₁₁NO₂", "C₈H₁₁NO", "C₁₀H₁₂N₂O", "C₉H₁₃NO₃"],
    correct: 0,
    explanation: "Dopamine has the molecular formula C₈H₁₁NO₂ and is crucial for reward, motivation, and motor control in the brain.",
    difficulty: "Biochemistry"
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
  const [quizStarted, setQuizStarted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    if (user) {
      checkTodayAttempt();
    }
  }, [user]);

  useEffect(() => {
    if (timeLeft > 0 && quizStarted && !quizCompleted && !hasAttemptedToday) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quizStarted && !quizCompleted) {
      handleTimeUp();
    }
  }, [timeLeft, quizStarted, quizCompleted, hasAttemptedToday]);

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
        setCorrectCount(attempt.correct_answers);
        if (!attempt.passed) {
          setShowAnswers(true);
        }
      }
    } catch (error) {
      console.error('Error checking today attempt:', error);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeLeft(40);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleTimeUp = () => {
    if (selectedAnswers[currentQuestion] === undefined) {
      const newAnswers = [...selectedAnswers];
      newAnswers[currentQuestion] = -1; // Mark as incorrect due to timeout
      setSelectedAnswers(newAnswers);
    }
    
    if (currentQuestion < expertQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(40);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleNext = () => {
    if (selectedAnswers[currentQuestion] !== undefined) {
      if (currentQuestion < expertQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setTimeLeft(40);
      } else {
        handleSubmitQuiz();
      }
    }
  };

  const handleSubmitQuiz = async () => {
    setIsVerifying(true);
    
    const correctAnswers = selectedAnswers.filter((answer, index) => 
      answer === expertQuestions[index].correct
    ).length;
    
    const allCorrect = correctAnswers === expertQuestions.length;
    setCorrectCount(correctAnswers);
    
    try {
      // Record quiz attempt
      const { error: attemptError } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user?.id,
          questions_answered: expertQuestions.length,
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
          setTimeout(() => setShowConfetti(false), 8000);
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

  // Quiz already taken today
  if (hasAttemptedToday && !isVerifying) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-24 flex items-center justify-center min-h-[80vh]">
          <div className="container-premium text-center">
            <div className="max-w-2xl mx-auto glass rounded-lg p-12">
              <Clock className="w-20 h-20 text-warning mx-auto mb-8" />
              <h2 className="text-3xl font-display font-semibold mb-6">
                Quiz Already Completed Today
              </h2>
              
              {quizPassed ? (
                <div className="space-y-6">
                  <div className="bg-success/10 border border-success/30 rounded-lg p-6">
                    <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-success mb-2">Congratulations!</h3>
                    <p className="text-secondary-foreground">
                      You scored {correctCount}/10 and earned a FREE $5 ticket for the $700 draw!
                    </p>
                  </div>
                  <Link to="/dashboard" onClick={() => window.scrollTo(0, 0)}>
                    <PremiumButton variant="gold" className="w-full">
                      View Your Dashboard
                    </PremiumButton>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-warning/10 border border-warning/30 rounded-lg p-6">
                    <XCircle className="w-12 h-12 text-warning mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-warning mb-2">Not Quite There</h3>
                    <p className="text-secondary-foreground">
                      You scored {correctCount}/10. All 10 answers must be correct to earn a free ticket.
                    </p>
                  </div>
                  <p className="text-secondary-foreground">
                    Come back tomorrow for another chance, or purchase tickets to enter today!
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
              )}
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  // Quiz verification in progress
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

  // Quiz completed
  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-background">
        {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
        <Header />
        
        <main className="pt-24 flex items-center justify-center min-h-[80vh]">
          <div className="container-premium text-center">
            <div className="max-w-2xl mx-auto glass rounded-lg p-12">
              {quizPassed ? (
                <>
                  <CheckCircle className="w-20 h-20 text-success mx-auto mb-8 animate-scale-in" />
                  <h2 className="text-3xl font-display font-semibold mb-6 text-success">
                    Perfect Score! 🎉
                  </h2>
                  <div className="bg-success/10 border border-success/30 rounded-lg p-6 mb-8">
                    <div className="text-6xl font-bold text-success mb-2">{correctCount}/10</div>
                    <div className="text-lg text-secondary-foreground">All answers correct!</div>
                  </div>
                  <p className="text-secondary-foreground mb-8 text-lg">
                    Incredible! Your FREE $5 ticket has been added to your account for the next $700 draw. 
                    You've joined the elite 2-3% who master our expert-level challenge.
                  </p>
                  <div className="space-y-4">
                    <Link to="/dashboard" onClick={() => window.scrollTo(0, 0)}>
                      <PremiumButton variant="gold" size="lg" className="w-full">
                        <Trophy className="w-5 h-5 mr-2" />
                        View Your Dashboard
                      </PremiumButton>
                    </Link>
                    <Link to="/winners" onClick={() => window.scrollTo(0, 0)}>
                      <PremiumButton variant="outline" size="lg" className="w-full">
                        <Star className="w-5 h-5 mr-2" />
                        See Other Winners
                      </PremiumButton>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-20 h-20 text-destructive mx-auto mb-8" />
                  <h2 className="text-3xl font-display font-semibold mb-6 text-destructive">
                    Challenge Not Completed
                  </h2>
                  <div className="bg-warning/10 border border-warning/30 rounded-lg p-6 mb-8">
                    <div className="text-6xl font-bold text-warning mb-2">{correctCount}/10</div>
                    <div className="text-lg text-secondary-foreground">
                      You need all 10 correct to earn a free ticket
                    </div>
                  </div>
                  
                  {showAnswers && (
                    <div className="text-left mb-8 max-h-80 overflow-y-auto">
                      <h3 className="font-semibold mb-4 text-center text-lg">Review: Correct Answers</h3>
                      <div className="space-y-4">
                        {expertQuestions.map((q, index) => (
                          <div key={q.id} className="p-4 bg-surface/50 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <div className="text-sm font-medium">Q{index + 1}: {q.question}</div>
                              <div className={`px-2 py-1 rounded text-xs ${
                                selectedAnswers[index] === q.correct 
                                  ? 'bg-success/20 text-success' 
                                  : 'bg-destructive/20 text-destructive'
                              }`}>
                                {selectedAnswers[index] === q.correct ? '✓' : '✗'}
                              </div>
                            </div>
                            <div className="text-sm text-success mb-1">
                              ✓ Correct: {q.options[q.correct]}
                            </div>
                            {selectedAnswers[index] !== q.correct && selectedAnswers[index] !== -1 && (
                              <div className="text-sm text-destructive mb-1">
                                ✗ Your answer: {q.options[selectedAnswers[index]]}
                              </div>
                            )}
                            <div className="text-xs text-secondary-foreground">
                              {q.explanation}
                            </div>
                            <div className="text-xs text-accent mt-1">
                              Category: {q.difficulty}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                      <p className="text-sm text-secondary-foreground">
                        <strong>Try again tomorrow</strong> or purchase tickets to enter today's draws!
                      </p>
                    </div>
                    <Link to="/buy" onClick={() => window.scrollTo(0, 0)}>
                      <PremiumButton variant="gold" size="lg" className="w-full">
                        Buy Tickets Instead
                      </PremiumButton>
                    </Link>
                    <Link to="/how-it-works" onClick={() => window.scrollTo(0, 0)}>
                      <PremiumButton variant="outline" size="lg" className="w-full">
                        Learn How It Works
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

  // Quiz intro/start screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-24">
          {/* Hero Section */}
          <section className="section-padding">
            <div className="container-premium text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
                Expert Knowledge Challenge
              </h1>
              <p className="text-xl text-secondary-foreground max-w-4xl mx-auto mb-8">
                Think you're smart enough? Answer 10 extremely difficult questions correctly to earn a 
                FREE $5 ticket for our $700 draw. This isn't your average quiz — only 2-3% pass.
              </p>
              
              <div className="glass rounded-lg p-8 max-w-3xl mx-auto mb-12">
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <Brain className="w-12 h-12 text-primary mx-auto mb-3" />
                    <div className="text-2xl font-bold text-primary">10</div>
                    <div className="text-sm text-secondary-foreground">Expert Questions</div>
                  </div>
                  <div className="text-center">
                    <Clock className="w-12 h-12 text-warning mx-auto mb-3" />
                    <div className="text-2xl font-bold text-warning">40s</div>
                    <div className="text-sm text-secondary-foreground">Per Question</div>
                  </div>
                  <div className="text-center">
                    <Trophy className="w-12 h-12 text-success mx-auto mb-3" />
                    <div className="text-2xl font-bold text-success">$5</div>
                    <div className="text-sm text-secondary-foreground">Free Ticket Value</div>
                  </div>
                </div>
                
                <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
                  <div className="text-warning font-medium mb-2">⚠️ Challenge Requirements:</div>
                  <ul className="text-sm text-secondary-foreground space-y-1">
                    <li>• ALL 10 questions must be answered correctly</li>
                    <li>• 40-second time limit per question (no exceptions)</li>
                    <li>• No going back to previous questions</li>
                    <li>• One attempt per 24-hour period</li>
                    <li>• Questions cover advanced topics in science, history, math, and more</li>
                  </ul>
                </div>
              </div>

              {/* Sample Question Preview */}
              <div className="glass rounded-lg p-8 max-w-2xl mx-auto mb-12">
                <h3 className="text-xl font-display font-semibold mb-4">Sample Question Preview</h3>
                <div className="bg-surface/50 p-6 rounded-lg mb-4">
                  <div className="text-sm text-accent mb-2">Category: Advanced Mathematics</div>
                  <div className="text-lg font-medium mb-4">
                    "In topology, what is the genus of a surface homeomorphic to a torus with two handles?"
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {["0", "1", "2", "3"].map((option, i) => (
                      <div key={i} className="p-3 border border-accent/30 rounded text-sm">
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-secondary-foreground">
                  This is the level of difficulty you can expect. Are you ready for the challenge?
                </p>
              </div>

              {/* Success Rate */}
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
                <div className="glass rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-destructive mb-2">97%</div>
                  <div className="text-sm text-secondary-foreground">Failure Rate</div>
                  <div className="text-xs text-accent mt-1">Most people don't pass</div>
                </div>
                <div className="glass rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-success mb-2">3%</div>
                  <div className="text-sm text-secondary-foreground">Success Rate</div>
                  <div className="text-xs text-accent mt-1">Elite knowledge required</div>
                </div>
                <div className="glass rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">$5</div>
                  <div className="text-sm text-secondary-foreground">Free Ticket Value</div>
                  <div className="text-xs text-accent mt-1">For $700 draw</div>
                </div>
              </div>

              <div className="space-y-6">
                <PremiumButton variant="hero" size="xl" onClick={startQuiz}>
                  <Brain className="w-6 h-6 mr-2" />
                  Start Expert Challenge
                </PremiumButton>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <Link to="/buy" onClick={() => window.scrollTo(0, 0)}>
                    <PremiumButton variant="gold" size="lg" className="flex-1">
                      Buy Tickets Instead
                    </PremiumButton>
                  </Link>
                  <Link to="/rules" onClick={() => window.scrollTo(0, 0)}>
                    <PremiumButton variant="outline" size="lg" className="flex-1">
                      Read Rules First
                    </PremiumButton>
                  </Link>
                </div>
                
                <p className="text-sm text-secondary-foreground">
                  By starting the quiz, you agree to our Official Rules and confirm you are 18+
                </p>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  // Active quiz
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        <section className="pb-24">
          <div className="container-premium">
            <div className="max-w-3xl mx-auto">
              {/* Progress Header */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-sm text-secondary-foreground">
                      Expert Challenge Progress
                    </span>
                    <div className="text-lg font-semibold">
                      Question {currentQuestion + 1} of {expertQuestions.length}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
                      <Clock className="w-5 h-5 text-warning" />
                      <span className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-destructive animate-pulse' : 'text-warning'}`}>
                        {timeLeft}s
                      </span>
                    </div>
                    <div className="text-xs text-secondary-foreground">Time remaining</div>
                  </div>
                </div>
                
                {/* Progress Bars */}
                <div className="space-y-2">
                  <div className="w-full bg-surface/50 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestion + 1) / expertQuestions.length) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-full bg-surface/50 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        timeLeft <= 10 ? 'bg-destructive' : timeLeft <= 20 ? 'bg-warning' : 'bg-success'
                      }`}
                      style={{ width: `${(timeLeft / 40) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Question Card */}
              <div className="glass rounded-lg p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/20 px-3 py-1 rounded-full text-sm text-primary font-medium">
                      {expertQuestions[currentQuestion].difficulty}
                    </div>
                    <div className="bg-destructive/20 px-3 py-1 rounded-full text-sm text-destructive font-medium">
                      Expert Level
                    </div>
                  </div>
                  <div className="text-sm text-accent font-medium">
                    Worth: $5 Free Ticket
                  </div>
                </div>
                
                <h3 className="text-xl md:text-2xl font-display font-semibold mb-8 text-center leading-relaxed">
                  {expertQuestions[currentQuestion].question}
                </h3>

                <div className="space-y-4">
                  {expertQuestions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={timeLeft === 0}
                      className={`w-full p-6 text-left rounded-lg border-2 transition-all duration-200 ${
                        selectedAnswers[currentQuestion] === index
                          ? 'border-primary bg-primary/20 text-primary shadow-lg'
                          : 'border-accent/30 hover:border-accent/60 hover:bg-accent/10'
                      } ${timeLeft === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                          selectedAnswers[currentQuestion] === index
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-accent/50 text-accent'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-lg">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-secondary-foreground">
                  {selectedAnswers.filter(a => a !== undefined).length} of {expertQuestions.length} answered
                </div>
                
                <PremiumButton
                  variant="gold"
                  size="lg"
                  onClick={handleNext}
                  disabled={selectedAnswers[currentQuestion] === undefined || timeLeft === 0}
                >
                  {currentQuestion === expertQuestions.length - 1 ? 'Submit Challenge' : 'Next Question'}
                </PremiumButton>
              </div>

              {/* Warning */}
              <div className="mt-8 p-6 glass rounded-lg border border-warning/30">
                <div className="flex items-start space-x-4">
                  <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0 mt-1" />
                  <div className="text-sm text-secondary-foreground">
                    <p className="font-medium text-warning mb-2">Critical Rules:</p>
                    <ul className="space-y-1">
                      <li>• You cannot return to previous questions</li>
                      <li>• Timer will auto-advance if no answer is selected</li>
                      <li>• All 10 answers must be correct to earn the free ticket</li>
                      <li>• Only one attempt allowed per 24-hour period</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>
      </main>

      <Footer />
    </div>
  );
}