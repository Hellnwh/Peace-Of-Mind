"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { format } from "date-fns";

interface MoodEntry {
    id: string;
    userId: string;
    moodScore: number;
    moodEmoji: string;
    timestamp: { seconds: number, nanoseconds: number } | any; // Firestore timestamp
}

interface MoodAnalysisChartProps {
    data: MoodEntry[] | null;
    isLoading: boolean;
}

export function MoodAnalysisChart({ data, isLoading }: MoodAnalysisChartProps) {
    const chartData = data
        ? data
            .filter(entry => entry.timestamp && typeof entry.timestamp.seconds === 'number')
            .sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0))
            .map(entry => ({
                date: format(new Date((entry.timestamp?.seconds || 0) * 1000), "MMM d"),
                moodScore: entry.moodScore,
            }))
        : [];
    
    const chartConfig = {
        moodScore: {
            label: "Mood Score",
            color: "hsl(var(--accent))",
        },
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Mood Analysis</CardTitle>
                <CardDescription>Visualize your mood trends over time.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                     <div className="h-[250px] w-full flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">Loading chart...</p>
                    </div>
                ) : !chartData || chartData.length < 2 ? (
                     <div className="h-[250px] w-full flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">Not enough mood entries to display a chart. Keep tracking your mood!</p>
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <LineChart accessibilityLayer data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <YAxis
                                dataKey="moodScore"
                                domain={[0, 100]}
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="line" />}
                            />
                            <Line
                                dataKey="moodScore"
                                type="natural"
                                stroke="hsl(var(--accent))"
                                strokeWidth={2}
                                dot={true}
                            />
                        </LineChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}
