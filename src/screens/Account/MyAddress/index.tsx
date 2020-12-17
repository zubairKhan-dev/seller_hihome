import * as React from "react";
import {Component} from "react";
import {ActivityIndicator, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import ColorTheme from "../../../theme/Colors";
import {StaticStyles} from "../../../theme/Styles";
import Constants from "../../../theme/Constants";
import {RTLView} from "react-native-rtl-layout";
import {getCurrentLocale, isRTLMode, strings} from "../../../components/Translations";
import {AppIcon} from "../../../common/IconUtils";
import {CommonIcons} from "../../../icons/Common";
import {SafeAreaView} from "react-navigation";
import TextKVInput from "../../../components/TextKVInput";
import HFTextRegular from "../../../components/HFText/HFTextRegular";
import ActionButton from "../../../components/ActionButton";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import LoadingOverlay from "../../../components/Loading";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import TextFormInput from "../../../components/TextFormInput";
import HHPickerView from "../../../components/HHPickerView";
import * as Api from "../../../lib/api";
import { showMessageAlert } from "../../../common";
import { showMessage } from "react-native-flash-message";
import { setAddress } from "../../../lib/user";
import { PermissionsAndroid } from 'react-native';

const {width, height} = Dimensions.get('window')
const SCREEN_HEIGHT = height
const SCREEN_WIDTH = width
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

interface Props {
    navigation: any;
}

interface State {
    loading?: boolean;
    showActivity?: boolean;
    isEdit?: boolean;
    sellerProfile?: any;
    cities: any[];
    address: string;
    // pincode?: string;
    selectedCity: any;
    showCities?: boolean;

    initialRegion?: {
        latitude: number,
        longitude: number,
        latitudeDelta: number,
        longitudeDelta: number,
    },
    currentLocation?: {
        latitude: number,
        longitude: number,
        address?: string,
        city?: string,
        country?: string,
    },
}

export default class MyAddress extends Component<Props, State> {
    watchID: number = null;
    apiHandler: any;
    apiExHandler: any;

    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            selectedCity: undefined,
            showCities: false,
            cities: [],
            address: ""
        };
    }

    async requestLocationPermission()
    {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    buttonPositive: "",
                    'title': 'Example App',
                    'message': 'Example App access to your location '
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the location")
                this.getGeoLocation();
                // alert("You can use the location");
            } else {
                console.log("location permission denied")
               // alert("Location permission denied");
            }
        } catch (err) {
            console.warn(err)
        }
    }

    componentDidMount(): void {
        if (Platform.OS === "ios") {
            Geolocation.requestAuthorization("whenInUse").then(r => this.getGeoLocation());
        } else {
            this.requestLocationPermission().then(r => {});
        }

        this.getCities();
    }

    private getProfile() {
        this.setState({loading: true});
        let formData = new FormData();
        this.apiHandler = (response) => {
            Api.checkValidationError(response, resp => {
                if (response.code === 200 && resp && resp.seller_details) {
                  this.setState({
                      sellerProfile: resp.seller_details
                    }, () => {
                        this.loadAddressData();
                    });

                }
                this.setState({loading: false});
            }, (errors, errorMessage) => {
                showMessageAlert(errorMessage);
                this.setState({loading: false});
            });
        };
        this.apiExHandler = (reason) => {
            showMessageAlert(reason);
            this.setState({loading: false});
        };
        Api.getProfile({})
            .then((response) => {
                    this.apiHandler(response);
                },
            ).catch((reason => {
                this.apiExHandler(reason);
            }),
        );
    }

    private loadAddressData() {
      let { sellerProfile } = this.state;
      this.setState({
          isEdit: false,
          address: sellerProfile.address,
          currentLocation: {
              latitude: sellerProfile.lat,
              longitude: sellerProfile.long,
          },
          initialRegion: {
              latitude: sellerProfile.lat,
              longitude: sellerProfile.long,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA
          },
      });
    }


    private getCities() {
        this.setState({loading: true});
        this.apiHandler = (response) => {
            Api.checkValidationError(response, resp => {
                if (response && response.code === 200 && resp.data) {
                    this.setState({
                        cities: response.response_data.data,
                        selectedCity: response.response_data.data[0]
                    });
                }
                this.setState({loading: false});
                this.getProfile();
            }, (errors, errorMessage) => {
                // showMessage(errorMessage);
                this.setState({loading: false});
            });
        };
        this.apiExHandler = (reason) => {
            // showError(reason);
            this.setState({loading: false});
        };
        Api.getCities()
            .then((response) => {
                    this.apiHandler(response);
                },
            ).catch((reason => {
                this.apiExHandler(reason);
            }),
        );
    }

    private saveAddress() {
        this.setState({loading: true});
        let formData = new FormData();
        formData.append("lat", this.state.currentLocation.latitude);
        formData.append("long", this.state.currentLocation.longitude);
        formData.append("address", this.state.address + "," + this.state.selectedCity.name);
        this.apiHandler = (response) => {
            Api.checkValidationError(response, resp => {
                if (response && response.code === 200 && resp) {
                    showMessage({
                        message: strings("address_updated_success"),
                        type: "success",
                    });
                    setAddress(this.state.address);
                    this.props.navigation.goBack();
                }
                this.setState({loading: false});
            }, (errors, errorMessage) => {
                setTimeout(() => {
                    showMessageAlert(response.error_msg);
                }, 200);
                this.setState({loading: false});
            });
        };
        this.apiExHandler = (reason) => {
            setTimeout(() => {
                showMessageAlert(reason);
            }, 200);
            this.setState({loading: false});
        };
        Api.saveAddress(formData)
            .then((response) => {
                    this.apiHandler(response);
                },
            ).catch((reason => {
                this.apiExHandler(reason);
            }),
        );
    }

    getGeoLocation() {
        Geolocation.getCurrentPosition(
            (position) => {
                console.log(position);
                this.setState({
                    currentLocation: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    },
                    initialRegion: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA
                    },
                });
                // setTimeout(() => {
                //     this.getReverseGeoCodeAddress();
                // }, 200);
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
        );

        this.watchID = Geolocation.watchPosition(
            (position) => {
                const newRegion = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                }
                this.onRegionChange(newRegion);
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
            },
            {enableHighAccuracy: true}
        );
    }

    onRegionChange(region) {
        console.log("REGION CHANGED");
        this.setState({initialRegion: region});
    }

    componentWillUnmount() {
        // Remove the event listener before removing the screen from the stack
    }

    renderHeader() {
        return (
            <View style={{
                backgroundColor: ColorTheme.white
            }}>
                <View style={{
                    paddingHorizontal: Constants.defaultPaddingRegular,
                }}>
                    <View style={{height: Constants.defaultPadding}}/>
                    <RTLView style={{padding: Constants.defaultPadding}} locale={getCurrentLocale()}>
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.goBack();
                        }}>
                            <AppIcon name={isRTLMode() ? "back_ar" : "back"}
                                     color={ColorTheme.appTheme}
                                     provider={CommonIcons}
                                     size={22}/>
                        </TouchableOpacity>
                        <View style={{flex: 1}}/>
                        <Text style={StaticStyles.nav_title}>{strings("my_address")}</Text>
                        <View style={{flex: 1}}/>
                        <TouchableOpacity onPress={() => {
                            this.setState({isEdit: !this.state.isEdit});
                        }}>
                            <View style={{
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                                <Text style={{
                                    fontWeight: "500",
                                    alignContent: "center",
                                    alignSelf: "center",
                                    fontSize: Constants.regularSmallFontSize,
                                    color: ColorTheme.appTheme,
                                }}>{this.state.isEdit ? "" : strings("edit")}</Text>
                            </View>
                        </TouchableOpacity>
                    </RTLView>
                    <View style={{height: Constants.defaultPaddingRegular}}/>
                </View>
                <View style={{height: 2, backgroundColor: ColorTheme.lightGrey}}/>
            </View>
        );
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: ColorTheme.white}}>
                {this.renderHeader()}
                <KeyboardAwareScrollView style={{
                    marginBottom: Constants.marginBottom,
                    paddingHorizontal: Constants.defaultPaddingRegular,
                    paddingVertical: Constants.defaultPadding
                }}>
                    <TextKVInput title={strings("address")}
                                 text={this.state.address}
                                 placeholder={strings("enter_value")}
                                 editable={this.state.isEdit}
                                 value={value => {
                                     this.setState({address: value})
                                 }}/>
                    <View style={{height: Constants.defaultPaddingRegular}}/>
                    <HFTextRegular value={strings("city")}/>
                    <View style={{height: Constants.defaultPaddingMin}}/>
                    <TextFormInput showOptions={() => {
                        if (this.state.isEdit) {
                            this.setState({showCities: true});
                        }
                    }}
                                   dropdown={true}
                                   placeholder={strings("add_price")}
                                   text={this.state.selectedCity ? this.state.selectedCity.name : ""}
                                   value={value => {
                                   }}/>
                    <View style={{height: Constants.defaultPaddingRegular}}/>
                    <HFTextRegular value={strings("set_on_map")}/>
                    <View style={{height: Constants.defaultPadding}}/>
                    <View style={{}}>
                        <MapView
                            style={{
                                height: 250,
                                borderRadius: Constants.defaultPaddingMin,
                                width: width - (2 * Constants.defaultPaddingRegular)
                            }}
                            initialRegion={this.state.initialRegion}>
                            {this.state.currentLocation && <Marker
                                onDragEnd={(e) => {
                                    this.setState({
                                        currentLocation: {
                                            latitude: e.nativeEvent.coordinate.latitude,
                                            longitude: e.nativeEvent.coordinate.longitude,
                                        }
                                    });
                                }}
                                pinColor={"red"}
                                draggable={true}
                                coordinate={{
                                    'latitude': this.state.currentLocation.latitude,
                                    'longitude': this.state.currentLocation.longitude
                                }}
                                title={strings("your_location")}
                                identifier={'mk1'}/>}
                        </MapView>
                        {!this.state.currentLocation && <RTLView locale={getCurrentLocale()}>
                            <Text style={[{
                                fontWeight: "200",
                                color: ColorTheme.buttonBorderGrey,
                                fontSize: 12,
                                marginTop: Constants.defaultPaddingMin
                            }]}>{strings("fetching_location")}</Text>
                            <ActivityIndicator size={"small"} color={ColorTheme.appTheme}/>
                        </RTLView>}
                        {this.state.currentLocation && <Text style={[{
                            fontWeight: "300",
                            color: ColorTheme.buttonBorderGrey,
                            fontSize: 12,
                            marginTop: Constants.defaultPaddingMin
                        }]}>{strings("pin_hold_drag")}</Text>}
                    </View>
                    {this.state.isEdit &&
                    <RTLView style={{marginTop: Constants.defaultPaddingRegular, flex: 1, alignItems: "center",  paddingBottom: Constants.defaultPaddingMin}}
                             locale={getCurrentLocale()}>
                        <View style={{flex: 1}}>
                            <ActionButton variant={"alt"} title={strings("cancel")} onPress={() => {
                                this.loadAddressData();
                            }}/>
                        </View>
                        <View style={{width: Constants.defaultPadding}}/>
                        {this.state.currentLocation && <View style={{flex: 1}}>
                            <ActionButton variant={"normal"} title={strings("save")} onPress={() => {
                                this.saveAddress();
                            }}/>
                        </View>}
                    </RTLView>}
                    <HHPickerView show={this.state.showCities}
                                  onDismiss={() => this.setState({showCities: false})}
                                  onValueChange={(value, index) => {
                                      this.setState({showCities: false, selectedCity: value})
                                  }}
                                  selectedValue={this.state.selectedCity}
                                  values={this.state.cities}/>
                </KeyboardAwareScrollView>
                {this.state.loading && <LoadingOverlay/>}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: ColorTheme.appThemeLight},
    language: {
        paddingTop: 10,
        textAlign: 'center',
    },
});
