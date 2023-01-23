import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CheckBox } from '../components/CheckBox';
import { BackButton } from '../components/BackButton';
import { useState } from 'react';
import colors from 'tailwindcss/colors';
import { api } from '../lib/axios';

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
    const [title, setTitle] = useState('');

    function handleToggleWeekDay(weekDayIndex: number) {
        if (weekDays.includes(weekDayIndex)) {
            setWeekDays(prevState => prevState.filter(weekDay => weekDayIndex !== weekDay))
        } else {
            setWeekDays(prevState => [...prevState, weekDayIndex]);
        }
    }

    async function handleCreateNewHabit() {
        try {
            if (!title.trim() || !weekDays.length) {
                return Alert.alert('Novo Hábito', 'Informe o nome do hábito e escolha a periodicidade')
            }
            await api.post('/habits', { title, weekDays });
            setTitle('');
            setWeekDays([]);

            Alert.alert('Novo Hábito', 'Hábito criado com sucesso!');
        } catch (error: any) {
            Alert.alert('Ops', 'Não foi possível criar o novo hábito')
        } {

        }
    }

    return (
        <View className='flex-1 bg-background px-8 pt-16'>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <BackButton />
                <Text className='mt-6 text-white font-bold text-3xl'>Criar habito</Text>
                <Text className='mt-6 text-white font-semibold text-base'>Qual o seu comprometimento?</Text>
                <TextInput
                    className='h-14 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600'
                    placeholder='Exercícios, dormir bem, etc...'
                    onChangeText={setTitle}
                    value={title}
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
                    onPress={() => handleCreateNewHabit()}
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