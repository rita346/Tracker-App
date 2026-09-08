import {View, StyleSheet, Text,Alert} from "react-native";
import Input from "./Input";
import {useState} from "react";
import Button from "../UI/Button";
import {getFormattedDate} from "../../util/date";
import {GlobalStyles} from "../../constants/styles";

function ExpenseForm({onCancel,onSubmit,submitButtonLabel,defaultValues}) {
    const [inputs, setInputs] =useState({
        amount: {
            value: defaultValues? defaultValues.amount.toString() : '',
            isValid: true
        },
        date: {
            value: defaultValues? getFormattedDate(defaultValues.date) : '',
            isValid: true
        },
        description: {
            value: defaultValues? defaultValues.description : '',
            isValid: true
        },
    });

    function inputChangedHandler(inputIdentifier,enteredValue) {
        setInputs((currentInputs)=>{
            return {
                ...currentInputs,
                [inputIdentifier]: {value: enteredValue, isValid: true},
            }
        });
    }

    function submitHandler(){
        const expenseDate = {
            amount: +inputs.amount.value,
            date: new Date(inputs.date.value),
            description: inputs.description.value,
        };

        const amountIsValid = !isNaN(expenseDate.amount) && expenseDate.amount > 0;
        const dateIsValid =  expenseDate.date.toString() !== 'Invalid Date';
        const descriptionIsValid = expenseDate.description.trim().length > 0;

        if (!amountIsValid || !descriptionIsValid || !dateIsValid) {
            // Alert.alert('Invalid input','Please check your input values')
            setInputs((currentInputs)=>{
                return {
                    amount: {value: currentInputs.amount.value, isValid: amountIsValid},
                    date: {value: currentInputs.date.value, isValid: dateIsValid},
                    description: {value: currentInputs.description.value ,isValid: descriptionIsValid},
                }
            })
            return;
        }

        onSubmit(expenseDate);
    }

    const formIsInvalid = !inputs.amount.isValid || !inputs.date.isValid || !inputs.description.isValid || !inputs.description.isValid;

    return (
        <View style={styles.form}>
            <Text style={styles.title}>Your Expense</Text>
            <View style={styles.inputsRow}>
                <Input label='Amount'
                       invalid={!inputs.amount.isValid}
                       textInputConfig={{
                           keyboardType:'decimal-pad',
                           onChangeText: inputChangedHandler.bind(this,'amount'),
                           value: inputs.amount.value,
                       }}
                       style={styles.rowInput}
                />
                <Input
                    label='Date'
                    invalid={!inputs.date.isValid}
                    textInputConfig={{
                        placeholder: 'YYYY-MM-DD' ,
                        maxLength: 10,
                        onChangeText: inputChangedHandler.bind(this,'date'),
                        value: inputs.date.value,
                    }}
                    style={styles.rowInput}
                />
            </View>
            <Input
                label='Description'
                invalid={!inputs.description.isValid}
                textInputConfig={{
                    multiline: true,
                    onChangeText: inputChangedHandler.bind(this,'description'),
                    value: inputs.description.value,
                }}
            />
            {formIsInvalid &&
                ( <Text style={styles.errorText}> Invalid input values - please check your entered data! </Text> )
            }
            <View style={styles.buttons}>
                <Button mode='flat' onPress={onCancel} style={styles.button}>
                    Cancel
                </Button>
                <Button onPress={submitHandler} style={styles.button}>
                    {submitButtonLabel}
                </Button>
            </View>
        </View>
    )
}

export default ExpenseForm;

const styles = StyleSheet.create({
    inputsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rowInput: {
        flex: 1,
    },
    form: {
        marginTop: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginVertical: 24,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button:{
        minWidth: 120,
        marginHorizontal:8,
    },
    errorText: {
        textAlign: 'center',
        color: GlobalStyles.colors.error500,
        marign: 8,
    },
})