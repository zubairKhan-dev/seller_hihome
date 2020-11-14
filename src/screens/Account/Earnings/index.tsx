import * as React from "react";
import {Component} from "react";
import {FlatList, StyleSheet, Text, View} from "react-native";
import ColorTheme from "../../../theme/Colors";
import {StaticStyles} from "../../../theme/Styles";
import Constants from "../../../theme/Constants";
import {getCurrentLocale, isRTLMode, strings} from "../../../components/Translations";
import {TouchableOpacity} from "react-native";
import {AppIcon} from "../../../common/IconUtils";
import {CommonIcons} from "../../../icons/Common";
import {SafeAreaView} from "react-navigation";
import {RTLView} from "react-native-rtl-layout";
import ActionButton from "../../../components/ActionButton";
import {formatDate} from "../../../lib/DateUtil";

const earning_history = {
    "Code": 200,
    "Response": [
        {
            "id": 1,
            "order": {
                "transaction_id": "981727344",
                "item_name": "Avocado Juice",
                "quantity": 4,
                "amount": 40,
            },
            "payout": null,
            "created_at": "2020-04-29T14:41:16.000000Z",
        },
        {
            "id": 1,
            "order": {
                "transaction_id": "981727344",
                "item_name": "Avocado Juice",
                "quantity": 4,
                "amount": 40,
            },
            "payout": null,
            "created_at": "2020-04-29T14:41:16.000000Z",
        },
        {
            "id": 1,
            "order": {
                "transaction_id": "981727344",
                "item_name": "Avocado Juice",
                "quantity": 4,
                "amount": 40,
            },
            "payout": null,
            "created_at": "2020-04-29T14:41:16.000000Z",
        },
        {
            "id": 1,
            "order": {
                "transaction_id": "981727344",
                "item_name": "Avocado Juice",
                "quantity": 4,
                "amount": 40,
            },
            "payout": null,
            "created_at": "2020-04-29T14:41:16.000000Z",
        },
        {
            "id": 2,
            "order": null,
            "payout": {
                "transaction_id": "189823456",
                "item_name": "Credit payout request",
                "amount": 4000,
            },
            "created_at": "2020-04-29T14:41:16.000000Z",
        },
        {
            "id": 1,
            "order": {
                "transaction_id": "981727344",
                "item_name": "Avocado Juice",
                "quantity": 4,
                "amount": 40,
            },
            "payout": null,
            "created_at": "2020-04-29T14:41:16.000000Z",
        },
        {
            "id": 1,
            "order": {
                "transaction_id": "981727344",
                "item_name": "Avocado Juice",
                "quantity": 4,
                "amount": 40,
            },
            "payout": null,
            "created_at": "2020-04-29T14:41:16.000000Z",
        },
        {
            "id": 1,
            "order": {
                "transaction_id": "981727344",
                "item_name": "Avocado Juice",
                "quantity": 4,
                "amount": 40,
            },
            "payout": null,
            "created_at": "2020-04-29T14:41:16.000000Z",
        },
    ]
};

interface Props {
    navigation: any;
}

interface State {
    reload?: boolean;
    earnings: any[];
}

