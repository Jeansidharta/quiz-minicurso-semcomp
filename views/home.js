import React from "react";
import { StyleSheet, Dimensions, Text, View, Alert, Animated, Button, ActivityIndicator } from 'react-native';

import axios from "axios";

import Colors from "../constants/colors";

const API_URL = "https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=boolean&encode=url3986";

let points = 0;

const TimerBar = React.forwardRef(function TimerBar({onTimeout = (()=>{})}, ref){
	const [width] = React.useState(new Animated.Value(Dimensions.get("window").width));
	const animationRef = React.useRef();
	React.useEffect(()=>{
		animationRef.current = Animated.timing(
			width,
			{
				toValue: 0,
				duration: 5000,
			}
		);
		animationRef.current.start();
	}, []);
	React.useEffect(()=>{
		const id = width.addListener(({value})=>{
			if(value == 0)
				onTimeout();
		});
		return ()=>{
			width.removeListener(id);
		}
	}, [onTimeout]);
	function reset(){
		width.setValue(Dimensions.get("window").width);
		animationRef.current.start();
	}
	function stop(){
		animationRef.current.stop();
	}
	React.useImperativeHandle(ref, ()=>({reset, stop}));
	return(
		<>
			<View style={styles.timerBar}/>
			<Animated.View ref={ref} style={[styles.timerBar, {
				transform: [{translateY: -10}],
				backgroundColor: Colors.success,
				width: width
			}]} />
		</>
	);
});

export default function Home() {
	const [questions, setQuestions] = React.useState([{}]);
	const [questionIndex, setQuestionIndex] = React.useState(0);
	const [isLoading, setIsLoading] = React.useState(true);
	const timerBarRef = React.useRef();

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
		timerBarRef.current.stop();
		Alert
			.alert("Game finished!", `You correctly answered ${points} questions! Congratulations!`, [
				{text: "Play Again", onPress: resetGame},
			], { cancelable: false });
	}

	function choose(answer){
		const correctAnswer = questions[questionIndex].correct_answer == "True" ? true : false;
		timerBarRef.current.reset();

		if (answer === correctAnswer) {
			points += 1;
		}

		if (questionIndex === questions.length - 1) {
			endGame();
		} else {
			setQuestionIndex(questionIndex + 1);
		}
	}

	function onQuestionTimeout(){
		choose(null);
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
			(<>
				<View style={styles.questionContainer}>
					<Text style={styles.questionText}>
						{ decodeURIComponent(questions[questionIndex].question) }
					</Text>
				</View>
				<TimerBar ref={timerBarRef} onTimeout={onQuestionTimeout}/>
				<Text style={styles.correctAnwsersText}>Correct answers: { points }/{ questions.length }</Text>
				<View style={styles.buttonsContainer}>
					<View style={styles.button}>
						<Button color={Colors.danger} title="False" onPress={() => choose(false)}/>
					</View>
					<View style={styles.button}>
						<Button color={Colors.success} title="True" onPress={() => choose(true)}/>
					</View>
				</View>
			</>) }
		</View>
	);
}

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: 'center'
	},
	timerBar: {
		height: 10,
		width: "100%",
		backgroundColor: Colors.danger
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