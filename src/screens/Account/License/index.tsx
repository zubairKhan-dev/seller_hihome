import * as React from "react";
import {Component} from "react";
import {StyleSheet, Text, TouchableOpacity, View, Platform, ActivityIndicator} from "react-native";
import ColorTheme from "../../../theme/Colors";
import {StaticStyles} from "../../../theme/Styles";
import Constants from "../../../theme/Constants";
import {RTLText, RTLView} from "react-native-rtl-layout";
import {getCurrentLocale, isRTLMode, strings} from "../../../components/Translations";
import {AppIcon} from "../../../common/IconUtils";
import {CommonIcons} from "../../../icons/Common";
import {SafeAreaView} from "react-navigation";
import TextKVInput from "../../../components/TextKVInput";
import HHDatePicker from "../../../components/HHDatePicker";
import HHPicker from "../../../components/HHPickerView/HHPicker";
import HFTextRegular from "../../../components/HFText/HFTextRegular";
import {windowWidth, showMessageAlert} from "../../../common";
import ImageUploadView from "../../../components/ImageUpload";
import DocumentsViewer from "../../../components/DocumentsViewer";
import ImagePicker from "react-native-image-picker";
import ActionButton from "../../../components/ActionButton";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import * as Api from "../../../lib/api";
import { showMessage } from "react-native-flash-message";
import { parseDate, formatDate } from "../../../lib/DateUtil";
import LoadingOverlay from "../../../components/Loading";
import FeaturedImage from "../../../components/FeaturedImage";
import {photoOptions} from "../../../config/Constants";

const defaultPhoto = {name: "", uri: "", data: undefined};

interface Props {
    navigation: any;
}

interface State {
    loading?: boolean;
    showActivity?: boolean;
    reload?: boolean;
    isEdit?: boolean;
    uploadImage?: boolean;
    showDocumentsViewer?: boolean;
    sellerProfile?: any;

    licenseId?: string;
    licenseStartDate?: Date;
    licenseExpiryDate?: Date;
    licensePhoto: any;
    accountPhoto: any;
    city?: string;
    pincode?: string;
}

export default class License extends Component<Props, State> {
    apiHandler: any;
    apiExHandler: any;
    constructor(props) {
        super(props);
        this.state = {pincode: "", reload: false, isEdit: false, accountPhoto: defaultPhoto, licensePhoto: defaultPhoto, uploadImage: false, licenseStartDate: new Date(), licenseExpiryDate: new Date()};
    }

    componentDidMount(): void {
        this.getProfile();
    }

