import * as React from "react";
import {Component} from "react";
import {StyleSheet, Text, TouchableOpacity, View, FlatList, Platform, ActivityIndicator} from "react-native";
import ColorTheme from "../../../theme/Colors";
import {StaticStyles} from "../../../theme/Styles";
import Constants from "../../../theme/Constants";
import {RTLView} from "react-native-rtl-layout";
import {getCurrentLocale, isRTLMode, strings} from "../../../components/Translations";
import {AppIcon} from "../../../common/IconUtils";
import {CommonIcons} from "../../../icons/Common";
import {SafeAreaView} from "react-navigation";
import TextKVInput from "../../../components/TextKVInput";
import ActionButton from "../../../components/ActionButton";
import HFTextHeavy from "../../../components/HFText/HFTextHeavy";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import ChangePasswordView from "../../../components/ChangePassword";
import {showMessageAlert} from "../../../common";
import * as Api from "../../../lib/api";
import LoadingOverlay from "../../../components/Loading";
import {showMessage} from "react-native-flash-message";
import HFTextRegular from "../../../components/HFText/HFTextRegular";
import ImageUploadView from "../../../components/ImageUpload";
import FeaturedImage from "../../../components/FeaturedImage";
import {photoOptions} from "../../../config/Constants";
import { validEmail, validMobile } from "../../../lib/Validation";
import { generateImageURL } from "../../../lib/Image";
import {launchCamera, launchImageLibrary} from "react-native-image-picker";

const logoPhoto = [
    {name: "", uri: "", data: undefined},
];

interface Props {
    navigation: any;
}

interface State {
    loading?: boolean;
    uploadImage?: boolean;
    isEdit?: boolean;
    sellerProfile?: any;
    logoPhoto: any[];

    business_name?: string;
    business_email?: string;
    business_phone?: string;

    first_name?: string;
    last_name?: string;
    contact_email?: string;
    contact_mobile_number?: string;
    changePassword?: boolean;
}

export default class Profile extends Component<Props, State> {
    apiHandler: any;
    apiExHandler: any;

    constructor(props) {
        super(props);
        this.state = {logoPhoto: logoPhoto, isEdit: false, changePassword: false, business_phone: ""};
    }

    componentDidMount(): void {
        this.getProfile();
    }

    componentWillUnmount() {
    }

