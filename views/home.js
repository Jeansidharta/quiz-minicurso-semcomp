import React from 'react';
import { StyleSheet, Text, View, Alert, Button } from 'react-native';
import Colors from "../constants/colors";

const API_URL = "https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=boolean&encode=url3986";

export default function Home() {
	let [points, setPoints] = React.useState(0);
	const [questions, setQuestions] = React.useState([{}]);
	const [questionIndex, setQuestionIndex] = React.useState(0);
	React.useEffect(()=>{
		// Alert.alert(
		// 	"Bem vindo(a)",
		// 	"Começar o quiz?",
		// 	[
		// 		{text: "Sim"},
		// 		{text: "Sim"}
		// 	]
		// );
		pullQuestions();
	}, []);
	async function pullQuestions(){
		const api = await fetch(API_URL);
		const data = await api.json();
		setQuestions(data.results);
		console.log(data.results);
	}
	async function resetGame(){
		await pullQuestions();
		setPoints(0);
		setQuestionIndex(0);
	}
	function endGame(){
		Alert.alert("Game finished!", `You correctly answered ${points} questions! Congratulations!`, [
			{text: "play again?", onPress: resetGame},
		]);
	}
	function click(answer){
		let correctAnswer = questions[questionIndex].correct_answer == "True"? true : false;
		if(answer == correctAnswer) setPoints(++points);
		if(questionIndex == questions.length - 1)
			endGame();
		else
			setQuestionIndex(questionIndex + 1);
	}
	return (
		<View style={styles.container}>
			<View style={styles.questionView}>
				<Text style={{
					fontSize: 32,
					color: "white",
					textAlign: "center"
				}}>
					{decodeURIComponent(questions[questionIndex].question)}
				</Text>
			</View>
			<View style={{width: "100%", flex: 1}}>
				<Text style={{
					textAlign: "center",
					flex: 1,
					fontSize: 20,
					marginTop: 20
				}}>Correct answers: {points}/{questions.length}</Text>
			</View>
			<View style={styles.buttonsView}>
				<View style={styles.buttonView}>
					<Button color={Colors.danger} title="False" onPress={()=>click(false)}/>
				</View>
				<View style={styles.buttonView}>
					<Button color={Colors.success} title="True" onPress={()=>click(true)}/>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
	},
	buttonView: {
		width: "40%",
		borderRadius: 8,
		overflow: "hidden"
	},
	buttonsView: {
		flex: 1,
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-around",
		height: 100
	},
	questionView: {
		flex: 2,
		backgroundColor: Colors.primary,
		height: "auto",
		width: "100%",
		alignItems: "center",
		justifyContent: "center"
	}
});