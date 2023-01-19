import { TouchableOpacity, Dimensions } from "react-native";

const weekDays = 7;
const screenHorizontalPaddins = (32 * 2) / 5;
export const dayMarginBetween = 8;
export const daySize = (Dimensions.get('screen').width / weekDays) - (screenHorizontalPaddins + 5);

export function HabitDay() {
    return(
        <TouchableOpacity 
            className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800"
            activeOpacity={0.7}
            style={{ width: daySize, height: daySize}}
        />
    )
}