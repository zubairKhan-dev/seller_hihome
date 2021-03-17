import * as React from "react";
import {Component} from "react";
import {ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {StaticStyles} from "../../theme/Styles";
import Constants from "../../theme/Constants";
import {getCurrentLocale, isRTLMode, strings} from "../../components/Translations";
import ColorTheme from "../../theme/Colors";
import {RTLView} from "react-native-rtl-layout";
import {SafeAreaView} from "react-navigation";
import {XEvents} from "../../lib/EventBus";
import Events from "react-native-simple-events";
import * as Api from "../../lib/api";
import LoadingOverlay from "../../components/Loading";
import NoDataFound from "../../components/NoDataFound";
import FeaturedImage from "../../components/FeaturedImage";
import {generateImageURL} from "../../lib/Image";

export enum OrderStatus {
    RECEIVED = 1,
    ACCEPTED,
    IN_KITCHEN,
    READY,
    OUT_FOR_DELIVERY,
    CANCELLED,
    PICKED_UP,
    DELIVERED,
}

interface Props {
    navigation: any;
}

interface State {
    loading?: boolean;
    showReject?: boolean;
    activity?: boolean;
    reload?: boolean;
    showFoodDetails: boolean;
    selCategory: number;
    selStatus: number;
    selItem: number;
    orders: any[];
    filteredOrders: any[];
    orderStatus: any[];
    hasMorePages: boolean;
    currentPage: number;
    rejectOrder?: any;
}

export default class Orders extends Component<Props, State> {
    apiHandler: any;
    apiExHandler: any;
    focusListener: any;

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            activity: false,
            reload: false,
            showFoodDetails: false,
            selCategory: 0,
            selStatus: 0,
            selItem: 0,
            orders: [],
            filteredOrders: [],
            orderStatus: [{
                "id": 0,
                "name": strings("all"),
            }],
            hasMorePages: false,
            currentPage: 1,
        }
    }

    componentDidMount(): void {
        const {navigation} = this.props;
        this.focusListener = navigation.addListener("focus", () => {
            this.getOrderStatusLookup();
        });
        //Events.on(XEvents.USER_LOGGED_IN, "user_logged_in", this.getOrderStatusLookup.bind(this));
        // analytics().setCurrentScreen("Dashboard", "Dashboard");
    }

    // private filterData() {
    //     let data: any = [];
    //     if (isValidString(this.state.searchQuery)) {
    //         data = this.state.foodItems.filter(value => {
    //             return (value.name).includes(this.state.searchQuery);
    //         });
    //     }
    //     this.setState({
    //         searchedFoodItems: data,
    //     });
    // }

    // private clearSearch() {
    //     this.setState({searchedFoodItems: [], isSearch: false, searchQuery: undefined});
    // }

    private getStatusColor(status) {
        switch (status) {
            case OrderStatus.RECEIVED:
                return ColorTheme.statusPendingBack;
            case OrderStatus.ACCEPTED:
                return ColorTheme.statusShippedBack;
            case OrderStatus.IN_KITCHEN:
                return ColorTheme.statusCancelledBack;
            case OrderStatus.READY:
                return ColorTheme.statusDeliveredBack;
            case OrderStatus.PICKED_UP:
                return ColorTheme.statusDeliveredBack;
            case OrderStatus.OUT_FOR_DELIVERY:
                return ColorTheme.statusDeliveredBack;
            case OrderStatus.DELIVERED:
                return ColorTheme.statusDeliveredBack;
            case OrderStatus.CANCELLED:
                return ColorTheme.statusDeliveredBack;
            default:
                return ColorTheme.white;
        }
    }

    getOrderStatusLookup() {
        this.setState({
            loading: true, orderStatus: [{
                "id": 0,
                "name": strings("all"),
            }],
            orders: [],
            filteredOrders: [],
            currentPage: 1,
        });
        this.apiHandler = (response) => {
            Api.checkValidationError(response, resp => {
                if (response && response.code === 200 && resp) {
                    this.setState({
                        orderStatus: this.state.orderStatus.concat(response.response_data),
                    });
                }
                this.setState({loading: false});
                this.getOrdersList();
            }, (errors, errorMessage) => {
                // showMessage(errorMessage);
                this.setState({loading: false});
            });
        };
        this.apiExHandler = (reason) => {
            // showError(reason);
            this.setState({loading: false});
        };
        Api.getOrderStatusList()
            .then((response) => {
                    this.apiHandler(response);
                },
            ).catch((reason => {
                this.apiExHandler(reason);
            }),
        );
    }

    getOrdersList() {
        this.setState({loading: true});
        this.apiHandler = (response) => {
            Api.checkValidationError(response, resp => {
                if (response && response.code === 200 && resp) {
                    this.setState({
                        orders: [...this.state.orders, ...resp.data],
                        filteredOrders: [...this.state.orders, ...resp.data],
                        currentPage: resp.paginator.next_page,
                        hasMorePages: resp.paginator.hasMorePages
                    });
                    this.loadItems(this.state.orderStatus[this.state.selCategory], this.state.selCategory);
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
        Api.getOrdersList(this.state.currentPage)
            .then((response) => {
                    this.apiHandler(response);
                },
            ).catch((reason => {
                this.apiExHandler(reason);
            }),
        );
    }

    renderOrderItems(foodItem: any, index: number) {
        return (
            <View style={{flex: 1, backgroundColor: ColorTheme.appThemeLightest}}>
                <RTLView locale={getCurrentLocale()}
                         style={{alignItems: "center", paddingHorizontal: Constants.defaultPadding}}>
                    <View style={{
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: ColorTheme.white,
                        borderRadius: 10
                    }}>
                        <View style={{
                            borderRadius: 10,
                            width: 50,
                            height: 50,
                            overflow: "hidden"
                        }}>
                            <FeaturedImage width={50} height={50}
                                           uri={generateImageURL(foodItem.product_details.main_image, 150, 150)}/>
                        </View>
                    </View>
                    <View style={{flex: 1, paddingHorizontal: Constants.defaultPadding}}>
                        <Text numberOfLines={2} style={[StaticStyles.regularFont, {
                            textAlign: isRTLMode() ? "right" : "left",
                            color: ColorTheme.textDark,
                            fontSize: Constants.regularSmallFontSize
                        }]}>
                            {foodItem.quantity + " x " + foodItem.product_details.name}
                        </Text>
                        <Text numberOfLines={1} style={[StaticStyles.regularFont, {
                            textAlign: isRTLMode() ? "right" : "left",
                            color: ColorTheme.textSkyBlue,
                            fontSize: Constants.regularSmallerFontSize
                        }]}>
                            {strings("aed") + foodItem.price}
                        </Text>
                    </View>
                </RTLView>
                <View style={{height: Constants.defaultPadding}}/>
            </View>
        );
    }

    renderOrderDetails(order: any, index: number) {
        return (<View style={{backgroundColor: ColorTheme.appThemeLightest}}>
            <View style={{paddingHorizontal: Constants.defaultPadding, paddingVertical: Constants.defaultPadding}}>
                <RTLView locale={getCurrentLocale()} style={{alignItems: "center"}}>
                    <Text numberOfLines={2} style={[StaticStyles.heavyFont, {
                        textAlign: isRTLMode() ? "right" : "left",
                        color: ColorTheme.textDark,
                        fontSize: Constants.regularSmallFontSize
                    }]}>
                        {strings("order_number")}
                    </Text>
                    <Text numberOfLines={1} style={[styles.text_order]}>
                        {order.order_number}
                    </Text>
                    <View style={{flex: 1}}/>
                    <Text numberOfLines={1} style={[styles.text_order_time]}>
                        {order.order_date + " ," + order.order_year}
                    </Text>
                    <View style={{width: Constants.defaultPaddingMin}}/>
                    <Text numberOfLines={1} style={[styles.text_order_time, {fontWeight: "700"}]}>
                        {order.order_time}
                    </Text>
                </RTLView>
                <View style={{height: Constants.defaultPaddingMin}}/>
                <RTLView locale={getCurrentLocale()} style={{alignItems: "center"}}>
                    <Text numberOfLines={2} style={[StaticStyles.heavyFont, {
                        textAlign: isRTLMode() ? "right" : "left",
                        color: ColorTheme.textDark,
                        fontSize: Constants.regularSmallFontSize
                    }]}>
                        {strings("total")}
                    </Text>
                    <Text numberOfLines={1} style={[styles.text_order]}>
                        {order.price.total}
                    </Text>
                    <View style={{flex: 1}}/>
                    <View style={[{
                        padding: 2,
                        backgroundColor: this.getStatusColor(order.status? order.status.id : undefined),
                        paddingHorizontal: Constants.defaultPaddingMin,
                        borderColor: ColorTheme.white,
                        borderWidth: 1,
                        borderRadius: 3
                    }]}>
                        <View style={[{
                            paddingHorizontal: Constants.defaultPaddingMin,
                            backgroundColor: this.getStatusColor(order.status? order.status.id : undefined)
                        }]}>
                            <Text numberOfLines={1} style={[StaticStyles.regularFont, {
                                color: ColorTheme.white,
                                textAlign: "center",
                                fontSize: 11,
                                fontWeight: "400"
                            }]}>{order.status? order.status.name : undefined}</Text>
                        </View>
                    </View>
                </RTLView>
            </View>
            {order.ordered_items  && order.ordered_items.map(item => (
                this.renderOrderItems(item, index)
            ))}
            <View style={{height: Constants.defaultPadding, backgroundColor: ColorTheme.white}}/>
        </View>);
    }

    renderCustomerDetails(foodItem) {
        return (
            <RTLView locale={getCurrentLocale()}
                     style={{alignItems: "center"}}>
                <View style={{flex: 1}}>
                    <Text numberOfLines={1} style={[StaticStyles.heavyFont, {
                        textAlign: isRTLMode() ? "right" : "left",
                        color: ColorTheme.timeToMakeColor,
                        fontSize: Constants.regularSmallerFontSize
                    }]}>
                        {strings("order_from").toUpperCase()}
                    </Text>
                    <Text numberOfLines={1} style={[StaticStyles.regularFont, {
                        textAlign: isRTLMode() ? "right" : "left",
                        color: ColorTheme.textSkyBlue,
                        fontSize: Constants.regularSmallerFontSize
                    }]}>
                        {foodItem.customer.name}
                    </Text>
                </View>
                <View style={{flex: 1}}>
                    <Text numberOfLines={1} style={[StaticStyles.heavyFont, {
                        textAlign: isRTLMode() ? "right" : "left",
                        color: ColorTheme.timeToMakeColor,
                        fontSize: Constants.regularSmallerFontSize
                    }]}>
                        {strings("location").toUpperCase()}
                    </Text>
                    <Text numberOfLines={1} style={[StaticStyles.regularFont, {
                        textAlign: isRTLMode() ? "right" : "left",
                        color: ColorTheme.textDark,
                        fontSize: Constants.regularSmallerFontSize
                    }]}>
                        {foodItem.customer.address}
                    </Text>
                </View>
            </RTLView>
        );
    }

    renderCategories() {
        return (
            <View style={{height: 35}}>
                <FlatList
                    contentContainerStyle={{
                        // justifyContent: isRTLMode() ? "flex-end" : "flex-start",
                        // flexDirection: isRTLMode() ? "row-reverse" : "row",
                        alignItems: 'center'
                    }}
                    horizontal={true}
                    style={{
                        direction: isRTLMode() ? "rtl" : "ltr",
                        paddingVertical: 0,
                        flexDirection: isRTLMode() ? "row-reverse" : "row"
                    }}
                    data={this.state.orderStatus}
                    renderItem={({item, index}) =>
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                selStatus: item.id
                            });
                            setTimeout(() => {
                                this.loadItems(item, index)
                            }, 100);
                        }}>
                            {this.renderCategoryItem(item, index)}
                        </TouchableOpacity>
                    }
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => "" + index}
                />
            </View>
        );
    }

    renderCategoryItem(category: any, index: number) {
        return (
            <View style={[{
                //padding: Constants.defaultPadding,
                backgroundColor: "white",
                paddingHorizontal: Constants.defaultPadding
            }]}>
                <View style={[{
                    backgroundColor: "white",
                    paddingHorizontal: Constants.defaultPadding
                }]}>
                    <Text numberOfLines={1} style={[StaticStyles.regularFont, {
                        color: index === this.state.selCategory ? ColorTheme.textDark : ColorTheme.placeholder,
                        textAlign: "center",
                        fontSize: 13,
                        fontWeight: "500"
                    }]}>{category.name}</Text>
                </View>
                <View style={{height: 7}}/>
                <View style={{
                    backgroundColor: index === this.state.selCategory ? ColorTheme.appTheme : ColorTheme.white,
                    height: 2
                }}/>
            </View>
        );
    }

    renderHeader() {
        return (
            <View style={{
                paddingHorizontal: Constants.defaultPaddingRegular,
                backgroundColor: ColorTheme.white
            }}>
                <View style={{height: Constants.defaultPadding}}/>
                <RTLView locale={getCurrentLocale()}>
                    <View style={{flex: 1}}/>
                    <Text style={StaticStyles.nav_title}>{strings("my_orders")}</Text>
                    <View style={{flex: 1}}/>
                    {/*<TouchableOpacity onPress={() => {*/}
                    {/*    this.setState({*/}
                    {/*        isSearch: !this.state.isSearch,*/}
                    {/*    })*/}
                    {/*}}>*/}
                    {/*    <AppIcon name={"notifications"}*/}
                    {/*             color={ColorTheme.appTheme}*/}
                    {/*             provider={CommonIcons}*/}
                    {/*             size={22}/>*/}
                    {/*</TouchableOpacity>*/}
                </RTLView>
                <View style={{height: 2 * Constants.defaultPadding}}/>
                {/*{this.state.isSearch &&*/}
                {/*<View style={{*/}
                {/*    marginTop: Constants.defaultPadding,*/}
                {/*    justifyContent: "center",*/}
                {/*    height: 40,*/}
                {/*    borderRadius: 20,*/}
                {/*    borderWidth: 1,*/}
                {/*    borderColor: ColorTheme.placeholder,*/}
                {/*    marginBottom: Constants.defaultPadding*/}
                {/*}}>*/}
                {/*    <RTLView locale={getCurrentLocale()}>*/}
                {/*        <View style={{width: Constants.defaultPadding}}/>*/}
                {/*        <TextInput placeholder={strings("search_your_food_items")}*/}
                {/*                   placeholderTextColor={ColorTheme.placeholder} value={this.state.searchQuery}*/}
                {/*                   onChangeText={(value) => {*/}
                {/*                       this.setState({searchQuery: value})*/}
                {/*                       setTimeout(() => {*/}
                {/*                           this.filterData();*/}
                {/*                       }, 100);*/}

                {/*                   }}/>*/}
                {/*        <View style={{flex: 1}}/>*/}
                {/*        <TouchableOpacity onPress={() => {*/}
                {/*            this.clearSearch();*/}
                {/*        }}>*/}
                {/*            <AppIcon name={"ic_close"}*/}
                {/*                     color={ColorTheme.grey}*/}
                {/*                     provider={CommonIcons}*/}
                {/*                     size={22}/>*/}
                {/*        </TouchableOpacity>*/}
                {/*        <View style={{width: Constants.defaultPadding}}/>*/}
                {/*    </RTLView>*/}
                {/*</View>}*/}
                {this.renderCategories()}
            </View>
        );

    }

    getDataSource() {
        // if (this.state.isSearch) {
        //     if (this.state.searchedFoodItems.length) {
        //         return this.state.searchedFoodItems;
        //     } else {
        //         return this.state.foodItems;
        //     }
        // }
        return this.state.orders;
    }

    loadItems(item, index) {
        this.setState({selCategory: index});
        if (this.state.selStatus === 0) {
            this.setState({
                filteredOrders: this.state.orders,
            });
        } else {
            let data: any = [];
            data = this.state.orders.filter(value => {
                let status = value.status;
                if (status) {
                    return status.id === this.state.selStatus
                } else {
                    return this.state.selStatus
                }
            });
            this.setState({
                filteredOrders: data,
            });
        }
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: ColorTheme.white}}>
                <View style={styles.container}>
                    {this.renderHeader()}
                    <View style={{backgroundColor: ColorTheme.lightGrey, height: 3}}/>
                    <View style={[StaticStyles.flexOne, {
                        backgroundColor: ColorTheme.white,
                        marginBottom: Constants.marginBottom,
                        marginTop: Constants.defaultPadding
                    }]}>
                        {this.state.filteredOrders && this.state.filteredOrders.length > 0 && <FlatList
                            horizontal={false}
                            style={[StaticStyles.flexOne, {paddingVertical: 0}]}
                            data={this.state.filteredOrders}
                            renderItem={({item, index}) => this.renderOrderDetails(item, index)}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => "" + index}
                        />}
                        {this.state.filteredOrders && this.state.filteredOrders.length === 0 && <NoDataFound/>}
                        {this.state.selCategory === 0 && this.state.hasMorePages &&
                        <View style={{marginTop: Constants.defaultPadding}}>
                            <TouchableOpacity style={{
                                alignSelf: "center",
                                paddingVertical: Constants.defaultPaddingMin,
                                paddingHorizontal: Constants.defaultPaddingRegular,
                                backgroundColor: ColorTheme.appTheme,
                                borderRadius: 20
                            }} onPress={() => {
                                this.getOrdersList();
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
    text_order: {
        textAlign: isRTLMode() ? "right" : "left",
        color: ColorTheme.textGreyDark,
        fontSize: 11,
        fontWeight: "500"
    },
    text_order_time: {
        textAlign: isRTLMode() ? "right" : "left",
        color: ColorTheme.textDark,
        fontSize: 11,
        fontWeight: "400"
    }
});
