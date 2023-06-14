
import { useReducer } from 'react';
import './App.css';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  EVALUATE: "evaluate",
  DELETE_DIGIT: "delete-digit",
}

function reducer(state,{type, payload}){

  switch (type){
    case ACTIONS.ADD_DIGIT:
      
     

      if(payload.digit === "0" && state.currentOperand === "0"){
        return state
      } 
      if(payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }

      if(state.overwrite){
        return{
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }

      return {
        ...state, currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }

    case ACTIONS.CHOOSE_OPERATION:

      

      if(state.currentOperand == null && state.previousOperand == null){
        return {}
      }
      
      if( state.previousOperand == null){
        return{
          ...state,
          operation: payload.operation,
          currentOperand: null,
          previousOperand: state.currentOperand,
        }
      }

      if(state.previousOperand != null){

        return{
          ...state,
          previousOperand: Evaluate(state),
          currentOperand: null,
          operation: payload.operation,
        }
      }
      
    case ACTIONS.CLEAR:
      return {}
 
    case ACTIONS.EVALUATE:

      if(state.currentOperand == null || state.previousOperand == null || state.operation == null){
        return {}
      }

      return{
        ...state,
        overwrite: true,
        currentOperand: Evaluate(state),
        previousOperand: null,
        operation: null,
      }

    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          currentOperand: null,
          overwrite: false,
        }
      }
      if(state.currentOperand == null) return state

      if(state.currentOperand.length === 1){
        return{ ...state, currentOperand: null}
      }

      return{
        ...state,
        currentOperand: state.currentOperand.slice(0,-1),
      }
    default:
      return state
  }
}

function Evaluate({currentOperand, previousOperand, operation}){
  const prev = parseFloat(previousOperand)
  const curr = parseFloat(currentOperand)

  if(isNaN(curr) || isNaN(prev)) return ""
  let computation = ""

  switch(operation){
    case "+":
      computation= prev + curr
      break
    case "-":
      computation= prev - curr
      break
    case "/":
      computation= prev / curr
      break
    case "*":
      computation= prev * curr
      break 
    default:
      break
  }

  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {maximumFractionDigits: 0,})

function formatOperand(operand){
  if(operand == null) return 
  const [integer,decimal] = operand.split('.')
  if(decimal == null) return INTEGER_FORMATTER.format(integer)

  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
  
}


function App() {

  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer,{})



  return (
    <div className='grid-container'>
      <div className='output'>
          <div className='previous-operand'>{formatOperand(previousOperand)} {operation}</div>
          <div className='current-operand'>{formatOperand(currentOperand)}</div>
      </div>
      <button className='span-two' onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>Del</button>
      <OperationButton dispatch={dispatch} operation="/" />
      <DigitButton dispatch={dispatch} digit="1" />
      <DigitButton dispatch={dispatch} digit="2" />
      <DigitButton dispatch={dispatch} digit="3" />
      <OperationButton dispatch={dispatch} operation="*" />
      <DigitButton dispatch={dispatch} digit="4" />
      <DigitButton dispatch={dispatch} digit="5" />
      <DigitButton dispatch={dispatch} digit="6" />
      <OperationButton dispatch={dispatch} operation="+" />
      <DigitButton dispatch={dispatch} digit="7" />
      <DigitButton dispatch={dispatch} digit="8" />
      <DigitButton dispatch={dispatch} digit="9" />
      <OperationButton dispatch={dispatch} operation="-" />
      <DigitButton dispatch={dispatch} digit="0" />
      <DigitButton dispatch={dispatch} digit="." />
      <button className='span-two'  onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  );
}

export default App;
