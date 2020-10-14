import * as React from "react";
import {Component} from "react";
import {FlatList, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {StaticStyles} from "../../../theme/Styles";
import Constants from "../../../theme/Constants";
import ColorTheme from "../../../theme/Colors";
import {getCurrentLocale, isRTLMode, strings} from "../../../components/Translations";
import TextKVInput from "../../../components/TextKVInput";
import ActionButton from "../../../components/ActionButton";
import {RTLText, RTLView} from "react-native-rtl-layout";
import * as Api from "../../../lib/api";
import LoadingOverlay from "../../../components/Loading";
import {showMessageAlert} from "../../../common";
import MessagePopUp from "../../../components/MessagePopUp";
import Modal from "react-native-modal";
import {AppIcon} from "../../../common/IconUtils";
import {CommonIcons} from "../../../icons/Common";
import HHDatePicker from "../../../components/HHDatePicker";
import ImagePicker from "react-native-image-picker";
import FastImage from "react-native-fast-image";
import ImageUploadView from "../../../components/ImageUpload";
import HFTextRegular from "../../../components/HFText/HFTextRegular";
import VerifyOTPPopUp from "../../../components/VerifyOTPPopUp";
import {parseDate} from "../../../lib/DateUtil";
import { getDeviceId } from "../../../lib/user";
import TermsConditions from "./TermsConditions"
const licensePhoto = [
    {name: "", uri: "", data: undefined},
];

const logoPhoto = [
    {name: "", uri: "", data: undefined},
];

const options = {
    title: 'Select Avatar',
    customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
    quality: 0.5
};

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
}

export default class SignUp extends Component<Props, State> {
    apiHandler: any;
    apiExHandler: any;
    scrollView: any;
    account_email: any;

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
            // business_name:"Test Business",
            // business_email: "sohrab.iosdev@gmail.com",
            // emirates_id: "784198809538493",
            // license_id: "234123",
            // address: "Al Nahda",
            // city: "Sharjah",
            // email: "sohrab@gmail.com",
            // mobile_number: "971507467251",
            // password: "123456",
            // confirm_password: "123456",
            // first_name: "Sohrab",
            // last_name: "Hussain",
            // email_contact: "sohrab.iosdev@gmail.com",
            // mobile_number_contact: "971507467251",
            license_start_date: new Date,
            license_end_date: new Date,
        }
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
        if (!this.state.city || (this.state.city && this.state.city.length === 0)) {
            showMessageAlert(strings("invalid_city"));
            return false;
        }

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

        if (!this.state.termsChecked ) {
            showMessageAlert(strings("please_accept_terms"));
            return false;
        }
        return true;
    }

    private registerUser() {
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
        formData.append("emirates_id", this.state.emirates_id)
        formData.append("address", this.state.address)
        formData.append("license_id", this.state.license_id)
        formData.append("license_start_date", parseDate(this.state.license_start_date, "yyyy-MM-DD"))
        formData.append("license_end_date", parseDate(this.state.license_end_date, "yyyy-MM-DD"))
        formData.append("city", this.state.city)
        formData.append("pincode", this.state.pin)
        formData.append("contact_us_first_name", this.state.first_name)
        formData.append("contact_us_last_name", this.state.last_name)
        formData.append("contact_us_email", this.state.email)
        formData.append("accept_orders", 0)
        formData.append("device_udid", getDeviceId())

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
        ImagePicker.launchCamera(options, (response) => {
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
        ImagePicker.launchImageLibrary(options, (response) => {
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
                    <RTLText fontSize={Constants.regularSmallFontSize} locale={getCurrentLocale()}
                             style={[{
                                 fontWeight: "400",
                                 color: ColorTheme.textGreyDark,
                             }]}>{strings("business_information_description")}</RTLText>
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
                                      this.setState({license_start_date: dateValue});
                                  }}/>
                    <View style={{height: Constants.defaultPadding}}/>
                    <HHDatePicker title={strings("license_expiry_date")}
                                  date={this.state.license_end_date}
                                  editable={true}
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
                                            {item.uri.length > 0 && <FastImage
                                                style={{
                                                    width: itemDimension,
                                                    height: itemDimension,
                                                }}
                                                source={{
                                                    uri: item.uri,
                                                    priority: FastImage.priority.normal,
                                                }}
                                                onLoadStart={() => {
                                                }}
                                                onLoadEnd={() => {
                                                }}
                                            />}
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
                    <TextKVInput title={strings("city")} placeholder={strings("enter_your_city")}
                                 text={this.state.city}
                                 value={value => {
                                     this.setState({city: value})
                                 }}/>
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
                    <RTLText fontSize={Constants.regularSmallFontSize} locale={getCurrentLocale()}
                             style={[{
                                 fontWeight: "400",
                                 color: ColorTheme.textGreyDark,
                             }]}>{strings("account_information_description")}</RTLText>
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
                                            {item.uri.length > 0 && <FastImage
                                                style={{
                                                    width: itemDimension,
                                                    height: itemDimension,
                                                }}
                                                source={{
                                                    uri: item.uri,
                                                    priority: FastImage.priority.normal,
                                                }}
                                                onLoadStart={() => {
                                                }}
                                                onLoadEnd={() => {
                                                }}
                                            />}
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
                    <TextKVInput ref={ref => {this.account_email = ref}} title={strings("email")}
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
                    <RTLText fontSize={Constants.regularSmallFontSize} locale={getCurrentLocale()}
                             style={[{
                                 fontWeight: "400",
                                 color: ColorTheme.textGreyDark,
                             }]}>{strings("contact_information_description")}</RTLText>
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
                    <ScrollView ref={ref => {this.scrollView = ref}}
                                // onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}
                                style={{marginTop: 40}} showsVerticalScrollIndicator={false}>
                        <Text style={[StaticStyles.heading, {textAlign: isRTLMode() ? "right" : "left"}]}>
                            {strings("create_account")}
                            <Text style={{color: ColorTheme.appTheme}}> {strings("app_name")}</Text>
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
                                <RTLText locale={getCurrentLocale()} style={[{
                                    color: ColorTheme.grey,
                                    fontWeight: "500",
                                    fontSize: 14,
                                }]}> {strings("i_accept_terms")}</RTLText>
                                <TouchableOpacity onPress={() => {
                                    this.setState({showTermsConditions: true});
                                }}>
                                    <RTLText locale={getCurrentLocale()} style={[{
                                        color: ColorTheme.appTheme,
                                        fontWeight: "500",
                                        fontSize: 14,
                                    }]}> {strings("view_terms")}</RTLText>
                                </TouchableOpacity>
                            </View>
                        </RTLView>
                        <ActionButton variant={"normal"} title={strings("register")} onPress={() => {
                            // if (this.state.verified_mobile !== this.state.mobile_number_contact) {
                            //     {this.setState({showOTP: true})};
                            // } else {
                            //     this.registerUser();
                            // }
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
