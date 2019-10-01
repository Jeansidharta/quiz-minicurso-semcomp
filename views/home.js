import React from 'react';
import { StyleSheet, Text, View, Alert, Button, ProgressBarAndroid, ActivityIndicator } from 'react-native';

import axios from "axios";

import Colors from "../constants/colors";

const API_URL = "https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=boolean&encode=url3986";

let points = 0;

export default function Home() {
	const [questions, setQuestions] = React.useState([{}]);
	const [questionIndex, setQuestionIndex] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  
	React.useEffect(()=>{
    getQuestions();
  }, []);
  
	function getQuestions(){
    setIsLoading(true);

    axios.get(API_URL)
      .then((res) => {
        setQuestions(res.data.results);
        setIsLoading(false);
      }, (err) => {
        setIsLoading(false);
        getQuestions();
      });
  }
  
	function resetGame(){
		getQuestions();
		points = 0;
    setQuestionIndex(0);
  }
  
	function endGame(){
    Alert
      .alert("Game finished!", `You correctly answered ${points} questions! Congratulations!`, [
			  {text: "Play Again", onPress: resetGame},
		  ], { cancelable: false });
  }
  
	function choose(answer){
		const correctAnswer = questions[questionIndex].correct_answer == "True" ? true : false;
    
    if (answer === correctAnswer) {
      points += 1;
    }
    
    if (questionIndex === questions.length - 1) {
			endGame();
    } else {
      setQuestionIndex(questionIndex + 1);
    }
  }
  
	return (
		<View style={styles.container}>
      { isLoading ? 
        (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.tertiary} />
          </View>
        )
        : 
        (
          <>
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>
                { decodeURIComponent(questions[questionIndex].question) }
              </Text>
            </View>

            <Text style={styles.correctAnwsersText}>Correct answers: { points }/{ questions.length }</Text>

            <View style={styles.buttonsContainer}>
              <View style={styles.button}>
                <Button color={Colors.danger} title="False" onPress={() => choose(false)}/>
              </View>
              <View style={styles.button}>
                <Button color={Colors.success} title="True" onPress={() => choose(true)}/>
              </View>
            </View>
          </>
        ) }
		</View>
	);
}

const styles = StyleSheet.create({
  loadingContainer: {
		flex: 1,
		justifyContent: 'center'
  },
	container: {
		flex: 1,
		backgroundColor: Colors.white,
  },
  textBlack: {
    color: Colors.black
  },
  questionContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 20
  },
  questionText: {
    fontSize: 32,
    color: Colors.white,
    textAlign: "center",
    textAlignVertical: "center"
  },
  correctAnwsersText: {
    textAlign: "center",
    fontSize: 20,
    paddingVertical: 40
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 40
  },
	button: {
		width: "40%",
		borderRadius: 8,
    overflow: "hidden"
	},
});