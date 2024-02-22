import React, { useEffect, useState } from "react";
import he from "he";
import {
  Box,
  Button,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
const Trivia = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [value, setValue] = useState("");
  const [error, setError] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [question, setQuestion] = useState();
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [attemptQuestions, setAttemptQuestions] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    getQuestion();
  }, []);

  useEffect(() => {
    shuffleAnswers();
  }, [currentQuestion, question]);
  const getQuestion = async (retryCount = 3) => {
    try {
      const response = await fetch(`https://opentdb.com/api.php?amount=10`);
      var data = await response.json();
      if (data.response_code === 0) {
        setQuestion(data.results);
      }
    } catch (error) {
      throw new Error();
    }
  };

  const checkAnswer = (no) => {
    var correctAnswers = he.decode(question[no].correct_answer);
    setError(true);
    if (correctAnswers === value) {
      setCorrectAnswer(correctAnswer + 1);
    } else {
      setError(false);
    }
    const QNA = {
      question: question[no].question,
      correctAnswer: correctAnswers,
      yourAnswer: value,
    };
    var attempted = [...attemptQuestions, QNA];
    setAttemptQuestions(attempted);

    const interval = setInterval(() => {
      if (question.length === no + 1) {
        setShowResults(true);
      } else {
        setCurrentQuestion((prevCurrentQuestion) => prevCurrentQuestion + 1);
        setError(null);
        setValue("");
      }
      clearInterval(interval);
    }, 1000);
  };
  const shuffleAnswers = () => {
    if (question) {
      const allAnswers = [
        question[currentQuestion].correct_answer,
        ...question[currentQuestion].incorrect_answers,
      ];

      for (let i = allAnswers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
      }
      setShuffledAnswers(allAnswers);
    }
  };
  return (
    <Box
      maxW={"700px"}
      margin={"100px auto"}
      backgroundColor={"#f4f4f4"}
      p={"20px"}
    >
      <Heading paddingBottom={5} textAlign={"center"} as="h2" size="lg">
        Trivia Quiz
      </Heading>
      {showResults ? (
        <>
          {attemptQuestions &&
            attemptQuestions.map((attempt, index) => {
              return (
                <Box key={index}>
                  <Heading as="h3" size="md" paddingBottom={1}>
                    {index + 1}. {attempt.question}
                  </Heading>
                  <Text color="green" fontSize="xl">
                    Correct Answer : {attempt.correctAnswer}
                  </Text>
                  <Text
                    color={
                      attempt.correctAnswer === attempt.yourAnswer
                        ? "green"
                        : "red"
                    }
                    fontSize="xl"
                    paddingBottom={5}
                  >
                    Your Answer : {attempt.yourAnswer}
                  </Text>
                </Box>
              );
            })}
          <Heading as="h3" size="md" paddingBottom={1}>
            Your Correct answer {correctAnswer} out of {attemptQuestions.length}{" "}
            questions
          </Heading>
        </>
      ) : (
        <>
          {question ? (
            <>
              <Heading as="h3" size="md" paddingBottom={3}>
                {currentQuestion + 1}.{" "}
                {
                  (question[currentQuestion].question = he.decode(
                    question[currentQuestion].question
                  ))
                }
              </Heading>
              <>
                <RadioGroup onChange={setValue} value={value}>
                  <Stack direction="column">
                    {shuffledAnswers &&
                      shuffledAnswers.map((ans, index) => {
                        return (
                          <Radio
                            colorScheme={
                              error === null ? "blue" : error ? "green" : "red"
                            }
                            key={index}
                            value={he.decode(ans)}
                          >
                            {he.decode(ans)}
                          </Radio>
                        );
                      })}
                  </Stack>
                </RadioGroup>
              </>
              {/* <input value={answer} type="text" onChange={(e)=>setAnswer(e.target.value)} />*/}
              <Button
                onClick={() => checkAnswer(currentQuestion)}
                marginTop={5}
                isDisabled={value === "" ? true : error ? true : false}
                colorScheme="blue"
              >
                Submit
              </Button>
              <Text
                color={error ? "green" : "red"}
                fontSize="xl"
                paddingBottom={5}
              >
                {error === null ? "" : error ? "Correct" : "InCorrect"}
              </Text>
            </>
          ) : (
            ""
          )}
        </>
      )}
    </Box>
  );
};

export default Trivia;
