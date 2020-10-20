/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import * as React from 'react';
import {Component} from 'react';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {bindActionCreators} from "redux";
import {connect, Provider} from "react-redux";
import codePush from "react-native-code-push";
import {View} from "react-native";
import {PersistGate} from "redux-persist/integration/react";
import OneSignal from 'react-native-onesignal';
import FlashMessage from "react-native-flash-message";
import DeviceInfo from 'react-native-device-info';
import LinearGradient from "react-native-linear-gradient";
import Orders from "./src/screens/Orders";
import ColorTheme from "./src/theme/Colors";
import {AppIcon} from "./src/common/IconUtils";
import {CommonIcons} from "./src/icons/Common";
import {isRTLMode, setLocale} from "./src/components/Translations";
import Dashboard from "./src/screens/Dashboard";
import FoodItems from "./src/screens/FoodItems";
import AddFoodItem from "./src/screens/FoodItems/AddFoodItem";
import RecipeIngredients from "./src/screens/FoodItems/RecipeIngredients";
import UploadFoodImages from "./src/screens/FoodItems/UploadFoodImages";
import Account from "./src/screens/Account";
import Login from "./src/screens/Account/Login/Login";
import SignUp from "./src/screens/Account/Login/SignUp";
import Profile from "./src/screens/Account/Profile";
import Subscription from "./src/screens/Account/Subscription";
import Earnings from "./src/screens/Account/Earnings";
import Reviews from "./src/screens/Account/Reviews";
import Notifications from "./src/screens/Account/Notifications";
import License from "./src/screens/Account/License";
import ContactUs from "./src/screens/Account/ContactUs";
import Language from "./src/screens/Account/Language";
import MyAddress from "./src/screens/Account/MyAddress";
import store, {persistedStore} from "./src/boot/store";
import {getLanguage, isUserLoggedIn, setDeviceId} from "./src/lib/user";
import SplashScreen from "./src/screens/Splash";
import LoginPopUp from "./src/components/LoginPopUp";
import * as Actions from "./src/reducers/User";
import {ONESIGNAL_APP_ID} from "./src/config/Constants";
import {XEvents} from "./src/lib/EventBus";
import Events from "react-native-simple-events";

let codePushOptions = {
  checkFrequency: codePush.CheckFrequency.MANUAL,
  installMode: codePush.InstallMode.IMMEDIATE
};

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

function renderArabicRootTabs() {
  return (
      <Tab.Navigator tabBarOptions={{
        style: {
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: "#FFFFFF",
          position: 'absolute',
          bottom: 0,
          paddingTop: 20,
          // width: DEVICE_WIDTH,
          elevation: 10,
          height: DeviceInfo.hasNotch() ? 100 : 70,
          zIndex: 8,
          shadowColor: ColorTheme.grey,
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.35,
          shadowRadius: 7,
        }
      }} screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName, iconColor;
          iconColor = focused ? ColorTheme.white : ColorTheme.grey;
          if (route.name === "Dashboard") {
            iconName = "dashboard";
          } else if (route.name === "Orders") {
            iconName = "orders";
          } else if (route.name === "FoodItems") {
            iconName = "menu";
          } else if (route.name === "Account") {
            iconName = "account";
          }

          if (focused) {
            return <View style={{
              width: DeviceInfo.hasNotch() ? 50 : 40,
              height: DeviceInfo.hasNotch() ? 50 : 40,
              borderRadius: DeviceInfo.hasNotch() ? 25 : 20,
              backgroundColor: ColorTheme.appTheme,
              alignItems: "center",
              justifyContent: "center"
            }}>
              <AppIcon name={iconName}
                       color={ColorTheme.selected_tab}
                       provider={CommonIcons}
                       size={DeviceInfo.hasNotch() ? 27 : 22}/>
            </View>;
          } else {
            return <AppIcon name={iconName}
                            color={ColorTheme.appTheme}
                            provider={CommonIcons}
                            size={DeviceInfo.hasNotch() ? 27 : 22}/>;
          }

        }
      })}>
        <Tab.Screen name="Account" component={AccountNavigator} options={{
          tabBarLabel: "",
        }}/>
        <Tab.Screen name="FoodItems" component={FoodItemsNavigator} options={{
          tabBarLabel: "",
        }}/>
        <Tab.Screen name="Orders" component={OrdersNavigator} options={{
          tabBarLabel: "",
        }}/>
        <Tab.Screen name="Dashboard" component={DashboardNavigator} options={{
          tabBarLabel: "",
        }}/>
      </Tab.Navigator>
  );
}

