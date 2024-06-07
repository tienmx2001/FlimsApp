import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import  {useMyContextController} from '../store/firebaseConfig'
import Login from "../screens/Login";
import Register from "../screens/Register";
import Admin from '../screens/admin/Admin';
import Customer from '../screens/customer/Customer';
import VideoPlayer from '../screens/customer/VideoPlayer';
import Profile from '../screens/Profile';
import MyList from '../screens/customer/MyList';
import Icon from 'react-native-vector-icons/FontAwesome5';  
import COLORS from '../store/constants'
import SearchScreen from '../screens/customer/SearchScreen';
import Setting from '../screens/customer/Setting';
import AddMovieScreen from '../screens/admin/AddMovieScreen';
import MovieDetails from '../screens/admin/MovieDetails';
import HistoryWatched from '../screens/customer/HistoryWatched';
import DownloadedVideos from '../screens/customer/DownloadedVideos';
import PlayVideoDowloaded from '../screens/customer/PlayVideoDowloaded';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AdminScreen= () =>{
    return(
      <Stack.Navigator 
          screenOptions={{
          tabBarActiveTintColor: COLORS.white,
          headerShown: false,
          tabBarShowLabel: true,
          headerStyle: { backgroundColor:'black' },
          }}
        >
        <Stack.Screen name='AdminScreen' component={Admin}/>
        <Stack.Screen name='AddMovieScreen' component={AddMovieScreen}/>
        <Stack.Screen name='MovieDetails' component={MovieDetails} 
        options={{headerShown:true,headerTintColor:'white',
        }}

        />
        
    </Stack.Navigator>
    )
};


const AdminTabs = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={{
      tabBarActiveTintColor: COLORS.white,
      headerShown: false,
      tabBarShowLabel: true,
      tabBarStyle: { backgroundColor: COLORS.black, borderTopWidth: 0 },
    }}
  >
    <Tab.Screen
      name="Admin"
      component={AdminScreen}
      options={{
        tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
        title: "Admin",
      }}
    />
    <Tab.Screen
      name="Profile"
      component={Profile}
      options={{
        tabBarIcon: ({ color, size }) => <Icon name="cog" color={color} size={size} />,
        title: "Profile",
      }}
    />
  </Tab.Navigator>
);


const CustomerTabs = () => {
  return (
      <Stack.Navigator
          screenOptions={{
              headerTintColor:COLORS.white,
              headerStyle: {
                backgroundColor: COLORS.black,
              },
              headerShown:false
          }}
      >
          <Stack.Screen name='Customer' component={Customer}/> 
          <Stack.Screen name='VideoPlayer' component={VideoPlayer}/>
          <Stack.Screen name='SearchScreen' component={SearchScreen} />
          <Stack.Screen name='MyList' component={MyList}/>
          <Stack.Screen name='Profile' component={Profile}/>
          <Stack.Screen name='Setting' component={Setting}/>
          <Stack.Screen name='HistoryWatched' component={HistoryWatched}/>
          <Stack.Screen name="DownloadedVideos" component={DownloadedVideos} />
          <Stack.Screen name='PlayVideoDowloaded' component={PlayVideoDowloaded}/>
      </Stack.Navigator>
  );
}






const AppNavigator = () => {
  const [controller] = useMyContextController();
  const { userLogin } = controller;

  return (
    <>
      {userLogin ? (
        userLogin.role === 'admin' ? (
          <AdminTabs />
        ) : (
          <CustomerTabs />
        )
      ) : (
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="DownloadedVideos" component={DownloadedVideos} />
          <Stack.Screen name='PlayVideoDowloaded' component={PlayVideoDowloaded}/>
        </Stack.Navigator>
      )}
    </>
  );
};

export default AppNavigator;
