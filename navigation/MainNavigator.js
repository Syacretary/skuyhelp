import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import RequestListScreen from '../screens/RequestListScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RequestFormScreen from '../screens/RequestFormScreen';
import PricingScreen from '../screens/PricingScreen';
import TaskMapScreen from '../screens/TaskMapScreen';
import ChatScreen from '../screens/ChatScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="RequestForm" component={RequestFormScreen} />
    <Stack.Screen name="Pricing" component={PricingScreen} />
    <Stack.Screen name="TaskMap" component={TaskMapScreen} />
  </Stack.Navigator>
);

const ChatStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ChatList" component={ChatListScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
  </Stack.Navigator>
);

const MainNavigator = ({ user, onLogout }) => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Explore') {
              iconName = 'explore';
            } else if (route.name === 'Requests') {
              iconName = 'list-alt';
            } else if (route.name === 'Chat') {
              iconName = 'chat';
            } else if (route.name === 'Profile') {
              iconName = 'person';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#FF69B4',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            backgroundColor: '#FFF',
            borderTopColor: '#FFB6C1',
            borderTopWidth: 1,
            paddingBottom: 5,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          headerShown: false,
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeStack}
          options={{ tabBarLabel: 'Beranda' }}
        />
        <Tab.Screen 
          name="Explore" 
          component={ExploreScreen}
          options={{ tabBarLabel: 'Jelajah' }}
        />
        <Tab.Screen 
          name="Requests" 
          component={RequestListScreen}
          options={{ tabBarLabel: 'Request' }}
        />
        <Tab.Screen 
          name="Chat" 
          component={ChatStack}
          options={{ tabBarLabel: 'Chat' }}
        />
        <Tab.Screen 
          name="Profile"
          options={{ tabBarLabel: 'Profil' }}
        >
          {() => <ProfileStack user={user} onLogout={onLogout} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