    launchCamera() {
        launchCamera(photoOptions, (response) => {
            if (!response.didCancel) {
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
            this.setState({uploadImage: false})
        });
    }

    launchGallery() {
        launchImageLibrary(photoOptions, (response) => {
            if (!response.didCancel) {
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
            this.setState({uploadImage: false})
        });
    }

    private removeMainPhoto() {
        let mainPic = this.state.logoPhoto[0];
        mainPic.uri = "";
        mainPic.name = "";
        mainPic.data = undefined;
        this.setState({logoPhoto: [mainPic]});
    }

    private getProfile() {
        this.setState({loading: true});
        let formData = new FormData();
        this.apiHandler = (response) => {
            Api.checkValidationError(response, resp => {
                if (response.code === 200 && resp && resp.seller_details) {
                    let details = resp.seller_details;
                    let logoPic = logoPhoto[0];
                    logoPic.uri = details.logo;
                    this.setState({sellerProfile: resp},
                    ()=>{
                      this.loadProfileInForm();
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

    private loadProfileInForm(){
      let {seller_details} = this.state.sellerProfile;
      let logoPic = logoPhoto[0];
      logoPic.uri = seller_details.logo;
      this.setState({
          isEdit: false,
          business_email: seller_details.legal_business_email,
          business_name: seller_details.title,
          business_phone: seller_details.legal_business_phone,
          first_name: seller_details.contact_us_first_name,
          last_name: seller_details.contact_us_last_name,
          contact_email: seller_details.contact_us_email,
          logoPhoto: logoPhoto,
          contact_mobile_number: seller_details.legal_business_phone,
      });
    }

    private validateInputs() {
        if (this.state.logoPhoto[0].uri.length === 0) {
            showMessageAlert(strings("invalid_logo_image"));
            return false;
        }

        // BUSINESS NAME
        if (!this.state.business_name || (this.state.business_name && this.state.business_name.length === 0)) {
            showMessageAlert(strings("invalid_business_name"));
            return false;
        }

        // BUSINESS EMAIL
        if (!this.state.business_email || (this.state.business_email && this.state.business_email.length === 0) || !validEmail(this.state.business_email)) {
            showMessageAlert(strings("invalid_business_email"));
            return false;
        }

        // BUSINESS PHONE
        if (!this.state.business_phone || (this.state.business_phone && this.state.business_phone.length === 0) || !validMobile(this.state.business_phone)) {
            showMessageAlert(strings("invalid_business_phone"));
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

        //EMAIL CONTACT
        if (!this.state.contact_email || (this.state.contact_email && this.state.contact_email.length === 0) || !validEmail(this.state.contact_email)) {
            showMessageAlert(strings("invalid_email_contact"));
            return false;
        }

        // MOBILE CONTACT
        if (!this.state.contact_mobile_number || (this.state.contact_mobile_number && this.state.contact_mobile_number.length === 0) || !validMobile(this.state.contact_mobile_number)) {
            showMessageAlert(strings("invalid_mobile_number_contact"));
            return false;
        }

        return true;
    }

    private updateProfile() {
        if (this.validateInputs()) {
            this.setState({loading: true});
            let formData = new FormData();
            let photo = this.state.logoPhoto[0];
            formData.append("logo", {
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
            formData.append("phone", this.state.contact_mobile_number) // UPDATE
            formData.append("lang", getCurrentLocale())
            formData.append("emirates_id", this.state.sellerProfile.seller_details.emirates_id)
            formData.append("address", this.state.sellerProfile.seller_details.address)
            formData.append("license_id", this.state.sellerProfile.seller_details.license_id)
            formData.append("license_start_date", this.state.sellerProfile.seller_details.license_start_date)
            formData.append("license_end_date", this.state.sellerProfile.seller_details.license_end_date)
            formData.append("city", this.state.sellerProfile.seller_details.city)
            formData.append("pincode", this.state.sellerProfile.seller_details.pincode)
            formData.append("accept_orders", this.state.sellerProfile.seller_details.accept_orders)

            formData.append("legal_business_name", this.state.business_name)
            formData.append("legal_business_email", this.state.business_email)
            formData.append("c_legal_business_email", this.state.business_email)
            formData.append("legal_business_phone", this.state.business_phone)

            formData.append("contact_us_first_name", this.state.first_name)
            formData.append("contact_us_last_name", this.state.last_name)
            formData.append("contact_us_email", this.state.contact_email)

            this.apiHandler = (response) => {
                Api.checkValidationError(response, resp => {
                    if (response.code === 200) {
                        // analytics().logEvent('Update_Profile', {
                        //     user_id: response.response_data.id,
                        // });
                        showMessage({
                            message: strings("profile_update_success"),
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
                    <RTLView locale={getCurrentLocale()}>
                        <TouchableOpacity style={{padding: Constants.defaultPadding}} onPress={() => {
                            this.props.navigation.goBack();
                        }}>
                            <AppIcon name={isRTLMode() ? "back_ar" : "back"}
                                     color={ColorTheme.appTheme}
                                     provider={CommonIcons}
                                     size={22}/>
                        </TouchableOpacity>
                        <View style={{flex: 1}}/>
                        <Text style={StaticStyles.nav_title}>{strings("my_profile")}</Text>
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
                                    fontSize: Constants.regularFontSize,
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

    renderSecurityInformation(){
      if(!this.state.isEdit){
        return (
          <>
            <View style={{
                backgroundColor: ColorTheme.appThemeLightest,
                paddingHorizontal: Constants.defaultPadding,
                paddingVertical: Constants.defaultPadding,
            }}>
                <HFTextHeavy value={strings("security_information")}/>
              </View>
              <View style={{
                  paddingHorizontal: Constants.defaultPaddingRegular,
                  paddingVertical: Constants.defaultPaddingRegular
              }}>
                  <ActionButton variant={"normal"} title={strings("change_password")} onPress={() => {
                      this.setState({changePassword: true})
                  }}/>
            </View>
          </>
        )
      }
      return null;
    }

    render() {
        let itemDimension = 100;
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: ColorTheme.white}}>
                {this.renderHeader()}
                <KeyboardAwareScrollView style={{marginBottom: Constants.marginBottom}}>
                    <View style={{
                        backgroundColor: ColorTheme.appThemeLightest,
                        paddingHorizontal: Constants.defaultPadding,
                        paddingVertical: Constants.defaultPadding,
                    }}>
                        <HFTextHeavy value={strings("upload_account_photo")}/>
                    </View>
                    <View style={{height: 120, paddingHorizontal: Constants.defaultPaddingRegular}}>
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
                                        this.setState({uploadImage: true});
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
                                            <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                                                <View style={{
                                                    borderWidth: 0.5,
                                                    borderRadius: Constants.defaultPaddingRegular,
                                                    borderColor: ColorTheme.grey,
                                                    overflow: "hidden",
                                                    width: itemDimension,
                                                    height: itemDimension
                                                }}>
                                                    <FeaturedImage width={itemDimension} height={itemDimension}
                                                                   uri={this.state.isEdit ? item.uri : generateImageURL(item.uri, itemDimension, itemDimension)}/>
                                                </View>
                                            </View>
                                            }
                                            {this.state.isEdit && item.uri.length > 0 && <View style={{
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

                    {this.renderSecurityInformation()}

                    <View style={{
                        backgroundColor: ColorTheme.appThemeLightest,
                        paddingHorizontal: Constants.defaultPadding,
                        paddingVertical: Constants.defaultPadding,
                    }}>
                        <HFTextHeavy value={strings("business_information")}/>
                    </View>

                    <View style={{
                        paddingHorizontal: Constants.defaultPaddingRegular,
                        paddingVertical: Constants.defaultPaddingRegular
                    }}>
                        <TextKVInput title={strings("business_name")}
                                     text={this.state.business_name}
                                     placeholder={strings("enter_value")}
                                     editable={this.state.isEdit}
                                     value={value => {
                                         this.setState({business_name: value})
                                     }}/>
                        <View style={{height: Constants.defaultPaddingMax}}/>
                        <TextKVInput title={strings("business_email")}
                                     text={this.state.business_email}
                                     placeholder={strings("enter_value")}
                                     keyboard={"email-address"}
                                     editable={this.state.isEdit}
                                     value={value => {
                                         this.setState({business_email: value})
                                     }}/>
                        <View style={{height: Constants.defaultPaddingMax}}/>
                        <TextKVInput title={strings("business_phone")}
                                     text={this.state.business_phone}
                                     placeholder={strings("enter_value")}
                                     keyboard={"phone-pad"}
                                     editable={this.state.isEdit}
                                     value={value => {
                                         this.setState({business_phone: value})
                                     }}/>
                    </View>

                    <View style={{
                        backgroundColor: ColorTheme.appThemeLightest,
                        paddingHorizontal: Constants.defaultPadding,
                        paddingVertical: Constants.defaultPadding,
                    }}>
                        <HFTextHeavy value={strings("contact_information")}/>
                    </View>
                    <View style={{
                        paddingHorizontal: Constants.defaultPaddingRegular,
                        paddingVertical: Constants.defaultPaddingRegular
                    }}>
                        <TextKVInput title={strings("first_name")}
                                     text={this.state.first_name}
                                     placeholder={strings("enter_value")}
                                     editable={this.state.isEdit}
                                     value={value => {
                                         this.setState({first_name: value})
                                     }}/>
                        <View style={{height: Constants.defaultPaddingMax}}/>
                        <TextKVInput title={strings("last_name")}
                                     text={this.state.last_name}
                                     placeholder={strings("enter_value")}
                                     editable={this.state.isEdit}
                                     value={value => {
                                         this.setState({last_name: value})
                                     }}/>
                        <View style={{height: Constants.defaultPaddingMax}}/>
                        <TextKVInput title={strings("email")}
                                     text={this.state.contact_email}
                                     placeholder={strings("enter_value")}
                                     keyboard={"email-address"}
                                     editable={this.state.isEdit}
                                     value={value => {
                                         this.setState({contact_email: value})
                                     }}/>
                        <View style={{height: Constants.defaultPaddingMax}}/>
                        <TextKVInput title={strings("mobile_number")}
                                     text={this.state.contact_mobile_number}
                                     placeholder={strings("enter_value")} // CHANGE LOGIC
                                     keyboard={"phone-pad"}
                                     editable={this.state.isEdit}
                                     value={value => {
                                         this.setState({contact_mobile_number: value})
                                     }}/>
                    </View>
                    {this.state.isEdit &&
                    <RTLView style={{
                        marginTop: Constants.defaultPaddingRegular,
                        flex: 1,
                        alignItems: "center",
                        paddingHorizontal: Constants.defaultPaddingRegular
                    }}
                             locale={getCurrentLocale()}>
                        <View style={{flex: 1}}>
                            <ActionButton variant={"alt"} title={strings("cancel")} onPress={() => {
                                this.loadProfileInForm();
                            }}/>
                        </View>
                        <View style={{width: Constants.defaultPadding}}/>
                        <View style={{flex: 1}}>
                            <ActionButton variant={"normal"} title={strings("save")} onPress={() => {
                                this.updateProfile();
                            }}/>
                        </View>
                    </RTLView>}
                </KeyboardAwareScrollView>
                <ChangePasswordView show={this.state.changePassword}
                                    hasCurrentPassword={true}
                                    onDismiss={() => {
                                        this.setState({changePassword: false})
                                    }}
                                    onSuccess={() => {
                                        this.setState({changePassword: false})
                                        setTimeout(() => {
                                            showMessageAlert(strings("password_reset_success"));
                                        }, 400);
                                    }}
                                    onFailure={() => {
                                        this.setState({changePassword: false})
                                    }}/>
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
