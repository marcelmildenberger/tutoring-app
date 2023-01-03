import React, {useEffect} from 'react'
import { View, Text, SafeAreaView, Button } from 'react-native'
import ReactNativeCalendarEvents from 'react-native-calendar-events'
import * as Calendar from 'expo-calendar';
import { async } from '@firebase/util';

/*const CalenderScreen = () => {
  const [eventTitle, setEventTitle] = React.useState('');

  React.useEffect(() =>{
    ReactNativeCalendarEvents.requestPermissions().then((res)=>{
      console.log('Permisson Response', res)
    }).catch((error) => {
      console.log(error);
    })
  }, []);

  

  return (
    <SafeAreaView>
      <View>
        <Text>Kalender</Text>
      </View>
    </SafeAreaView>
  )
}*/

export default function CalenderScreen(){
  useEffect(()=> {
    (async() => {
      const {status} = await Calendar.requestCalendarPersissionAsync();
      if(status === 'granted'){
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        console.log('Here are all your calendars:');
        console.log({calendars});
      }
    })();
  }, []);

  return(
    <SafeAreaView>
      <View>
        <Text>Calendar Module Example</Text>
        <Button title='Creat a new calendar' onPress={createCalendar}/>
      </View>
    </SafeAreaView>
  );
}

async function getDefaultCalendarSource() {
  const defaultCalendar = await Calendar.getDefaultCalendarAsync();
  return defaultCalendar.source;
}

async function createCalendar() {
  const defaultCalendarSource =
    Platform.OS === 'ios'
      ? await getDefaultCalendarSource()
      : { isLocalAccount: true, name: 'Expo Calendar' };
  const newCalendarID = await Calendar.createCalendarAsync({
    title: 'Expo Calendar',
    color: 'blue',
    entityType: Calendar.EntityTypes.EVENT,
    sourceId: defaultCalendarSource.id,
    source: defaultCalendarSource,
    name: 'internalCalendarName',
    ownerAccount: 'personal',
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });
  console.log(`Your new calendar ID is: ${newCalendarID}`);
}