function renderEnglishRootTabs() {
  return (
      <Tab.Navigator tabBarOptions={{
        style: {
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: "#FFFFFF",
          position: 'absolute',
          bottom: 0,
          paddingTop: 20,
          // width: DEVICE_WIDTH,
          elevation: 10,
          height: DeviceInfo.hasNotch() ? 100 : 70,
          zIndex: 8,
          shadowColor: ColorTheme.grey,
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.35,
          shadowRadius: 7,
        }
      }} screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName, iconColor;
          iconColor = focused ? ColorTheme.white : ColorTheme.grey;
          if (route.name === "Dashboard") {
            iconName = "dashboard";
          } else if (route.name === "Orders") {
            iconName = "orders";
          } else if (route.name === "FoodItems") {
            iconName = "menu";
          } else if (route.name === "Account") {
            iconName = "account";
          }


          if (focused) {
            return <LinearGradient colors={[ColorTheme.appTheme, ColorTheme.appThemeSecond]} style={{
              width: DeviceInfo.hasNotch() ? 50 : 40,
              height: DeviceInfo.hasNotch() ? 50 : 40,
              borderRadius: DeviceInfo.hasNotch() ? 25 : 20,
              backgroundColor: ColorTheme.appTheme,
              alignItems: "center",
              justifyContent: "center"
            }}>
              <AppIcon name={iconName}
                       color={ColorTheme.selected_tab}
                       provider={CommonIcons}
                       size={DeviceInfo.hasNotch() ? 27 : 22}/>
            </LinearGradient>;
          } else {
            return <AppIcon name={iconName}
                            color={ColorTheme.appTheme}
                            provider={CommonIcons}
                            size={DeviceInfo.hasNotch() ? 27 : 22}/>;
          }

        }
      })}>
        <Tab.Screen name="Dashboard" component={DashboardNavigator} options={{
          tabBarLabel: "",
        }}/>
        <Tab.Screen name="Orders" component={OrdersNavigator} options={{
          tabBarLabel: "",
        }}/>
        <Tab.Screen name="FoodItems" component={FoodItemsNavigator} options={{
          tabBarLabel: "",
        }}/>
        <Tab.Screen name="Account" component={AccountNavigator} options={{
          tabBarLabel: "",
        }}/>
      </Tab.Navigator>
  );
}

function RootTabs() {
  if (isRTLMode()) {
    return renderArabicRootTabs();
  } else {
    return renderEnglishRootTabs();
  }
}

function DashboardNavigator() {
  return (
      <Stack.Navigator screenOptions={{headerShown: false}} headerMode={'screen'}>
        <Stack.Screen name="Dashboard" component={Dashboard} options={{}}/>
      </Stack.Navigator>
  );
}

function OrdersNavigator() {
  return (
      <Stack.Navigator screenOptions={{
        headerShown: false
      }} headerMode={'screen'}>
        <Stack.Screen name="Orders" component={Orders} options={{}}/>
      </Stack.Navigator>
  );
}

function FoodItemsNavigator() {
  return (
      <Stack.Navigator screenOptions={{
        headerShown: false
      }} headerMode={'screen'}>
        <Stack.Screen name="FoodItems" component={FoodItems} options={{}}/>
        <Stack.Screen name="AddFoodItem" component={AddFoodItem} options={{}}/>
        <Stack.Screen name="RecipeIngredients" component={RecipeIngredients} options={{}}/>
        <Stack.Screen name="UploadFoodImages" component={UploadFoodImages} options={{}}/>
      </Stack.Navigator>
  );
}