export default class Earnings extends Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {reload: false, earnings: earning_history.Response};
    }

    componentDidMount(): void {

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
                        <Text style={StaticStyles.nav_title}>{strings("my_earnings")}</Text>
                        <View style={{flex: 1}}/>
                    </RTLView>
                    <View style={{height: Constants.defaultPaddingRegular}}/>
                </View>
                <View style={{height: 2, backgroundColor: ColorTheme.lightGrey}}/>
            </View>
        );
    }

    renderTotalEarnings() {
        return (
            <View style={{
                backgroundColor: ColorTheme.white,
            }}>
                <View style={{
                    paddingHorizontal: Constants.defaultPaddingRegular,
                }}>
                    <View style={{height: Constants.defaultPadding}}/>
                    <RTLView locale={getCurrentLocale()}>
                        <View style={[StaticStyles.center, {
                            height: 50,
                            width: 50,
                            backgroundColor: ColorTheme.light_brown,
                            borderRadius: 25
                        }]}>
                            <AppIcon name={"earnings"}
                                     color={ColorTheme.appTheme}
                                     provider={CommonIcons}
                                     size={30}/>
                        </View>
                        <View style={{width: Constants.defaultPaddingRegular}}/>
                        <View style={{flex: 1, justifyContent: "center"}}>
                            <Text style={{
                                fontSize: 12,
                                color: ColorTheme.appTheme,
                                fontWeight: "bold"
                            }}>{strings("total_earnings")}</Text>
                            <View style={{height: Constants.defaultPaddingMin}}/>
                            <RTLView locale={getCurrentLocale()}>
                                <Text style={{fontSize: 12, color: ColorTheme.grey}}>{strings("aed") + " "}</Text>
                                <Text style={{fontSize: 16, fontWeight: "bold"}}>{"20,475"}</Text>
                            </RTLView>
                            <RTLView style={{marginTop: Constants.defaultPaddingRegular, alignItems: "center"}}
                                     locale={getCurrentLocale()}>
                                <View style={{flex: 1}}>
                                    <ActionButton variant={"normal"} title={strings("request_payout")} onPress={() => {
                                    }}/>
                                </View>
                                <View style={{width: Constants.defaultPadding}}/>
                                <View style={{flex: 1}}>
                                    <ActionButton variant={"alt"} title={strings("export_to_csv")} onPress={() => {
                                    }}/>
                                </View>
                            </RTLView>
                            <Text style={{
                                marginTop: Constants.defaultPadding,
                                fontSize: 10,
                                color: ColorTheme.textDark
                            }}>{strings("payout_message") + " "}</Text>
                        </View>
                    </RTLView>
                    <View style={{height: Constants.defaultPadding}}/>
                </View>
            </View>
        );
    }

    renderEarning(item: any, index: number) {
        return (<View style={{paddingHorizontal: Constants.defaultPadding}}>
            {item.id === 1 && this.renderFoodEarning(item)}
            {item.id === 2 && this.renderPayoutEarning(item)}
        </View>);
    }

    renderFoodEarning(item: any) {
        return (<View style={{paddingHorizontal: Constants.defaultPadding, paddingVertical: Constants.defaultPaddingMin}}>
            <RTLView locale={getCurrentLocale()}>
                <Text style={StaticStyles.regularFont}>{item.order.quantity}</Text>
                <Text style={StaticStyles.regularFont}>{" X "}</Text>
                <Text style={StaticStyles.regularFont}>{item.order.item_name}</Text>
                    <View style={{flex: 1}}/>
                <Text style={[StaticStyles.regularFont, {color: ColorTheme.grey}]}>{strings("aed") + " "}</Text>
                <Text style={StaticStyles.regularFont}>{item.order.amount}</Text>
            </RTLView>
            <Text style={[StaticStyles.lightFont, {fontSize: 12, color: ColorTheme.grey}]}>{strings("identity") + " : " + item.order.transaction_id}</Text>
            <Text style={[StaticStyles.lightFont, {fontSize: 10, color: ColorTheme.grey}]}>{formatDate(item.created_at, Constants.dateFormat)}</Text>
            <View style={{height: 1}}/>
        </View>);
    }

    renderPayoutEarning(item: any) {
        return (<View style={{paddingHorizontal: Constants.defaultPadding}}>
            <RTLView locale={getCurrentLocale()}>
                <Text style={StaticStyles.regularFont}>{item.payout.item_name}</Text>
                <View style={{flex: 1}}/>
                <Text style={[StaticStyles.regularFont, {color: ColorTheme.grey}]}>{strings("aed") + " "}</Text>
                <Text style={StaticStyles.regularFont}>{item.payout.amount}</Text>
            </RTLView>
            <Text style={[StaticStyles.lightFont, {fontSize: 12, color: ColorTheme.grey}]}>{strings("identity") + " : " + item.payout.transaction_id}</Text>
            <Text style={[StaticStyles.lightFont, {fontSize: 10, color: ColorTheme.grey}]}>{formatDate(item.created_at, Constants.dateFormat)}</Text>
        </View>);
    }

    renderEarningDetails() {
        return (
            <View style={{
                backgroundColor: ColorTheme.light_brown,
                height: 80
            }}>
                <View style={{
                    paddingHorizontal: Constants.defaultPaddingRegular,
                }}>
                    <View style={{height: Constants.defaultPaddingRegular}}/>
                    <Text style={StaticStyles.nav_title}>{strings("earning_history")}</Text>
                    <View style={{height: Constants.defaultPadding}}/>
                    <RTLView locale={getCurrentLocale()}>
                        <Text
                            style={[StaticStyles.regularFont, {color: ColorTheme.grey}]}>{strings("description")}</Text>
                        <View style={{flex: 1}}/>
                        <Text style={[StaticStyles.regularFont, {color: ColorTheme.grey}]}>{strings("amount")}</Text>
                    </RTLView>
                </View>
            </View>
        );
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: ColorTheme.white}}>
                {this.renderHeader()}
                {this.renderTotalEarnings()}
                {this.renderEarningDetails()}
                <FlatList
                    horizontal={false}
                    style={[StaticStyles.flexOne, {
                        paddingVertical: 0,
                        marginTop: Constants.defaultPadding,
                        marginBottom: 70
                    }]}
                    data={this.state.earnings}
                    renderItem={({item, index}) =>
                        <TouchableOpacity onPress={() => {
                        }}>
                            {this.renderEarning(item, index)}
                        </TouchableOpacity>
                    }
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => "" + index}
                />
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
