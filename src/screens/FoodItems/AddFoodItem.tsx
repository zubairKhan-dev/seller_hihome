import * as React from "react";
import {Component} from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import ColorTheme from "../../theme/Colors";
import Constants from "../../theme/Constants";
import {getCurrentLocale, isRTLMode, strings} from "../../components/Translations";
import {AppIcon} from "../../common/IconUtils";
import {CommonIcons} from "../../icons/Common";
import {RTLView} from "react-native-rtl-layout";
import TextFormInput from "../../components/TextFormInput";
import HFTextRegular from "../../components/HFText/HFTextRegular";
import {StaticStyles} from "../../theme/Styles";
import HFTextLight from "../../components/HFText/HFTextLight";
import ActionButton from "../../components/ActionButton";
import HHPickerView from "../../components/HHPickerView";
import {SafeAreaView} from "react-navigation";
import FastImage from "react-native-fast-image";
import ImageUploadView from "../../components/ImageUpload";
import ImagePicker from "react-native-image-picker";
import * as Api from "../../lib/api";
import {showMessageAlert} from "../../common";
import LoadingOverlay from "../../components/Loading";
import RecipeIngredients from "./RecipeIngredients";
import {showMessage} from "react-native-flash-message";
import {combineTime, splitTime} from "../../lib/DateUtil";
import {XEvents} from "../../lib/EventBus";
import Events from "react-native-simple-events";
import {hasFeaturedProduct, setProfile} from "../../lib/user";

const removeItem = (items, i) =>
    items.slice(0, i - 1).concat(items.slice(i, items.length))

const options = {
    title: 'Select Avatar',
    customButtons: [{name: 'fb', title: 'Choose Photo from Facebook'}],
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
    quality: 0.5
};

export enum TextViewType {
    INGREDIENTS = 1,
    RECIPE
}

const morePhotos = [
    {name: "", uri: "", data: {}},
    {name: "", uri: "", data: {}},
    {name: "", uri: "", data: {}},
    {name: "", uri: "", data: {}},
    {name: "", uri: "", data: {}},
];


const mainPhoto = [
    {name: "", uri: "", data: undefined},
];

interface Props {
    navigation: any;
    isFeatureProduct?: boolean;
}

interface State {
    loading?: boolean;
    showActivity?: boolean;
    showMainPhotoActivity?: boolean;
    foodName?: string;
    photos: any[];
    mainPhoto: any[];
    costPrice?: string;
    offer?: any;
    days?: string;
    hours?: string;
    minutes?: string;
    ingredients?: string;
    description?: string;
    edit?: boolean;
    showRecipeIngredients?: boolean;
    textViewTitle?: string;
    textViewType?: number;
    categories: any[];

    showOffers?: boolean;
    selectedOffer?: any;
    uploadImage?: boolean;
    selectedCategory?: any;
    showCategories?: boolean;

    errorOccurred?: boolean;
    errorText?: string;

    photoIndex?: number;
    product?: any;

    showFeatureInfo?: boolean;
    isFeatureProduct?: number;
}

export default class AddFoodItem extends Component<Props, State> {
    apiHandler: any;
    apiExHandler: any;
    product: any;

    constructor(props) {
        super(props);
        const {edit, product} = props.route.params;
        this.product = product;
        this.state = {
            loading: false,
            showFeatureInfo: false,
            isFeatureProduct: edit === 1 ? product.is_feature : 0,
            categories: [],
            photos: edit === 1 ? this.getMorePhotos(product) : morePhotos,
            mainPhoto: edit === 1 ? this.getMainPhoto(product) : mainPhoto,
            showRecipeIngredients: false,
            showOffers: false,
            textViewTitle: "",
            selectedOffer: "None",
            selectedCategory: undefined,
            showCategories: false,
            uploadImage: false,
            foodName: edit === 0 ? "" : product.name ? product.name : "",
            costPrice: edit === 0 ? "" : "" + product.price,
            ingredients: edit === 0 ? "" : product.ingredients ? product.ingredients : "",
            description: edit === 0 ? "" : product.description ? product.description : "",
            edit: edit !== 0,
            product: edit === 1 ? product : undefined,
            days: edit === 1 ? "" + splitTime(product.prepration_time).days : "",
            hours: edit === 1 ? "" + splitTime(product.prepration_time).hours : "",
            minutes: edit === 1 ? "" + splitTime(product.prepration_time).minutes : ""
        }
    }

