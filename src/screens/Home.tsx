import { View, Text, ScrollView, Alert } from "react-native";
import { Header } from "../components/Header";
import { api } from "../lib/axios";

import { daySize, HabitDay } from "../components/Habits";
import { generateDatesFromYearBeginning } from "../utils/generate-range-between-dates";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useState, useCallback } from "react";
import { Loading } from "../components/Loading";
import dayjs from "dayjs";

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const datesFromYearStart = generateDatesFromYearBeginning();
const minimunSummaryDatesSize = 18 * 7;
const amountOfDaysToFill = minimunSummaryDatesSize - datesFromYearStart.length;

type SummaryProps = Array<{
    id: string;
    date: string;
    amount: number;
    completed: number;
}>

export function Home() {
    const { navigate } = useNavigation();
    const [loading, setLoaging] = useState(true);
    const [summary, setSummary] = useState<SummaryProps | null>(null);

    async function fetchData() {
        try {
            setLoaging(true);
            const response = await api.get('/summary');
            setSummary(response.data)
        } catch (error: any) {
            Alert.alert('Ops', 'Não foi possível carregar os dados');
            console.log(error.reponse)
        } finally {
            setLoaging(false);
        }
    }

    useFocusEffect(useCallback(() => {
        fetchData();
    }, []));

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <View className='flex-1 bg-background px-8 pt-16'>
            <Header />
            <View className="flex-row mt-6 mb-2">
                {
                    weekDays.map((weekDay, i) => (
                        <Text
                            key={`${weekDay} - ${i}`}
                            className='text-zinc-400 text-xl font-bold text-center mx-1'
                            style={{ width: daySize }}
                        >
                            {weekDay}
                        </Text>
                    ))
                }
            </View>
            <ScrollView
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {
                    summary &&
                    <View className="flex-row flex-wrap">
                        {
                            datesFromYearStart.map(date => {
                                const dayWithHabits = summary.find(day => {
                                    return dayjs(date).isSame(day.date, 'day')
                                })
                                return (
                                    <HabitDay
                                        key={date.toISOString()}
                                        date={date}
                                        amountOfHabits={dayWithHabits?.amount}
                                        amountCompleted={dayWithHabits?.completed}
                                        onPress={() => navigate('habit', { date: date.toISOString() })}
                                    />
                                )
                            })
                        }
                        {
                            amountOfDaysToFill > 0 && Array
                                .from({ length: amountOfDaysToFill })
                                .map((_, index) => (
                                    <View
                                        key={index}
                                        className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                                        style={{ width: daySize, height: daySize }}
                                    />
                                ))
                        }
                    </View>
                }
            </ScrollView>
        </View>
    )
}