    componentWillUnmount() {
        // Remove the event listener before removing the screen from the stack
    }
    private getProfile() {
        this.setState({loading: true});
        let formData = new FormData();
        this.apiHandler = (response) => {
            Api.checkValidationError(response, resp => {
                if (response.code === 200 && resp && resp.seller_details) {

                    this.setState({
                        sellerProfile: resp
                    }, () => {
                      this.loadLicenseData();
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

    private loadLicenseData(){
      let { seller_details } = this.state.sellerProfile;
      let licPic = defaultPhoto;
      licPic.uri = seller_details.license_photo;
      this.setState({
          isEdit: false,
          licenseId: seller_details.license_id,
          licenseStartDate: new Date(formatDate(seller_details.license_start_date, "yyyy-MM-DD")) ,
          licenseExpiryDate: new Date(formatDate(seller_details.license_end_date, "yyyy-MM-DD")),
          licensePhoto: licPic,
          city: seller_details.city,
          pincode: seller_details.pincode
      });

    }
    private validateInputs() {
        // LICESE ID
        if (!this.state.licenseId || (this.state.licenseId && this.state.licenseId.length === 0)) {
            showMessageAlert(strings("invalid_license_id"));
            return false;
        }

        // CITY
        if (!this.state.city || (this.state.city && this.state.city.length === 0)) {
            showMessageAlert(strings("invalid_city"));
            return false;
        }

        // LICENSE DATES
        if (this.state.licenseStartDate > this.state.licenseExpiryDate) {
            showMessageAlert(strings("invalid_license_dates"));
            return false;
        }
        // LICENSE PHOTO
        // !this.state.licensePhoto.data
        if (this.state.licensePhoto.uri.length === 0) {
            showMessageAlert(strings("invalid_license_image"));
            return false;
        }


        return true;
    }

    private updateLicenseDetails() {
        this.setState({loading: true});
        let formData = new FormData();
        let photo = this.state.licensePhoto;
        formData.append("license_photo", {
            name: "test",
            type: photo.data ? photo.data.type : "",
            uri: Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
        });
        formData.append("user_id", this.state.sellerProfile.id)
        formData.append("first_name", this.state.sellerProfile.first_name)
        formData.append("last_name", this.state.sellerProfile.last_name)
        formData.append("email", this.state.sellerProfile.email)
        formData.append("password", "123456") // REMOVE
        formData.append("c_password", "123456") // REMOVE
        formData.append("phone", "0507467251")
        formData.append("lang", getCurrentLocale())
        formData.append("emirates_id", this.state.sellerProfile.seller_details.emirates_id)
        formData.append("address", this.state.sellerProfile.seller_details.address)
        formData.append("accept_orders", this.state.sellerProfile.seller_details.accept_orders)
        formData.append("legal_business_name", this.state.sellerProfile.seller_details.title)
        formData.append("legal_business_email", this.state.sellerProfile.seller_details.legal_business_email)
        formData.append("c_legal_business_email", this.state.sellerProfile.seller_details.legal_business_email)
        formData.append("legal_business_phone", this.state.sellerProfile.seller_details.legal_business_phone)
        formData.append("contact_us_first_name", this.state.sellerProfile.seller_details.contact_us_first_name)
        formData.append("contact_us_last_name", this.state.sellerProfile.seller_details.contact_us_last_name)
        formData.append("contact_us_email", this.state.sellerProfile.seller_details.contact_us_email)
        formData.append("logo", this.state.sellerProfile.seller_details.logo)

        formData.append("license_id", this.state.licenseId)
        formData.append("license_start_date", parseDate(this.state.licenseStartDate, "yyyy-MM-DD"))
        formData.append("license_end_date", parseDate(this.state.licenseExpiryDate, "yyyy-MM-DD"))
        formData.append("city", this.state.city)
        formData.append("pincode", this.state.pincode)
        this.apiHandler = (response) => {
            Api.checkValidationError(response, resp => {
                if (response.code === 200) {
                    showMessage({
                        message: strings("license_update_success"),
                        type: "success",
                        duration: 4000
                    });
                    setTimeout(() => {
                        this.props.navigation.pop();
                    }, 200);
                    this.setState({isEdit: false});
                }
                this.setState({loading: false});
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
        Api.updateProfile(formData)
            .then((response) => {
                    this.apiHandler(response);
                },
            ).catch((reason => {
                this.apiExHandler(reason);
            }),
        );
    }

    launchCamera() {
        ImagePicker.launchCamera(photoOptions, (response) => {
            if (!response.didCancel) {
                let photo = this.state.licensePhoto;
                if (photo.uri.length === 0 && !photo.add) {
                    photo.uri = response.uri;
                    photo.data = response;
                }
            }
            this.setState({uploadImage: false})
        });
    }

    launchGallery() {
        ImagePicker.launchImageLibrary(photoOptions, (response) => {
            if (!response.didCancel) {
                let photo = this.state.licensePhoto;
                if (photo.uri.length === 0 && !photo.add) {
                    photo.uri = response.uri;
                    photo.data = response;
                }
            }
            this.setState({uploadImage: false})
        });
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
                        <Text style={StaticStyles.nav_title}>{strings("my_license")}</Text>
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
    private removeMainPhoto() {
        let mainPic = this.state.licensePhoto;
        mainPic.uri = "";
        mainPic.name = "";
        mainPic.data = undefined;
        this.setState({licensePhoto: mainPic});
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: ColorTheme.white}}>
                {this.renderHeader()}
                <KeyboardAwareScrollView style={{
                    marginBottom: Constants.marginBottom,
                    paddingHorizontal: Constants.defaultPaddingRegular,
                    paddingVertical: Constants.defaultPaddingRegular
                }}>
                    <TextKVInput title={strings("license_id")}
                                 text={this.state.licenseId}
                                 placeholder={strings("enter_value")}
                                 keyboard={"numeric"}
                                 editable={this.state.isEdit}
                                 value={value => {
                                     this.setState({licenseId: value})
                                 }}/>
                    <View style={{height: Constants.defaultPaddingMax}}/>
                    <RTLView locale={getCurrentLocale()}>
                        <View style={{flex: 1}}>
                            <HHDatePicker title={strings("license_start_date")}
                                          date={this.state.licenseStartDate}
                                          editable={this.state.isEdit}
                                          value={(dateValue) => {
                                              this.setState({licenseStartDate: dateValue});
                                          }}/>
                        </View>
                        <View style={{width: Constants.defaultPaddingRegular}}/>
                        <View style={{flex: 1}}>
                            <HHDatePicker title={strings("license_expiry_date")}
                                          date={this.state.licenseExpiryDate}
                                          editable={this.state.isEdit}
                                          value={(dateValue) => {
                                              this.setState({licenseExpiryDate: dateValue});
                                          }}/>
                        </View>
                    </RTLView>

                    <View style={{height: Constants.defaultPaddingMax}}/>
                    <HFTextRegular value={strings("license_photo")}/>
                    <View style={{height: Constants.defaultPadding}}/>
                    <TouchableOpacity onPress={() => {
                        if (this.state.isEdit) {
                            if (this.state.licensePhoto.uri === "") {
                                this.setState({uploadImage: true});
                            } else {
                                this.setState({showDocumentsViewer: true});
                            }
                        } else {
                            if (this.state.licensePhoto.uri !== "") {
                                this.setState({showDocumentsViewer: true});
                            }
                        }
                    }}>
                        {this.state.licensePhoto.uri === "" && <View style={{
                            width: windowWidth - (2 * Constants.defaultPaddingRegular),
                            height: 150,
                            justifyContent: "center",
                            alignItems: "center",
                            borderWidth: 0.5,
                            borderColor: ColorTheme.grey,
                            borderStyle: "dashed",
                            backgroundColor: ColorTheme.lightGrey
                        }}>
                            <AppIcon name={"upload"}
                                     color={ColorTheme.grey_add}
                                     provider={CommonIcons}
                                     size={40}/>
                            <View style={{height: Constants.defaultPadding}}/>
                            <RTLText fontSize={Constants.regularSmallerFontSize} locale={getCurrentLocale()}
                                     style={[{
                                         fontWeight: "200",
                                         color: ColorTheme.grey,
                                         textAlign: "center"
                                     }]}>{strings("upload_image")}</RTLText>
                        </View>}
                        {this.state.licensePhoto && this.state.licensePhoto.uri.length > 0 && <View style={{
                            width: windowWidth - (2 * Constants.defaultPaddingRegular),
                            height: 150,
                            justifyContent: "center",
                            alignItems: "center",
                            borderWidth: 0.5,
                            borderColor: ColorTheme.grey,
                            borderStyle: "dashed",
                            backgroundColor: ColorTheme.lightGrey
                        }}>
                            <View style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                                {this.state.showActivity && <ActivityIndicator size={"small"} style={{position: "absolute"}} color={ColorTheme.appTheme}/>}
                                <View style={{overflow: "hidden", width: windowWidth - (2 * Constants.defaultPaddingRegular), height: 150}}>
                                    <FeaturedImage width={windowWidth - (2 * Constants.defaultPaddingRegular)} height={150} uri={this.state.licensePhoto.uri}/>
                                </View>
                            </View>
                            {this.state.isEdit && <View style={{
                                position: "absolute",
                                padding: 5,
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
                                             size={14}/>
                                </TouchableOpacity>
                            </View>}
                        </View>}
                    </TouchableOpacity>
                    {this.state.isEdit &&
                    <RTLView style={{marginTop: Constants.defaultPaddingRegular, flex: 1, alignItems: "center"}}
                             locale={getCurrentLocale()}>
                        <View style={{flex: 1}}>
                            <ActionButton variant={"alt"} title={strings("cancel")} onPress={() => {
                                this.loadLicenseData();
                            }}/>
                        </View>
                        <View style={{width: Constants.defaultPadding}}/>
                        <View style={{flex: 1}}>
                            <ActionButton variant={"normal"} title={strings("save")} onPress={() => {
                                if (this.validateInputs()) {
                                    this.updateLicenseDetails();
                                }
                            }}/>
                        </View>
                    </RTLView>}

                    <ImageUploadView show={this.state.uploadImage}
                                     onDismiss={() => {
                                         this.setState({uploadImage: false})
                                     }}
                                     onCameraSelected={() => {
                                         this.launchCamera();
                                     }}
                                     onGallerySelected={() => {
                                         this.launchGallery();
                                     }}
                    />
                    <DocumentsViewer show={this.state.showDocumentsViewer}
                                     onDismiss={() => {
                                         this.setState({showDocumentsViewer: false})
                                     }}
                                     documents={[this.state.licensePhoto.uri]}
                    />
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
