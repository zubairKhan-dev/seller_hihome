import * as React from "react";
import {Component} from "react";
import {FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert} from "react-native";
import {StaticStyles} from "../../theme/Styles";
import Constants from "../../theme/Constants";
import {getCurrentLocale, isRTLMode, strings} from "../../components/Translations";
import ColorTheme from "../../theme/Colors";
import {RTLView} from "react-native-rtl-layout";
import {CommonIcons} from "../../icons/Common";
import {AppIcon} from "../../common/IconUtils";
import AddButton from "../../components/AddButton";
import * as Api from "../../lib/api";
import StockSwitch from "../../components/StockSwitch";
import {isValidString} from "../../lib/StringUtil";
import {SafeAreaView} from "react-navigation";
import {showMessageAlert} from "../../common";
import FoodDetails from "../../components/FoodDetails";
import NoDataFound from "../../components/NoDataFound";
import LoadingOverlay from "../../components/Loading";
import ProductActions from "../../components/ProductActions";
import {showMessage} from "react-native-flash-message";
import {splitTime} from "../../lib/DateUtil";
import {XEvents} from "../../lib/EventBus";
import Events from "react-native-simple-events";
import {setProfile} from "../../lib/user";
import FeaturedImage from "../../components/FeaturedImage";
import {generateImageURL} from "../../lib/Image";

const removeItem = (items, i) =>
    items.slice(0, i - 1).concat(items.slice(i, items.length))

const listCategories = [{"name": "all_items", "id": 0}, {
    "name": "out_of_stock",
    "id": 1
}, {"name": "in_stock", "id": 2}];

interface Props {
    navigation: any;
}

interface State {
    loading?: boolean;
    reload?: boolean;
    isSearch?: boolean;
    searchQuery?: string;
    listCategories: any[];
    selectedCategory?: number;
    foodItems?: any[];
    selectedFood?: any;
    outOfStockItems?: number;
    inStockItems?: number;
    searchedFoodItems?: any[];
    showFoodDetails: boolean;
    showProductActions: boolean;
    hasMorePages: boolean;
    currentPage: number;
    activity?: boolean;
    selFoodIndex?: number;
}

