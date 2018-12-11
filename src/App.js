import React, { ReactNode, SyntheticEvent } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Linking,
  TextInput,
  DatePickerIOS
} from "react-native";
import RNCalendarEvents from "react-native-calendar-events";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      cal_auth: "",
      title: "",
      location: "",
      notes: "",
      startDate: new Date(),
      endDate: new Date(),
      showDatePicker: false
    };
  }

  addEvent() {
    // iOS
    RNCalendarEvents.authorizationStatus()
      .then(status => {
        // if the status was previous accepted, set the authorized status to state
        this.setState({ cal_auth: status });
        if (status === "authorized") {
          const startDate = new Date(1544597775);
          const endDate = new Date(1544644582);
          RNCalendarEvents.saveEvent(this.state.title, {
            location: this.state.location,
            notes: this.state.notes,
            startDate: this.state.startDate.toISOString(),
            endDate: this.state.endDate.toISOString()
          })
            .then(id => {
              // we can get the event ID here if we need it
              console.log(id);
              Linking.openURL(`calshow:`);
            })
            .catch(error => console.log("Save Event Error: ", error));
        }
        if (status === "undetermined") {
          // if we made it this far, we need to ask the user for access
          RNCalendarEvents.authorizeEventStore().then(out => {
            console.log("out", out);
            if (out == "authorized") {
              // set the new status to the auth state
              this.setState({ cal_auth: out });
            }
          });
        }
      })
      .catch(error => console.warn("Auth Error: ", error));
  }

  getEvents() {
    RNCalendarEvents.fetchAllEvents(startDate, endDate, calendars);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text> Calendar</Text>
        <TextInput
          style={styles.input}
          editable={true}
          maxLength={40}
          placeholder="Event Name"
          onChangeText={value => this.setState({ title: value })}
        />
        <TextInput
          style={styles.input}
          editable={true}
          maxLength={40}
          placeholder="Location"
          onChangeText={value => this.setState({ location: value })}
        />
        <TextInput
          style={styles.input}
          editable={true}
          maxLength={40}
          placeholder="Notes"
          onChangeText={value => this.setState({ notes: value })}
        />
        <Text> Start Date</Text>
        <DatePickerIOS
          style={styles.picker}
          date={this.state.startDate}
          onDateChange={date => this.setState({ startDate: date })}
        />
        <Text> End Date</Text>
        <DatePickerIOS
          style={styles.picker}
          date={this.state.endDate}
          onDateChange={date => this.setState({ endDate: date })}
        />
        <TouchableOpacity style={styles.button} onPress={() => this.addEvent()}>
          <Text style={{ color: "#ffffff" }}>Add Event</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = {
  container: {
    marginTop: 50,
    flex: 1,
    alignItems: "center"
  },
  picker: {
    width: "100%",
    height: 200
  },
  input: {
    width: "80%",
    height: 30
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: 30,
    backgroundColor: "#4b0082",
    borderRadius: 30
  }
};
export default App;
