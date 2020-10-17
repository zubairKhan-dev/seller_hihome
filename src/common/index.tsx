import {Alert, Dimensions} from "react-native";
import {strings} from "../components/Translations";

export const windowHeight = Dimensions.get('window').height;
export const windowWidth = Dimensions.get('window').width;

export function showMessageAlert(message : string) {
    console.log("ALERT", message);
    Alert.alert(
        strings("app_name"),
        message.toString(),
        [
            {
                text: strings("ok"), onPress: () => {}
            },
        ],
        {cancelable: false},
    );
}

