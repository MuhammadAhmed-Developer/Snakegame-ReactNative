import * as React  from "react"
import { SafeAreaView, StyleSheet, Text, View } from "react-native"
import { Colors } from "../styles/colors"
import {PanGestureHandler} from "react-native-gesture-handler"
import { Coordinate, Direction, GestureEventType } from "../types/types"
import {useState } from "react"
import Snake from "./snake"
import { checkGameOver } from "../utils/CheckGameOver"
import Food from "./Food"
import { checkEatsFood } from "../utils/checkEatsFood"
import { randomFoodPosition } from "../utils/randomFoodPositions"
import Header from "./Header"

const SNAKE_INITIAL_POSITION = [{x:5, y:5}];
const FOOD_INITIAL_POSITION = {x:5, y:5};
const GAME_BOUNDS = {xMin:0, xMax:32, yMin:0, yMax:59};
const MOVE_INTERVAL = 80;
const SCORE_INCRENMENT = 10;

export default function Game():JSX.Element{

    const [direction, setDirection] = React.useState<Direction>(Direction.Right)
    const [snake, setSnake] = React.useState<Coordinate[]>(SNAKE_INITIAL_POSITION)
    const [food, setFood] = React.useState<Coordinate>(FOOD_INITIAL_POSITION)
    const [isGameOver, setIsGameOver] = React.useState<boolean>(false)
    const [isPaused, setIsPaused] = React.useState<boolean>(false)
    const [score, setscore] = React.useState<number>(0)


    React.useEffect(()=>{
          if(!isGameOver){
             const intervalId = setInterval(()=>{
              !isPaused &&  movesnake()
             }, MOVE_INTERVAL)
             
             return () => clearInterval(intervalId)
          }
    }, [snake, isGameOver, isPaused])



    //movesnake function 
    const movesnake = () =>{
        const snakedHead = snake[0]
        const newHead = {...snakedHead}  //creating a copy of head 

        
        // game over

        if(checkGameOver(snakedHead, GAME_BOUNDS)){
              setIsGameOver((prev)=> !prev)
              return
        }

        switch (direction){
            case Direction.Up:
                newHead.y -= 1;
                break
            case Direction.Down:
                newHead.y += 1;
                break
            case Direction.Left:
                newHead.x -= 1;
                break
            case Direction.Right:
                newHead.x += 1;
                break
             default:
                break   
        }

        if(checkEatsFood(newHead, food, 2)){
            // get another position of food
            setFood(randomFoodPosition(GAME_BOUNDS.xMax, GAME_BOUNDS.yMax))
        setSnake([newHead, ...snake])
        setscore(score+SCORE_INCRENMENT)
          
        }else{
            setSnake([newHead, ...snake.slice(0, -1)])

        }

    }



    // function check user swiping
    const handleGesture = (event:GestureEventType) =>{
        const {translationX, translationY} = event.nativeEvent
    //    console.log(translationX, translationY);    get values
    if(Math.abs(translationX) > Math.abs(translationY)){
        if(translationX>0){
            //moving right
            setDirection(Direction.Right)
        }else{
            //moving left
            setDirection(Direction.Left)

        }

    }else{
        if(translationY>0){
            setDirection(Direction.Down)
            //moving down
        }else{
            // moving up
            setDirection(Direction.Up)

        }
    }
       
    }


    const reloadGame = () => {
        setSnake(SNAKE_INITIAL_POSITION);
        setFood(FOOD_INITIAL_POSITION);
        setIsGameOver(false);
        setscore(0);
        setDirection(Direction.Right);
        setIsPaused(false);
      };



    const pauseGame = () =>{
        setIsPaused(!isPaused)
    }

    return(
        // PanGestureHandler is give event when swiping
        <PanGestureHandler onGestureEvent={handleGesture}>
            <SafeAreaView style={styles.container}>
                <Header  isPaused={isPaused} pauseGame={pauseGame} reloadGame={reloadGame}>
                    <Text style={{fontSize:20, fontWeight:'bold'}}>{score}</Text>
                </Header>
                <View style={styles.boundries}>
                    <Snake snake={snake}/>
                    <Food x={food.x} y={food.y}/>
                </View>
            </SafeAreaView>
        </PanGestureHandler>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:Colors.primary
    },
    boundries:{
        // marginTop:10,
        flex:1,
        borderColor:Colors.primary,
        borderWidth:12,
        borderRadius:30,
        backgroundColor:Colors.background
    }
})