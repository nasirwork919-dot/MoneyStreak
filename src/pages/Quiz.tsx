import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PremiumButton } from "@/components/ui/premium-button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  Clock, 
  Trophy, 
  Star, 
  CheckCircle, 
  X, 
  AlertTriangle,
  Timer,
  Award,
  Target
} from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  category: string;
  difficulty: "expert";
}

const expertQuestions: Question[] = [
  {
    id: 1,
    question: "What is the exact value of Euler's number (e) to 10 decimal places?",
    options: [
      "2.7182818284",
      "2.7182818285", 
      "2.7182818283",
      "2.7182818286"
    ],
    correct: 0,
    category: "Mathematics",
    difficulty: "expert"
  },
  {
    id: 2,
    question: "Which element has the atomic number 74?",
    options: ["Tungsten", "Rhenium", "Osmium", "Tantalum"],
    correct: 0,
    category: "Chemistry",
    difficulty: "expert"
  },
  {
    id: 3,
    question: "In what year did the Treaty of Westphalia end the Thirty Years' War?",
    options: ["1646", "1648", "1650", "1652"],
    correct: 1,
    category: "History",
    difficulty: "expert"
  },
  {
    id: 4,
    question: "What is the capital of Bhutan?",
    options: ["Thimphu", "Paro", "Punakha", "Jakar"],
    correct: 0,
    category: "Geography",
    difficulty: "expert"
  },
  {
    id: 5,
    question: "Who wrote the novel 'The Brothers Karamazov'?",
    options: ["Leo Tolstoy", "Fyodor Dostoevsky", "Ivan Turgenev", "Anton Chekhov"],
    correct: 1,
    category: "Literature",
    difficulty: "expert"
  },
  {
    id: 6,
    question: "What is the speed of light in a vacuum (in meters per second)?",
    options: ["299,792,458", "299,792,459", "299,792,457", "299,792,460"],
    correct: 0,
    category: "Physics",
    difficulty: "expert"
  },
  {
    id: 7,
    question: "Which composer wrote 'The Art of Fugue'?",
    options: ["Wolfgang Amadeus Mozart", "Ludwig van Beethoven", "Johann Sebastian Bach", "George Frideric Handel"],
    correct: 2,
    category: "Music",
    difficulty: "expert"
  },
  {
    id: 8,
    question: "What is the largest moon of Saturn?",
    options: ["Enceladus", "Titan", "Mimas", "Iapetus"],
    correct: 1,
    category: "Astronomy",
    difficulty: "expert"
  },
  {
    id: 9,
    question: "In computer science, what does 'NP' stand for in 'NP-complete'?",
    options: ["Non-Polynomial", "Nondeterministic Polynomial", "Not Provable", "Nearly Perfect"],
    correct: 1,
    category: "Computer Science",
    difficulty: "expert"
  },
  {
    id: 10,
    question: "Which artist painted 'The Persistence of Memory' featuring melting clocks?",
    options: ["Pablo Picasso", "René Magritte", "Salvador Dalí", "Joan Miró"],
    correct: 2,
    category: "Art",
    difficulty: "expert"
  }
];

