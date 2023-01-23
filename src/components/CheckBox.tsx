import { Feather } from '@expo/vector-icons';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import colors from 'tailwindcss/colors';

interface Props extends TouchableOpacityProps {
    checked?: boolean;
    title?: string;
    datePast: boolean;
}

export function CheckBox({ title, checked = false, datePast, ...rest }: Props) {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            className='flex-row mb-2 items-center'
            disabled={datePast}
            {...rest}
        >
            {
                checked
                    ?
                    <Animated.View
                        className="h-8 w-8 bg-green-500 rounded-lg items-center justify-center"
                        entering={ZoomIn}
                        exiting={ZoomOut}
                        >
                        <Feather
                            name='check'
                            size={20}
                            color={colors.white}
                        />
                    </Animated.View>
                    :
                    <View className="h-8 w-8 bg-zinc-900 rounded-lg" />
            }
            <Text className="text-white text-base ml-3">
                {title}
            </Text>
        </TouchableOpacity>
    )
}