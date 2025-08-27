import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PremiumButton } from "@/components/ui/premium-button";
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

const questions = [
  {
    id: 1,
    question: "What is the capital city of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Perth"],
    correct: 2
  },
  {
    id: 2,
    question: "Which element has the chemical symbol 'Au'?",
    options: ["Silver", "Gold", "Aluminum", "Argon"],
    correct: 1
  },
  {
    id: 3,
    question: "In which year did the Berlin Wall fall?",
    options: ["1987", "1988", "1989", "1990"],
    correct: 2
  },
  {
    id: 4,
    question: "What is the largest planet in our solar system?",
    options: ["Saturn", "Jupiter", "Neptune", "Uranus"],
    correct: 1
  },
  {
    id: 5,
    question: "Who painted 'The Starry Night'?",
    options: ["Pablo Picasso", "Claude Monet", "Vincent van Gogh", "Leonardo da Vinci"],
    correct: 2
  }
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = () => {
    setIsVerifying(true);
    
    // Check if all answers are correct
    const allCorrect = selectedAnswers.every((answer, index) => 
      answer === questions[index].correct
    );
    
    setTimeout(() => {
      setIsVerifying(false);
      setQuizCompleted(true);
      setQuizPassed(allCorrect);
    }, 3000);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

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
                Checking your responses and issuing your entry...
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
        <Header />
        
        <main className="pt-24 flex items-center justify-center min-h-[80vh]">
          <div className="container-premium text-center">
            <div className="max-w-lg mx-auto glass rounded-lg p-12">
              {quizPassed ? (
                <>
                  <CheckCircle className="w-16 h-16 text-success mx-auto mb-6" />
                  <h2 className="text-2xl font-display font-semibold mb-4 text-success">
                    Congratulations!
                  </h2>
                  <p className="text-secondary-foreground mb-6">
                    Free ticket added! Entry #BM-2025-FREE-001. Check your dashboard.
                  </p>
                  <div className="space-y-3">
                    <PremiumButton variant="gold" className="w-full">
                      Go to Dashboard
                    </PremiumButton>
                    <PremiumButton variant="outline" className="w-full">
                      Read Official Rules
                    </PremiumButton>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-16 h-16 text-destructive mx-auto mb-6" />
                  <h2 className="text-2xl font-display font-semibold mb-4 text-destructive">
                    Almost There!
                  </h2>
                  <p className="text-secondary-foreground mb-6">
                    You got {selectedAnswers.filter((answer, index) => answer === questions[index].correct).length} out of {questions.length} correct. Try again in 24 hours or use the mail-in option in the Official Rules.
                  </p>
                  <div className="space-y-3">
                    <PremiumButton variant="outline" className="w-full">
                      Read Official Rules
                    </PremiumButton>
                    <PremiumButton variant="glass" className="w-full">
                      Buy Tickets Instead
                    </PremiumButton>
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
              No Purchase Necessary
            </h1>
            <p className="text-xl text-secondary-foreground max-w-3xl mx-auto mb-8">
              Answer 5 difficult questions. All correct = 1 free ticket. Limit 1 per draw period. 
              CAPTCHA & email verification required.
            </p>
            
            <div className="flex items-center justify-center space-x-4 text-sm text-secondary-foreground">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <span>All questions must be correct</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-accent" />
                <span>24-hour cooldown between attempts</span>
              </div>
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
                  <span className="text-sm text-secondary-foreground">
                    {Math.round(progress)}% Complete
                  </span>
                </div>
                <div className="w-full bg-surface/50 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Question Card */}
              <div className="glass rounded-lg p-8 mb-8">
                <h3 className="text-xl font-display font-semibold mb-6 text-center">
                  {questions[currentQuestion].question}
                </h3>

                <div className="space-y-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                        selectedAnswers[currentQuestion] === index
                          ? 'border-primary bg-primary/20 text-primary'
                          : 'border-accent/30 hover:border-accent/60 hover:bg-accent/10'
                      }`}
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
              <div className="flex justify-between items-center">
                <PremiumButton
                  variant="outline"
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </PremiumButton>

                <PremiumButton
                  variant="gold"
                  onClick={handleNext}
                  disabled={selectedAnswers[currentQuestion] === undefined}
                >
                  {currentQuestion === questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
                </PremiumButton>
              </div>

              {/* Info */}
              <div className="mt-8 p-4 glass rounded-lg">
                <p className="text-sm text-secondary-foreground text-center">
                  We use this quiz to ensure a genuine free entry path as required by sweepstakes law.
                  <br />
                  <a href="/rules" className="text-primary hover:text-accent underline">
                    See Official Rules for mail-in alternative
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}