    componentDidMount(): void {
        this.getCategories();
    }

    private updateLocalProfile() {
        let formData = new FormData();
        this.apiHandler = (response) => {
            Api.checkValidationError(response, resp => {
                switch (response.code) {
                    case 200 :
                        if (resp) {
                            setProfile(resp);
                        }
                        break;
                }
            }, (errors, errorMessage) => {
                showMessageAlert(errorMessage);
            });
        };
        this.apiExHandler = (reason) => {
            showMessageAlert(reason);
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

    private getCategories() {
        this.setState({loading: true});
        this.apiHandler = (response) => {
            Api.checkValidationError(response, resp => {
                if (response && response.code === 200 && resp.data) {
                    this.setState({
                        categories: response.response_data.data,
                        selectedCategory: response.response_data.data[0]
                    });
                    this.updateLocalProfile();
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
        Api.getCategories()
            .then((response) => {
                    this.apiHandler(response);
                },
            ).catch((reason => {
                this.apiExHandler(reason);
            }),
        );
    }

    getMorePhotos(product) {
        let newPhotos = morePhotos;
        for (let i = 0; i < newPhotos.length; i++) {
            let pic = newPhotos[i];
            if (product.images_list && product.images_list.length > i) {
                pic.uri = product.images_list[i].image;
            } else {
                pic.uri = "";
            }
        }
        return newPhotos;
    }

    getMainPhoto(product) {
        let newPhoto = mainPhoto;
        for (let i = 0; i < newPhoto.length; i++) {
            let pic = newPhoto[i];
            if (product.main_image && product.main_image.length > 0) {
                pic.uri = product.main_image;
            } else {
                pic.uri = "";
            }
        }
        return newPhoto;
    }

    getCategory(id) {
        for (let i = 0; i < this.state.categories.length; i++) {
            let category = this.state.categories[i];
            if (category.id === id) {
                return category
            }
        }
        return {
            "id": 1,
            "image": "http://shop.hihoome.com/public/data/category/The_Fresh_Salad.jpg",
            "name": "SALADS"
        };
    }

    renderMorePhotos() {
        let itemDimension = 100;
        return (
            <View>
                <RTLView locale={getCurrentLocale()} style={{alignItems: "center"}}>
                    <HFTextRegular fontSize={Constants.regularSmallFontSize} value={strings("add_more_photo")}/>
                    <View style={{flex: 1}}/>
                    {/*<TouchableOpacity onPress={() => {*/}
                    {/*    this.props.navigation.push("UploadFoodImages")*/}
                    {/*}}>*/}
                    {/*    <View style={{*/}
                    {/*        width: 100,*/}
                    {/*        backgroundColor: ColorTheme.appTheme,*/}
                    {/*        padding: Constants.defaultPaddingMin,*/}
                    {/*        borderRadius: 20*/}
                    {/*    }}>*/}
                    {/*        <Text style={[StaticStyles.regularFont, {*/}
                    {/*            fontSize: 12,*/}
                    {/*            textAlign: "center",*/}
                    {/*            color: ColorTheme.white*/}
                    {/*        }]}>{strings("upload_now")}</Text>*/}
                    {/*    </View>*/}
                    {/*</TouchableOpacity>*/}
                </RTLView>
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
                        data={this.state.photos}
                        renderItem={({item, index}) =>
                            <TouchableOpacity onPress={() => {
                                if (!this.state.showActivity && item.uri.length === 0) {
                                    this.setState({uploadImage: true, photoIndex: index});
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
                                        {!this.state.showActivity && item && item.uri.length === 0 &&
                                        <AppIcon name={"upload"}
                                                 color={ColorTheme.grey_add}
                                                 provider={CommonIcons}
                                                 size={50}/>}
                                        {item && item.uri.length > 0 &&
                                        <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                                            <ActivityIndicator size={"small"} style={{position: "absolute"}}
                                                               color={ColorTheme.black}/>
                                            <FastImage
                                                style={{
                                                    width: itemDimension,
                                                    height: itemDimension,
                                                }}
                                                source={{
                                                    uri: item.uri,
                                                    priority: FastImage.priority.high,
                                                }}
                                                onLoadStart={() => {
                                                }}
                                                onLoadEnd={() => {
                                                }}
                                            />
                                        </View>}
                                        {this.state.showActivity && this.state.photoIndex === index &&
                                        <ActivityIndicator size={"small"} style={{position: "absolute"}}
                                                           color={ColorTheme.black}/>}
                                        {item && item.uri.length > 0 && <View style={{
                                            position: "absolute",
                                            padding: 2,
                                            right: 7,
                                            top: 7,
                                            backgroundColor: "red",
                                            borderRadius: Constants.defaultPaddingRegular,
                                        }}>
                                            <TouchableOpacity onPress={() => {
                                                this.setState({photoIndex: index});
                                                setTimeout(() => {
                                                    this.removePhoto();
                                                }, 300);
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
            </View>
        );
    }

    private removeMainPhoto() {
        this.setState({showMainPhotoActivity: true});
        let formData = new FormData();
        formData.append("product_id", this.state.product.id)
        this.apiHandler = (response) => {
            Api.checkValidationError(response, resp => {
                if (response && response.code === 200) {
                    let mainPic = this.state.mainPhoto[0];
                    mainPic.uri = "";
                    mainPic.name = "";
                    mainPic.data = undefined;
                    this.setState({mainPhoto: [mainPic]});
                } else if (response.code === 400) {
                    showMessageAlert(resp.error_msg)
                }
                this.setState({showMainPhotoActivity: false});
            }, (errors, errorMessage) => {
                // showMessage(errorMessage);
                this.setState({showMainPhotoActivity: false});
            });
        };
        this.apiExHandler = (reason) => {
            // showError(reason);
            this.setState({showMainPhotoActivity: false});
        };
        Api.removeMainImage(formData)
            .then((response) => {
                    this.apiHandler(response);
                },
            ).catch((reason => {
                this.apiExHandler(reason);
            }),
        );
    }

    private validateInputs() {
        if (this.state.foodName.length === 0) {
            showMessage({
                message: strings("invalid_food_name"),
                type: "danger",
                icon: "info"
            });
            return false;
        }
        if (this.state.mainPhoto[0].uri.length === 0) {
            showMessage({
                message: strings("invalid_main_image"),
                type: "danger",
                icon: "info"
            });
            return false;
        }
        if (this.state.costPrice.length === 0) {
            showMessage({
                message: strings("invalid_price"),
                type: "danger",
                icon: "info"
            });
            return false;
        }
        if (this.state.ingredients.length === 0) {
            showMessage({
                message: strings("invalid_ingredients"),
                type: "danger",
                icon: "info"
            });
            return false;
        }
        if (this.state.description.length === 0) {
            showMessage({
                message: strings("invalid_description"),
                type: "danger",
                icon: "info"
            });
            return false;
        }

        if (combineTime(this.state.days, this.state.hours, this.state.minutes) === 0) {
            showMessage({
                message: strings("invalid_time"),
                type: "danger",
                icon: "info"
            });
            return false;
        }

        if (hasFeaturedProduct() === false) {
            if (this.state.isFeatureProduct === 0) {
                showMessage({
                    message: strings("mandatory_feature_product"),
                    type: "danger",
                    icon: "info",
                    duration: 4000
                });
                return false;
            }
        }

        return true;
    }

    private addProduct() {
        if (this.validateInputs()) {
            this.setState({loading: true});
            let photo = this.state.mainPhoto[0];
            let formData = new FormData();
            formData.append("main_image", {
                name: "test",
                type: photo.data.type,
                uri: Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
            });
            // {days: this.state.days, hours: this.state.hours, minutes: this.state.minutes}
            formData.append("price", this.state.costPrice)
            formData.append("prepration_time", combineTime(this.state.days, this.state.hours, this.state.minutes))
            formData.append("details[en][name]", this.state.foodName)
            formData.append("details[en][ingredients]", this.state.ingredients)
            formData.append("details[en][description]", this.state.description)
            formData.append("category_id", this.state.selectedCategory.id)
            formData.append("is_feature", this.state.isFeatureProduct)
            this.apiHandler = (response) => {
                Api.checkValidationError(response, resp => {
                    if (response && response.code === 200 && resp) {
                        // analytics().logEvent('Product_Added', {
                        //     product_id: response.response_data.id,
                        // });
                        showMessage({
                            message: strings("food_created_success"),
                            type: "success",
                        });
                        setTimeout(() => {
                            Events.trigger(XEvents.UPDATE_FOOD_ITEMS);
                            this.props.navigation.pop();
                        }, 1000);
                    } else if (resp.code === 400) {
                        showMessageAlert(resp.error_msg)
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
            Api.addProduct(formData)
                .then((response) => {
                        this.apiHandler(response);
                    },
                ).catch((reason => {
                    this.apiExHandler(reason);
                }),
            );
        }
    }

    private updateProduct() {
        if (this.validateInputs()) {
            this.setState({loading: true});
            let photo = this.state.mainPhoto[0];
            let formData = new FormData();
            if (photo.uri !== this.state.product.main_image) {
                formData.append("main_image", {
                    name: "test",
                    type: photo.data.type,
                    uri: Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
                });
            }
            // {days: this.state.days, hours: this.state.hours, minutes: this.state.minutes}
            formData.append("product_id", this.state.product.id)
            formData.append("price", this.state.costPrice)
            formData.append("prepration_time", combineTime(this.state.days, this.state.hours, this.state.minutes))
            formData.append("details[en][name]", this.state.foodName)
            formData.append("details[en][ingredients]", this.state.ingredients)
            formData.append("details[en][description]", this.state.description)
            formData.append("category_id", this.state.selectedCategory.id)
            formData.append("is_feature", this.state.isFeatureProduct)
            this.apiHandler = (response) => {
                Api.checkValidationError(response, resp => {
                    if (response && response.code === 200 && resp) {
                        showMessage({
                            message: strings("info_updated_success"),
                            type: "success",
                        });
                        setTimeout(() => {
                            Events.trigger(XEvents.UPDATE_FOOD_ITEMS);
                            this.props.navigation.pop();
                        }, 1000);

                    } else if (resp.code === 400) {
                        showMessageAlert(resp.error_msg)
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
            Api.updateProduct(formData)
                .then((response) => {
                        this.apiHandler(response);
                    },
                ).catch((reason => {
                    this.apiExHandler(reason);
                }),
            );
        }
    }

    renderMainPhoto() {
        let itemDimension = 100;
        return (
            <View>
                <RTLView locale={getCurrentLocale()} style={{alignItems: "center"}}>
                    <HFTextRegular fontSize={Constants.regularSmallFontSize} value={strings("add_main_photo")}/>
                </RTLView>
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
                        data={this.state.mainPhoto}
                        renderItem={({item, index}) =>
                            <TouchableOpacity onPress={() => {
                                if (item.uri.length === 0) {
                                    this.setState({uploadImage: true, photoIndex: -1});
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
                                        {!this.state.showMainPhotoActivity && item && item.uri.length === 0 &&
                                        <AppIcon name={"upload"}
                                                 color={ColorTheme.grey_add}
                                                 provider={CommonIcons}
                                                 size={50}/>}
                                        {item && item.uri.length > 0 &&
                                        <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                                            <ActivityIndicator size={"small"} style={{position: "absolute"}}
                                                               color={ColorTheme.black}/>
                                            <FastImage
                                                style={{
                                                    width: itemDimension,
                                                    height: itemDimension,
                                                }}
                                                source={{
                                                    uri: item.uri,
                                                    priority: FastImage.priority.high,
                                                }}
                                                onLoadStart={() => {
                                                }}
                                                onLoadEnd={() => {
                                                }}
                                            />
                                        </View>}
                                        {this.state.showMainPhotoActivity && this.state.photoIndex === index &&
                                        <ActivityIndicator size={"small"} style={{position: "absolute"}}
                                                           color={ColorTheme.black}/>}
                                        {item.uri.length > 0 && <View style={{
                                            position: "absolute",
                                            padding: 2,
                                            right: 7,
                                            top: 7,
                                            backgroundColor: "red",
                                            borderRadius: Constants.defaultPaddingRegular,
                                        }}>
                                            <TouchableOpacity onPress={() => {
                                                if (this.state.edit) {
                                                    this.removeMainPhoto();
                                                } else {
                                                    let mainPic = this.state.mainPhoto[0];
                                                    mainPic.uri = "";
                                                    mainPic.name = "";
                                                    mainPic.data = undefined;
                                                    this.setState({mainPhoto: [mainPic]});
                                                }
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
            </View>
        );
    }

    launchCamera() {
        ImagePicker.launchCamera(options, (response) => {
            if (!response.didCancel) {
                this.setState({showMainPhotoActivity: true});
                if (this.state.photoIndex === -1) {
                    // Main Photo
                    for (let i = 0; i < this.state.mainPhoto.length; i++) {
                        let photo = this.state.mainPhoto[i];
                        if (photo.uri.length === 0 && !photo.add) {
                            photo.uri = response.uri;
                            photo.data = response;
                            break;
                        }
                    }
                    this.setState({showMainPhotoActivity: false});
                } else {
                    this.uploadPhoto(response)
                }
            }
            this.setState({uploadImage: false})
        });
    }

    launchGallery() {
        ImagePicker.launchImageLibrary(options, (response) => {
            if (!response.didCancel) {
                if (this.state.photoIndex === -1) {
                    // Main Photo
                    for (let i = 0; i < this.state.mainPhoto.length; i++) {
                        let photo = this.state.mainPhoto[i];
                        if (photo.uri.length === 0 && !photo.add) {
                            photo.uri = response.uri;
                            photo.data = response;
                            break;
                        }
                    }
                } else {
                    this.uploadPhoto(response)
                }
            }
            this.setState({uploadImage: false})
        });
    }

    uploadPhoto(photoResponse) {
        // API Call to upload photo
        this.setState({loading: true, showActivity: true});
        let formData = new FormData();
        formData.append("images[]", {
            name: "test1",
            type: photoResponse.type,
            uri: Platform.OS === "android" ? photoResponse.uri : photoResponse.uri.replace("file://", "")
        });
        formData.append("product_id", this.state.product.id)
        this.apiHandler = (response) => {
            Api.checkValidationError(response, resp => {
                if (response && response.code === 200) {
                    this.state.product.images_list.push({image: photoResponse.uri, id: 0});
                    // CHANGE TO BE MADE
                    this.setState({photos: this.getMorePhotos(this.state.product)});
                } else if (response.code === 400) {
                    showMessageAlert(resp.error_msg)
                }
                this.setState({loading: false, showActivity: false});
            }, (errors, errorMessage) => {
                // showMessage(errorMessage);
                this.setState({loading: false});
            });
        };
        this.apiExHandler = (reason) => {
            // showError(reason);
            this.setState({loading: false});
        };
        Api.addProductImage(formData)
            .then((response) => {
                    this.apiHandler(response);
                },
            ).catch((reason => {
                this.apiExHandler(reason);
            }),
        );

    }

    removePhoto() {
        // API Call to remove photo
        this.setState({showActivity: true});
        let formData = new FormData();
        let imgUrl = this.state.product.images_list[this.state.photoIndex].image.split("data")
        formData.append("product_id", this.state.product.id)
        formData.append("image_id", this.state.product.images_list[this.state.photoIndex].id)
        // formData.append("image", "/data" + imgUrl[1])
        this.apiHandler = (response) => {
            Api.checkValidationError(response, resp => {
                if (response && response.code === 200) {
                    this.state.product.images_list = removeItem(this.state.product.images_list, this.state.photoIndex + 1)
                    this.setState({photos: this.getMorePhotos(this.state.product)});
                } else if (response.code === 400) {
                    showMessageAlert(resp.error_msg)
                }
                this.setState({showActivity: false});
            }, (errors, errorMessage) => {
                // showMessage(errorMessage);
                this.setState({showActivity: false});
            });
        };
        this.apiExHandler = (reason) => {
            // showError(reason);
            this.setState({showActivity: false});
        };
        Api.removeProductImage(formData)
            .then((response) => {
                    this.apiHandler(response);
                },
            ).catch((reason => {
                this.apiExHandler(reason);
            }),
        );
    }

    getTexViewValue() {
        switch (this.state.textViewType) {
            case TextViewType.INGREDIENTS:
                return this.state.ingredients;
                break;
            case TextViewType.RECIPE:
                return this.state.description;
                break;
            default:
                return "";
        }
    }

    setTexViewValue(value) {
        switch (this.state.textViewType) {
            case TextViewType.INGREDIENTS:
                this.setState({ingredients: value});
                break;
            case TextViewType.RECIPE:
                this.setState({description: value});
                break;
            default:
                break;
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
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.goBack();
                        }}>
                            <AppIcon name={isRTLMode() ? "back_ar" : "back"}
                                     color={ColorTheme.appTheme}
                                     provider={CommonIcons}
                                     size={20}/>
                        </TouchableOpacity>
                        <View style={{flex: 1}}/>
                        <Text
                            style={StaticStyles.nav_title}>{this.state.edit ? strings("update_menu") : strings("add_menu")}</Text>
                        <View style={{flex: 1}}/>
                        {/*<EditButton onPress={() => {*/}
                        {/*}}/>*/}
                    </RTLView>
                    <View style={{height: Constants.defaultPaddingMin}}/>
                </View>
                <View style={{backgroundColor: ColorTheme.lightGrey, height: 3, marginTop: Constants.defaultPadding}}/>
            </View>
        );

    }

    renderForm() {
        return (
            <View>
                {this.state.errorOccurred &&
                <View style={[StaticStyles.center, {backgroundColor: "#ffe5e5", borderRadius: 5}]}>
                    <Text style={{
                        color: "red",
                        fontWeight: "400",
                        fontSize: 12,
                        marginTop: 2,
                        alignSelf: "center"
                    }}>{this.state.errorText}</Text>
                    <View style={{height: Constants.defaultPadding}}/>
                </View>}
                <HFTextRegular fontSize={Constants.regularSmallFontSize} value={strings("food_name")}/>
                <TextFormInput text={this.state.foodName} placeholder={"Hello"} value={value => {
                    this.setState({foodName: value});
                }}/>

                <View style={{height: Constants.defaultPaddingRegular}}/>
                {this.renderMainPhoto()}
                {this.state.edit && this.renderMorePhotos()}
                <HFTextRegular fontSize={Constants.regularSmallFontSize} value={strings("add_price")}/>
                <RTLView locale={getCurrentLocale()} style={{alignItems: "center"}}>
                    <View style={{flex: 1}}>
                        <HFTextLight textColor={ColorTheme.appTheme} fontSize={10} value={strings("costing_price")}/>
                        <TextFormInput text={this.state.costPrice} keyboard={"numeric"}
                                       placeholder={strings("add_price")} value={value => {
                            this.setState({costPrice: value});
                        }}/>
                    </View>
                    <View style={{width: Constants.defaultPadding}}/>
                    <View style={{flex: 1}}>
                        <HFTextLight textColor={ColorTheme.appTheme} fontSize={10} value={strings("categories")}/>
                        <TextFormInput showOptions={() => {
                            this.setState({showCategories: true})
                        }}
                                       dropdown={true}
                                       placeholder={strings("add_price")}
                                       text={this.state.selectedCategory ? this.state.selectedCategory.name : ""}
                                       value={value => {
                                       }}/>
                    </View>
                </RTLView>

                <View style={{height: Constants.defaultPaddingRegular}}/>

                <HFTextRegular fontSize={Constants.regularSmallFontSize} value={strings("time_to_make")}/>
                <RTLView locale={getCurrentLocale()} style={{alignItems: "center"}}>
                    <View style={{flex: 1}}>
                        <TextFormInput keyboard={"numeric"} text={this.state.days} placeholder={strings("days")}
                                       value={value => {
                                           this.setState({days: value});
                                       }}/>
                    </View>
                    <View style={{width: Constants.defaultPadding}}/>
                    <View style={{flex: 1}}>
                        <TextFormInput keyboard={"numeric"} text={this.state.hours} placeholder={strings("hours")}
                                       value={value => {
                                           this.setState({hours: value});
                                       }}/>
                    </View>
                    <View style={{width: Constants.defaultPaddingMin}}/>
                    <HFTextRegular fontSize={Constants.regularSmallFontSize} value={":"}/>
                    <View style={{width: Constants.defaultPaddingMin}}/>
                    <View style={{flex: 1}}>
                        <TextFormInput keyboard={"numeric"} text={this.state.minutes} placeholder={strings("minutes")}
                                       value={value => {
                                           this.setState({minutes: value});
                                       }}/>
                    </View>
                </RTLView>

                <View style={{height: Constants.defaultPaddingRegular}}/>

                <HFTextRegular fontSize={Constants.regularSmallFontSize} value={strings("ingredients")}/>
                <TextFormInput
                    textView={true}
                    showTextView={() => this.setState({
                        textViewTitle: strings("ingredients"),
                        showRecipeIngredients: true,
                        textViewType: TextViewType.INGREDIENTS
                    })}
                    text={this.state.ingredients}
                    placeholder={strings("enter_content_here")}
                    value={value => {
                        this.setState({ingredients: value});
                    }}/>

                <View style={{height: Constants.defaultPaddingRegular}}/>

                <HFTextRegular fontSize={Constants.regularSmallFontSize} value={strings("description")}/>
                <TextFormInput
                    showTextView={() => this.setState({
                        textViewTitle: strings("recipes"),
                        showRecipeIngredients: true,
                        textViewType: TextViewType.RECIPE
                    })}
                    text={this.state.description}
                    textView={true} placeholder={strings("enter_content_here")} value={value => {
                    this.setState({description: value});
                }}/>
                <RTLView locale={getCurrentLocale()} style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: Constants.defaultPaddingRegular,
                    marginBottom: Constants.defaultPaddingRegular
                }}>
                    <TouchableOpacity onPress={() => {
                        this.validateFeatureProduct();
                    }}>
                        <AppIcon name={this.state.isFeatureProduct === 1 ? "check_box" : "blank_check_box"}
                                 color={this.getCheckboxColor()}
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
                        }]}> {strings("make_this_feature")}</Text>
                        <TouchableOpacity onPress={() => {
                            if (hasFeaturedProduct() === true) {
                                if (this.product) {
                                    // EDIT
                                    if (this.state.isFeatureProduct === 0) {
                                        showMessageAlert(strings("feature_product_info"));
                                    } else {
                                        showMessageAlert(strings("exist_feature_product_info"));
                                    }
                                } else {
                                    // NEW
                                    showMessageAlert(strings("feature_product_info"));
                                }
                            } else {
                                showMessageAlert(strings("feature_product_info"));
                            }
                        }}>
                            <Text style={[{
                                textAlign: isRTLMode() ? "right" : "left",
                                color: ColorTheme.appTheme,
                                fontWeight: "500",
                                fontSize: 14,
                            }]}> {strings("more_info")}</Text>
                        </TouchableOpacity>
                    </View>
                </RTLView>

                <View style={{height: Constants.defaultPaddingRegular}}/>
                <View style={{paddingHorizontal: Constants.defaultPaddingMax}}>
                    <ActionButton title={this.state.edit ? strings("update_menu") : strings("add_menu")}
                                  variant={"normal"} onPress={() => {
                        this.state.edit ? this.updateProduct() : this.addProduct();
                    }}/>
                </View>
                <View style={{height: 50}}/>
            </View>
        );
    }

    confirmFeatureProduct() {
        Alert.alert(
            strings("app_name"),
            strings("already_feature_product"),
            [
                {
                    text: strings("yes"), onPress: () => {
                        this.setState({isFeatureProduct: this.state.isFeatureProduct === 0 ? 1 : 0});
                    }
                },
                {
                    text: strings("no")
                }
            ],
            {cancelable: false},
        );
    }

    validateFeatureProduct() {
        if (hasFeaturedProduct() === true) {
            if (this.product) {
                // EDIT
                if (this.state.isFeatureProduct === 0) {
                    this.confirmFeatureProduct();
                } else {

                }
            } else {
                // NEW
                if (this.state.isFeatureProduct === 0) {
                    this.confirmFeatureProduct();
                } else {
                    this.setState({isFeatureProduct: this.state.isFeatureProduct === 0 ? 1 : 0});
                }
            }
        } else {
            if (this.product) {
                // EDIT
                this.setState({isFeatureProduct: this.state.isFeatureProduct === 0 ? 1 : 0});
            } else {
                // NEW
                this.setState({isFeatureProduct: this.state.isFeatureProduct === 0 ? 1 : 0});
            }
        }
    }

    getCheckboxColor() {
        if (hasFeaturedProduct() === true) {
            if (this.product) {
                // EDIT
                switch (this.product.is_feature) {
                    case 0:
                        return ColorTheme.appTheme;
                    case 1:
                        return ColorTheme.grey;
                }
            } else {
                // NEW
                return ColorTheme.appTheme;
            }
        } else {
            return ColorTheme.appTheme;
        }
        return ColorTheme.appTheme;
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: ColorTheme.white}}>
                <View style={styles.container}>
                    {this.renderHeader()}
                    <ScrollView style={{
                        paddingHorizontal: Constants.defaultPaddingRegular,
                        paddingTop: Constants.defaultPaddingMax,
                        paddingBottom: Constants.defaultPaddingMax,
                        marginBottom: 70
                    }}>
                        {this.renderForm()}
                        <RecipeIngredients title={this.state.textViewTitle}
                                           text={this.getTexViewValue()}
                                           navigation={this.props.navigation}
                                           show={this.state.showRecipeIngredients}
                                           onDismiss={(value) => {
                                               this.setState({showRecipeIngredients: false});
                                               this.setTexViewValue(value);
                                           }}/>
                    </ScrollView>
                    <HHPickerView show={this.state.showCategories}
                                  onDismiss={() => this.setState({showCategories: false})}
                                  onValueChange={(value, index) => {
                                      this.setState({showCategories: false, selectedCategory: value})
                                  }}
                                  selectedValue={this.state.selectedCategory}
                                  values={this.state.categories}/>
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
                    {this.state.loading && <LoadingOverlay/>}
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ColorTheme.white,
    },
});
