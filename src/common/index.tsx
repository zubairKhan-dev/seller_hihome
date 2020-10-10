import {Alert, Dimensions} from "react-native";
import {strings} from "../components/Translations";

export const windowHeight = Dimensions.get('window').height;
export const windowWidth = Dimensions.get('window').width;

export function showMessageAlert(message) {
    Alert.alert(
        strings("app_name"),
        message,
        [
            {
                text: strings("ok"), onPress: () => {}
            },
        ],
        {cancelable: false},
    );
}

