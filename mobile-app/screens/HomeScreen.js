import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  FlatList,
  AsyncStorage,
  Button,
  TextInput,
  Keyboard,
  Platform
} from "react-native";

const isAndroid = Platform.OS == "android";
const viewPadding = 10;
const daysLookBack = 5; // generic for testing, try to find good amount (maybe make this scrollable?)

// what's the most efficient way to store dates?

export default class HomeScreen extends Component {
  state = {
    mode: "edit", 
    habits: [],
    text: ""
  };

  changeTextHandler = text => {
    this.setState({ text: text });
  };

  addHabit = () => {
    let notEmpty = this.state.text.trim().length > 0;

    if (notEmpty) {
      this.setState(
        prevState => {
          let { mode, habits, text } = prevState;
          return {
            mode: mode,
            habits: habits.concat({ key: habits.length, dateMap: {}, text: text }),
            text: ""
          };
        },
        () => Habits.save(this.state.habits)
      );
    }
  };

  incrementHabitOnDay = (habitIndex, dateIndex) => {
    this.setState(
      prevState => {
        let { mode, habits, text } = prevState;

        if (habits[habitIndex][dateIndex]) {
          habits[habitIndex][dateIndex]++;
        } else {
          habits[habitIndex][dateIndex] = 1; // 1 is "did it"
        }
        
        return {
          mode: mode,
          habits: habits,
          text: text
        }
      },
      () => Habits.save(this.state.habits)
    )
  }

  deleteHabit = i => {
    this.setState(
      prevState => {
        let habits = prevState.habits.slice();

        habits.splice(i, 1);

        return { habits: habits };
      },
      () => Habits.save(this.state.habits)
    );
  };

  componentDidMount() {
    Keyboard.addListener(
      isAndroid ? "keyboardDidShow" : "keyboardWillShow",
      e => this.setState({ viewPadding: e.endCoordinates.height + viewPadding })
    );

    Keyboard.addListener(
      isAndroid ? "keyboardDidHide" : "keyboardWillHide",
      () => this.setState({ viewPadding: viewPadding })
    );

    Habits.all(habits => this.setState({ habits: habits || [] }));
  }

  renderHabit(habit, habitIndex) {
    // today's date
    let daysToDisplay = [];
    let today = new Date();
    for (let i = 0; i < daysLookBack; i++) {
      // today.getDay()+1 because days of the month are zero-indexed??
      daysToDisplay.push("" + today.getFullYear() + "-" + today.getMonth() + "-" + (today.getDay()+1));
      today.setDate(today.getDate() - 1);
    }

    // render buttons accordingly
    let dateButtons = daysToDisplay.map((day, index) => {
      let state = 0; // 0 = untouched
      if (habit['dateMap'] && habit['dateMap'][day]) {
        state = habit['dateMap'][day];
      }
      if (state === 0) {
        return <Button title={day} onpress={() => this.incrementHabitOnDay(habitIndex, day)}></Button>
      } else if (state === 1) {
        return <Button title="X" style="background: #0A6640;" onpress={() => this.incrementHabitOnDay(habitIndex, day)}></Button>
      } else if (state === 2) {
        return <Button title="XX" style="background: #3DCC91;" onpress={() => this.incrementHabitOnDay(habitIndex, day)}></Button>
      }
    })

    return (<View>
      {dateButtons}
    </View>)
  }

  render() {
    return (
      <View
        style={[styles.container, { paddingBottom: this.state.viewPadding }]}
      >

        <FlatList
          style={styles.list}
          data={this.state.habits}
          renderItem={({ item, index }) =>
            <View>
              <View style={styles.listItemCont}>
                <Text style={styles.listItem}>
                  {item.text}
                </Text>
                {this.renderHabit(item, index)}
                <Button title="X" onPress={() => this.deleteHabit(index)} />
              </View>
              <View style={styles.hr} />
            </View>}
        />
        <TextInput
          style={styles.textInput}
          onChangeText={this.changeTextHandler}
          onSubmitEditing={this.addHabit}
          value={this.state.text}
          placeholder="Add Habits"
          returnKeyType="done"
          returnKeyLabel="done"
        />
      </View>
    );
  }
}

let Habits = {
  convertToArrayOfObject(habits, callback) {
    return callback(
      habits ? habits.split("||").map((habit, i) => ({ key: i, text: habit})) : []
    );
  },
  convertToStringWithSeparators(habits) {
    return habits.map(habit => JSON.stringify(habit)).join("||");
  },
  all(callback) {
    return AsyncStorage.getItem("HABITS", (err, habits) =>
      this.convertToArrayOfObject(habits, callback)
    );
  },
  save(habits) {
    AsyncStorage.setItem("HABITS", this.convertToStringWithSeparators(habits));
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    padding: viewPadding,
    paddingTop: 20
  },
  list: {
    width: "100%"
  },
  listItem: {
    paddingTop: 2,
    paddingBottom: 2,
    fontSize: 18
  },
  hr: {
    height: 1,
    backgroundColor: "gray"
  },
  listItemCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  textInput: {
    height: 40,
    paddingRight: 10,
    paddingLeft: 10,
    borderColor: "gray",
    borderWidth: isAndroid ? 0 : 1,
    width: "100%"
  }
});

AppRegistry.registerComponent("HomeScreen", () => HomeScreen);