export default function Quiz() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(40);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [canTakeQuiz, setCanTakeQuiz] = useState(true);
  const [lastAttempt, setLastAttempt] = useState<Date | null>(null);

  useEffect(() => {
    if (user) {
      checkQuizEligibility();
    }
  }, [user]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && quizStarted && !quizCompleted) {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted, quizCompleted]);

  const checkQuizEligibility = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('created_at, passed')
        .eq('user_id', user.id)
        .gte('created_at', new Date().toISOString().split('T')[0])
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setCanTakeQuiz(false);
        setLastAttempt(new Date(data[0].created_at));
      }
    } catch (error) {
      console.error('Error checking quiz eligibility:', error);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setTimeLeft(40);
    setSelectedAnswer(null);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (currentQuestion < expertQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimeLeft(40);
    } else {
      completeQuiz(newAnswers);
    }
  };

  const handleTimeUp = () => {
    if (selectedAnswer !== null) {
      handleNextQuestion();
    } else {
      // Auto-select wrong answer if no selection made
      const newAnswers = [...answers, -1];
      setAnswers(newAnswers);
      
      if (currentQuestion < expertQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setTimeLeft(40);
      } else {
        completeQuiz(newAnswers);
      }
    }
  };

  const completeQuiz = async (finalAnswers: number[]) => {
    setLoading(true);
    setQuizCompleted(true);

    // Calculate score
    const correctAnswers = finalAnswers.reduce((count, answer, index) => {
      return answer === expertQuestions[index].correct ? count + 1 : count;
    }, 0);

    setScore(correctAnswers);
    const passed = correctAnswers === expertQuestions.length;

    try {
      // Record quiz attempt
      const { error: attemptError } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user?.id,
          questions_answered: finalAnswers.length,
          correct_answers: correctAnswers,
          passed: passed,
          time_taken: (expertQuestions.length * 40) - timeLeft
        });

      if (attemptError) throw attemptError;

      // If passed, create free ticket
      if (passed && user) {
        const { error: ticketError } = await supabase
          .from('tickets')
          .insert({
            user_id: user.id,
            ticket_type: 'free_quiz',
            amount: 0,
            draw_type: '700',
            draw_date: getNextDrawDate()
          });

        if (ticketError) throw ticketError;

        toast({
          title: "Congratulations!",
          description: "Perfect score! You've earned a free $5 ticket for the $700 draw.",
        });
      } else {
        toast({
          title: "Quiz Complete",
          description: `You scored ${correctAnswers}/10. All answers must be correct to earn a free ticket.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error recording quiz attempt:', error);
      toast({
        title: "Error",
        description: "Failed to record quiz attempt. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getNextDrawDate = () => {
    const now = new Date();
    const next700 = new Date(now.getFullYear(), now.getMonth(), 20);
    if (next700 <= now) {
      next700.setMonth(next700.getMonth() + 1);
    }
    return next700.toISOString().split('T')[0];
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setTimeLeft(40);
    setScore(0);
  };

  const getTimeUntilNextAttempt = () => {
    if (!lastAttempt) return null;
    const nextAttempt = new Date(lastAttempt);
    nextAttempt.setDate(nextAttempt.getDate() + 1);
    const now = new Date();
    const diff = nextAttempt.getTime() - now.getTime();
    
    if (diff <= 0) {
      setCanTakeQuiz(true);
      return null;
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 flex items-center justify-center min-h-[80vh]">
          <div className="text-center max-w-md">
            <Brain className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-display font-bold mb-4">Sign In Required</h2>
            <p className="text-secondary-foreground mb-6">
              Please sign in to take the free quiz and earn tickets.
            </p>
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
        {!quizStarted && !quizCompleted && (
          <>
            {/* Hero Section */}
            <section className="section-padding">
              <div className="container-premium text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
                  Free Entry Quiz
                </h1>
                <p className="text-xl text-secondary-foreground max-w-4xl mx-auto mb-8">
                  Answer all 10 expert-level questions correctly to earn a free $5 ticket for the $700 draw. 
                  You have 40 seconds per question and cannot go back.
                </p>
                
                <div className="glass rounded-lg p-8 max-w-3xl mx-auto mb-12">
                  <h3 className="text-2xl font-display font-semibold mb-6">Quiz Challenge Rules</h3>
                  <div className="grid md:grid-cols-2 gap-6 text-left">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Target className="w-5 h-5 text-primary" />
                        <span>10 extremely difficult questions</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Timer className="w-5 h-5 text-warning" />
                        <span>40 seconds per question</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Trophy className="w-5 h-5 text-success" />
                        <span>Must get ALL answers correct</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <X className="w-5 h-5 text-destructive" />
                        <span>No going back to previous questions</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-accent" />
                        <span>One attempt per 24 hours</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Star className="w-5 h-5 text-primary" />
                        <span>~2-3% success rate</span>
                      </div>
                    </div>
                  </div>
                </div>

                {canTakeQuiz ? (
                  <div className="space-y-6">
                    <div className="bg-warning/10 border border-warning/30 rounded-lg p-6 max-w-2xl mx-auto">
                      <div className="flex items-center space-x-3 mb-3">
                        <AlertTriangle className="w-6 h-6 text-warning" />
                        <h4 className="text-lg font-semibold text-warning">Expert Difficulty Warning</h4>
                      </div>
                      <p className="text-secondary-foreground text-sm">
                        These questions are designed to be extremely challenging. Topics include advanced mathematics, 
                        science, history, geography, literature, and more. Only the most knowledgeable participants 
                        will earn free tickets.
                      </p>
                    </div>
                    
                    <PremiumButton
                      variant="hero"
                      size="xl"
                      onClick={startQuiz}
                      className="animate-pulse-glow"
                    >
                      <Brain className="w-6 h-6 mr-3" />
                      Start Expert Challenge
                    </PremiumButton>
                    
                    <p className="text-sm text-secondary-foreground">
                      By starting, you agree to the challenge rules and understand this is a skill-based test.
                    </p>
                  </div>
                ) : (
                  <div className="glass rounded-lg p-8 max-w-2xl mx-auto">
                    <Clock className="w-16 h-16 text-warning mx-auto mb-6" />
                    <h3 className="text-2xl font-display font-semibold mb-4">
                      Quiz Cooldown Active
                    </h3>
                    <p className="text-secondary-foreground mb-6">
                      You can take the quiz once every 24 hours. Your next attempt will be available in:
                    </p>
                    <div className="text-3xl font-bold text-primary mb-6">
                      {getTimeUntilNextAttempt()}
                    </div>
                    <p className="text-sm text-secondary-foreground">
                      Use this time to study and prepare for the expert-level challenge!
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Sample Questions Preview */}
            <section className="pb-24 bg-surface/30">
              <div className="container-premium section-padding">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                    Question Categories & Difficulty
                  </h2>
                  <p className="text-xl text-secondary-foreground max-w-3xl mx-auto">
                    Our quiz covers diverse topics at expert level. Here's what to expect:
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {[
                    { category: "Mathematics", icon: Target, description: "Advanced calculus, number theory, complex equations" },
                    { category: "Science", icon: Award, description: "Physics, chemistry, biology at university level" },
                    { category: "History", icon: Clock, description: "World history, specific dates, lesser-known events" },
                    { category: "Geography", icon: Star, description: "World capitals, obscure locations, physical features" },
                    { category: "Literature", icon: Trophy, description: "Classic authors, specific works, literary analysis" },
                    { category: "General Knowledge", icon: Brain, description: "Art, music, technology, current events" }
                  ].map((cat, index) => (
                    <div key={index} className="glass rounded-lg p-6 text-center hover-lift">
                      <cat.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                      <h3 className="text-lg font-display font-semibold mb-3">{cat.category}</h3>
                      <p className="text-sm text-secondary-foreground">{cat.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {quizStarted && !quizCompleted && (
          <section className="min-h-screen flex items-center justify-center py-16">
            <div className="container-premium">
              <div className="max-w-4xl mx-auto">
                {/* Progress & Timer */}
                <div className="flex items-center justify-between mb-8">
                  <div className="text-sm text-secondary-foreground">
                    Question {currentQuestion + 1} of {expertQuestions.length}
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-secondary-foreground">
                      {expertQuestions[currentQuestion].category}
                    </div>
                    <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-destructive animate-pulse' : 'text-primary'}`}>
                      {timeLeft}s
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-surface/50 rounded-full h-2 mb-8">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / expertQuestions.length) * 100}%` }}
                  />
                </div>

                {/* Question */}
                <div className="glass rounded-lg p-8 mb-8">
                  <h2 className="text-2xl md:text-3xl font-display font-semibold mb-8 leading-relaxed">
                    {expertQuestions[currentQuestion].question}
                  </h2>
                  
                  <div className="grid gap-4">
                    {expertQuestions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={`p-6 text-left rounded-lg border-2 transition-all duration-300 ${
                          selectedAnswer === index
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-accent/30 hover:border-accent hover:bg-accent/5'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                            selectedAnswer === index
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-accent/50'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="text-lg">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Next Button */}
                <div className="text-center">
                  <PremiumButton
                    variant="hero"
                    size="xl"
                    onClick={handleNextQuestion}
                    disabled={selectedAnswer === null}
                    className="min-w-48"
                  >
                    {currentQuestion === expertQuestions.length - 1 ? 'Complete Quiz' : 'Next Question'}
                  </PremiumButton>
                </div>
              </div>
            </div>
          </section>
        )}

        {quizCompleted && (
          <section className="section-padding">
            <div className="container-premium text-center">
              <div className="max-w-3xl mx-auto">
                {score === expertQuestions.length ? (
                  <>
                    <Trophy className="w-24 h-24 text-success mx-auto mb-8 animate-pulse-glow" />
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-success">
                      Perfect Score!
                    </h1>
                    <p className="text-xl text-secondary-foreground mb-8">
                      Incredible! You answered all {expertQuestions.length} expert questions correctly. 
                      You've earned a free $5 ticket for the next $700 draw.
                    </p>
                    
                    <div className="glass rounded-lg p-8 mb-8">
                      <h3 className="text-xl font-display font-semibold mb-4">Your Free Ticket</h3>
                      <div className="text-3xl font-bold text-gradient-gold mb-4">$5 Value</div>
                      <p className="text-secondary-foreground">
                        Applied to next $700 draw • Check your dashboard for details
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Brain className="w-24 h-24 text-warning mx-auto mb-8" />
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
                      Quiz Complete
                    </h1>
                    <p className="text-xl text-secondary-foreground mb-8">
                      You scored {score} out of {expertQuestions.length}. All questions must be correct to earn a free ticket.
                    </p>
                    
                    <div className="glass rounded-lg p-8 mb-8">
                      <h3 className="text-xl font-display font-semibold mb-4">Your Results</h3>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <div className="text-3xl font-bold text-primary">{score}</div>
                          <div className="text-sm text-secondary-foreground">Correct Answers</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-warning">{Math.round((score / expertQuestions.length) * 100)}%</div>
                          <div className="text-sm text-secondary-foreground">Accuracy</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-accent">Expert</div>
                          <div className="text-sm text-secondary-foreground">Difficulty Level</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
                    <a href="/dashboard">
                      <PremiumButton variant="gold" size="lg" className="flex-1">
                        View Dashboard
                      </PremiumButton>
                    </a>
                    <a href="/buy">
                      <PremiumButton variant="outline" size="lg" className="flex-1">
                        Buy Additional Tickets
                      </PremiumButton>
                    </a>
                  </div>
                  
                  {score < expertQuestions.length && (
                    <p className="text-sm text-secondary-foreground">
                      Try again tomorrow for another chance at a free ticket!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}