export default class FoodItems extends Component<Props, State> {
    apiHandler: any;
    apiExHandler: any;

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            reload: false,
            isSearch: false,
            showProductActions: false,
            listCategories: listCategories,
            selectedCategory: 0,
            searchedFoodItems: [],
            foodItems: [],
            outOfStockItems: 0,
            inStockItems: 0,
            showFoodDetails: false,
            hasMorePages: false,
            currentPage: 1,
        }
    }

    componentDidMount(): void {
        const {navigation} = this.props;
        this.focusListener = navigation.addListener("focus", () => {
            this.refreshFoodList();
        });
        //Events.on(XEvents.UPDATE_FOOD_ITEMS, "update_food_items", this.updateLocalProfile.bind(this));
    }

    private updateLocalProfile() {
        this.apiHandler = (response) => {
            Api.checkValidationError(response, resp => {
                switch (response.code) {
                    case 200 :
                        if (resp) {
                            setProfile(resp);
                        }
                        break;
                }
                this.refreshFoodList();
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

    private refreshFoodList() {
        this.setState({
            currentPage: 1, hasMorePages: false, foodItems: [], outOfStockItems: 0,
            inStockItems: 0, searchedFoodItems: [], isSearch: false,
        });
        setTimeout(() => {
            this.getFoodList();
        }, 200)
    }

    private filterData() {
        let data: any = [];
        if (isValidString(this.state.searchQuery)) {
            data = this.state.foodItems.filter(value => {
                return (value.name).includes(this.state.searchQuery);
            });
        }
        this.setState({
            searchedFoodItems: data,
        });
    }

    private clearSearch() {
        this.setState({searchedFoodItems: [], isSearch: false, searchQuery: undefined});
    }

    private itemOutOfStock(index) {
        let obj = this.state.foodItems[index];
        return obj.status === 1;
    }

    private removeProduct() {
        this.setState({loading: true,showProductActions: false});
        let formData = new FormData();
        formData.append("product_id", this.state.selectedFood.id)
        this.apiHandler = (response) => {
            Api.checkValidationError(response, resp => {
                if (response && response.code === 200 && resp) {
                    // analytics().logEvent('Product_Deleted', {
                    //     product_id: this.state.selectedFood.id,
                    // });
                    showMessage({
                        message: strings("info_delete_success"),
                        type: "success",
                    });
                    setTimeout(() => {
                        this.refreshFoodList();
                    }, 1000);
                }
                this.setState({loading: false});
            }, (errors, errorMessage) => {
                showMessage({
                    message: strings(errorMessage),
                    type: "danger",
                    autoHide: false
                });
                this.setState({loading: false});
            });
        };
        this.apiExHandler = (reason) => {
            // showError(reason);
            this.setState({loading: false});
        };
        Api.removeProduct(formData)
            .then((response) => {
                    this.apiHandler(response);
                },
            ).catch((reason => {
                this.apiExHandler(reason);
            }),
        );
    }


    getFoodList() {
        this.setState({loading: true});
        this.apiHandler = (response) => {
            Api.checkValidationError(response, resp => {
                if (response && response.code === 200 && resp) {
                    resp.data.map((item) => {
                        if (item.out_of_stock === 1) {
                            this.setState({outOfStockItems: this.state.outOfStockItems + 1});
                        } else {
                            this.setState({inStockItems: this.state.inStockItems + 1});
                        }
                    });
                    this.setState({
                        foodItems: [...this.state.foodItems, ...resp.data],
                        currentPage: resp.paginator.next_page,
                        hasMorePages: resp.paginator.hasMorePages
                    });
                }
                this.setState({loading: false});
            }, (errors, errorMessage) => {
                showMessageAlert(errorMessage);
                this.setState({loading: false});
            });
        };
        this.apiExHandler = (reason) => {
            // showMessage(reason);
            this.setState({loading: false});
        };
        let currentPage = this.state.currentPage || 1;
        Api.getFoodList(this.state.currentPage)
            .then((response) => {
                    this.apiHandler(response);
                },
            ).catch((reason => {
                this.apiExHandler(reason);
            }),
        );
    }

    performProductAction(actionStatus: number, product: any, index: number) {
        this.setState({loading: true});
        let formData = new FormData();
        formData.append("product_id", product.id)
        formData.append("out_of_stock", actionStatus)
        this.apiHandler = (response) => {
            Api.checkValidationError(response, resp => {
                if (response && response.code === 200 && resp) {
                    product.out_of_stock = actionStatus;
                    if (actionStatus === 1) {
                        this.setState({
                            outOfStockItems: this.state.outOfStockItems + 1,
                            inStockItems: this.state.inStockItems - 1
                        });
                    } else {
                        this.setState({
                            outOfStockItems: this.state.outOfStockItems - 1,
                            inStockItems: this.state.inStockItems + 1
                        })
                    }
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
        Api.updateProductStock(formData)
            .then((response) => {
                    this.apiHandler(response);
                },
            ).catch((reason => {
                this.apiExHandler(reason);
            }),
        );
    }

    renderFoodItem(foodItem: any, index: number) {
        let prep_time = splitTime(foodItem.prepration_time).days > 0 ? splitTime(foodItem.prepration_time).days + " " + strings("days") : "";
        prep_time = prep_time + (splitTime(foodItem.prepration_time).hours > 0 ? " " + splitTime(foodItem.prepration_time).hours + " " + strings("hours") : "");
        prep_time = prep_time + (splitTime(foodItem.prepration_time).minutes > 0 ? " " + splitTime(foodItem.prepration_time).minutes + " " + strings("minutes") : "");
        let imageURL = foodItem.images[0];

        return (<View style={{marginTop: Constants.defaultPadding}}>
            <TouchableOpacity onPress={() => {
                this.setState({showFoodDetails: true, selectedFood: foodItem})
            }}>
                <RTLView locale={getCurrentLocale()}
                         style={{alignItems: "center", paddingHorizontal: Constants.defaultPadding}}>
                    <View style={{
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: ColorTheme.lightGrey,
                        borderRadius: 10
                    }}>
                        <View style={{
                            borderRadius: Constants.defaultPadding,
                            width: 80,
                            height: 80,
                            overflow: "hidden"
                        }}>
                            <FeaturedImage width={80} height={80}
                                           uri={foodItem.main_image ? generateImageURL(foodItem.main_image, 240, 240) : ""}/>
                        </View>
                        {/*{foodItem.is_feature === 1 && <View style={{*/}
                        {/*    height: 16,*/}
                        {/*    width: 70,*/}
                        {/*    backgroundColor: ColorTheme.white,*/}
                        {/*    borderRadius: 8,*/}
                        {/*    paddingHorizontal: 4,*/}
                        {/*    justifyContent: "center",*/}
                        {/*    position: "absolute",*/}
                        {/*    top: 5*/}
                        {/*}}>*/}
                        {/*    <Text numberOfLines={1} style={[StaticStyles.heavyFont, {*/}
                        {/*        textAlign: "center",*/}
                        {/*        color: ColorTheme.appTheme,*/}
                        {/*        fontSize: Constants.regularSmallestFontSize*/}
                        {/*    }]}>*/}
                        {/*        {strings("featured")}*/}
                        {/*    </Text>*/}
                        {/*</View>}*/}
                    </View>
                    <View style={{flex: 1, paddingHorizontal: Constants.defaultPadding}}>
                        <Text numberOfLines={2} style={[StaticStyles.regularFont, {
                            textAlign: isRTLMode() ? "right" : "left",
                            color: ColorTheme.appTheme,
                            fontSize: Constants.regularSmallFontSize
                        }]}>
                            {foodItem.name}
                        </Text>
                        <View style={{flex: 1}}/>
                        <Text numberOfLines={2}
                              style={[StaticStyles.heavyFont, {
                                  textAlign: isRTLMode() ? "right" : "left",
                                  color: ColorTheme.appThemeSecond,
                                  fontSize: Constants.regularSmallFontSize
                              }]}>
                            {strings("aed") + foodItem.price}
                        </Text>
                        <View style={{flex: 1}}/>
                        <Text numberOfLines={1} style={[StaticStyles.heavyFont, {
                            textAlign: isRTLMode() ? "right" : "left",
                            color: ColorTheme.timeToMakeColor,
                            fontSize: Constants.regularSmallerFontSize
                        }]}>
                            {strings("time_to_make")}
                        </Text>
                        <Text numberOfLines={1} style={[StaticStyles.regularFont, {
                            textAlign: isRTLMode() ? "right" : "left",
                            color: ColorTheme.appThemeSecond,
                            fontSize: Constants.regularSmallerFontSize
                        }]}>
                            {prep_time}
                        </Text>
                    </View>
                    <View style={{}}>
                        {foodItem.status === 1 && <View>
                            <View style={{flex: 1}}/>
                            <StockSwitch initialState={!foodItem.out_of_stock} onActive={() => {
                                this.performProductAction(0, foodItem, index);
                            }} onInActive={() => {
                                this.performProductAction(1, foodItem, index);
                            }}/>
                            <View style={{flex: 1}}/>
                        </View>}
                        {foodItem.status === 0 && <View>
                            <View style={{flex: 1}}/>
                            <Text style={[StaticStyles.regularFont, {
                                color: ColorTheme.textGreyDark,
                                textAlign: "center",
                                fontSize: 10,
                            }]}>{strings("waiting_for_approval")}</Text>
                            <View style={{flex: 1}}/>
                        </View>}
                    </View>
                    <View>
                        <View style={{flex: 1}}/>
                        <TouchableOpacity style={{paddingHorizontal: Constants.defaultPadding}} onPress={() => {
                            this.setState({showProductActions: true, selectedFood: foodItem, selFoodIndex: index});
                        }}>
                            <AppIcon name={"more"}
                                     color={ColorTheme.grey}
                                     provider={CommonIcons}
                                     size={18}/>
                        </TouchableOpacity>
                        <View style={{flex: 1}}/>
                    </View>
                </RTLView>
            </TouchableOpacity>

        </View>);

    }

    renderCategories() {
        return (
            <View style={{height: 50}}>
                <FlatList
                    contentContainerStyle={{
                        justifyContent: isRTLMode() ? "flex-end" : "flex-start",
                        flexDirection: isRTLMode() ? "row-reverse" : "row",
                        alignItems: 'center'
                    }}
                    horizontal={true}
                    style={[{paddingVertical: 10, flexDirection: isRTLMode() ? "row-reverse" : "row"}]}
                    data={this.state.listCategories}
                    renderItem={({item, index}) =>
                        <TouchableOpacity onPress={() => {
                            this.setState({selectedCategory: index});
                            setTimeout(() => {
                                this.setState({reload: true});
                            }, 100);
                        }}>
                            {this.renderCategoryItem(item, index)}
                        </TouchableOpacity>
                    }
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => "" + index}
                />
                <FoodDetails show={this.state.showFoodDetails}
                             details={this.state.selectedFood}
                             onEdit={() => {
                                 this.setState({showFoodDetails: false});
                                 setTimeout(() => {
                                     this.props.navigation.navigate("AddFoodItem", {
                                         product: this.state.selectedFood,
                                         edit: 1
                                     });
                                 }, 400);
                             }}
                             onDismiss={() => {
                                 this.setState({showFoodDetails: false});
                             }}/>
                <ProductActions show={this.state.showProductActions}
                                details={this.state.selectedFood}
                                onEdit={() => {
                                    this.setState({showProductActions: false});
                                    setTimeout(() => {
                                        this.props.navigation.navigate("AddFoodItem", {
                                            product: this.state.selectedFood,
                                            edit: 1
                                        });
                                    }, 400);
                                }}
                                onDelete={() => {
                                   // this.setState({showProductActions: false});
                                    setTimeout(() => {
                                      Alert.alert(
                                                strings("app_name"),
                                                strings("delete_alert_message"),
                                                [
                                                    {
                                                        text: strings("cancel"), onPress: () => {
                                                       
                                                       this.setState({showProductActions: false})
                                                        }
                                                    },
                                                    {
                                                        text: strings("yes"), onPress: () => {
                                                            setTimeout(() => {
                                                                this.removeProduct();
                                                            }, 400);
                                                        }
                                                    },
                                                ],
                                                {cancelable: false},
                                            );
                                    }, 100);

                                }}
                                onDismiss={() => {
                                    this.setState({showProductActions: false});
                                }}/>

            </View>
        );
    }

    getCategoryName(category) {
        switch (category.id) {
            case 0:
                return strings(category.name) + " (" + this.state.foodItems.length + ") ";
            case 1:
                return strings(category.name) + " (" + this.state.outOfStockItems + ") ";
            case 2:
                return strings(category.name) + " (" + this.state.inStockItems + ") ";
            default:
                return strings(category.name) + " (" + this.state.foodItems.length + ") ";
        }
    }

    renderCategoryItem(category: any, index: number) {
        return (
            <RTLView locale={getCurrentLocale()} style={{alignItems: "center"}}>
                <View style={[{
                    height: 28,
                    borderColor: this.state.selectedCategory === index ? ColorTheme.appTheme : ColorTheme.placeholder,
                    borderWidth: 1.0,
                    borderRadius: 20,
                    paddingHorizontal: Constants.defaultPadding,
                    alignItems: "center",
                    justifyContent: "center"
                }]}>
                    <View style={{width: Constants.defaultPadding}}/>
                    <Text numberOfLines={1} style={[StaticStyles.regularFont, {
                        color: this.state.selectedCategory === index ? ColorTheme.appTheme : ColorTheme.placeholder,
                        textAlign: "center",
                        fontSize: 12,
                    }]}>{this.getCategoryName(category)}</Text>
                </View>
                <View style={{width: Constants.defaultPadding}}/>
            </RTLView>

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
                        {/*<TouchableOpacity onPress={() => {*/}
                        {/*    this.setState({*/}
                        {/*        isSearch: !this.state.isSearch,*/}
                        {/*    })*/}
                        {/*}}>*/}
                        {/*    <AppIcon name={"search"}*/}
                        {/*             color={ColorTheme.grey}*/}
                        {/*             provider={CommonIcons}*/}
                        {/*             size={18}/>*/}
                        {/*</TouchableOpacity>*/}
                        <View style={{flex: 1}}/>
                        <Text style={StaticStyles.nav_title}>{strings("my_food_items")}</Text>
                        <View style={{flex: 1}}/>
                        <AddButton onPress={() => {
                            this.props.navigation.navigate("AddFoodItem", {edit: 0});
                        }}/>
                    </RTLView>
                    <View style={{height: 2 * Constants.defaultPadding}}/>
                    {this.state.isSearch &&
                    <View style={{
                        marginTop: Constants.defaultPadding,
                        justifyContent: "center",
                        height: 40,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: ColorTheme.placeholder,
                        marginBottom: Constants.defaultPadding
                    }}>
                        <RTLView locale={getCurrentLocale()}>
                            <View style={{width: Constants.defaultPadding}}/>
                            <TextInput placeholder={strings("search_your_food_items")}
                                       placeholderTextColor={ColorTheme.placeholder} value={this.state.searchQuery}
                                       onChangeText={(value) => {
                                           this.setState({searchQuery: value})
                                           setTimeout(() => {
                                               this.filterData();
                                           }, 100);

                                       }}/>
                            <View style={{flex: 1}}/>
                            <TouchableOpacity onPress={() => {
                                this.clearSearch();
                            }}>
                                <AppIcon name={"ic_close"}
                                         color={ColorTheme.grey}
                                         provider={CommonIcons}
                                         size={22}/>
                            </TouchableOpacity>
                            <View style={{width: Constants.defaultPadding}}/>
                        </RTLView>
                    </View>}
                    {!this.state.isSearch && this.renderCategories()}
                </View>
                <View style={{height: Constants.defaultPaddingMin, backgroundColor: ColorTheme.lightGrey}}/>
            </View>
        );

    }

    getDataSource() {
        if (this.state.isSearch) {
            if (this.state.searchedFoodItems.length) {
                return this.state.searchedFoodItems;
            } else {
                return this.state.foodItems;
            }
        }
        return this.state.foodItems;
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: ColorTheme.white}}>
                {this.renderHeader()}
                <View style={{height: Constants.defaultPadding}}/>
                <View style={styles.container}>
                    <View style={[StaticStyles.flexOne, {
                        backgroundColor: ColorTheme.white,
                        // paddingHorizontal: Constants.defaultPadding,
                        marginBottom: 70,
                    }]}>
                        {this.state.foodItems && this.state.foodItems.length > 0 && <FlatList
                            horizontal={false}
                            style={[StaticStyles.flexOne, {paddingVertical: 0}]}
                            data={this.getDataSource()}
                            renderItem={({item, index}) =>
                                <TouchableOpacity onPress={() => {
                                }}>
                                    {this.state.selectedCategory === 0 && this.renderFoodItem(item, index)}
                                    {this.state.selectedCategory === 1 && this.state.foodItems[index].out_of_stock === 1 && this.renderFoodItem(item, index)}
                                    {this.state.selectedCategory === 2 && this.state.foodItems[index].out_of_stock === 0 && this.renderFoodItem(item, index)}
                                </TouchableOpacity>
                            }
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => "" + index}
                        />}
                        {this.state.foodItems && this.state.foodItems.length === 0 && <NoDataFound/>}
                        {this.state.selectedCategory === 0 && this.state.hasMorePages &&
                        <View style={{marginTop: Constants.defaultPadding, marginBottom: Constants.defaultPaddingMin}}>
                            <TouchableOpacity style={{
                                alignSelf: "center",
                                paddingVertical: Constants.defaultPaddingMin,
                                paddingHorizontal: Constants.defaultPaddingRegular,
                                backgroundColor: ColorTheme.appTheme,
                                borderRadius: 20
                            }} onPress={() => {
                                this.getFoodList();
                            }}>
                                <Text style={{color: ColorTheme.white}}>{strings("load_more")}</Text>
                            </TouchableOpacity>
                        </View>}
                    </View>
                    {this.state.loading && <LoadingOverlay/>}
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ColorTheme.white
    },
});

// if (foodItem.is_feature === 1) {
//     Alert.alert(
//         strings("app_name"),
//         strings("inactive_feature_product_info"),
//         [
//             {
//                 text: strings("ok"), onPress: () => {
//                     this.setState({
//                         currentPage: 1,
//                         hasMorePages: true,
//                         foodItems: [],
//                         outOfStockItems: 0,
//                         inStockItems: 0
//                     });
//                     setTimeout(() => {
//                         this.getFoodList();
//                     }, 100);
//                 }
//             },
//         ],
//         {cancelable: false},
//     );
// } else {
//     this.performProductAction(0, foodItem, index);
// }
