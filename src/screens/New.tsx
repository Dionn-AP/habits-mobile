import { ScrollView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CheckBox } from '../components/CheckBox';
import { BackButton } from '../components/BackButton';
import { useState } from 'react';
import colors from 'tailwindcss/colors';

const availableWeekDays = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado'
];

export function New() {
    const [weekDays, setWeekDays] = useState<number[]>([]);

    function handleToggleWeekDay(weekDayIndex: number) {
        if (weekDays.includes(weekDayIndex)) {
            setWeekDays(prevState => prevState.filter(weekDay => weekDayIndex !== weekDay))
        } else {
            setWeekDays(prevState => [...prevState, weekDayIndex]);
        }
    }

    return (
        <View className='flex-1 bg-background px-8 pt-16'>
            <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 100}}
            >
                <BackButton />
                <Text className='mt-6 text-white font-bold text-3xl'>Criar habito</Text>
                <Text className='mt-6 text-white font-semibold text-base'>Qual o seu comprometimento?</Text>
                <TextInput
                    className='h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600'
                    placeholder='Exercícios, dormir bem, etc...'
                    placeholderTextColor={colors.zinc[500]}
                />
                <Text className='font-semibold mt-4 mb-3 text-white text-base'>
                    Qual a referência?
                </Text>
                {
                    availableWeekDays.map((weekDay, index) => (
                        <CheckBox
                            key={weekDay}
                            title={weekDay}
                            checked={weekDays.includes(index)}
                            onPress={() => handleToggleWeekDay(index)}
                        />
                    ))
                }
                <TouchableOpacity
                    activeOpacity={0.7}
                    className='flex-row w-full mt-5 items-center justify-center rounded-md h-14 bg-green-600'
                >
                    <Feather
                        name='check'
                        size={20}
                        color={colors.white}
                    />
                    <Text className='ml-2 text-white font-semibold text-base'>Confirmar</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}