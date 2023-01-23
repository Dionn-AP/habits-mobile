import { ScrollView, View, Text, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import clsx from 'clsx';
import { BackButton } from '../components/BackButton';
import { ProgressBar } from '../components/ProgressBar';
import { CheckBox } from '../components/CheckBox';
import { useState, useEffect } from 'react';
import { Loading } from '../components/Loading';
import { HabitsEmpty } from '../components/HabitsEmpty';
import { generateProgressPercentage } from '../utils/generate-progress-percentage';
import { api } from '../lib/axios';


interface Params {
    date: string;
}

interface DayInfoProps {
    completedHabits: string[];
    possibleHabits: {
        id: string;
        title: string;
    }[];
}

export function Habit() {
    const route = useRoute();
    const { date } = route.params as Params;

    const [loading, setLoading] = useState(true);
    const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null);
    const [completedHabits, setCompletedHabit] = useState<string[]>([]);

    const parsedDate = dayjs(date);
    const isDateIsPast = parsedDate.endOf('day').isBefore(new Date());
    const dayOfWeek = parsedDate.format('dddd');
    const dayAndMonth = parsedDate.format('DD/MM');

    const habitsProgress = dayInfo?.possibleHabits.length ? generateProgressPercentage(dayInfo.possibleHabits.length, completedHabits.length) : 0;

    async function handleToggleHabit(habitId: string) {
        try {
            await api.patch(`/habits/${habitId}/toggle`);
            if (completedHabits.includes(habitId)) {
                setCompletedHabit(prevState => prevState.filter(habit => habit !== habitId))
            } else {
                setCompletedHabit(prevState => [...prevState, habitId]);
            }
        } catch (error: any) {
            console.log(error.response)
            Alert.alert('Ops', 'Não foi possível carregar as informações dos hábitos')
        }
    }

    async function fetchHabits() {
        try {
            setLoading(true);

            const response = await api.get('/day', { params: { date } });
            setDayInfo(response.data);
            setCompletedHabit(response.data.completedHabits);
        } catch (error: any) {
            console.log(error.response)
            Alert.alert('Ops', 'Não foi possível carregar as informações dos hábitos')
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchHabits();
    }, [])

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <View className='flex-1 bg-background px-8 pt-16'>
            <ScrollView
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <BackButton />
                <Text className='mt-6 text-zinc-400 font-semibold text-base lowercase'>
                    {dayOfWeek}
                </Text>
                <Text className='text-white font-extrabold text-3xl'>
                    {dayAndMonth}
                </Text>
                <ProgressBar progress={habitsProgress} />
                <View className={clsx('mt-6', {
                    ['opacity-50']: isDateIsPast,
                })}>
                    {
                        dayInfo?.possibleHabits ?
                            dayInfo?.possibleHabits.map(habit => (
                                <CheckBox
                                    key={habit.id}
                                    title={habit.title}
                                    checked={completedHabits.includes(habit.id)}
                                    datePast={isDateIsPast}
                                    onPress={() => handleToggleHabit(habit.id)}
                                />
                            ))
                            : <HabitsEmpty />
                    }
                </View>
                {
                    isDateIsPast &&
                    <Text className='text-white mt-10 text-center text-base'>
                        Você não pode alterar hábitos de uma data passada
                    </Text>
                }
            </ScrollView>
        </View>
    )
}