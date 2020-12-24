import * as React from "react";
import {Component} from "react";
import {
    ActivityIndicator, Dimensions,
    FlatList, PermissionsAndroid,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {StaticStyles} from "../../../theme/Styles";
import Constants from "../../../theme/Constants";
import ColorTheme from "../../../theme/Colors";
import {getCurrentLocale, isRTLMode, strings} from "../../../components/Translations";
import TextKVInput from "../../../components/TextKVInput";
import ActionButton from "../../../components/ActionButton";
import {RTLText, RTLView} from "react-native-rtl-layout";
import * as Api from "../../../lib/api";
import LoadingOverlay from "../../../components/Loading";
import {showMessageAlert, windowWidth} from "../../../common";
import MessagePopUp from "../../../components/MessagePopUp";
import Modal from "react-native-modal";
import {AppIcon} from "../../../common/IconUtils";
import {CommonIcons} from "../../../icons/Common";
import HHDatePicker from "../../../components/HHDatePicker";
import ImagePicker from "react-native-image-picker";
import ImageUploadView from "../../../components/ImageUpload";
import HFTextRegular from "../../../components/HFText/HFTextRegular";
import VerifyOTPPopUp from "../../../components/VerifyOTPPopUp";
import {parseDate} from "../../../lib/DateUtil";
import {getDeviceId, setDeviceId} from "../../../lib/user";
import TermsConditions from "./TermsConditions"
import {ONESIGNAL_APP_ID, photoOptions} from "../../../config/Constants";
import OneSignal from 'react-native-onesignal';
import FeaturedImage from "../../../components/FeaturedImage";
import MapView, {Marker} from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import TextFormInput from "../../../components/TextFormInput";
import HHPickerView from "../../../components/HHPickerView";

const {width, height} = Dimensions.get('window')
const SCREEN_HEIGHT = height
const SCREEN_WIDTH = width
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

const licensePhoto = [
    {name: "", uri: "", data: undefined},
];

const logoPhoto = [
    {name: "", uri: "", data: undefined},
];


interface Props {
    navigation: any;
    show: boolean;
    onDismiss: Function;
}

interface State {
    loading?: boolean,
    uploadImage?: boolean;
    showOTP?: boolean;
    showTermsConditions?: boolean;
    termsChecked?: boolean;
    expandBusinessView?: boolean,
    expandAccountView?: boolean,
    expandContactView?: boolean,

    business_name?: string,
    business_email?: string,
    emirates_id?: string,
    license_id?: string,
    license_start_date?: Date,
    license_end_date?: Date,
    address?: string,
    city?: string,
    pin?: string,
    licensePhoto: any[];
    logoPhoto: any[];
    photoIndex?: number;
    cities: any[];
    selectedCity: any;
    showCities?: boolean;

    email?: string,
    mobile_number?: string,
    password?: string,
    confirm_password?: string,

    first_name?: string,
    last_name?: string,
    email_contact?: string,
    mobile_number_contact?: string,

    showMessagePopup?: boolean,

    verified_mobile?: string,
    resendRequest?: boolean,

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

export default class SignUp extends Component<Props, State> {
    apiHandler: any;
    apiExHandler: any;
    scrollView: any;
    account_email: any;
    watchID: number = null;

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            uploadImage: false,
            showTermsConditions: false,
            termsChecked: false,
            expandBusinessView: true,
            expandAccountView: false,
            expandContactView: false,
            licensePhoto: licensePhoto,
            logoPhoto: logoPhoto,
            photoIndex: -1,
            verified_mobile: "",
            pin: "12345",
            license_start_date: new Date,
            license_end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            resendRequest: false,
            selectedCity: undefined,
            showCities: false,
            cities: [],
        }
        // OneSignal.inFocusDisplaying(2);
        OneSignal.addEventListener('ids', this.onIds.bind(this));
    }

    async requestLocationPermission() {
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
        OneSignal.removeEventListener('ids', this.onIds);
    }

    componentDidMount(): void {
        if (Platform.OS === "ios") {
            Geolocation.requestAuthorization("whenInUse").then(r => this.getGeoLocation());
        } else {
            this.requestLocationPermission().then(r => {
            });
        }
        this.getCities();
    }

    onIds = (device) => {
        console.log('Device info: Seller', device);
        setDeviceId(device.userId);
        if (this.state.resendRequest) {
            this.setState({resendRequest: false});
            setTimeout(() => {
                this.registerUser()
            }, 300);
        }

    }

    private getCities() {
        this.setState({loading: true});
        this.apiHandler = (response) => {
            Api.checkValidationError(response, resp => {
                if (response && response.code === 200 && resp.data) {
                    this.setState({
                        cities: response.response_data.data,
                        selectedCity: response.response_data.data[2]
                    });
                }
                this.setState({loading: false});
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

    private validateInputs() {
        // BUSINESS NAME
        if (!this.state.business_name || (this.state.business_name && this.state.business_name.length === 0)) {
            showMessageAlert(strings("invalid_business_name"));
            return false;
        }

        // BUSINESS NAME
        // if (!this.state.business_email || (this.state.business_email && this.state.business_email.length === 0)) {
        //     showMessageAlert(strings("invalid_business_email"));
        //     return false;
        // }

        // EMIRATES ID
        if (!this.state.emirates_id || (this.state.emirates_id && this.state.emirates_id.length === 0)) {
            showMessageAlert(strings("invalid_emirates_id"));
            return false;
        } else {
            if (this.state.emirates_id.length !== 15) {
                showMessageAlert(strings("invalid_emirates_id"));
                return false;
            }
        }

        // LICESE ID
        if (!this.state.license_id || (this.state.license_id && this.state.license_id.length === 0)) {
            showMessageAlert(strings("invalid_license_id"));
            return false;
        }

        // LICENSE START DATE

        // LICENSE PHOTO
        if (this.state.licensePhoto[0].uri.length === 0) {
            showMessageAlert(strings("invalid_license_image"));
            return false;
        }

        // LOGO PHOTO
        if (this.state.logoPhoto[0].uri.length === 0) {
            showMessageAlert(strings("invalid_logo_image"));
            return false;
        }

        // ADDRESS
        if (!this.state.address || (this.state.address && this.state.address.length === 0)) {
            showMessageAlert(strings("invalid_address"));
            return false;
        }

        // CITY
        // if (!this.state.city || (this.state.city && this.state.city.length === 0)) {
        //     showMessageAlert(strings("invalid_city"));
        //     return false;
        // }

        // EMAIL
        if (!this.state.email || (this.state.email && this.state.email.length === 0)) {
            showMessageAlert(strings("invalid_email"));
            return false;
        }

        // MOBILE
        if (!this.state.mobile_number || (this.state.mobile_number && this.state.mobile_number.length === 0)) {
            showMessageAlert(strings("invalid_mobile_number"));
            return false;
        }

        // PASSWORD
        if (!this.state.password || (this.state.password && this.state.password.length === 0)) {
            showMessageAlert(strings("invalid_password"));
            return false;
        }

        // CONFIRM PASSWORD
        if (!this.state.confirm_password || (this.state.confirm_password && this.state.confirm_password.length === 0)) {
            showMessageAlert(strings("invalid_confirm_password"));
            return false;
        }

        // PASSWORD & CONFIRM PASSWORD
        if (this.state.password && this.state.confirm_password && this.state.password !== this.state.confirm_password) {
            showMessageAlert(strings("password_mismatch"));
            return false;
        }

        // FIRST NAME
        if (!this.state.first_name || (this.state.first_name && this.state.first_name.length === 0)) {
            showMessageAlert(strings("invalid_first_name"));
            return false;
        }

        // LAST NAME
        if (!this.state.last_name || (this.state.last_name && this.state.last_name.length === 0)) {
            showMessageAlert(strings("invalid_last_name"));
            return false;
        }

        // EMAIL CONTACT
        // if (!this.state.email_contact || (this.state.email_contact && this.state.email_contact.length === 0)) {
        //     showMessageAlert(strings("invalid_email_contact"));
        //     return false;
        // }

        // MOBILE CONTACT
        if (!this.state.mobile_number_contact || (this.state.mobile_number_contact && this.state.mobile_number_contact.length === 0)) {
            showMessageAlert(strings("invalid_mobile_number_contact"));
            return false;
        }

        if (!this.state.termsChecked) {
            showMessageAlert(strings("please_accept_terms"));
            return false;
        }
        return true;
    }

    private registerUser() {
        if (!this.state.currentLocation) {
            this.requestLocationPermission().then(r => {
            });
        }
        if (this.validateInputs()) {
            this.setState({loading: true});
            this.apiHandler = (response) => {
                Api.checkValidationError(response, resp => {
                    if (response && response.code === 200 && resp) {
                        // analytics().logEvent('Register_Seller', {
                        //     user_id: response.response_data.id,
                        // });
                        this.setState({loading: false, showMessagePopup: true});
                    }
                }, (errors, errorMessage) => {
                    setTimeout(() => {
                        showMessageAlert(errorMessage);
                    }, 400);
                    this.setState({loading: false});
                });
            };
            this.apiExHandler = (reason) => {
                setTimeout(() => {
                    showMessageAlert(reason);
                }, 400);
                this.setState({loading: false});
            };
            Api.registerUser(this.getPostObj())
                .then((response) => {
                        this.apiHandler(response);
                    },
                ).catch((reason => {
                    this.apiExHandler(reason);
                }),
            );
        }
    }

    private getErrors(errors) {
        let errorValue = "";
        if (errors) {
            if (errors.email && errors.email.length > 0) {
                errorValue = errorValue + errors.email[0] + "\n";
            }

            if (errors.phone && errors.phone.length > 0) {
                errorValue = errorValue + errors.phone[0];
            }
        }
        return errorValue;
    }

    private getPostObj() {
        let formData = new FormData();
        let photo = this.state.licensePhoto[0];
        let logo = this.state.logoPhoto[0];
        formData.append("license_photo", {
            name: "test",
            type: photo.data.type,
            uri: Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
        });
        formData.append("first_name", this.state.first_name)
        formData.append("last_name", this.state.last_name)
        formData.append("email", this.state.email)
        formData.append("password", this.state.password)
        formData.append("c_password", this.state.confirm_password)
        formData.append("phone", this.state.mobile_number)
        formData.append("lang", getCurrentLocale())
        formData.append("legal_business_name", this.state.business_name)
        formData.append("legal_business_email", this.state.email)
        formData.append("c_legal_business_email", this.state.email)
        formData.append("legal_business_phone", this.state.mobile_number_contact)
        formData.append("seller_eid", this.state.emirates_id)
        formData.append("address", this.state.address)
        formData.append("license_id", this.state.license_id)
        formData.append("license_start_date", parseDate(this.state.license_start_date, "yyyy-MM-DD"))
        formData.append("license_end_date", parseDate(this.state.license_end_date, "yyyy-MM-DD"))
        formData.append("city", this.state.selectedCity.name)
        formData.append("pincode", this.state.pin)
        formData.append("contact_us_first_name", this.state.first_name)
        formData.append("contact_us_last_name", this.state.last_name)
        formData.append("contact_us_email", this.state.email)
        formData.append("accept_orders", 0)
        formData.append("lat", this.state.currentLocation.latitude);
        formData.append("long", this.state.currentLocation.longitude);
        formData.append("emirates_id", this.state.selectedCity.id);
        if (getDeviceId() && getDeviceId().length > 0) {
            formData.append("device_udid", getDeviceId())
        } else {
            this.setState({resendRequest: true});
            OneSignal.init(ONESIGNAL_APP_ID, {
                kOSSettingsKeyAutoPrompt: false,
                kOSSettingsKeyInAppLaunchURL: false,
                kOSSettingsKeyInFocusDisplayOption: 2
            });
            return false;
        }
        formData.append("logo", {
            name: "test",
            type: logo.data.type,
            uri: Platform.OS === "android" ? logo.uri : logo.uri.replace("file://", "")
        });
        // legal_business_email
        // c_legal_business_email
        return formData;
    }

    private dismiss() {
        this.props.onDismiss();
    }

    launchCamera() {
        ImagePicker.launchCamera(photoOptions, (response) => {
            if (!response.didCancel) {
                if (this.state.photoIndex === 0) {
                    // License Photo
                    for (let i = 0; i < this.state.licensePhoto.length; i++) {
                        let photo = this.state.licensePhoto[i];
                        if (photo.uri.length === 0 && !photo.add) {
                            photo.uri = response.uri;
                            photo.data = response;
                            break;
                        }
                    }
                } else if (this.state.photoIndex === 1) {
                    // Logo Photo
                    for (let i = 0; i < this.state.logoPhoto.length; i++) {
                        let photo = this.state.logoPhoto[i];
                        if (photo.uri.length === 0 && !photo.add) {
                            photo.uri = response.uri;
                            photo.data = response;
                            break;
                        }
                    }
                }

            }
            this.setState({uploadImage: false})
        });
    }

    launchGallery() {
        ImagePicker.launchImageLibrary(photoOptions, (response) => {
            if (!response.didCancel) {
                if (this.state.photoIndex === 0) {
                    // Main Photo
                    for (let i = 0; i < this.state.licensePhoto.length; i++) {
                        let photo = this.state.licensePhoto[i];
                        if (photo.uri.length === 0 && !photo.add) {
                            photo.uri = response.uri;
                            photo.data = response;
                            break;
                        }
                    }
                } else if (this.state.photoIndex === 1) {
                    // Logo Photo
                    for (let i = 0; i < this.state.logoPhoto.length; i++) {
                        let photo = this.state.logoPhoto[i];
                        if (photo.uri.length === 0 && !photo.add) {
                            photo.uri = response.uri;
                            photo.data = response;
                            break;
                        }
                    }
                }

            }
            this.setState({uploadImage: false})
        });
    }

    private removeMainPhoto() {
        let mainPic = this.state.licensePhoto[0];
        mainPic.uri = "";
        mainPic.name = "";
        mainPic.data = undefined;
        this.setState({licensePhoto: [mainPic]});
    }

    private removeLogoPhoto() {
        let mainPic = this.state.logoPhoto[0];
        mainPic.uri = "";
        mainPic.name = "";
        mainPic.data = undefined;
        this.setState({licensePhoto: [mainPic]});
    }

    renderBusinessView() {
        let itemDimension = 100;
        return (
            <View style={{
                borderColor: ColorTheme.appThemeLight,
                borderWidth: 0.5,
                overflow: "hidden",
                borderRadius: Constants.defaultPaddingMin,
            }}>
                <TouchableOpacity style={{}} onPress={() => {
                    this.setState({expandBusinessView: !this.state.expandBusinessView});
                }}>
                    <RTLView style={{
                        alignItems: "center",
                        paddingVertical: Constants.defaultPadding,
                        paddingHorizontal: Constants.defaultPadding,
                        backgroundColor: ColorTheme.appTheme,
                    }} locale={getCurrentLocale()}>
                        <Text style={[{
                            textAlign: isRTLMode() ? "right" : "left",
                            color: ColorTheme.white,
                            fontWeight: "600",
                            fontSize: 16,
                        }]}> {strings("business_information").toUpperCase()}</Text>
                        <View style={{flex: 1}}/>
                        <AppIcon name={"arrow_down"}
                                 color={ColorTheme.white}
                                 provider={CommonIcons}
                                 size={15}/>
                    </RTLView>
                </TouchableOpacity>
                <View style={{
                    flex: 1,
                    backgroundColor: ColorTheme.light_brown,
                    paddingHorizontal: Constants.defaultPadding,
                    height: this.state.expandBusinessView ? undefined : 0,
                }}>
                    <View style={{height: Constants.defaultPaddingRegular}}/>
                    <Text style={[{
                        textAlign: isRTLMode() ? "right" : "left",
                        color: ColorTheme.textGreyDark,
                        fontWeight: "400",
                        fontSize: Constants.regularSmallFontSize,
                    }]}> {strings("business_information_description").toUpperCase()}</Text>
                    <View style={{height: Constants.defaultPaddingRegular}}/>
                    <TextKVInput title={strings("business_name")}
                                 placeholder={strings("enter_your_business_name")}
                                 text={this.state.business_name}
                                 value={value => {
                                     this.setState({business_name: value})
                                 }}/>
                    <View style={{height: Constants.defaultPadding}}/>
                    {/*<TextKVInput title={strings("business_email")}*/}
                    {/*             placeholder={strings("enter_your_business_email")}*/}
                    {/*             text={this.state.business_email}*/}
                    {/*             keyboard={"email-address"}*/}
                    {/*             value={value => {*/}
                    {/*                 this.setState({business_email: value})*/}
                    {/*             }}/>*/}
                    {/*<View style={{height: Constants.defaultPadding}}/>*/}
                    <TextKVInput title={strings("emirates_id")}
                                 placeholder={strings("enter_your_emirates_id")}
                                 text={this.state.emirates_id}
                                 keyboard={"number-pad"}
                                 value={value => {
                                     this.setState({emirates_id: value})
                                 }}/>
                    <View style={{height: Constants.defaultPadding}}/>
                    <TextKVInput title={strings("license_id")}
                                 placeholder={strings("enter_your_license_id")}
                                 text={this.state.license_id}
                                 value={value => {
                                     this.setState({license_id: value})
                                 }}/>
                    <View style={{height: Constants.defaultPadding}}/>
                    <HHDatePicker title={strings("license_start_date")}
                                  date={this.state.license_start_date}
                                  editable={true}
                                  value={(dateValue) => {
                                    this.setState({license_start_date: dateValue},
                                    ()=>{
                                      let endDate = new Date(dateValue);
                                      endDate = new Date(endDate.setFullYear(endDate.getFullYear() + 1));
                                      this.setState({license_end_date: endDate});
                                    });
                                  }}/>
                    <View style={{height: Constants.defaultPadding}}/>
                    <HHDatePicker title={strings("license_expiry_date")}
                                  date={this.state.license_end_date}
                                  editable={true}
                                  minimumDate={this.state.license_end_date}
                                  value={(dateValue) => {
                                      this.setState({license_end_date: dateValue});
                                  }}/>
                    <View style={{height: Constants.defaultPadding}}/>
                    <HFTextRegular value={strings("upload_license_photo")}/>
                    <View style={{height: 120}}>
                        <FlatList
                            contentContainerStyle={{
                                justifyContent: isRTLMode() ? "flex-end" : "flex-start",
                                flexDirection: isRTLMode() ? "row-reverse" : "row"
                            }}
                            horizontal={true}
                            style={[{
                                direction: isRTLMode() ? "rtl" : "ltr",
                                paddingVertical: 10,
                                flexDirection: isRTLMode() ? "row-reverse" : "row"
                            }]}
                            data={this.state.licensePhoto}
                            renderItem={({item, index}) =>
                                <TouchableOpacity onPress={() => {
                                    if (item.uri.length === 0) {
                                        this.setState({uploadImage: true, photoIndex: 0});
                                    }
                                }}>
                                    <RTLView locale={getCurrentLocale()}>
                                        {isRTLMode() && <View style={{width: Constants.defaultPadding}}/>}
                                        <View style={{
                                            width: itemDimension,
                                            height: itemDimension,
                                            justifyContent: "center",
                                            backgroundColor: ColorTheme.lightGrey,
                                            alignItems: "center",
                                            borderWidth: 0.5,
                                            borderRadius: Constants.defaultPaddingRegular,
                                            borderColor: ColorTheme.grey,
                                            borderStyle: "dashed",
                                            overflow: "hidden"
                                        }}>
                                            {item.uri.length === 0 && <AppIcon name={"upload"}
                                                                               color={ColorTheme.grey_add}
                                                                               provider={CommonIcons}
                                                                               size={50}/>}
                                            {item.uri.length > 0 &&
                                            <View style={{
                                                borderRadius: 15,
                                                overflow: "hidden",
                                                width: itemDimension,
                                                height: itemDimension
                                            }}>
                                                <FeaturedImage width={itemDimension} height={itemDimension}
                                                               uri={item.uri}/>
                                            </View>
                                            }
                                            {item.uri.length > 0 && <View style={{
                                                position: "absolute",
                                                padding: 2,
                                                right: 7,
                                                top: 7,
                                                backgroundColor: "red",
                                                borderRadius: Constants.defaultPaddingRegular,
                                            }}>
                                                <TouchableOpacity onPress={() => {
                                                    this.removeMainPhoto();
                                                }}>
                                                    <AppIcon name={"ic_close"}
                                                             color={ColorTheme.white}
                                                             provider={CommonIcons}
                                                             size={12}/>
                                                </TouchableOpacity>
                                            </View>}
                                        </View>
                                        {!isRTLMode() && <View style={{width: Constants.defaultPadding}}/>}
                                    </RTLView>
                                </TouchableOpacity>
                            }
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => "" + index}
                        />
                    </View>
                    <View style={{height: Constants.defaultPadding}}/>
                    <TextKVInput title={strings("address")} placeholder={strings("enter_your_address")}
                                 text={this.state.address}
                                 value={value => {
                                     this.setState({address: value})
                                 }}/>
                    <View style={{height: Constants.defaultPadding}}/>
                    <HFTextRegular value={strings("city")}/>
                    <View style={{height: 5}}/>
                    <TextFormInput showOptions={() => {
                        this.setState({showCities: true});
                    }}
                                   dropdown={true}
                                   placeholder={strings("select_city")}
                                   text={this.state.selectedCity ? this.state.selectedCity.name : ""}
                                   value={value => {
                                   }}/>
                    <View style={{height: Constants.defaultPadding}}/>
                    <View style={{}}>
                        <MapView
                            style={{
                                height: 250,
                                borderRadius: Constants.defaultPaddingMin,
                                width: width - (2 * 30) - (2 * Constants.defaultPadding)
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
                    <View style={{height: Constants.defaultPadding}}/>
                    {/*<TextKVInput title={strings("pin")} placeholder={strings("enter_your_pin")}*/}
                    {/*             text={this.state.pin}*/}
                    {/*             keyboard={"number-pad"}*/}
                    {/*             value={value => {*/}
                    {/*                 this.setState({pin: value})*/}
                    {/*             }}/>*/}
                    {/*<View style={{height: Constants.defaultPadding}}/>*/}
                </View>
            </View>
        );
    }

    renderAccountView() {
        let itemDimension = 100;
        return (
            <View style={{
                borderColor: ColorTheme.appThemeLight,
                borderWidth: 0.5,
                overflow: "hidden",
                borderRadius: Constants.defaultPaddingMin,
            }}>
                <TouchableOpacity style={{}} onPress={() => {
                    this.setState({expandAccountView: !this.state.expandAccountView});
                }}>
                    <RTLView style={{
                        alignItems: "center",
                        paddingVertical: Constants.defaultPadding,
                        paddingHorizontal: Constants.defaultPadding,
                        backgroundColor: ColorTheme.appTheme,
                    }} locale={getCurrentLocale()}>
                        <Text style={[{
                            color: ColorTheme.white,
                            fontWeight: "600",
                            fontSize: 16,
                        }]}> {strings("account_information").toUpperCase()}</Text>
                        <View style={{flex: 1}}/>
                        <AppIcon name={"arrow_down"}
                                 color={ColorTheme.white}
                                 provider={CommonIcons}
                                 size={15}/>
                    </RTLView>
                </TouchableOpacity>
                <View style={{
                    flex: 1,
                    backgroundColor: ColorTheme.light_brown,
                    paddingHorizontal: Constants.defaultPadding,
                    height: this.state.expandAccountView ? undefined : 0,
                }}>
                    <View style={{height: Constants.defaultPaddingRegular}}/>
                    <Text style={[{
                        textAlign: isRTLMode() ? "right" : "left",
                        color: ColorTheme.textGreyDark,
                        fontWeight: "400",
                        fontSize: Constants.regularSmallFontSize,
                    }]}> {strings("account_information_description").toUpperCase()}</Text>
                    <View style={{height: Constants.defaultPaddingRegular}}/>
                    <HFTextRegular value={strings("upload_account_photo")}/>
                    <View style={{height: 120}}>
                        <FlatList
                            contentContainerStyle={{
                                justifyContent: isRTLMode() ? "flex-end" : "flex-start",
                                flexDirection: isRTLMode() ? "row-reverse" : "row"
                            }}
                            horizontal={true}
                            style={[{
                                direction: isRTLMode() ? "rtl" : "ltr",
                                paddingVertical: 10,
                                flexDirection: isRTLMode() ? "row-reverse" : "row"
                            }]}
                            data={this.state.logoPhoto}
                            renderItem={({item, index}) =>
                                <TouchableOpacity onPress={() => {
                                    if (item.uri.length === 0) {
                                        this.setState({uploadImage: true, photoIndex: 1});
                                    }
                                }}>
                                    <RTLView locale={getCurrentLocale()}>
                                        {isRTLMode() && <View style={{width: Constants.defaultPadding}}/>}
                                        <View style={{
                                            width: itemDimension,
                                            height: itemDimension,
                                            justifyContent: "center",
                                            backgroundColor: ColorTheme.lightGrey,
                                            alignItems: "center",
                                            borderWidth: 0.5,
                                            borderRadius: Constants.defaultPaddingRegular,
                                            borderColor: ColorTheme.grey,
                                            borderStyle: "dashed",
                                            overflow: "hidden"
                                        }}>
                                            {item.uri.length === 0 && <AppIcon name={"upload"}
                                                                               color={ColorTheme.grey_add}
                                                                               provider={CommonIcons}
                                                                               size={50}/>}
                                            {item.uri.length > 0 &&
                                            <View style={{
                                                borderRadius: 15,
                                                overflow: "hidden",
                                                width: itemDimension,
                                                height: itemDimension
                                            }}>
                                                <FeaturedImage width={itemDimension} height={itemDimension}
                                                               uri={item.uri}/>
                                            </View>
                                            }
                                            {item.uri.length > 0 && <View style={{
                                                position: "absolute",
                                                padding: 2,
                                                right: 7,
                                                top: 7,
                                                backgroundColor: "red",
                                                borderRadius: Constants.defaultPaddingRegular,
                                            }}>
                                                <TouchableOpacity onPress={() => {
                                                    this.removeLogoPhoto();
                                                }}>
                                                    <AppIcon name={"ic_close"}
                                                             color={ColorTheme.white}
                                                             provider={CommonIcons}
                                                             size={12}/>
                                                </TouchableOpacity>
                                            </View>}
                                        </View>
                                        {!isRTLMode() && <View style={{width: Constants.defaultPadding}}/>}
                                    </RTLView>
                                </TouchableOpacity>
                            }
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => "" + index}
                        />
                    </View>
                    <TextKVInput ref={ref => {
                        this.account_email = ref
                    }} title={strings("email")}
                                 placeholder={strings("enter_email_address")}
                                 keyboard={"email-address"}
                                 text={this.state.email}
                                 value={value => {
                                     this.setState({email: value})
                                 }}/>
                    <View style={{height: Constants.defaultPadding}}/>
                    <TextKVInput title={strings("mobile_number")}
                                 placeholder={strings("enter_mobile")}
                                 text={this.state.mobile_number}
                                 keyboard={"number-pad"}
                                 value={value => {
                                     this.setState({mobile_number: value})
                                 }}/>
                    <View style={{height: Constants.defaultPadding}}/>
                    <TextKVInput title={strings("password")}
                                 placeholder={strings("enter_password")}
                                 text={this.state.password}
                                 secure={true}
                                 value={value => {
                                     this.setState({password: value})
                                 }}/>
                    <View style={{height: Constants.defaultPadding}}/>
                    <TextKVInput title={strings("confirm_password")}
                                 placeholder={strings("enter_confirm_password")}
                                 text={this.state.confirm_password}
                                 secure={true}
                                 value={value => {
                                     this.setState({confirm_password: value})
                                 }}/>
                    <View style={{height: Constants.defaultPadding}}/>
                </View>
                <HHPickerView show={this.state.showCities}
                              onDismiss={() => this.setState({showCities: false})}
                              onValueChange={(value, index) => {
                                  this.setState({showCities: false, selectedCity: value})
                              }}
                              selectedValue={this.state.selectedCity}
                              values={this.state.cities}/>
            </View>
        );
    }

    renderContactView() {
        return (
            <View style={{
                borderColor: ColorTheme.appThemeLight,
                borderWidth: 0.5,
                overflow: "hidden",
                borderRadius: Constants.defaultPaddingMin,
            }}>
                <TouchableOpacity style={{}} onPress={() => {
                    this.setState({expandContactView: !this.state.expandContactView});
                }}>
                    <RTLView style={{
                        alignItems: "center",
                        paddingVertical: Constants.defaultPadding,
                        paddingHorizontal: Constants.defaultPadding,
                        backgroundColor: ColorTheme.appTheme,
                    }} locale={getCurrentLocale()}>
                        <Text style={[{
                            color: ColorTheme.white,
                            fontWeight: "600",
                            fontSize: 16,
                        }]}> {strings("contact_information").toUpperCase()}</Text>
                        <View style={{flex: 1}}/>
                        <AppIcon name={"arrow_down"}
                                 color={ColorTheme.white}
                                 provider={CommonIcons}
                                 size={15}/>
                    </RTLView>
                </TouchableOpacity>
                <View style={{
                    flex: 1,
                    backgroundColor: ColorTheme.light_brown,
                    paddingHorizontal: Constants.defaultPadding,
                    height: this.state.expandContactView ? undefined : 0,
                }}>
                    <View style={{height: Constants.defaultPaddingRegular}}/>
                    <Text style={[{
                        textAlign: isRTLMode() ? "right" : "left",
                        color: ColorTheme.textGreyDark,
                        fontWeight: "400",
                        fontSize: Constants.regularSmallFontSize,
                    }]}> {strings("contact_information_description").toUpperCase()}</Text>
                    <View style={{height: Constants.defaultPaddingRegular}}/>
                    <TextKVInput title={strings("first_name")}
                                 placeholder={strings("enter_first_name")}
                                 text={this.state.first_name}
                                 value={value => {
                                     this.setState({first_name: value})
                                 }}/>
                    <View style={{height: Constants.defaultPadding}}/>
                    <TextKVInput title={strings("last_name")}
                                 placeholder={strings("enter_last_name")}
                                 text={this.state.last_name}
                                 value={value => {
                                     this.setState({last_name: value})
                                 }}/>
                    <View style={{height: Constants.defaultPadding}}/>
                    {/*<TextKVInput title={strings("email")}*/}
                    {/*             placeholder={strings("enter_email_address")}*/}
                    {/*             keyboard={"email-address"}*/}
                    {/*             text={this.state.email_contact}*/}
                    {/*             value={value => {*/}
                    {/*                 this.setState({email_contact: value})*/}
                    {/*             }}/>*/}
                    {/*<View style={{height: Constants.defaultPadding}}/>*/}
                    <TextKVInput title={strings("mobile_number")} placeholder={strings("enter_mobile")}
                                 keyboard={"number-pad"}
                                 text={this.state.mobile_number_contact}
                                 value={value => {
                                     this.setState({mobile_number_contact: value})
                                 }}/>
                    <View style={{height: Constants.defaultPadding}}/>
                </View>
            </View>
        );
    }

    render() {
        return (
            <Modal
                isVisible={this.props.show}
                onBackButtonPress={() => {
                    this.dismiss();
                }}
                avoidKeyboard={true}
                useNativeDriver={true}
                onBackdropPress={() => this.dismiss()}>
                <View style={{
                    flex: 1,
                    backgroundColor: ColorTheme.white,
                    marginHorizontal: -20,
                    marginVertical: -20,
                    paddingHorizontal: 30,
                    paddingVertical: 20
                }}>
                    <RTLView locale={getCurrentLocale()} style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: Constants.defaultPaddingRegular
                    }}>
                        <View style={{flex: 1}}/>
                        <Text style={[{
                            textAlign: "center", color: "black",
                            fontWeight: "700",
                            fontSize: 18,
                        }]}> {strings("sign_up")}</Text>
                        <View style={{flex: 1}}/>
                        <TouchableOpacity onPress={() => {
                            this.dismiss();
                        }}>
                            <AppIcon name={"ic_close"}
                                     color={ColorTheme.appTheme}
                                     provider={CommonIcons}
                                     size={25}/>
                        </TouchableOpacity>
                    </RTLView>
                    <ScrollView ref={ref => {
                        this.scrollView = ref
                    }}
                        // onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}
                                style={{marginTop: 40}} showsVerticalScrollIndicator={false}>
                        <Text style={[StaticStyles.heading, {textAlign: isRTLMode() ? "right" : "left"}]}>
                            {strings("create_account")}
                            <Text style={{color: ColorTheme.appTheme}}> {strings("app_name") + " "}</Text>
                            {strings("account")}
                        </Text>
                        <View style={{height: 2 * Constants.defaultPadding}}/>
                        {this.renderBusinessView()}
                        <View style={{height: Constants.defaultPadding}}/>
                        {this.renderAccountView()}
                        <View style={{height: Constants.defaultPadding}}/>
                        {this.renderContactView()}
                    </ScrollView>
                    <View style={{marginTop: Constants.defaultPadding}}>
                        <RTLView locale={getCurrentLocale()} style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: Constants.defaultPaddingRegular,
                            marginBottom: Constants.defaultPaddingRegular
                        }}>
                            <TouchableOpacity onPress={() => {
                                this.setState({termsChecked: !this.state.termsChecked});
                            }}>
                                <AppIcon name={this.state.termsChecked ? "check_box" : "blank_check_box"}
                                         color={ColorTheme.appTheme}
                                         provider={CommonIcons}
                                         size={25}/>
                            </TouchableOpacity>
                            <View style={{width: Constants.defaultPadding}}/>
                            <View>
                                <Text style={[{
                                    textAlign: isRTLMode() ? "right" : "left",
                                    color: ColorTheme.grey,
                                    fontWeight: "500",
                                    fontSize: 14,
                                }]}> {strings("i_accept_terms")}</Text>
                                <TouchableOpacity onPress={() => {
                                    this.setState({showTermsConditions: true});
                                }}>
                                    <Text style={[{
                                        textAlign: isRTLMode() ? "right" : "left",
                                        color: ColorTheme.appTheme,
                                        fontWeight: "500",
                                        fontSize: 14,
                                    }]}> {strings("view_terms")}</Text>
                                </TouchableOpacity>
                            </View>
                        </RTLView>
                        <ActionButton variant={"normal"} title={strings("register")} onPress={() => {
                            this.registerUser();
                        }}/>
                    </View>
                    {this.state.loading && <LoadingOverlay/>}
                    <MessagePopUp show={this.state.showMessagePopup}
                                  heading={strings("succeeded")}
                                  message={strings("account_under_review")}
                                  success={true}
                                  onDismiss={() => {
                                      this.setState({showMessagePopup: false});
                                      this.dismiss();
                                  }
                                  }/>
                    <ImageUploadView show={this.state.uploadImage}
                                     onDismiss={() => {
                                         this.setState({uploadImage: false})
                                     }}
                                     onCameraSelected={() => {
                                         this.launchCamera();
                                     }}
                                     onGallerySelected={() => {
                                         this.launchGallery();
                                     }}/>
                    <VerifyOTPPopUp show={this.state.showOTP} onDismiss={() => {
                        this.setState({showOTP: false})
                    }} onFailure={() => {
                    }} onSuccess={() => {
                        this.setState({showOTP: false, verified_mobile: this.state.mobile_number_contact});
                        setTimeout(() => {
                            this.registerUser();
                        }, 400);
                    }} mobileNumber={this.state.mobile_number_contact}/>
                    <TermsConditions show={this.state.showTermsConditions} onDismiss={() => {
                        this.setState({showTermsConditions: false})
                    }}/>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Constants.defaultPaddingMax,
        backgroundColor: ColorTheme.white,
        margin: -20
    },
});