function AccountNavigator() {
  return (
      <Stack.Navigator screenOptions={{
        headerShown: false
      }} headerMode={'screen'}>
        <Stack.Screen name="Account" component={Account} options={{}}/>
        <Stack.Screen name="Login" component={Login} options={{}}/>
        <Stack.Screen name="SignUp" component={SignUp} options={{}}/>
        <Stack.Screen name="Profile" component={Profile} options={{}}/>
        <Stack.Screen name="Subscription" component={Subscription} options={{}}/>
        <Stack.Screen name="Earnings" component={Earnings} options={{}}/>
        <Stack.Screen name="Reviews" component={Reviews} options={{}}/>
        <Stack.Screen name="Notifications" component={Notifications} options={{}}/>
        <Stack.Screen name="License" component={License} options={{}}/>
        <Stack.Screen name="ContactUs" component={ContactUs} options={{}}/>
        <Stack.Screen name="Language" component={Language} options={{}}/>
        <Stack.Screen name="MyAddress" component={MyAddress} options={{}}/>
      </Stack.Navigator>
  );
}

interface Props {
  navigation: any;
}

interface State {
  user?: undefined;
  isLoggedIn?: boolean;
  language: string;
  showLogin: boolean;
  loading: boolean;
}

class App extends Component<Props, State> {
  static defaultProps = {
    language: store.getState().User.language,
    user: store.getState().User.user,
    isLoggedIn: store.getState().User.user !== null,
  };

  constructor(props) {
    super(props);
    OneSignal.init(ONESIGNAL_APP_ID, {
      kOSSettingsKeyAutoPrompt: false,
      kOSSettingsKeyInAppLaunchURL: false,
      kOSSettingsKeyInFocusDisplayOption: 2
    });
    OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.
    // The promptForPushNotifications function code will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step below)
    OneSignal.promptForPushNotificationsWithUserResponse(myiOSPromptCallback);

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds.bind(this));

    this.state = {
      language: props.language,
      showLogin: false,
      // showLanguage: true,
      loading: true,
    };


    this.state = {
      user: props.user,
      isLoggedIn: props.isLoggedIn,
      language: props.language,
      showLogin: !isUserLoggedIn(),
      loading: true,
    };
    setLocale(getLanguage());
  }

  componentDidMount(): void {
    Events.on(XEvents.SESSION_EXPIRED, "session_expired", this.sessionExpired.bind(this));
  }

  sessionExpired() {
    setTimeout(() => {
      this.setState({showLogin: true});
    }, 300);
  }

  componentWillUnmount() {
    Events.rm(XEvents.SESSION_EXPIRED, "session_expired");
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onIds = (device) => {
    console.log('Device info: Seller', device);
    setDeviceId(device.userId);
  }


  componentWillReceiveProps(newProps) {
    this.setState({
      user: newProps.user,
      isLoggedIn: newProps.isLoggedIn,
      language: newProps.language,
    });
    setLocale(getLanguage());
  }

  render() {
    return (
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistedStore}>
            <NavigationContainer>
              <SafeAreaProvider>
                {this.state.loading ? <SplashScreen onFinishedLoading={() => {
                      this.setState({
                        loading: false,
                      });
                    }}/> :
                    <View style={{flex: 1}}>
                      <ConnectedRoot/>
                      <LoginPopUp navigation={this.props.navigation} show={!isUserLoggedIn()}
                                  onDismiss={() => this.setState({showLogin: false})}/>
                    </View>}
                <FlashMessage position="top"/>
              </SafeAreaProvider>
            </NavigationContainer>
          </PersistGate>
        </Provider>
    );
  }
}

function myiOSPromptCallback(permission) {
  // do something with permission value
}

const ConnectedRoot = connect(
    (state) => ({
      language: state.User.language,
      isLoggedIn: state.User.user !== null,
      user: state.User.user,
    }),
    (dispatch) => ({
      actions: bindActionCreators(Actions, dispatch)
    })
)(RootTabs);

let HiHome = codePush(codePushOptions)(App);
export default HiHome;
