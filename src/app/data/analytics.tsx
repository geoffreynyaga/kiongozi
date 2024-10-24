"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";

import {useState} from "react";

// Mock data for charts
const constituencyData = [
    {name: "Constituency A", voters: 50000, supporters: 30000},
    {name: "Constituency B", voters: 45000, supporters: 25000},
    {name: "Constituency C", voters: 55000, supporters: 35000},
    {name: "Constituency D", voters: 40000, supporters: 20000},
    {name: "Constituency E", voters: 60000, supporters: 40000},
];

const supportTrendData = [
    {month: "Jan", support: 30},
    {month: "Feb", support: 35},
    {month: "Mar", support: 40},
    {month: "Apr", support: 45},
    {month: "May", support: 50},
    {month: "Jun", support: 55},
];

const ageGroupData = [
    {name: "18-24", value: 20},
    {name: "25-34", value: 30},
    {name: "35-44", value: 25},
    {name: "45-54", value: 15},
    {name: "55+", value: 10},
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const issueData = [
    {issue: "Economy", importance: 90, performance: 60},
    {issue: "Healthcare", importance: 85, performance: 70},
    {issue: "Education", importance: 80, performance: 75},
    {issue: "Security", importance: 75, performance: 65},
    {issue: "Infrastructure", importance: 70, performance: 55},
];

export default function AnalyticsTab() {
    const [selectedConstituency, setSelectedConstituency] = useState("All");

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Supporter Age Demographics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{
                                value: {
                                    label: "Percentage",
                                    color: "hsl(var(--chart-4))",
                                },
                            }}
                            className="h-[300px]"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={ageGroupData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({name, percent}) =>
                                            `${name} ${(percent * 100).toFixed(0)}%`
                                        }
                                    >
                                        {ageGroupData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Key Issues Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{
                                importance: {
                                    label: "Importance",
                                    color: "hsl(var(--chart-5))",
                                },
                                performance: {
                                    label: "Your Performance",
                                    color: "hsl(var(--chart-6))",
                                },
                            }}
                            className="h-[300px]"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={issueData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="issue" type="category" />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Legend />
                                    <Bar
                                        dataKey="importance"
                                        fill="var(--color-importance)"
                                    />
                                    <Bar
                                        dataKey="performance"
                                        fill="var(--color-performance)"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Voter Sentiment Analysis</CardTitle>
                    <CardDescription>
                        Based on social media and survey data
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            "Economy",
                            "Healthcare",
                            "Education",
                            "Security",
                            "Infrastructure",
                        ].map((issue) => (
                            <div key={issue} className="flex items-center">
                                <div className="w-[100px] font-medium">{issue}</div>
                                <div className="flex-1">
                                    <div className="h-4 w-full rounded-full bg-secondary">
                                        <div
                                            className="h-4 rounded-full bg-primary"
                                            style={{
                                                width: `${Math.floor(
                                                    Math.random() * 100,
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
