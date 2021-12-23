import * as React from "react";
import {Component} from "react";
import {ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {StaticStyles} from "../../theme/Styles";
import Constants from "../../theme/Constants";
import {getCurrentLocale, isRTLMode, strings} from "../../components/Translations";
import ColorTheme from "../../theme/Colors";
import {RTLView} from "react-native-rtl-layout";
import {CommonIcons} from "../../icons/Common";
import {AppIcon} from "../../common/IconUtils";
import {SafeAreaView} from "react-navigation";
import {windowWidth} from "../../common";
import ActionButton from "../../components/ActionButton";
import * as Api from "../../lib/api";
import LoadingOverlay from "../../components/Loading";
import {OrderStatus} from "../Orders";
import NoDataFound from "../../components/NoDataFound";
import {XEvents} from "../../lib/EventBus";
import Events from "react-native-simple-events";
import RejectPopUp from "../../components/RejectPopUp";
import {parseDate} from "../../lib/DateUtil";
import DashboardActions from "../../components/DashboardActions";
import HHPickerView from "../../components/HHPickerView";
import TextFormInput from "../../components/TextFormInput";
import {showMessage} from "react-native-flash-message";
import { getUserCity } from "../../lib/user";

const categories = [{"name": "aed", "value": undefined, "title": "today_earnings", "id": 1},
    {"name": "orders", "value": undefined, "title": "today_orders", "id": 2}];

const nearByEmirates = ["dubai", "sharjah",  "ajman", "دبي", "الشارقة",  "عجمان"];

interface Props {
    navigation: any;
}

interface State {
    loading?: boolean;
    loadingStats?: boolean;
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
    stats?: any;
    showPeriodActions?: boolean;
    period?: string;
    showSlots?: boolean;
    selectedSlot?: any;
    timeSlots?: any[];
    pickupTime?: string;
    pickupTimeError?: boolean;
}

export default class Dashboard extends Component<Props, State> {
    apiHandler: any;
    apiExHandler: any;
    focusListener: any;

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            loadingStats: false,
            activity: false,
            reload: false,
            showPeriodActions: false,
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
            stats: categories,
            period: "day",
            selectedSlot: undefined,
            pickupTimeError: false,
            timeSlots: this.getTimeSlot("")
        }
    }

    quickDeliveryPossible(order) {
        let cus_city = order.customer.address ? order.customer.address.split(", ").pop() : "";
        if (nearByEmirates.includes(getUserCity().toLowerCase()) && nearByEmirates.includes(cus_city.toLowerCase())) {
            // this.setState({selectedSlot: undefined});
            return  true;

        } else {
            return false;
        }
    }

    getTimeSlot(slotRange) {
        let values = slotRange.split("-");
        if (values[1] === "1PM") {
            return [{name: "10:00 AM", id: 1}, {name: "11:00 AM", id: 2}, {name: "12:00 PM", id: 3}];
        } else if (values[1] === "5PM") {
            return [{name: "02:00 PM", id: 4}, {name: "03:00 PM", id: 5}, {name: "04:00 PM", id: 6}];
        } else if (values[1] === "9PM") {
            return [{name: "06:00 PM", id: 7}, {name: "07:00 PM", id: 8}, {name: "08:00 PM", id: 9}];
        }
        return [{name: "02:00 PM", id: 4}, {name: "03:00 PM", id: 5}, {name: "04:00 PM", id: 6}];
    }

    componentDidMount(): void {

      

        const {navigation} = this.props;
        this.focusListener = navigation.addListener("focus", () => {
            this.getOrderStatusLookup();
        });
        //Events.on(XEvents.USER_LOGGED_IN, "user_logged_in", this.getOrderStatusLookup.bind(this));
        // // await analytics().setCurrentScreen("Dashboard", "Dashboard").then(r => {
        // // });
    }

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
            selectedSlot: undefined,
        });
        this.apiHandler = (response) => {
            Api.checkValidationError(response, resp => {
                if (response && response.code === 200 && resp) {
                    let resp_statuses = response.response_data.filter(status => status.id < OrderStatus.DELIVERED);
                    this.setState({
                        orderStatus: this.state.orderStatus.concat(resp_statuses),
                        currentPage: 1
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
                    resp.data.map((order) => {
                        if (!this.quickDeliveryPossible(order)) {
                            order.selectedSlot = "8:00 AM";
                        }
                    })
                    this.setState({
                        orders: [...this.state.orders, ...resp.data],
                        filteredOrders: [...this.state.orders, ...resp.data],
                        currentPage: resp.paginator.next_page,
                        hasMorePages: resp.paginator.hasMorePages
                    });
                    this.loadItems(this.state.orderStatus[this.state.selCategory], this.state.selCategory);
                }
                this.setState({loading: false});
                this.getSellerStats(this.state.period);
            }, (errors, errorMessage) => {
                // showMessage(errorMessage);
                this.setState({loading: false});
            });
        };
        this.apiExHandler = (reason) => {
            // showError(reason);
            this.setState({loading: false});
        };
        Api.getDashboardOrdersList(this.state.currentPage)
            .then((response) => {
                    this.apiHandler(response);
                },
            ).catch((reason => {
                this.apiExHandler(reason);
            }),
        );
    }

    performOrderAction(actionStatus: number, order: any, rejectReason?: string) {
        if (this.quickDeliveryPossible(order) && !this.state.selectedSlot && actionStatus === OrderStatus.ACCEPTED) {
            this.setState({pickupTimeError: true});
            showMessage(strings("select_pickup_time_error"));
            return ;
        }
        let formData = new FormData();
        formData.append("order_id", order.order_id)
        formData.append("status", actionStatus)
        if (actionStatus === OrderStatus.ACCEPTED) {
            if (!this.quickDeliveryPossible(order)) {
                formData.append("pickup_time", "" + order.delivery_date + " " + order.selectedSlot);
            } else {
                formData.append("pickup_time", "" + order.delivery_date + " " + this.state.selectedSlot.name);
            }
        }

        this.setState({activity: true});

        if (rejectReason) {
            formData.append("cancellation_comment", rejectReason)
        }
        this.apiHandler = (response) => {
            Api.checkValidationError(response, resp => {
                if (response && response.code === 200 && resp) {
                    // if (actionStatus === OrderStatus.RECEIVED) {
                    //     order.pickup_time = order.delivery_date + " " + this.state.selectedSlot.name;
                    //     setTimeout(() => {
                    //         this.setState({pickupTime: undefined, selectedSlot: {}});
                    //     }, 100);
                    // }
                    order.status = resp.status;
                    order.pickup_time = resp.pickup_time;
                    this.setState({pickupTime: undefined, selectedSlot: undefined});
                    // analytics().logEvent('Order_Action', {
                    //     action_status: actionStatus,
                    //     order_id: order.id,
                    //     reject_reason: rejectReason,
                    // });
                }
                this.setState({activity: false});
            }, (errors, errorMessage) => {
                // showMessage(errorMessage);
                this.setState({activity: false});
            });
        };
        this.apiExHandler = (reason) => {
            // showError(reason);
            this.setState({activity: false});
        };
        Api.updateOrderStatus(formData)
            .then((response) => {
                    this.apiHandler(response);
                },
            ).catch((reason => {
                this.apiExHandler(reason);
            }),
        );
    }

    getTitleForEarning() {
        let value;
        switch (this.state.period) {
            case "day":
                value = "today_earnings";
                break;
            case "week":
                value = "week_earnings";
                break;
            case "month":
                value = "month_earnings";
                break;
            case "year":
                value = "year_earnings";
                break;
        }
        return value;
    }

    getTitleForOrders() {
        let value;
        switch (this.state.period) {
            case "day":
                value = "today_orders";
                break;
            case "week":
                value = "week_orders";
                break;
            case "month":
                value = "month_orders";
                break;
            case "year":
                value = "year_orders";
                break;
        }
        return value;
    }

    getSellerStats(period) {
        let formData = new FormData();
        formData.append("date", parseDate(new Date(), "yyyy-MM-DD"))
        formData.append("period", period)
        this.setState({activity: true});
        this.apiHandler = (response) => {
            Api.checkValidationError(response, resp => {
                if (resp && resp.status === 1) {
                    let values = this.state.stats;
                    values[0].value = resp.data.revenue;
                    values[1].value = resp.data.today_orders;
                    values[0].title = this.getTitleForEarning();
                    values[1].title = this.getTitleForOrders();
                    this.setState({stats: values});
                }
                this.setState({activity: false});
            }, (errors, errorMessage) => {
                // showMessage(errorMessage);
                this.setState({activity: false});
            });
        };
        this.apiExHandler = (reason) => {
            // showError(reason);
            this.setState({activity: false});
        };
        Api.getSellerStats(formData)
            .then((response) => {
                    this.apiHandler(response);
                },
            ).catch((reason => {
                this.apiExHandler(reason);
            }),
        );
    }

    renderOptions() {
        return (
            <View style={{}}>
                <FlatList
                    contentContainerStyle={{
                        alignItems: 'center',
                    }}
                    horizontal={true}
                    style={[{
                        paddingVertical: 0,
                        direction: isRTLMode() ? "rtl" : "ltr",
                        flexDirection: isRTLMode() ? "row-reverse" : "row"
                    }]}
                    data={this.state.stats}
                    renderItem={({item, index}) => this.renderOptionItem(item, index)
                    }
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => "" + index}
                />
            </View>
        );
    }

    renderOptionItem(category: any, index: number) {
        return (
            <RTLView locale={getCurrentLocale()} style={{marginTop: 10}}>
                <View style={[{
                    backgroundColor: "white",
                    paddingHorizontal: Constants.defaultPadding,
                    paddingVertical: Constants.defaultPaddingMin,
                    width: (windowWidth / 2 - (3 * Constants.defaultPadding)),
                    height: 80,
                    borderRadius: Constants.defaultPaddingMin
                }]}>
                    <View style={{height: Constants.defaultPadding}}/>
                    <RTLView locale={getCurrentLocale()} style={{}}>
                        <View style={[{
                            flex: 1,
                        }]}>
                            <Text numberOfLines={1} style={[StaticStyles.regularFont, {
                                color: ColorTheme.timeToMakeColor,
                                textAlign: isRTLMode() ? "right" : "left",
                                fontSize: 10,
                                fontWeight: "500"
                            }]}>{strings(category.name).toUpperCase()}</Text>
                            <View style={{height: Constants.defaultPaddingMin}}/>
                            {this.state.activity && <ActivityIndicator size={"small"} color={ColorTheme.appThemeSecond}
                                                                       style={[{transform: [{scale: 0.75}]}]}/>}
                            {category.value !== undefined && <Text numberOfLines={1} style={[StaticStyles.heavyFont, {
                                color: ColorTheme.appThemeSecond,
                                textAlign: isRTLMode() ? "right" : "left",
                                fontSize: Constants.regularFontSize,
                            }]}>{category.value}</Text>}
                            <View style={{height: Constants.defaultPadding}}/>
                            <Text numberOfLines={1} style={[StaticStyles.regularFont, {
                                color: ColorTheme.textDark,
                                textAlign: isRTLMode() ? "right" : "left",
                                fontSize: Constants.regularSmallestFontSize,
                            }]}>{strings(category.title).toUpperCase()}</Text>
                        </View>
                        <TouchableOpacity onPress={() => {
                            this.setState({showPeriodActions: true});
                        }}>
                            <AppIcon name={"more"}
                                     color={ColorTheme.grey}
                                     provider={CommonIcons}
                                     size={18}/>
                        </TouchableOpacity>
                    </RTLView>
                </View>
                <View style={[{
                    paddingHorizontal: Constants.defaultPadding,
                    width: 10
                }]}>
                </View>
            </RTLView>
        );
    }

    renderOrder(order: any, index: number) {
        return (<View style={{marginTop: Constants.defaultPaddingMin}}>
            <TouchableOpacity onPress={() => {
                this.setState({selItem: index === this.state.selItem ? -1 : index});
            }}>
                <View style={{
                    flex: 1,
                    backgroundColor: this.state.selItem === index ? ColorTheme.light_brown : ColorTheme.lightGrey,
                    paddingTop: Constants.defaultPaddingMin
                }}>
                    <RTLView locale={getCurrentLocale()} style={{alignItems: "center",}}>
                        <View style={{flex: 1, paddingHorizontal: Constants.defaultPadding}}>
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
                                <View style={[{
                                    padding: 2,
                                    backgroundColor: this.getStatusColor(order.status ? order.status.id : undefined),
                                    paddingHorizontal: Constants.defaultPaddingMin,
                                    borderColor: ColorTheme.white,
                                    borderWidth: 1,
                                    borderRadius: 3
                                }]}>
                                    <View style={[{
                                        paddingHorizontal: Constants.defaultPaddingMin,
                                        backgroundColor: this.getStatusColor(order.status ? order.status.id : undefined)
                                    }]}>
                                        <Text numberOfLines={1} style={[StaticStyles.regularFont, {
                                            color: ColorTheme.white,
                                            textAlign: "center",
                                            fontSize: 11,
                                            fontWeight: "400"
                                        }]}>{order.status ? order.status.name : undefined}</Text>
                                    </View>
                                </View>
                                <View style={{width: Constants.defaultPadding}}/>
                                {/* <Text numberOfLines={2}
                                      style={[StaticStyles.regularFont, {
                                          textAlign: isRTLMode() ? "right" : "left",
                                          color: ColorTheme.appTheme,
                                          fontSize: 11,
                                      }]}>
                                    {strings("delivery") + " : " + order.estimated_time}
                                </Text> */}
                                <View style={{flex: 1}}/>
                            </RTLView>
                            {this.state.selItem === index && <View style={{
                                backgroundColor: ColorTheme.white,
                                marginTop: Constants.defaultPadding,
                                borderRadius: 3,
                                borderWidth: 0.5,
                                borderColor: ColorTheme.selected_tab,
                                paddingHorizontal: Constants.defaultPadding,
                                paddingVertical: Constants.defaultPadding
                            }}>

                                {/*--------ORDER DETAILS-------*/}
                                {order.ordered_items && order.ordered_items.map(item => (
                                    <View>
                                        <Text numberOfLines={1} style={[StaticStyles.regularFont, {
                                            color: ColorTheme.textDark,
                                            textAlign: isRTLMode() ? "right" : "left",
                                            fontSize: 12,
                                            fontWeight: "400"
                                        }]}>{item.quantity + " X " + item.product_details.name}</Text>
                                        <View style={{height: Constants.defaultPaddingMin}}/>
                                        <Text numberOfLines={1} style={[StaticStyles.regularFont, {
                                            color: ColorTheme.grey,
                                            textAlign: isRTLMode() ? "right" : "left",
                                            fontSize: 10,
                                            fontWeight: "400"
                                        }]}>{strings("unit_price") + " : " + strings("aed") + " " + item.price}</Text>
                                        <View style={{height: Constants.defaultPadding}}/>
                                    </View>
                                ))}
                                <View style={{height: 0.5, backgroundColor: ColorTheme.selected_tab}}/>

                                {/*--------PAYMENT DETAILS-------*/}
                                <View style={{height: Constants.defaultPadding}}/>
                                <RTLView locale={getCurrentLocale()} style={{alignItems: "center"}}>
                                    <Text numberOfLines={2} style={[StaticStyles.heavyFont, {
                                        textAlign: isRTLMode() ? "right" : "left",
                                        color: ColorTheme.textDark,
                                        fontSize: Constants.regularSmallerFontSize
                                    }]}>
                                        {strings("total_bill")}
                                    </Text>
                                    <Text numberOfLines={1} style={[styles.text_order]}>
                                        {order.price.total}
                                    </Text>
                                    <View style={{width: Constants.defaultPadding}}/>
                                    <Text numberOfLines={1} style={[styles.text_order, {
                                        backgroundColor: ColorTheme.lightGrey,
                                        paddingHorizontal: 5,
                                        paddingVertical: 2,
                                        fontSize: 8,
                                        borderRadius: 3,
                                        borderWidth: 0.25,
                                        borderColor: ColorTheme.appTheme,
                                    }]}>
                                        {"COD"}
                                    </Text>
                                </RTLView>
                                <View style={{height: Constants.defaultPadding}}/>
                                {/*--------SPECIAL REQUEST-------*/}
                                <View style={{height: Constants.defaultPadding}}/>
                                <Text numberOfLines={2} style={[StaticStyles.heavyFont, {
                                    textAlign: isRTLMode() ? "right" : "left",
                                    color: ColorTheme.textDark,
                                    fontSize: Constants.regularSmallerFontSize
                                }]}>
                                    {strings("special_request")}
                                </Text>
                                <View style={{height: Constants.defaultPaddingMin}}/>
                                <Text style={[StaticStyles.regularFont, {
                                    color: ColorTheme.grey,
                                    textAlign: isRTLMode() ? "right" : "left",
                                    fontSize: 10,
                                    fontWeight: "400"
                                }]}>{order.special_request}</Text>
                                <View style={{height: Constants.defaultPadding}}/>

                                {/*--------DELIVERY DETAILS DETAILS-------*/}
                                <View style={{height: Constants.defaultPadding}}/>
                                <Text numberOfLines={2} style={[StaticStyles.heavyFont, {
                                    textAlign: isRTLMode() ? "right" : "left",
                                    color: ColorTheme.textDark,
                                    fontSize: Constants.regularSmallerFontSize
                                }]}>
                                    {strings("delivery_date")}
                                </Text>
                                <View style={{height: Constants.defaultPaddingMin}}/>
                                <Text style={[StaticStyles.regularFont, {
                                    color: ColorTheme.grey,
                                    textAlign: isRTLMode() ? "right" : "left",
                                    fontSize: 10,
                                    fontWeight: "400"
                                }]}>{parseDate(order.delivery_date, Constants.dateFormat)} @ {order.delivery_slot}</Text>
                                {/*--------PICKUP TIME DETAILS-------*/}
                                <View style={{height: Constants.defaultPadding}}/>
                                <Text numberOfLines={2} style={[StaticStyles.heavyFont, {
                                    textAlign: isRTLMode() ? "right" : "left",
                                    color: ColorTheme.textDark,
                                    fontSize: Constants.regularSmallerFontSize
                                }]}>
                                    {strings("pickup_time")}
                                </Text>
                                <View style={{height: Constants.defaultPaddingMin}}/>
                                {/*CHANGE HERE*/}
                                {this.quickDeliveryPossible(order) === false && <View style={{
                                    flex: 1,
                                    backgroundColor: ColorTheme.appThemeLight,
                                    paddingHorizontal: Constants.defaultPadding,
                                    borderRadius: 5,
                                    paddingVertical: Constants.defaultPadding}}>
                                    <Text style={[StaticStyles.regularFont, {
                                        color: ColorTheme.grey,
                                        textAlign: isRTLMode() ? "right" : "left",
                                        fontSize: 12,
                                        fontWeight: "400"
                                    }]}>{strings("item_pickup")}</Text>
                                    <Text style={{
                                        color: ColorTheme.grey,
                                        textAlign: isRTLMode() ? "right" : "left",
                                        fontSize: 14,
                                        fontWeight: "600"
                                    }}>{parseDate(order.delivery_date, Constants.dateFormat)}</Text>
                                </View>}

                                {this.quickDeliveryPossible(order) === true && (order.pickup_time)?
                                    <View>
                                        <Text style={[StaticStyles.regularFont, {
                                            color: ColorTheme.grey,
                                            textAlign: isRTLMode() ? "right" : "left",
                                            fontSize: 10,
                                            fontWeight: "400"
                                        }]}>{order.pickup_time}</Text>
                                    </View>
                                    :
                                    null
                                }
                                {this.quickDeliveryPossible(order) === true && <View>
                                    <View style={{height: Constants.defaultPaddingMin}}/>
                                    {order.status.id === OrderStatus.RECEIVED && <TextFormInput showOptions={() => {
                                        this.setState({
                                            timeSlots: this.getTimeSlot(order.delivery_slot),
                                            showSlots: true,
                                            selectedSlot: {},
                                        });
                                    }}
                                                                                                dropdown={true}
                                                                                                showError={this.state.pickupTimeError}
                                                                                                placeholder={strings("select_pickup_time")}
                                                                                                text={this.state.selectedSlot ? this.state.selectedSlot.name : ""}
                                                                                                value={value => {
                                                                                                }}/>}
                                </View>}

                                <View style={{height: Constants.defaultPaddingMin}}/>
                                {this.state.activity && <ActivityIndicator size={"small"} color={ColorTheme.appTheme}/>}
                                {this.renderOrderActions(order.status ? order.status.id : undefined, index, order)}
                            </View>}
                        </View>
                    </RTLView>
                    <View style={{height: Constants.defaultPadding}}/>
                    <HHPickerView show={this.state.showSlots}
                                  onDismiss={() => this.setState({showSlots: false})}
                                  onValueChange={(value, index) => {
                                      this.setState({showSlots: false, selectedSlot: value, pickupTimeError: false})
                                  }}
                                  selectedValue={this.state.selectedSlot}
                                  values={this.state.timeSlots}/>
                </View>
            </TouchableOpacity>
        </View>);
    }

    renderOrderActions(orderStatus: number, index: number, item: any) {
        switch (orderStatus) {
            case OrderStatus.RECEIVED:
                return (<View style={{marginTop: Constants.defaultPaddingMin}}>
                    <RTLView locale={getCurrentLocale()} style={{alignItems: "center"}}>
                        <View style={{flex: 1}}>
                            <ActionButton title={strings("accept")} onPress={() => {
                                this.performOrderAction(OrderStatus.ACCEPTED, item);
                                // if (Object.keys(this.state.selectedSlot).length > 0) {
                                //     this.performOrderAction(OrderStatus.ACCEPTED, item);
                                // } else {
                                //     showMessage({
                                //         message: strings("select_pickup_time_error"),
                                //         type: "danger",
                                //         icon: "info",
                                //         duration: 4000
                                //     });
                                // }
                            }} variant={"normal"}/>
                        </View>
                        <View style={{width: Constants.defaultPadding}}/>
                        <View style={{flex: 1}}>
                            <ActionButton title={strings("reject")} onPress={() => {
                                this.setState({rejectOrder: item, showReject: true});
                            }} variant={"alt"}/>
                        </View>

                    </RTLView>
                </View>);
            case OrderStatus.ACCEPTED:
                return (<View style={{marginTop: Constants.defaultPaddingMin}}>
                    <RTLView locale={getCurrentLocale()} style={{alignItems: "center"}}>
                        <View style={{flex: 1}}/>
                        <View style={{flex: 1, maxWidth: 150}}>
                            <ActionButton title={strings("in_kitchen")} onPress={() => {
                                this.performOrderAction(OrderStatus.IN_KITCHEN, item);
                            }} variant={"normal"}/>
                        </View>
                        <View style={{flex: 1}}/>
                    </RTLView>
                </View>);
            case OrderStatus.IN_KITCHEN:
                return (<View style={{marginTop: Constants.defaultPaddingMin}}>
                    <RTLView locale={getCurrentLocale()} style={{alignItems: "center"}}>
                        <View style={{flex: 1}}/>
                        <View style={{flex: 1, maxWidth: 180}}>
                            <ActionButton title={strings("picked_up")} onPress={() => {
                                this.performOrderAction(OrderStatus.OUT_FOR_DELIVERY, item);
                            }} variant={"normal"}/>
                        </View>
                        <View style={{flex: 1}}/>
                    </RTLView>
                </View>);
            // return (<View style={{marginTop: Constants.defaultPaddingMin}}>
            //     <RTLView locale={getCurrentLocale()} style={{alignItems: "center"}}>
            //         <View style={{flex: 1}}/>
            //         <View style={{maxWidth: 220}}>
            //             <ActionButton title={strings("ready")} onPress={() => {
            //                 this.performOrderAction(OrderStatus.READY, item);
            //             }} variant={"normal"}/>
            //         </View>
            //         <View style={{flex: 1}}/>
            //     </RTLView>
            // </View>);
            case OrderStatus.READY:
                return <View/>
            case OrderStatus.PICKED_UP:
                return <View/>
            case OrderStatus.OUT_FOR_DELIVERY:
                return <View/>
            case OrderStatus.DELIVERED:
                return <View/>
            case OrderStatus.CANCELLED:
                return <View/>
            default:
                return <View/>
        }
    }

    renderHeader() {
        return (
            <View style={{
                paddingHorizontal: Constants.defaultPaddingRegular,
                backgroundColor: ColorTheme.lightGrey,
                height: 100
            }}>
                <RTLView locale={getCurrentLocale()}>
                    <View style={{flex: 1}}/>
                    <Image resizeMode={"contain"} style={{width: 200, height: 20, marginTop: 0}}
                           source={require('../../../assets/images/app-logo.jpg')}/>
                    <View style={{flex: 1}}/>
                </RTLView>
                {this.renderOptions()}
            </View>
        );

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

    renderOrderStatuses() {
        return (
            <View style={{
                height: 40,
                marginTop: Constants.defaultPadding,
                paddingHorizontal: Constants.defaultPaddingMin
            }}>
                <FlatList
                    contentContainerStyle={{}}
                    horizontal={true}
                    style={[StaticStyles.flexOne, {
                        direction: isRTLMode() ? "rtl" : "ltr",
                        paddingVertical: 0,
                        flexDirection: isRTLMode() ? "row-reverse" : "row"
                    }]}
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
                            {this.renderStatusItem(item, index)}
                        </TouchableOpacity>
                    }
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => "" + index}
                />
                <View style={{
                    height: 4,
                    marginTop: Constants.defaultPadding,
                    backgroundColor: ColorTheme.lightGrey,
                    marginHorizontal: -10
                }}/>
                {/*<FoodDetails show={this.state.showFoodDetails}*/}
                {/*             details={this.state.selectedFood}*/}
                {/*             onEdit={() => {*/}
                {/*             }}*/}
                {/*             onDismiss={() => {*/}
                {/*                 this.setState({showFoodDetails: false});*/}
                {/*             }}/>*/}
            </View>
        );
    }

    renderStatusItem(category: any, index: number) {
        return (
            <RTLView locale={getCurrentLocale()}>
                <View style={[{
                    padding: Constants.defaultPaddingMin,
                    backgroundColor: "white",
                    paddingHorizontal: Constants.defaultPadding,
                    borderColor: index === this.state.selCategory ? ColorTheme.appTheme : ColorTheme.appThemeLight,
                    borderWidth: 1,
                    borderRadius: 3,
                    justifyContent: "center",
                    alignItems: "center"
                }]}>
                    <View style={[{
                        backgroundColor: "white",
                        paddingHorizontal: Constants.defaultPadding,
                        justifyContent: "center",
                        alignItems: "center"
                    }]}>
                        <Text numberOfLines={1} style={[StaticStyles.regularFont, {
                            color: index === this.state.selCategory ? ColorTheme.appTheme : ColorTheme.appThemeLight,
                            textAlign: "center",
                            fontSize: 12,
                            fontWeight: "500"
                        }]}>{category.name}</Text>
                    </View>
                </View>
                <View style={{width: Constants.defaultPaddingMin}}/>
            </RTLView>
        );
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: "#F9F7F7"}}>
                {this.renderHeader()}
                <View style={{height: Constants.defaultPadding}}/>
                <View style={[styles.container]}>
                    <View style={[StaticStyles.flexOne, {
                        backgroundColor: ColorTheme.white,
                        marginBottom: 70,
                    }]}>
                        <View style={{height: Constants.defaultPadding, backgroundColor: "#F9F7F7"}}/>
                        {this.renderOrderStatuses()}
                        {this.state.filteredOrders && this.state.filteredOrders.length > 0 && <FlatList
                            horizontal={false}
                            style={[StaticStyles.flexOne, {paddingVertical: 0}]}
                            data={this.state.filteredOrders}
                            renderItem={({item, index}) =>
                                <View>
                                    <TouchableOpacity onPress={() => {
                                        this.setState({selectedSlot: undefined, pickupTimeError: true});
                                    }}>
                                        {this.renderOrder(item, index)}
                                    </TouchableOpacity>
                                </View>
                            }
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => "" + index}
                        />}
                        {this.state.filteredOrders && this.state.filteredOrders.length === 0 && <NoDataFound/>}
                        {this.state.selCategory === 0 && this.state.hasMorePages &&
                        <View style={{marginTop: Constants.defaultPadding, marginBottom: Constants.defaultPaddingMin}}>
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
                    {this.state.showReject && <RejectPopUp show={this.state.showReject} onReject={(reason) => {
                        this.performOrderAction(OrderStatus.CANCELLED, this.state.rejectOrder, reason);
                        this.setState({showReject: false})
                    }} onDismiss={() => {
                        this.setState({showReject: false})
                    }}/>}
                    <DashboardActions show={this.state.showPeriodActions}
                                      onToday={() => {
                                          this.setState({showPeriodActions: false, period: "day"});
                                          setTimeout(() => {
                                              this.getSellerStats(this.state.period);
                                          }, 400);
                                      }}
                                      onWeek={() => {
                                          this.setState({showPeriodActions: false, period: "week"});
                                          setTimeout(() => {
                                              this.getSellerStats(this.state.period);
                                          }, 400);
                                      }}
                                      onMonth={() => {
                                          this.setState({showPeriodActions: false, period: "month"});
                                          setTimeout(() => {
                                              this.getSellerStats(this.state.period);
                                          }, 400);
                                      }}
                                      onYear={() => {
                                          this.setState({showPeriodActions: false, period: "year"});
                                          setTimeout(() => {
                                              this.getSellerStats(this.state.period);
                                          }, 400);
                                      }}
                                      onDismiss={() => {
                                          this.setState({showPeriodActions: false});
                                      }}/>
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
