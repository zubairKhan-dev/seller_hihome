import * as React from "react";
import {Component} from "react";
import {FlatList, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import ColorTheme from "../../theme/Colors";
import Constants from "../../theme/Constants";
import {getCurrentLocale, isRTLMode, strings} from "../../components/Translations";
import {RTLView} from "react-native-rtl-layout";
import {AppIcon} from "../../common/IconUtils";
import {CommonIcons} from "../../icons/Common";
import SaveButton from "../../components/SaveButton";
import {windowWidth} from "../../common";
import ImageUploadView from "../../components/ImageUpload";
import {SafeAreaView} from "react-navigation";
import * as Api from "../../lib/api";
import DocumentsViewer from "../../components/DocumentsViewer";
import {getToken} from "../../lib/user";
import FeaturedImage from "../../components/FeaturedImage";
import {photoOptions} from "../../config/Constants";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

const createFormData = (photo) => {
    let data = new FormData();
    data.append("image", {
        name: photo.data.fileName,
        type: photo.data.type,
        uri: Platform.OS === "android" ? photo.data.uri : photo.data.uri.replace("file://", "")
    });

    // Object.keys(body).forEach(key => {
    //     data.append("image", {
    //         name: photo.data.fileName,
    //         type: photo.data.type,
    //         uri:
    //             Platform.OS === "android" ? photo.data.uri : photo.data.uri.replace("file://", "")
    //     });
    // });

    return data;
};

const photos = [{uri: "", data: {}, add: false},
    {uri: "", data: {}, add: false},
    {uri: "", data: {}, add: false},
    {uri: "", data: {}, add: false},
    {uri: "", data: {}, add: false},
    {uri: "", data: {}, add: true}];

interface Props {
    navigation: any;
}

interface State {
    loading?: boolean;
    uploadImage?: boolean;
    showDocumentsViewer?: boolean;
    photos: any[];
}

export default class UploadFoodImages extends Component<Props, State> {
    apiHandler: any;
    apiExHandler: any;

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            uploadImage: false,
            showDocumentsViewer: false,
            photos: photos,
        }
    }

    getPhotosForView() {
        let photoURLs = [];
        for (let i = 0; i < this.state.photos.length; i++) {
            let photo = this.state.photos[i];
            if (photo.uri.length > 0) {
                photoURLs.push(photo.uri)
            }
        }
        return photoURLs;
    }

    launchCamera() {
        this.setState({uploadImage: false})
        launchCamera(photoOptions, (response) => {
            this.setState({uploadImage: false})
        });
    }

    launchGallery() {
        launchImageLibrary(photoOptions, (response) => {
            for (let i = 0; i < this.state.photos.length; i++) {
                let photo = this.state.photos[i];
                if (photo.uri.length === 0 && !photo.add) {
                    photo.uri = response.uri;
                    photo.data = response;
                    break;
                }
            }
            this.setState({uploadImage: false})
        });
    }
// size: photo.data.fileSize,
    // data: photo.data.data,
    // data.append("debug", 1);
    private uploadImage() {
        let photo = this.state.photos[0];
        let data = new FormData();
        let token = getToken();
        data.append("image", {
            name: "test",
            type: photo.data.type,
            uri: Platform.OS === "android" ? photo.data.uri : photo.data.uri.replace("file://", "")
        });
        this.setState({loading: true});
        this.apiHandler = (response) => {
            Api.checkValidationError(response, resp => {
                if (resp && resp.Code === 200 && resp.Response) {
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
        Api.addProductImage(data)
            .then((response) => {
                    this.apiHandler(response);
                },
            ).catch((reason => {
                this.apiExHandler(reason);
            }),
        );
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
                        <TouchableOpacity style={{padding: Constants.defaultPadding}}  onPress={() => {
                            this.props.navigation.goBack();
                        }}>
                            <AppIcon name={isRTLMode() ? "back_ar" : "back"}
                                     color={ColorTheme.appTheme}
                                     provider={CommonIcons}
                                     size={22}/>
                        </TouchableOpacity>
                        <View style={{flex: 1}}/>
                        <Text style={{
                            fontWeight: "600",
                            fontSize: 15,
                            color: ColorTheme.black
                        }}>{strings("upload_images")}</Text>
                        <View style={{flex: 1}}/>
                        <SaveButton variant={"alt"} title={"Save"} onPress={() => {
                            this.uploadImage();
                        }}/>
                    </RTLView>
                </View>
                <View style={{backgroundColor: ColorTheme.lightGrey, height: 3, marginTop: Constants.defaultPadding}}/>
            </View>
        );

    }

    renderPhotos() {
        let itemDimension = (windowWidth - Constants.defaultPadding) / 3;
        return (
            <View style={{flex: 1, paddingHorizontal: Constants.defaultPadding / 2}}>
                <FlatList
                    numColumns={3}
                    style={[{paddingVertical: 5}]}
                    data={this.state.photos}
                    renderItem={({item, index}) =>
                        <View style={{
                            padding: Constants.defaultPadding,
                            width: itemDimension,
                            height: itemDimension,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            {item.add && <TouchableOpacity onPress={() => {
                                this.setState({uploadImage: true});
                            }}>
                                <RTLView locale={getCurrentLocale()} style={{
                                    width: itemDimension - 10,
                                    height: itemDimension - 10,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                    <AppIcon name={"add_image"}
                                             color={ColorTheme.grey_add}
                                             provider={CommonIcons}
                                             size={50}/>
                                </RTLView>
                            </TouchableOpacity>}

                            {!item.add && <TouchableOpacity onPress={() => {
                                this.setState({showDocumentsViewer: true});
                            }}>
                                <View style={{
                                    width: itemDimension - 10,
                                    height: itemDimension - 10,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderWidth: 0.5,
                                    borderColor: ColorTheme.grey,
                                    borderStyle: "dashed",
                                }}>
                                    {item.uri.length === 0 && <AppIcon name={"upload"}
                                                                       color={ColorTheme.grey_add}
                                                                       provider={CommonIcons}
                                                                       size={50}/>}
                                    {item.uri.length > 0 && <View style={{
                                        borderRadius: Constants.defaultPadding,
                                        width: itemDimension - 10,
                                        height: itemDimension - 10,
                                        overflow: "hidden"
                                    }}>
                                        <FeaturedImage width={itemDimension - 10} height={itemDimension - 10}
                                                       uri={item.uri}/>
                                    </View>
                                    }
                                </View>
                            </TouchableOpacity>}
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
                        </View>
                    }
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => "" + index}
                />
            </View>
        );
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: ColorTheme.white}}>
                <View style={styles.container}>
                    {this.renderHeader()}
                    {this.renderPhotos()}
                    <DocumentsViewer show={this.state.showDocumentsViewer}
                                     onDismiss={() => {
                                         this.setState({showDocumentsViewer: false})
                                     }}
                                     documents={this.getPhotosForView()}
                    />
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
